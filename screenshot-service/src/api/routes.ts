import type { Express } from 'express';
import Redis from 'ioredis';
import { screenshotSchema } from './validators.js';
import { queue, SCREENSHOT_QUEUE, redisConnection } from '../queue/index.js';
import { cacheKey } from '../lib/hash.js';
import { exists } from '../storage/s3.js';
import { assertPublicHttpUrl } from '../lib/ip-guard.js';
import { logger } from '../lib/logger.js';

const redisClient = new Redis(redisConnection);

export function registerRoutes(app: Express): void {
  app.get('/healthz', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.post('/api/screenshot', async (req, res) => {
    try {
      const parsed = screenshotSchema.parse(req.body);
      await assertPublicHttpUrl(parsed.url);

      const keyBase = cacheKey(parsed);
      const suffix = `${parsed.viewport ? `${parsed.viewport.width}x${parsed.viewport.height}` : '1440x900'}${parsed.fullPage ? '.fp' : ''}${parsed.mobile ? '.mobile' : ''}`;
      const key = `${keyBase}/${keyBase}.${suffix}.webp`;

      const idemKey = req.header('Idempotency-Key') || keyBase;
      const fresh = parsed.fresh === true;

      if (!fresh) {
        const cached = await exists(key);
        if (cached) {
          const imageUrl = `${process.env.CDN_BASE_URL}/${key}`;
          logger.info({ url: parsed.url, key }, 'returning cached screenshot');
          return res.json({ 
            imageUrl, 
            width: 0, 
            height: 0, 
            bytes: 0, 
            cached: true 
          });
        }
      }

      // Use a unique jobId when fresh=true to avoid hitting cached status/results
      const jobId = fresh ? `${idemKey}-${Date.now()}` : idemKey;
      const job = await queue.add(
        SCREENSHOT_QUEUE, 
        parsed, 
        { 
          jobId,
          removeOnComplete: true,
          removeOnFail: true,
        }
      );
      
      logger.info({ jobId: job.id, url: parsed.url, fresh }, 'screenshot job enqueued');
      
      res.status(202).json({ 
        jobId: job.id, 
        statusUrl: `/api/screenshot/${job.id}` 
      });
    } catch (err: any) {
      logger.warn({ err: err.message }, 'screenshot enqueue failed');
      res.status(400).json({ error: err.message || 'Invalid request' });
    }
  });

  app.get('/api/screenshot/:jobId', async (req, res) => {
    try {
      const jobId = req.params.jobId;
      
      // First check Redis cache for completed results (with retry for race conditions)
      const resultKey = `screenshot:result:${jobId}`;
      let cachedResult = await redisClient.get(resultKey);
      if (!cachedResult) {
        // Wait a bit and retry in case the worker just finished writing
        await new Promise(resolve => setTimeout(resolve, 500));
        cachedResult = await redisClient.get(resultKey);
      }
      if (cachedResult) {
        return res.json(JSON.parse(cachedResult));
      }

      // Then check the queue for active jobs
      const job = await queue.getJob(jobId);
      if (!job) {
        // Job not in queue - might be completed and removed, or never existed
        // Wait a bit more for cache to populate, then check again
        await new Promise(resolve => setTimeout(resolve, 1000));
        cachedResult = await redisClient.get(resultKey);
        if (cachedResult) {
          return res.json(JSON.parse(cachedResult));
        }
        return res.status(404).json({ status: 'not_found' });
      }

      const state = await job.getState();
      if (state === 'completed') {
        const result = await job.returnvalue;
        // Store in cache for future lookups
        await redisClient.setex(resultKey, 86400, JSON.stringify({ status: 'done', ...result }));
        return res.json({ 
          status: 'done', 
          ...result 
        });
      }
      if (state === 'failed') {
        const error = job.failedReason || 'Unknown error';
        return res.json({ status: 'error', error });
      }
      
      return res.json({ status: state });
    } catch (err: any) {
      logger.error({ err, jobId: req.params.jobId }, 'error fetching job status');
      res.status(404).json({ error: 'Not found' });
    }
  });
}

