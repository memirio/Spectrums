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
    const transformersModule = await import('@xenova/transformers').catch((err) => {
      console.error('[embeddings] Failed to load @xenova/transformers:', err.message);
      throw new Error(`Transformers library not available in this environment: ${err.message}`);
    });
    
    const { AutoTokenizer, CLIPTextModelWithProjection } = transformersModule;
    
    if (!globalThis.__clip_text_tokenizer) {
      globalThis.__clip_text_tokenizer = await AutoTokenizer.from_pretrained(MODEL_ID).catch((err: any) => {
        console.error('[embeddings] Failed to load tokenizer:', err.message);
        throw new Error(`Failed to load CLIP tokenizer: ${err.message}`);
      });
    }
    if (!globalThis.__clip_text_model) {
      globalThis.__clip_text_model = await CLIPTextModelWithProjection.from_pretrained(MODEL_ID, { quantized: true }).catch((err: any) => {
        console.error('[embeddings] Failed to load model:', err.message);
        throw new Error(`Failed to load CLIP model: ${err.message}`);
      });
    }
    return {
      tokenizer: globalThis.__clip_text_tokenizer!,
      model: globalThis.__clip_text_model!,
    };
  } catch (error: any) {
    console.error('[embeddings] Error loading CLIP text model:', error.message);
    console.error('[embeddings] Full error:', error);
    throw error;
  }
}
export async function loadImageExtractor() {
  if (!globalThis.__clip_image_extractor) {
    globalThis.__clip_image_extractor = await getPipeline('image-feature-extraction');
  }
  return globalThis.__clip_image_extractor!;
}

