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
  
  console.log('═'.repeat(100))
  console.log(`🔍 Search Ranking Analysis for: "${query}"`)
  console.log('═'.repeat(100))
  console.log()
  
  // 1. Compute query embedding
  const isAbstract = isAbstractQuery(query.trim())
  let queryVec: number[] | null = null
  let expansionEmbeddings: number[][] | null = null
  
  if (isAbstract) {
    expansionEmbeddings = await getExpansionEmbeddings(query.trim())
    const [vec] = await embedTextBatch([query.trim()])
    queryVec = vec
  } else {
    const [vec] = await embedTextBatch([query.trim()])
    queryVec = vec
  }
  
  const dim = queryVec.length
  
  // 2. Load all images with embeddings and tags
  const images = await (prisma.image.findMany as any)({
    include: {
      embedding: true,
      site: true,
      tags: {
        include: { concept: true },
      },
    },
  })
  
  // 3. Find matching concepts
  const queryLower = query.trim().toLowerCase()
  const queryTokens = queryLower.split(/[\s,]+/).filter(Boolean)
  
  const allConcepts = await prisma.concept.findMany()
  const relevantConceptIds = new Set<string>()
  
  for (const token of queryTokens) {
    for (const concept of allConcepts) {
      const conceptLabel = concept.label.toLowerCase()
      const conceptId = concept.id.toLowerCase()
      const synonyms = ((concept.synonyms as unknown as string[]) || []).map(s => s.toLowerCase())
      
      if (conceptLabel === token || conceptId === token || synonyms.includes(token)) {
        relevantConceptIds.add(concept.id)
      }
    }
  }
  
  // 4. Compute scores
  interface ScoredImage {
    imageId: string
    siteTitle: string
    siteUrl: string
    baseScore: number
    boost: number
    finalScore: number
    matchingTags: Array<{ label: string; score: number }>
  }
  
  const scored: ScoredImage[] = []
  
  for (const img of images as any[]) {
    const ivec = (img.embedding?.vector as unknown as number[]) || []
    if (ivec.length !== dim) continue
    
    let baseScore: number
    if (isAbstract && expansionEmbeddings) {
      const expansionScores = expansionEmbeddings.map(expVec => cosine(expVec, ivec))
      baseScore = poolSoftmax(expansionScores, 0.05)
    } else {
      baseScore = cosine(queryVec!, ivec)
    }
    
    // Calculate tag boost
    let boost = 0
    const matchingTags: Array<{ label: string; score: number }> = []
    
    for (const tag of img.tags || []) {
      if (relevantConceptIds.has(tag.conceptId)) {
        const tagScore = tag.score || 0
        boost += 0.01 * tagScore // Same as search API
        matchingTags.push({ label: tag.concept.label, score: tagScore })
      }
    }
    
    const finalScore = baseScore + boost
    
    scored.push({
      imageId: img.id,
      siteTitle: img.site?.title || 'N/A',
      siteUrl: img.site?.url || 'N/A',
      baseScore,
      boost,
      finalScore,
      matchingTags,
    })
  }
  
  // 5. Sort by final score
  scored.sort((a, b) => b.finalScore - a.finalScore)
  
  // 6. Find synchronized.studio, duroc.ma, and leoleo.studio
  const targetSites = ['synchronized.studio', 'duroc.ma', 'leoleo.studio']
  
  console.log('📊 Ranking Comparison:')
  console.log('─'.repeat(100))
  console.log('Rank | Site Title                    | Base Score | Boost   | Final Score | Matching Tags')
  console.log('─'.repeat(100))
  
  scored.forEach((item, i) => {
    const rank = i + 1
    const isTarget = targetSites.some(s => item.siteUrl.toLowerCase().includes(s))
    
    if (isTarget || rank <= 20) {
      const title = item.siteTitle.substring(0, 28).padEnd(28)
      const baseScore = item.baseScore.toFixed(4).padStart(10)
      const boost = item.boost.toFixed(4).padStart(8)
      const finalScore = item.finalScore.toFixed(4).padStart(11)
      const tags = item.matchingTags.map(t => t.label).join(', ') || 'none'
      const tagStr = tags.substring(0, 30)
      
      const marker = isTarget ? ' ⭐' : ''
      console.log(`${rank.toString().padStart(4)} | ${title} | ${baseScore} | ${boost} | ${finalScore} | ${tagStr}${marker}`)
    }
  })
  
  console.log()
  console.log('═'.repeat(100))
  
  await prisma.$disconnect()
}

main().catch(console.error)

