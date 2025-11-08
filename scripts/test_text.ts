import { embedTextBatch } from '../src/lib/embeddings'

function cosine(a: number[], b: number[]) {
  return a.reduce((s, x, i) => s + x * b[i], 0)
}

;(async () => {
  const [a, b] = await embedTextBatch([
    'playful colorful rounded',
    'austere minimalist grid',
  ])
  console.log('cos =', cosine(a, b).toFixed(3))
})().catch(e => { console.error(e); process.exit(1) })