/** Text embeddings (CLIP text encoder) with external service fallback */
export async function embedTextBatch(texts: string[]): Promise<number[][]> {
  // Try external embedding service first (if configured)
  const embeddingServiceUrl = process.env.EMBEDDING_SERVICE_URL;
  const embeddingServiceApiKey = process.env.EMBEDDING_SERVICE_API_KEY;
  
  // Log configuration status for debugging
  if (process.env.NODE_ENV === 'production' || process.env.DEBUG_EMBEDDINGS === 'true') {
    console.log('[embeddings] Configuration check:', {
      hasServiceUrl: !!embeddingServiceUrl,
      serviceUrl: embeddingServiceUrl ? `${embeddingServiceUrl.substring(0, 30)}...` : 'NOT SET',
      hasApiKey: !!embeddingServiceApiKey,
      environment: process.env.NODE_ENV,
    });
  }
  
  if (embeddingServiceUrl) {
    // Strip trailing slashes to avoid double slashes in URL
    const baseUrl = embeddingServiceUrl.replace(/\/+$/, '');
    
    // Retry logic: Railway might be slow on first request (cold start - model loading takes 10-30s)
    // OPTIMIZED for Vercel's 60s timeout: reduce retries and timeouts to fail faster
    // Worst case: 15s (first attempt) + 2s (backoff) + 20s (retry) = 37s (within 60s limit)
    const maxRetries = 1; // Reduced to 1 retry (2 attempts total) to stay within Vercel's 60s limit
    let lastError: any = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          // Shorter backoff: 2s (reduced from 5s, 10s, 15s)
          const delay = 2000;
          console.log(`[embeddings] Retry attempt ${attempt}/${maxRetries} for embedding service (waiting ${delay}ms for cold start...)`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          console.log('[embeddings] Using external embedding service:', baseUrl);
        }
        
        // Create AbortController for timeout
        // First attempt: 15s (fast for warm service), retry: 20s (allows for cold start)
        const timeout = attempt === 0 ? 15000 : 20000; // 15s first, 20s retry
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
          const response = await fetch(`${baseUrl}/embed/text`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(embeddingServiceApiKey && { 'Authorization': `Bearer ${embeddingServiceApiKey}` }),
            },
            body: JSON.stringify({ texts }),
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            // 404 might mean wrong URL or service not deployed - check health endpoint first
            if (response.status === 404 && attempt === 0) {
              // Try health check to see if service exists
              try {
                const healthResponse = await fetch(`${baseUrl}/health`, { signal: controller.signal });
                if (!healthResponse.ok) {
                  throw new Error(`Embedding service health check failed: ${healthResponse.status}. Service may not be deployed or URL is incorrect.`);
                }
              } catch (healthError) {
                throw new Error(`Embedding service not found at ${baseUrl}. Please verify EMBEDDING_SERVICE_URL is correct and the service is deployed.`);
              }
            }
            // 502 Bad Gateway often means service is starting up - retry with delay
            if (response.status === 502 && attempt < maxRetries) {
              console.warn(`[embeddings] Service returned 502 (likely cold start), will retry once...`);
              lastError = new Error(`Embedding service returned ${response.status}`);
              continue;
            }
            // 503 Service Unavailable also indicates startup
            if (response.status === 503 && attempt < maxRetries) {
              console.warn(`[embeddings] Service returned 503 (service unavailable), will retry once...`);
              lastError = new Error(`Embedding service returned ${response.status}`);
              continue;
            }
            throw new Error(`Embedding service returned ${response.status}`);
          }
          
          const data = await response.json();
          if (!data.embeddings || !Array.isArray(data.embeddings)) {
            throw new Error('Invalid response from embedding service');
          }
          
          // Verify dimension is 768 (CLIP dimension)
          const dimension = data.embeddings[0]?.length;
          if (dimension !== 768) {
            throw new Error(`Embedding service returned wrong dimension: ${dimension} (expected 768 for CLIP)`);
          }
          
          console.log(`[embeddings] Successfully got embeddings from external service (${data.embeddings.length} vectors, ${dimension}D)`);
          return data.embeddings;
        } catch (fetchError: any) {
          clearTimeout(timeoutId);
          if (fetchError.name === 'AbortError') {
            // Timeout - might be cold start, retry if attempts remaining
            if (attempt < maxRetries) {
              console.warn(`[embeddings] Request timed out after ${timeout}ms (likely cold start), will retry once...`);
              lastError = fetchError;
              continue;
            }
            const timeoutError = new Error(`Embedding service request timed out after ${timeout}ms (attempt ${attempt + 1}/${maxRetries + 1}). Service URL: ${baseUrl}. This usually means the service is down or unreachable.`);
            console.error('[embeddings] Timeout error details:', {
              serviceUrl: baseUrl,
              timeout: `${timeout}ms`,
              attempt: attempt + 1,
              maxAttempts: maxRetries + 1,
            });
            throw timeoutError;
          }
          // Log fetch errors for better debugging
          console.error('[embeddings] Fetch error details:', {
            error: fetchError.message,
            name: fetchError.name,
            serviceUrl: baseUrl,
            attempt: attempt + 1,
          });
          throw fetchError;
        }
      } catch (error: any) {
        lastError = error;
        // Don't retry on certain errors (auth, validation, 404 with health check, etc.)
        if (error.message?.includes('401') || error.message?.includes('400') || error.message?.includes('422') || error.message?.includes('not found') || error.message?.includes('not deployed')) {
          throw error;
        }
        // Retry on network/timeout/502/503 errors
        if (attempt < maxRetries && (
          error.message?.includes('timeout') || 
          error.message?.includes('502') || 
          error.message?.includes('503') ||
          error.message?.includes('fetch') ||
          error.message?.includes('ECONNREFUSED')
        )) {
          continue;
        }
        // If last attempt, log and fall through
        console.warn(`[embeddings] External service failed after ${attempt + 1} attempts:`, error.message);
        break;
      }
    }
    
    // If all retries failed, log detailed error and fall through to local CLIP
    console.error('[embeddings] External service failed after all retries:', {
      serviceUrl: embeddingServiceUrl,
      lastError: lastError?.message || 'Unknown error',
      errorType: lastError?.name || 'Unknown',
      willTryLocal: true,
    });
    console.warn('[embeddings] External service failed, trying local CLIP:', lastError?.message || 'Unknown error');
  }
  
  try {
    // Try CLIP locally (works in Railway/Fly.io, not Vercel)
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
  } catch (error: any) {
    // CRITICAL: Do NOT fall back to OpenAI embeddings - they are 1536 dimensions
    // but the database has 768-dim CLIP embeddings. This causes dimension mismatch errors.
    // Instead, throw an error so the user knows the Railway service is required.
    
    // Provide detailed diagnostic information
    const diagnostics = {
      embeddingServiceUrl: embeddingServiceUrl || 'NOT SET',
      hasApiKey: !!embeddingServiceApiKey,
      environment: process.env.NODE_ENV,
      error: error.message,
      errorType: error.name,
    };
    
    console.error('[embeddings] CRITICAL: Cannot generate CLIP embeddings. Diagnostics:', diagnostics);
    
    let errorMessage: string;
    if (!embeddingServiceUrl) {
      errorMessage = `CLIP embeddings are required (768 dimensions) but EMBEDDING_SERVICE_URL is not set. 
      
To fix this:
1. Deploy the embedding service to Railway (see embedding-service/DEPLOY.md)
2. Set EMBEDDING_SERVICE_URL in your Vercel environment variables to your Railway service URL
3. Set EMBEDDING_SERVICE_API_KEY if your service requires authentication

Error: ${error.message}`;
    } else {
      errorMessage = `Embedding service at ${embeddingServiceUrl} failed and local CLIP is not available in this environment (Vercel/serverless).

Possible issues:
1. Service is down or unreachable - check Railway dashboard
2. Service URL is incorrect - verify EMBEDDING_SERVICE_URL
3. API key mismatch - verify EMBEDDING_SERVICE_API_KEY matches Railway
4. Service is cold-starting - wait a few seconds and retry

To verify service is running:
  curl ${embeddingServiceUrl}/health

Error: ${error.message}`;
    }
    
    throw new Error(errorMessage);
  }
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