import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
// IMPORTANT: use relative path to avoid alias duplication
import { embedTextBatch, embedImageFromBuffer } from '../src/lib/embeddings'

function cos(a: number[], b: number[]) {
  return a.reduce((s, x, i) => s + x * (b[i] ?? 0), 0)
}

async function readBufferFromArg(arg: string): Promise<Buffer> {
  if (/^https?:\/\//i.test(arg)) {
    const res = await fetch(arg)
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${arg}`)
    const ab = await res.arrayBuffer()
    return Buffer.from(ab)
  }
  const p = path.resolve(arg)
  return fs.readFileSync(p)
}

async function main() {
  const src = process.argv[2]
  if (!src) {
    console.error('Usage: tsx scripts/test_clip_image.ts </path/to/image.webp|https://...>')
    process.exit(1)
  }

  const buf = await readBufferFromArg(src)
  const ivec = await embedImageFromBuffer(buf)

  const [tPlayful, tStrict] = await embedTextBatch(['playful', 'strict'])
  console.log('dim:', ivec.length)
  console.log('cos(image,"playful") =', cos(ivec, tPlayful).toFixed(3))
  console.log('cos(image,"strict")  =', cos(ivec, tStrict).toFixed(3))
}

main().catch(e => { console.error(e); process.exit(1) })


