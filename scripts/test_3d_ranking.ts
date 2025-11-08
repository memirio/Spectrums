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
  console.log('🧪 Testing 3d ranking with new logic...\n')
  
  const q = '3d'
  const [queryVec] = await embedTextBatch([q.trim()])
  const dim = queryVec.length
  
  const queryTerms = q.split(/[,+\s]+/).map(t => t.trim().toLowerCase()).filter(Boolean)
  const concepts = await prisma.concept.findMany()
  
  // Find matched concept IDs
  const matchedConceptIds = new Set<string>()
  for (const term of queryTerms) {
    for (const c of concepts) {
      const conceptId = c.id.toLowerCase()
      const label = c.label.toLowerCase()
      const synonyms = (c.synonyms as unknown as string[] || []).map(s => String(s).toLowerCase())
      if (conceptId === term || label === term || synonyms.includes(term)) {
        matchedConceptIds.add(c.id)
      }
    }
  }
  
  console.log(`Matched concept IDs: ${Array.from(matchedConceptIds).join(', ')}\n`)
  
  const images = await (prisma.image.findMany as any)({
    where: { embedding: { isNot: null } },
    include: { embedding: true, site: true },
  })
  
  const allImageIds = images.map((img: any) => img.id)
  const allTags = allImageIds.length > 0 ? await prisma.imageTag.findMany({
    where: { imageId: { in: allImageIds } } as any
  }) : []
  
  const imageHasTagsSet = new Set<string>()
  for (const tag of allTags) {
    imageHasTagsSet.add(tag.imageId)
  }
  
  const imageTagsMap = new Map<string, Map<string, number>>()
  if (matchedConceptIds.size > 0) {
    const tagsForMatches = allTags.filter(t => matchedConceptIds.has(t.conceptId))
    for (const tag of tagsForMatches) {
      if (!imageTagsMap.has(tag.imageId)) {
        imageTagsMap.set(tag.imageId, new Map())
      }
      imageTagsMap.get(tag.imageId)!.set(tag.conceptId, tag.score)
    }
  }
  
  const allImageTags = new Map<string, Array<{ conceptId: string; score: number }>>()
  for (const tag of allTags) {
    if (!allImageTags.has(tag.imageId)) {
      allImageTags.set(tag.imageId, [])
    }
    allImageTags.get(tag.imageId)!.push({ conceptId: tag.conceptId, score: tag.score })
  }
  
  const ranked: Array<{
    siteUrl: string
    siteTitle: string
    score: number
    hasDirect3d: boolean
    direct3dScore: number
    baseScore: number
    tagsCount: number
  }> = []
  
  const DIRECT_MULTIPLIER = 10
  const ZERO_WITH_DIRECT = 0.10
  const ZERO_WITH_RELATED = 0.10
  const RELATED_MIN = 0.20
  const ZERO_NO_DIRECT = 0.05
  
  for (const img of images as any[]) {
    const ivec = (img.embedding?.vector as unknown as number[]) || []
    if (ivec.length !== dim) continue
    
    let baseScore = cosine(queryVec, ivec)
    let score = baseScore
    
    const hasTags = imageHasTagsSet.has(img.id)
    const imgTags = imageTagsMap.get(img.id)
    const imageTagList = hasTags ? (allImageTags.get(img.id) || []) : []
    
    let hasDirect3d = false
    let direct3dScore = 0
    
    if (hasTags) {
      const hasMatchingTag = matchedConceptIds.size > 0 && 
                             imgTags && 
                             Array.from(matchedConceptIds).some(id => imgTags.has(id))
      
      if (hasMatchingTag) {
        // Build supporting tags
        const supportingTags: Array<{ conceptId: string; score: number }> = []
        if (matchedConceptIds.size > 0) {
          for (const queryConceptId of matchedConceptIds) {
            const tagScore = imgTags?.get(queryConceptId)
            if (tagScore !== undefined) {
              supportingTags.push({ conceptId: queryConceptId, score: tagScore })
              if (queryConceptId.toLowerCase() === '3d') {
                hasDirect3d = true
                direct3dScore = tagScore
              }
            }
          }
        }
        
        const directMatches = supportingTags.filter(t => matchedConceptIds.has(t.conceptId))
        const relatedMatches = supportingTags.filter(t => !matchedConceptIds.has(t.conceptId))
        
        if (directMatches.length > 0 || relatedMatches.length > 0) {
          const directSum = directMatches.reduce((s, t) => s + t.score, 0)
          const relatedMax = relatedMatches.reduce((m, t) => Math.max(m, t.score), 0)
          
          let directComponent = directSum
          if (matchedConceptIds.size > 1) {
            const imageMatchedConceptCount = Array.from(matchedConceptIds).filter(id => imgTags?.has(id)).length
            if (imageMatchedConceptCount < matchedConceptIds.size) {
              const completeness = imageMatchedConceptCount / matchedConceptIds.size
              directComponent *= Math.max(0.4, completeness)
            }
          }
          
          if (directComponent > 0) {
            const tagScore = DIRECT_MULTIPLIER * directComponent
            score = tagScore + baseScore * ZERO_WITH_DIRECT
          } else if (relatedMax >= RELATED_MIN) {
            score = relatedMax + baseScore * ZERO_WITH_RELATED
          } else {
            score = baseScore * ZERO_WITH_RELATED
          }
        }
      } else if (matchedConceptIds.size > 0) {
        // No matching tag but query matches concept
        const relatedMatches: Array<{ conceptId: string; score: number }> = []
        for (const queryConceptId of matchedConceptIds) {
          const queryConcept = concepts.find(c => c.id === queryConceptId)
          if (!queryConcept) continue
          
          const relatedTerms = [
            ...((queryConcept.synonyms as unknown as string[]) || []),
            ...((queryConcept.related as unknown as string[]) || [])
          ].map(t => String(t).toLowerCase())
          
          for (const { conceptId, score: tagScore } of imageTagList) {
            const tagConcept = concepts.find(c => c.id === conceptId)
            if (!tagConcept) continue
            const tagLabel = tagConcept.label.toLowerCase()
            const tagId = tagConcept.id.toLowerCase()
            if (relatedTerms.includes(tagLabel) || relatedTerms.includes(tagId)) {
              relatedMatches.push({ conceptId, score: tagScore })
            }
          }
        }
        
        const relatedMax = relatedMatches.reduce((m, t) => Math.max(m, t.score), 0)
        if (relatedMax >= RELATED_MIN) {
          score = relatedMax + baseScore * ZERO_NO_DIRECT
        } else {
          score = baseScore * ZERO_NO_DIRECT
        }
      }
    } else {
      // No tags at all
      if (matchedConceptIds.size > 0) {
        score = baseScore * ZERO_NO_DIRECT
      }
    }
    
    if (img.site) {
      ranked.push({
        siteUrl: img.site.url,
        siteTitle: img.site.title || img.site.url,
        score,
        hasDirect3d,
        direct3dScore,
        baseScore,
        tagsCount: imageTagList.length,
      })
    }
  }
  
  ranked.sort((a, b) => b.score - a.score)
  
  console.log('Top 10 results:\n')
  for (let i = 0; i < Math.min(10, ranked.length); i++) {
    const r = ranked[i]
    const status = r.hasDirect3d ? '✅ HAS 3D' : '❌ NO 3D TAG'
    console.log(`${i + 1}. ${r.siteTitle}`)
    console.log(`   ${r.siteUrl}`)
    console.log(`   ${status} | score=${r.score.toFixed(3)} | direct3d=${r.direct3dScore.toFixed(3)} | base=${r.baseScore.toFixed(3)} | tags=${r.tagsCount}`)
    console.log()
  }
  
  const without3d = ranked.slice(0, 10).filter(r => !r.hasDirect3d)
  console.log(`\n⚠️  Sites WITHOUT 3d tag in top 10: ${without3d.length}`)
  if (without3d.length > 0) {
    console.log('\nProblem sites:')
    for (const r of without3d) {
      console.log(`  - ${r.siteTitle} | ${r.siteUrl} | score=${r.score.toFixed(3)}`)
    }
  }
}

main().catch(e => {
  console.error('Script failed:', e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})

