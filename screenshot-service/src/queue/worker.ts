import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { redisConnection } from './redis.js';
import { SCREENSHOT_QUEUE } from './index.js';
import { captureScreenshot } from '../capture/capture.js';
import { uploadBuffer, exists } from '../storage/s3.js';
import { cacheKey } from '../lib/hash.js';
import type { ScreenshotRequest } from '../types.js';
import { logger } from '../lib/logger.js';
import { fetchOgImage } from '../lib/og.js';

const redisClient = new Redis(redisConnection);

export const worker = new Worker(
  SCREENSHOT_QUEUE, 
  async (job: Job<ScreenshotRequest>) => {
    const input = job.data;
    const keyBase = cacheKey(input);
    const suffix = `${input.viewport ? `${input.viewport.width}x${input.viewport.height}` : '1440x900'}${input.fullPage ? '.fp' : ''}${input.mobile ? '.mobile' : ''}`;
    const key = `${keyBase}/${keyBase}.${suffix}.webp`;

    logger.info({ jobId: job.id, url: input.url }, 'processing screenshot');

    // Only use cache when fresh is not requested
    if (!input.fresh && await exists(key)) {
      logger.info({ key }, 'using cached screenshot');
      const imageUrl = `${process.env.CDN_BASE_URL}/${key}`;
      return { imageUrl };
    }

    try {
      const { webp, width, height, bytes } = await captureScreenshot(input);
      const imageUrl = await uploadBuffer(key, webp, 'image/webp');
      logger.info({ key, width, height, bytes, imageUrl }, 'screenshot captured and uploaded');
      return { imageUrl, width, height, bytes };
    } catch (err) {
      if (input.noOgFallback) {
        logger.warn({ url: input.url, err }, 'capture failed and og fallback disabled');
        throw err;
      }
      logger.warn({ url: input.url, err }, 'primary capture failed, attempting og:image fallback');
      const og = await fetchOgImage(input.url);
      if (og) {
        logger.info({ url: input.url, og }, 'using og:image as fallback');
        return { imageUrl: og, width: 0, height: 0, bytes: 0 };
      }
      throw err;
    }
  }, 
  { 
    connection: redisConnection,
    limiter: {
      max: 10,
      duration: 60000,
    },
    lockDuration: 180000, // 3 minutes - enough time for slow captures
    lockRenewTime: 30000, // Renew lock every 30 seconds
    maxStalledCount: 1, // Retry once if job stalls
    stalledInterval: 30000, // Check for stalled jobs every 30 seconds
    removeOnComplete: {
      age: 3600, // Keep completed jobs for 1 hour
    },
    removeOnFail: {
      age: 86400, // Keep failed jobs for 24 hours
    },
  }
);

worker.on('completed', async (job, result) => {
  logger.info({ jobId: job.id }, 'job completed');
  // Store result in Redis with 24 hour TTL for status endpoint
  const resultKey = `screenshot:result:${job.id}`;
  await redisClient.setex(resultKey, 86400, JSON.stringify({ status: 'done', ...result }));
});

worker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, url: job?.data?.url, err }, 'job failed');
});

worker.on('error', (err) => {
  logger.error({ err }, 'worker error');
});

