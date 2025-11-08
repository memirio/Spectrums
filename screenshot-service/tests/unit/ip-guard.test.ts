import { describe, it, expect } from 'vitest';
import { assertPublicHttpUrl } from '../../src/lib/ip-guard.js';

describe('ip-guard', () => {
  it('allows public HTTP URLs', async () => {
    // Skip if no network access (common in CI)
    try {
      await assertPublicHttpUrl('https://www.google.com');
      expect(true).toBe(true); // If it doesn't throw, test passes
    } catch (err: any) {
      if (err.message.includes('ENOTFOUND')) {
        console.warn('Skipping network-dependent test (no DNS access)');
        expect(true).toBe(true); // Skip this test gracefully
      } else {
        throw err;
      }
    }
  });

  it('rejects non-HTTP protocols', async () => {
    await expect(assertPublicHttpUrl('ftp://example.com')).rejects.toThrow('Invalid protocol');
    await expect(assertPublicHttpUrl('file:///etc/passwd')).rejects.toThrow('Invalid protocol');
  });

  it('rejects localhost', async () => {
    await expect(assertPublicHttpUrl('http://localhost')).rejects.toThrow('Private IP');
    await expect(assertPublicHttpUrl('http://127.0.0.1')).rejects.toThrow('Private IP');
  });

  it('rejects private IP ranges', async () => {
    await expect(assertPublicHttpUrl('http://192.168.1.1')).rejects.toThrow('Private IP');
    await expect(assertPublicHttpUrl('http://10.0.0.1')).rejects.toThrow('Private IP');
    await expect(assertPublicHttpUrl('http://172.16.0.1')).rejects.toThrow('Private IP');
  });
});

