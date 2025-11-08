import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { embedTextBatch } from '../src/lib/embeddings'

function cosine(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  let s = 0
  for (let i = 0; i < len; i++) s += a[i] * b[i]
  return s
}

async function main() {
  const testQueries = ['3d gradient', 'playful', 'strict']
  
  console.log('Testing zero-shot search...\n')
  
  for (const q of testQueries) {
    console.log(`Query: "${q}"`)
    const [queryVec] = await embedTextBatch([q.trim()])
    const dim = queryVec.length
    
    const images = await prisma.image.findMany({
      where: { embedding: { isNot: null } },
      include: { embedding: true, site: true },
      take: 5,
    })
    
    const scored = images.map(img => {
      const ivec = (img.embedding?.vector as unknown as number[]) || []
      if (ivec.length !== dim) return null
      return {
        url: img.site?.url || '',
        score: cosine(queryVec, ivec),
      }
    }).filter(x => x !== null)
    
    scored.sort((a, b) => b!.score - a!.score)
    
    for (const s of scored.slice(0, 3)) {
      console.log(`  ${s!.url}: ${s!.score.toFixed(3)}`)
    }
    console.log()
  }
  
  // Specific test: playful vs strict on all images
  console.log('Playful vs Strict comparison on all images:')
  const [playfulVec, strictVec] = await embedTextBatch(['playful', 'strict'])
  
  const allImages = await prisma.image.findMany({
    where: { embedding: { isNot: null } },
    include: { embedding: true, site: true },
  })
  
  const compared = allImages.map(img => {
    const ivec = (img.embedding?.vector as unknown as number[]) || []
    if (ivec.length !== playfulVec.length) return null
    return {
      url: img.site?.url || '',
      playful: cosine(playfulVec, ivec),
      strict: cosine(strictVec, ivec),
      diff: cosine(playfulVec, ivec) - cosine(strictVec, ivec),
    }
  }).filter(x => x !== null)
  
  compared.sort((a, b) => b!.diff - a!.diff)
  
  console.log('Images where playful > strict:')
  for (const c of compared.slice(0, 5)) {
    if (c!.diff > 0) {
      console.log(`  ${c!.url}: playful=${c!.playful.toFixed(3)}, strict=${c!.strict.toFixed(3)}, diff=${c!.diff.toFixed(3)}`)
    }
  }
  
  const playfulWins = compared.filter(c => c!.diff > 0).length
  console.log(`\n✓ ${playfulWins}/${compared.length} images rank higher for "playful" than "strict"`)
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())

