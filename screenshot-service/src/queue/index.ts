import { Queue } from 'bullmq';
import { redisConnection } from './redis.js';

export const SCREENSHOT_QUEUE = 'screenshot';
export { redisConnection };
export const queue = new Queue(SCREENSHOT_QUEUE, { 
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: { age: 3600 },
    removeOnFail: { age: 86400 },
  },
});

