import express from 'express';
import rateLimit from 'express-rate-limit';
import { registerRoutes } from './routes.js';
import { logger } from '../lib/logger.js';

const app = express();
app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({ 
  windowMs: 60_000, 
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

registerRoutes(app);

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
app.listen(port, '0.0.0.0', () => {
  logger.info({ port }, 'screenshot-service listening');
});

