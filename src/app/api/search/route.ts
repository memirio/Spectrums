import { NextRequest, NextResponse } from 'next/server'
import { embedTextBatch } from '@/lib/embeddings'
import { prisma } from '@/lib/prisma'
import { hasOppositeTags } from '@/lib/concept-opposites'

function cosine(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  let s = 0
  for (let i = 0; i < len; i++) s += a[i] * b[i]
  return s
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    const debug = searchParams.get('debug') === '1'
    const zeroShot = searchParams.get('ZERO_SHOT') !== 'false' // default true
    if (!q.trim()) return NextResponse.json({ images: [] })

    if (zeroShot) {
      // CLIP-FIRST RETRIEVAL: Primary semantic signal
      // 1. Compute query embedding directly from user text
      const [queryVec] = await embedTextBatch([q.trim()])
      const dim = queryVec.length
      
      // 2. Retrieve all images with embeddings
      const images = await (prisma.image.findMany as any)({
        where: { embedding: { isNot: null } },
        include: { embedding: true, site: true },
      })
      
      if (debug) {
        // Debug mode: pure CLIP cosine ranking only
        const ranked = [] as Array<{
          imageId: string
          siteUrl: string
          score: number
          contentHash: string | null
          model: string
        }>
        for (const img of images as any[]) {
          const ivec = (img.embedding?.vector as unknown as number[]) || []
          if (ivec.length !== dim) continue
          const score = cosine(queryVec, ivec)
          ranked.push({
            imageId: img.id,
            siteUrl: img.site?.url || '',
            score,
            contentHash: (img.embedding?.contentHash as string | null) || null,
            model: img.embedding?.model || '',
          })
        }
        ranked.sort((a, b) => b.score - a.score)
        return NextResponse.json({
          query: q,
          mode: 'debug',
          images: ranked.slice(0, 60),
        })
      }
      
      // 3. CLIP-FIRST: Rank by cosine similarity (primary semantic signal)
      // This handles abstract queries like "love", "fun", "3d dashboard", "fun mobile app" etc.
      const ranked = [] as Array<{
        imageId: string
        siteId: string
        url: string
        siteUrl: string
        score: number
        baseScore: number
        site: any
      }>
      
      for (const img of images as any[]) {
        const ivec = (img.embedding?.vector as unknown as number[]) || []
        if (ivec.length !== dim) continue
        
        // PRIMARY: CLIP cosine similarity (this is the main ranking signal)
        const baseScore = cosine(queryVec, ivec)
        let score = baseScore
        
        ranked.push({
          imageId: img.id,
          siteId: (img as any).siteId,
          url: (img as any).url,
          siteUrl: img.site.url,
          score,
          baseScore,
          site: {
            id: img.site.id,
            title: img.site.title,
            description: img.site.description,
            url: img.site.url,
            imageUrl: (img as any).url,
            author: img.site.author,
            tags: [],
          },
        } as any)
      }
      
      // Sort by CLIP cosine similarity (primary ranking)
      ranked.sort((a: any, b: any) => {
        // Primary: CLIP cosine similarity (baseScore)
        if (Math.abs(a.baseScore - b.baseScore) > 0.0001) {
          return b.baseScore - a.baseScore
        }
        return 0
      })
      
      // LIGHT RERANK: Apply very small tag-based adjustments (only to top K)
      const TOP_K_FOR_RERANK = 200
      const topK = ranked.slice(0, TOP_K_FOR_RERANK)
      const remaining = ranked.slice(TOP_K_FOR_RERANK)
      
      // 1. Find relevant concepts (string match only - simpler and more precise)
      const queryLower = q.trim().toLowerCase()
      const queryTokens = queryLower.split(/[\s,]+/).filter(Boolean)
      const allConcepts = await prisma.concept.findMany()
      
      const relevantConceptIds = new Set<string>()
      for (const concept of allConcepts) {
        const conceptLower = concept.label.toLowerCase()
        const conceptIdLower = concept.id.toLowerCase()
        
        // Exact match
        if (conceptLower === queryLower || conceptIdLower === queryLower) {
          relevantConceptIds.add(concept.id)
        }
        // Token match (only if token is substantial, not single letters)
        else {
          for (const token of queryTokens) {
            if (token.length >= 2 && (conceptLower === token || conceptIdLower === token)) {
              relevantConceptIds.add(concept.id)
              break
            }
          }
        }
      }
      
      // Get opposites for relevant concepts
      const oppositeConceptIds = new Set<string>()
      for (const conceptId of relevantConceptIds) {
        const concept = allConcepts.find(c => c.id === conceptId)
        if (concept?.opposites) {
          const opposites = (concept.opposites as unknown as string[]) || []
          for (const oppId of opposites) {
            oppositeConceptIds.add(oppId)
          }
        }
      }
      
      // 2. Load ImageTags for top K images
      const topKImageIds = topK.map(r => r.imageId)
      const imageTags = await prisma.imageTag.findMany({
        where: { imageId: { in: topKImageIds } },
      })
      
      // Group tags by imageId
      const tagsByImage = new Map<string, Map<string, number>>()
      for (const tag of imageTags) {
        if (!tagsByImage.has(tag.imageId)) {
          tagsByImage.set(tag.imageId, new Map())
        }
        tagsByImage.get(tag.imageId)!.set(tag.conceptId, tag.score)
      }
      
      // 3. Apply very light boosts/penalties
      const reranked = topK.map((item: any) => {
        const imageTags = tagsByImage.get(item.imageId) || new Map()
        let boost = 0
        let penalty = 0
        
        // Very light boosts: 0.05-0.08 * tagScore (much lighter than before)
        for (const conceptId of relevantConceptIds) {
          const tagScore = imageTags.get(conceptId)
          if (tagScore !== undefined) {
            boost += 0.05 * tagScore  // Very small boost
          }
        }
        
        // Very light penalties: 0.03 * tagScore (much lighter than before)
        for (const oppId of oppositeConceptIds) {
          const tagScore = imageTags.get(oppId)
          if (tagScore !== undefined) {
            penalty += 0.03 * tagScore  // Very small penalty
          }
        }
        
        // finalScore = baseScore + tiny boosts - tiny penalties
        const finalScore = item.baseScore + boost - penalty
        
        return {
          ...item,
          score: finalScore,
          baseScore: item.baseScore,
          boost,
          penalty,
        }
      })
      
      // Rerank by finalScore
      reranked.sort((a: any, b: any) => {
        if (Math.abs(a.score - b.score) > 0.0001) {
          return b.score - a.score
        }
        return 0
      })
      
      // Combine reranked top K with remaining results
      const finalRanked = [...reranked, ...remaining]
      
      // Return results
      return NextResponse.json({ 
        query: q, 
        sites: finalRanked.map(r => r.site),
        images: finalRanked
      })
    }

    // Fallback to old concept-expansion logic (if zeroShot is false)
    const rawTokens = q.split(/[,+\s]+/).map(t => t.trim()).filter(Boolean)
    if (rawTokens.length === 0) return NextResponse.json({ images: [] })

    const concepts = await prisma.concept.findMany()
    const expandSet = new Set<string>()
    for (const t of rawTokens) {
      expandSet.add(t)
      const c = concepts.find(x => x.id.toLowerCase() === t.toLowerCase() || x.label.toLowerCase() === t.toLowerCase())
      if (c) {
        const syn = (c.synonyms as unknown as string[] | undefined) || []
        const rel = (c.related as unknown as string[] | undefined) || []
        for (const s of syn) expandSet.add(String(s))
        for (const r of rel) expandSet.add(String(r))
      }
    }
    const expanded = Array.from(expandSet)

    const textVecs = await embedTextBatch(expanded)
    const dim = textVecs[0]?.length || 0
    const query = new Array(dim).fill(0)
    for (const v of textVecs) for (let i = 0; i < dim; i++) query[i] += v[i]
    const nrm = Math.sqrt(query.reduce((s, x) => s + x * x, 0)) || 1
    for (let i = 0; i < dim; i++) query[i] /= nrm

    const images = await (prisma.image.findMany as any)({ include: { embedding: true, tags: true } })
    const conceptIds = new Set(rawTokens.map(t => t.toLowerCase()))

    const ranked = [] as Array<{ imageId: string; siteId: string; url: string; score: number }>
    for (const img of images as any[]) {
      const ivec = (img.embedding?.vector as unknown as number[]) || []
      if (ivec.length !== dim || dim === 0) continue
      let score = cosine(query, ivec)
      for (const it of img.tags) {
        if (conceptIds.has(it.conceptId.toLowerCase())) score += 0.02
      }
      ranked.push({ imageId: img.id, siteId: (img as any).siteId, url: (img as any).url, score })
    }
    ranked.sort((a, b) => b.score - a.score)

    return NextResponse.json({ query: expanded, images: ranked.slice(0, 60) })
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 })
  }
}


