import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function cosine(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length)
  let s = 0
  for (let i = 0; i < len; i++) s += a[i] * b[i]
  return s
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('imageId')
    if (!imageId) return NextResponse.json({ error: 'imageId required' }, { status: 400 })

    const emb = await prisma.imageEmbedding.findUnique({ where: { imageId } })
    if (!emb) return NextResponse.json({ error: 'no embedding for image' }, { status: 404 })

    const vec = (emb.vector as unknown as number[]) || []
    const concepts = await prisma.concept.findMany()
    const scored = concepts.map(c => ({
      concept: c.id,
      score: cosine(vec, (c.embedding as unknown as number[]) || []),
    }))
    scored.sort((a, b) => b.score - a.score)
    return NextResponse.json({ imageId, scores: scored })
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 })
  }
}


