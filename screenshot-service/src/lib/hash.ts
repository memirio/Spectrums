import crypto from 'crypto';
import type { ScreenshotRequest } from '../types.js';

export function cacheKey(input: ScreenshotRequest): string {
  const vp = input.viewport ? `${input.viewport.width}x${input.viewport.height}` : '';
  const raw = `${input.url}|${input.fullPage ? '1' : '0'}|${vp}|${input.mobile ? '1' : '0'}`;
  return crypto.createHash('sha1').update(raw).digest('hex');
}

