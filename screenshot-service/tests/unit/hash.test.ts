import { describe, it, expect } from 'vitest';
import { cacheKey } from '../../src/lib/hash.js';
import type { ScreenshotRequest } from '../../src/types.js';

describe('hash', () => {
  it('generates consistent cache keys', () => {
    const req: ScreenshotRequest = {
      url: 'https://example.com',
      fullPage: true,
      viewport: { width: 1920, height: 1080 },
      mobile: false,
    };
    const key1 = cacheKey(req);
    const key2 = cacheKey(req);
    expect(key1).toBe(key2);
    expect(key1.length).toBe(40); // SHA1 hex length
  });

  it('generates different keys for different params', () => {
    const req1: ScreenshotRequest = { url: 'https://example.com' };
    const req2: ScreenshotRequest = { url: 'https://example.com', mobile: true };
    expect(cacheKey(req1)).not.toBe(cacheKey(req2));
  });
});

