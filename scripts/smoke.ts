import 'dotenv/config'
import { embedImageFromBuffer, embedTextBatch } from '../src/lib/embeddings'

// tiny util
const cos = (a:number[], b:number[]) => a.reduce((s,x,i)=>s + x*b[i], 0)

// simple fetch that works in Node 18+
async function readBuf(src: string) {
  if (/^https?:\/\//i.test(src)) {
    const r = await fetch(src)
    if (!r.ok) throw new Error(`HTTP ${r.status} for ${src}`)
    return Buffer.from(await r.arrayBuffer())
  }
  const { readFileSync } = await import('node:fs')
  const { resolve } = await import('node:path')
  // Handle /fallback.webp -> public/fallback.webp
  if (src.startsWith('/')) {
    return readFileSync(resolve(process.cwd(), 'public', src.slice(1)))
  }
  return readFileSync(resolve(src))
}

async function main() {
  const src = process.argv[2] || '/fallback.webp'
  console.log('image:', src)

  const buf = await readBuf(src)
  const { vector: ivec } = await embedImageFromBuffer(buf)

  // 3 “visual” prompts that give clear separation
  const prompts = [
    'playful, colorful, rounded, bubbly',
    'austere, minimalist, rigid grid, monochrome',
    'measurement, precise, metrics, gridlines'
  ]
  const tvecs = await embedTextBatch(prompts)

  console.log('dim:', ivec.length)
  prompts.forEach((p, i) => {
    console.log(`${(i+1)}. cos(image, "${p}") = ${cos(ivec, tvecs[i]).toFixed(3)}`)
  })
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})


