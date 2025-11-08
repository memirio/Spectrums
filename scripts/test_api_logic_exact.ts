import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { embedTextBatch } from '../src/lib/embeddings'
import { hasOppositeTags } from '../src/lib/concept-opposites'

function cosine(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  let s = 0
  for (let i = 0; i < len; i++) s += a[i] * b[i]
  return s
}

async function main() {
  console.log('🧪 Testing exact API route logic for problematic sites...\n')
  
  const q = '3d'
  const [queryVec] = await embedTextBatch([q.trim()])
  const dim = queryVec.length
  
  const queryTerms = q.split(/[,+\s]+/).map(t => t.trim().toLowerCase()).filter(Boolean)
  const concepts = await prisma.concept.findMany()
  
  // Find matched concept IDs (EXACT API LOGIC)
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
  
  const targetUrls = [
    'http://martinbriceno.xyz/',
    'https://www.jamarea.com/en',
    'http://samsy.ninja/',
    'https://mola-zone.com/',
  ]
  
  const images = await (prisma.image.findMany as any)({
    where: { embedding: { isNot: null }, site: { url: { in: targetUrls } } },
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
    
    console.log(`\n=== ${img.site?.url} ===`)
    console.log(`hasTags: ${hasTags}, tagsCount: ${imageTagList.length}`)
    console.log(`baseScore: ${baseScore.toFixed(3)}`)
    
    if (hasTags) {
      const hasMatchingTag = matchedConceptIds.size > 0 && 
                             imgTags && 
                             Array.from(matchedConceptIds).some(id => imgTags.has(id))
      
      console.log(`hasMatchingTag: ${hasMatchingTag}`)
      console.log(`matchedConceptIds.size: ${matchedConceptIds.size}`)
      console.log(`imgTags has 3d: ${imgTags?.has('3d') || false}`)
      
      if (hasMatchingTag) {
        // Build supporting tags
        const supportingTags: Array<{ conceptId: string; score: number }> = []
        if (matchedConceptIds.size > 0) {
          for (const queryConceptId of matchedConceptIds) {
            const tagScore = imgTags?.get(queryConceptId)
            if (tagScore !== undefined) {
              supportingTags.push({ conceptId: queryConceptId, score: tagScore })
            }
          }
        }
        
        let directMatches = supportingTags.filter(t => matchedConceptIds.has(t.conceptId))
        if (directMatches.length === 0 && imgTags) {
          for (const conceptId of matchedConceptIds) {
            const tagScore = imgTags.get(conceptId)
            if (tagScore !== undefined) {
              directMatches.push({ conceptId, score: tagScore })
            }
          }
        }
        
        const relatedMatches = supportingTags.filter(t => !matchedConceptIds.has(t.conceptId))
        
        console.log(`directMatches: ${directMatches.length}, relatedMatches: ${relatedMatches.length}`)
        
        if (directMatches.length > 0 || relatedMatches.length > 0) {
          const directSum = directMatches.reduce((s, t) => s + t.score, 0)
          const relatedMax = relatedMatches.reduce((m, t) => Math.max(m, t.score), 0)
          
          let directComponent = directSum
          
          if (directComponent > 0) {
            const tagScore = DIRECT_MULTIPLIER * directComponent
            score = tagScore + baseScore * ZERO_WITH_DIRECT
            console.log(`✅ Direct match: tagScore=${tagScore.toFixed(3)}, final=${score.toFixed(3)}`)
          } else if (relatedMax >= RELATED_MIN) {
            score = relatedMax + baseScore * ZERO_WITH_RELATED
            console.log(`⚠️  Related only: relatedMax=${relatedMax.toFixed(3)}, final=${score.toFixed(3)}`)
          } else {
            score = baseScore * ZERO_WITH_RELATED
            console.log(`⚠️  Weak related: final=${score.toFixed(3)}`)
          }
        }
      } else if (matchedConceptIds.size > 0) {
        // No matching tag - check for related
        const supportingTags: Array<{ conceptId: string; score: number }> = []
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
              supportingTags.push({ conceptId, score: tagScore })
            }
          }
        }
        
        const relatedMatches = supportingTags.filter(t => !matchedConceptIds.has(t.conceptId))
        const relatedMax = relatedMatches.reduce((m, t) => Math.max(m, t.score), 0)
        
        console.log(`relatedMax: ${relatedMax.toFixed(3)}`)
        
        if (relatedMax >= RELATED_MIN) {
          score = relatedMax + baseScore * ZERO_NO_DIRECT
          console.log(`❌ No direct, related: final=${score.toFixed(3)}`)
        } else {
          score = baseScore * ZERO_NO_DIRECT
          console.log(`❌ No direct, no related: final=${score.toFixed(3)}`)
        }
      }
    } else {
      if (matchedConceptIds.size > 0) {
        score = baseScore * ZERO_NO_DIRECT
        console.log(`❌ No tags at all: final=${score.toFixed(3)}`)
      }
    }
    
    console.log(`FINAL SCORE: ${score.toFixed(3)}`)
  }
}

main().catch(e => {
  console.error('Script failed:', e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})

