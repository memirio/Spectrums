// Minimal CLIP image probe
import { embedImageFromBuffer } from '../src/lib/embeddings';

function fmt(n: number) {
  return Number.isFinite(n) ? n.toFixed(6) : String(n);
}

async function readBufferFromUrl(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const ab = await res.arrayBuffer();
  return Buffer.from(ab);
}

(async () => {
  const src = process.argv[2];
  if (!src) {
    console.error('Usage: tsx scripts/min_clip_probe.ts https://image-url');
    process.exit(1);
  }
  const buf = await readBufferFromUrl(src);
  const vec = await embedImageFromBuffer(buf);
  console.log('dim:', vec.length);
  console.log('head:', fmt(vec[0]), fmt(vec[1]), fmt(vec[2]));
})();


