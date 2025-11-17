#!/usr/bin/env tsx
/**
 * Analyze why search results differ from pure cosine ranking
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { embedTextBatch } from '../src/lib/embeddings'
import { isAbstractQuery, expandAndEmbedQuery } from '../src/lib/query-expansion'

function cosine(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  let s = 0
  for (let i = 0; i < len; i++) s += a[i] * b[i]
  return s
}

async function main() {
  const query = 'dark'
  
  console.log('═'.repeat(80))
  console.log(`🔍 Analyzing Search Discrepancy for "${query}"`)
  console.log('═'.repeat(80))
  
  // Step 1: Check if query is abstract
  const isAbstract = isAbstractQuery(query)
  console.log(`\n1️⃣  Query Analysis:`)
  console.log(`   Is Abstract: ${isAbstract}`)
  
  // Step 2: Get query vectors
  console.log(`\n2️⃣  Query Embeddings:`)
  const directVec = (await embedTextBatch([query]))[0]
  console.log(`   Direct embedding dimension: ${directVec.length}`)
  
  let expandedVec: number[] | null = null
  if (isAbstract) {
    expandedVec = await expandAndEmbedQuery(query)
    console.log(`   Expanded embedding dimension: ${expandedVec.length}`)
    console.log(`   Using expanded embedding in search API`)
  } else {
    console.log(`   Using direct embedding in search API`)
  }
  
  const queryVec = expandedVec || directVec
  
  // Step 3: Get all images
  console.log(`\n3️⃣  Loading Images:`)
  const images = await (prisma.image.findMany as any)({
    where: { embedding: { isNot: null } },
    include: { embedding: true, site: true },
  })
  console.log(`   Found ${images.length} images`)
  
  // Step 4: Pure cosine ranking (direct)
  console.log(`\n4️⃣  Pure Cosine Ranking (Direct "dark" embedding):`)
  const directRanked = [] as Array<{ siteId: string; siteTitle: string; score: number }>
  for (const img of images as any[]) {
    const ivec = (img.embedding?.vector as unknown as number[]) || []
    if (ivec.length !== directVec.length) continue
    const score = cosine(directVec, ivec)
    directRanked.push({
      siteId: img.site.id,
      siteTitle: img.site.title || 'Unknown',
      score,
    })
  }
  directRanked.sort((a, b) => b.score - a.score)
  
  // Deduplicate by siteId (keep best)
  const directUnique = new Map<string, { siteTitle: string; score: number }>()
  for (const item of directRanked) {
    if (!directUnique.has(item.siteId) || item.score > directUnique.get(item.siteId)!.score) {
      directUnique.set(item.siteId, { siteTitle: item.siteTitle, score: item.score })
    }
  }
  const directTop10 = Array.from(directUnique.entries())
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, 10)
  
  console.log(`   Top 10 (deduplicated by site):`)
  directTop10.forEach(([siteId, data], i) => {
    console.log(`   ${(i + 1).toString().padStart(2)}. ${data.siteTitle.padEnd(30)} Score: ${data.score.toFixed(4)}`)
  })
  
  // Step 5: Pure cosine ranking (expanded, if applicable)
  if (expandedVec) {
    console.log(`\n5️⃣  Pure Cosine Ranking (Expanded "dark" embedding):`)
    const expandedRanked = [] as Array<{ siteId: string; siteTitle: string; score: number }>
    for (const img of images as any[]) {
      const ivec = (img.embedding?.vector as unknown as number[]) || []
      if (ivec.length !== expandedVec.length) continue
      const score = cosine(expandedVec, ivec)
      expandedRanked.push({
        siteId: img.site.id,
        siteTitle: img.site.title || 'Unknown',
        score,
      })
    }
    expandedRanked.sort((a, b) => b.score - a.score)
    
    const expandedUnique = new Map<string, { siteTitle: string; score: number }>()
    for (const item of expandedRanked) {
      if (!expandedUnique.has(item.siteId) || item.score > expandedUnique.get(item.siteId)!.score) {
        expandedUnique.set(item.siteId, { siteTitle: item.siteTitle, score: item.score })
      }
    }
    const expandedTop10 = Array.from(expandedUnique.entries())
      .sort((a, b) => b[1].score - a[1].score)
      .slice(0, 10)
    
    console.log(`   Top 10 (deduplicated by site):`)
    expandedTop10.forEach(([siteId, data], i) => {
      console.log(`   ${(i + 1).toString().padStart(2)}. ${data.siteTitle.padEnd(30)} Score: ${data.score.toFixed(4)}`)
    })
    
    // Compare
    console.log(`\n6️⃣  Comparison (Direct vs Expanded):`)
    const directSet = new Set(directTop10.map(([id]) => id))
    const expandedSet = new Set(expandedTop10.map(([id]) => id))
    const inBoth = Array.from(directSet).filter(id => expandedSet.has(id))
    const onlyDirect = Array.from(directSet).filter(id => !expandedSet.has(id))
    const onlyExpanded = Array.from(expandedSet).filter(id => !directSet.has(id))
    
    console.log(`   Sites in both top 10: ${inBoth.length}`)
    console.log(`   Only in direct top 10: ${onlyDirect.length}`)
    console.log(`   Only in expanded top 10: ${onlyExpanded.length}`)
  }
  
  // Step 6: Simulate tag-based reranking (what search API does)
  console.log(`\n7️⃣  Tag-Based Reranking Analysis:`)
  const queryLower = query.toLowerCase()
  const allConcepts = await prisma.concept.findMany()
  
  // Find relevant concepts (same logic as search API)
  const relevantConceptIds = new Set<string>()
  for (const concept of allConcepts) {
    const conceptLower = concept.label.toLowerCase()
    const conceptIdLower = concept.id.toLowerCase()
    if (conceptLower === queryLower || conceptIdLower === queryLower) {
      relevantConceptIds.add(concept.id)
    }
  }
  
  console.log(`   Relevant concept IDs for "dark": ${Array.from(relevantConceptIds).join(', ') || 'none'}`)
  
  // Get top 200 images (what search API reranks)
  const top200Ranked = [] as Array<{
    siteId: string
    siteTitle: string
    baseScore: number
    imageId: string
  }>
  
  for (const img of images as any[]) {
    const ivec = (img.embedding?.vector as unknown as number[]) || []
    if (ivec.length !== queryVec.length) continue
    const baseScore = cosine(queryVec, ivec)
    top200Ranked.push({
      siteId: img.site.id,
      siteTitle: img.site.title || 'Unknown',
      baseScore,
      imageId: img.id,
    })
  }
  top200Ranked.sort((a, b) => b.baseScore - a.baseScore)
  const top200 = top200Ranked.slice(0, 200)
  
  // Get tags for top 200
  const top200ImageIds = top200.map(r => r.imageId)
  const imageTags = await prisma.imageTag.findMany({
    where: { imageId: { in: top200ImageIds } },
  })
  
  const tagsByImage = new Map<string, Map<string, number>>()
  for (const tag of imageTags) {
    if (!tagsByImage.has(tag.imageId)) {
      tagsByImage.set(tag.imageId, new Map())
    }
    tagsByImage.get(tag.imageId)!.set(tag.conceptId, tag.score)
  }
  
  // Apply reranking (same logic as search API)
  const reranked = top200.map((item) => {
    const imgTags = tagsByImage.get(item.imageId) || new Map()
    let boost = 0
    
    for (const conceptId of relevantConceptIds) {
      const tagScore = imgTags.get(conceptId)
      if (tagScore !== undefined) {
        boost += 0.05 * tagScore
      }
    }
    
    const finalScore = item.baseScore + boost
    return {
      ...item,
      finalScore,
      boost,
    }
  })
  
  reranked.sort((a, b) => b.finalScore - a.finalScore)
  
  // Deduplicate by siteId
  const rerankedUnique = new Map<string, { siteTitle: string; baseScore: number; finalScore: number; boost: number }>()
  for (const item of reranked) {
    if (!rerankedUnique.has(item.siteId) || item.finalScore > rerankedUnique.get(item.siteId)!.finalScore) {
      rerankedUnique.set(item.siteId, {
        siteTitle: item.siteTitle,
        baseScore: item.baseScore,
        finalScore: item.finalScore,
        boost: item.boost,
      })
    }
  }
  
  const rerankedTop10 = Array.from(rerankedUnique.entries())
    .sort((a, b) => b[1].finalScore - a[1].finalScore)
    .slice(0, 10)
  
  console.log(`   Top 10 after reranking (deduplicated by site):`)
  rerankedTop10.forEach(([siteId, data], i) => {
    const boostStr = data.boost > 0 ? ` (+${data.boost.toFixed(4)})` : ''
    console.log(`   ${(i + 1).toString().padStart(2)}. ${data.siteTitle.padEnd(30)} Final: ${data.finalScore.toFixed(4)} (Base: ${data.baseScore.toFixed(4)}${boostStr})`)
  })
  
  // Compare with pure cosine
  console.log(`\n8️⃣  Final Comparison:`)
  const pureTop10Ids = new Set(directTop10.map(([id]) => id))
  const rerankedTop10Ids = new Set(rerankedTop10.map(([id]) => id))
  const inBothFinal = Array.from(pureTop10Ids).filter(id => rerankedTop10Ids.has(id))
  const onlyPure = Array.from(pureTop10Ids).filter(id => !rerankedTop10Ids.has(id))
  const onlyReranked = Array.from(rerankedTop10Ids).filter(id => !pureTop10Ids.has(id))
  
  console.log(`   Sites in both top 10: ${inBothFinal.length}/10`)
  if (onlyPure.length > 0) {
    console.log(`   Only in pure cosine top 10: ${onlyPure.length}`)
    onlyPure.forEach(id => {
      const item = directTop10.find(([sid]) => sid === id)
      if (item) console.log(`      - ${item[1].siteTitle}`)
    })
  }
  if (onlyReranked.length > 0) {
    console.log(`   Only in reranked top 10: ${onlyReranked.length}`)
    onlyReranked.forEach(id => {
      const item = rerankedTop10.find(([sid]) => sid === id)
      if (item) console.log(`      - ${item[1].siteTitle}`)
    })
  }
  
  console.log('\n' + '═'.repeat(80))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

