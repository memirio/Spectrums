import { z } from 'zod';

export const screenshotSchema = z.object({
  url: z.string().url().refine((u) => /^https?:\/\//.test(u), 'Must be http/https'),
  fullPage: z.boolean().optional(),
  viewport: z.object({ 
    width: z.number().int().positive(), 
    height: z.number().int().positive() 
  }).optional(),
  mobile: z.boolean().optional(),
  fresh: z.boolean().optional(),
  noOgFallback: z.boolean().optional(),
});

