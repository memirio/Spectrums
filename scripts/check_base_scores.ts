import { prisma } from '../src/lib/prisma'
import { embedTextBatch } from '../src/lib/embeddings'
import { isAbstractQuery, getExpansionEmbeddings, poolSoftmax } from '../src/lib/query-expansion'

function cosine(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  let s = 0
  for (let i = 0; i < len; i++) s += a[i] * b[i]
  return s
}

async function main() {
  const query = process.argv[2] || '3d'
  const topN = parseInt(process.argv[3] || '30')
  
  console.log('═'.repeat(70))
  console.log(`🔍 Top ${topN} Base Scores for Query: "${query}"`)
  console.log('═'.repeat(70))
  console.log()
  
  // 1. Compute query embedding
  const isAbstract = isAbstractQuery(query.trim())
  let queryVec: number[] | null = null
  let expansionEmbeddings: number[][] | null = null
  
  if (isAbstract) {
    console.log(`📝 Query is abstract, using expansion embeddings...`)
    expansionEmbeddings = await getExpansionEmbeddings(query.trim())
    // Also compute averaged for base comparison
    const [vec] = await embedTextBatch([query.trim()])
    queryVec = vec
  } else {
    console.log(`📝 Query is concrete, using direct embedding...`)
    const [vec] = await embedTextBatch([query.trim()])
    queryVec = vec
  }
  
  const dim = queryVec.length
  console.log(`📊 Embedding dimension: ${dim}`)
  console.log()
  
  // 2. Load all images with embeddings
  console.log(`📦 Loading images with embeddings...`)
  const images = await (prisma.image.findMany as any)({
    include: {
      embedding: true,
      site: true,
    },
  })
  
  console.log(`📊 Found ${images.length} images with embeddings`)
  console.log()
  
  // 3. Compute cosine similarity for each image
  interface ScoredImage {
    imageId: string
    siteTitle: string
    siteUrl: string
    baseScore: number
  }
  
  const scored: ScoredImage[] = []
  
  for (const img of images as any[]) {
    const ivec = (img.embedding?.vector as unknown as number[]) || []
    if (ivec.length !== dim) continue
    
    let baseScore: number
    if (isAbstract && expansionEmbeddings) {
      // Use softmax pooling for expansions
      const expansionScores = expansionEmbeddings.map(expVec => cosine(expVec, ivec))
      baseScore = poolSoftmax(expansionScores, 0.05)
    } else {
      // Direct cosine similarity
      baseScore = cosine(queryVec!, ivec)
    }
    
    scored.push({
      imageId: img.id,
      siteTitle: img.site?.title || 'N/A',
      siteUrl: img.site?.url || 'N/A',
      baseScore,
    })
  }
  
  // 4. Sort by base score (descending)
  scored.sort((a, b) => b.baseScore - a.baseScore)
  
  // 5. Display top N
  console.log(`📊 Top ${topN} Results - BEFORE Penalties:`)
  console.log('─'.repeat(100))
  console.log('Rank | Site Title                    | Base Score | Site URL')
  console.log('─'.repeat(100))
  
  scored.slice(0, topN).forEach((item, i) => {
    const rank = (i + 1).toString().padStart(4)
    const title = item.siteTitle.substring(0, 28).padEnd(28)
    const baseScore = item.baseScore.toFixed(4).padStart(11)
    const url = item.siteUrl.substring(0, 40)
    console.log(`${rank} | ${title} | ${baseScore} | ${url}`)
  })
  
  console.log()
  console.log('═'.repeat(70))
  console.log('✅ Base scores check complete!')
  console.log('═'.repeat(70))
  
  await prisma.$disconnect()
}

main().catch(console.error)

