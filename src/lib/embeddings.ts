// src/lib/embeddings.ts
import sharp from 'sharp';
// Lazy load transformers to avoid native library issues in serverless
// import { AutoTokenizer, CLIPTextModelWithProjection } from '@xenova/transformers';
import { createHash } from 'node:crypto';

declare global {
  // eslint-disable-next-line no-var
  var __clip_text_extractor: any | undefined;
  // eslint-disable-next-line no-var
  var __clip_image_extractor: any | undefined;
  // eslint-disable-next-line no-var
  var __clip_text_tokenizer: any | undefined;
  // eslint-disable-next-line no-var
  var __clip_text_model: any | undefined;
}

const MODEL_ID = 'Xenova/clip-vit-large-patch14';
const PIPE_OPTS = { pooling: 'mean', normalize: true } as const;

function norm(v: number[]) {
  return Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
}
function unit(v: number[]) {
  const n = norm(v);
  return v.map((x: number) => x / n);
}
function ensureUnit(v: number[], tag: string) {
  const n = norm(v);
  if (Math.abs(1 - n) > 1e-3) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[emb] ${tag} renormalized (norm=${n.toFixed(3)})`);
    }
    for (let i = 0; i < v.length; i++) v[i] /= n || 1;
  }
  return v;
}
function toFloatArray(out: any): number[] {
  if (out?.data instanceof Float32Array) return Array.from(out.data);
  if (out instanceof Float32Array) return Array.from(out);
  if (Array.isArray(out)) return (out as number[]).flat(Infinity) as number[];
  throw new Error('[emb] unexpected pipeline output format');
}

/** Average multiple vectors */
export function meanVec(vecs: number[][]): number[] {
  if (vecs.length === 0) return [];
  const dim = vecs[0].length;
  const avg = new Array(dim).fill(0);
  for (const v of vecs) {
    for (let i = 0; i < dim && i < v.length; i++) {
      avg[i] += v[i];
    }
  }
  const n = vecs.length;
  return avg.map((x: number) => x / n);
}

/** L2-normalize a vector (unit length) */
export function l2norm(vec: number[]): number[] {
  return unit(vec);
}

async function getPipeline(task: any, modelId?: string) {
  const { pipeline } = await import('@xenova/transformers');
  return pipeline(task, modelId || MODEL_ID, { quantized: true });
}

/** Singleton loaders (idempotent, safe across multiple imports) */
// Explicit CLIP text tower loader (tokenizer + model)
async function loadClipText() {
  try {
    // Lazy load transformers to avoid native library issues in serverless
    const { AutoTokenizer, CLIPTextModelWithProjection } = await import('@xenova/transformers').catch((err) => {
      console.error('[embeddings] Failed to load @xenova/transformers:', err.message);
      throw new Error('Transformers library not available in this environment');
    });
    
    if (!globalThis.__clip_text_tokenizer) {
      globalThis.__clip_text_tokenizer = await AutoTokenizer.from_pretrained(MODEL_ID);
    }
    if (!globalThis.__clip_text_model) {
      globalThis.__clip_text_model = await CLIPTextModelWithProjection.from_pretrained(MODEL_ID, { quantized: true });
    }
    return {
      tokenizer: globalThis.__clip_text_tokenizer!,
      model: globalThis.__clip_text_model!,
    };
  } catch (error: any) {
    console.error('[embeddings] Error loading CLIP text model:', error.message);
    throw error;
  }
}
export async function loadImageExtractor() {
  if (!globalThis.__clip_image_extractor) {
    globalThis.__clip_image_extractor = await getPipeline('image-feature-extraction');
  }
  return globalThis.__clip_image_extractor!;
}

/** Text embeddings (CLIP text encoder) */
export async function embedTextBatch(texts: string[]): Promise<number[][]> {
  const { tokenizer, model } = await loadClipText();
  const safe = texts.map((t: string) => String(t ?? ''));
  const inputs = await tokenizer(safe, { padding: true, truncation: true } as any);
  const { text_embeds }: any = await model(inputs as any);
  const flat = Array.from(text_embeds.data as Float32Array);
  const dim = (text_embeds.dims as number[]).at(-1) as number;
  const rows: number[][] = [];
  for (let i = 0; i < safe.length; i++) {
    const v = flat.slice(i * dim, (i + 1) * dim);
    const n = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
    rows.push(v.map((x: number) => x / n));
  }
  return rows;
}

/**
 * Canonicalize image: decode → sRGB → remove alpha → PNG encode
 * Returns { png: Buffer, hash: string, width: number, height: number }
 */
export async function canonicalizeImage(buf: Buffer): Promise<{ png: Buffer; hash: string; width: number; height: number }> {
  const canonical = await sharp(buf, { limitInputPixels: false })
    .toColorspace('srgb')
    .removeAlpha()
    .png()
    .toBuffer({ resolveWithObject: true });
  
  const hash = createHash('sha256').update(canonical.data).digest('hex');
  
  return {
    png: canonical.data,
    hash,
    width: canonical.info.width,
    height: canonical.info.height,
  };
}

/** Image embeddings (CLIP vision encoder) with deterministic canonical input */
export async function embedImageFromBuffer(buf: Buffer): Promise<{ vector: number[]; contentHash: string; width: number; height: number }> {
  const model = await loadImageExtractor();
  
  // Canonicalize: decode → sRGB → remove alpha → PNG
  const { png, hash, width, height } = await canonicalizeImage(buf);
  
  // Get transformers version for logging
  const transformersVersion = (await import('@xenova/transformers/package.json')).version || 'unknown';
  
  // Embed canonical PNG using raw RGBA path (most reliable)
  try {
    const { data, info } = await sharp(png, { limitInputPixels: false })
      .toColorspace('srgb')
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    if (info.channels !== 4) throw new Error(`rawRGBA: channels=${info.channels}`);
    if (data.length !== info.width * info.height * 4) throw new Error('rawRGBA size mismatch');
    
    const { RawImage } = await import('@xenova/transformers');
    const raw = new RawImage(new Uint8Array(data), info.width, info.height, 4);
    const out: any = await model(raw as any, PIPE_OPTS);
    const vec = ensureUnit(toFloatArray(out), 'image(canonical)');
    
    // Debug logging
    if (process.env.NODE_ENV !== 'production' || process.env.DEBUG_EMBEDDINGS === 'true') {
      console.info(`[emb] model=${MODEL_ID} transformers=${transformersVersion} size=${width}x${height} hash=${hash.slice(0, 12)}...`);
    }
    
    return { vector: vec, contentHash: hash, width, height };
  } catch (e: any) {
    // Fallback: pass canonical PNG directly
    const out: any = await model(new Uint8Array(png), PIPE_OPTS);
    const vec = ensureUnit(toFloatArray(out), 'image(canonicalPNG)');
    
    if (process.env.NODE_ENV !== 'production' || process.env.DEBUG_EMBEDDINGS === 'true') {
      console.info(`[emb] model=${MODEL_ID} transformers=${transformersVersion} size=${width}x${height} hash=${hash.slice(0, 12)}... (fallback)`);
    }
    
    return { vector: vec, contentHash: hash, width, height };
  }
}