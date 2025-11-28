/**
 * Tag newly created concepts on all existing images
 * Called after new concepts are created via Gemini
 */

import { prisma } from '@/lib/prisma'
import { embedTextBatch, meanVec, l2norm } from '@/lib/embeddings'
import { TAG_CONFIG } from '@/lib/tagging-config'
import * as fs from 'fs/promises'
import * as path from 'path'

function cosineSimilarity(a: number[], b: number[]): number {
  let s = 0
  for (let i = 0; i < a.length && i < b.length; i++) s += a[i] * b[i]
  return s
}

export async function tagNewConceptsOnAllImages(newConceptIds: string[]): Promise<void> {
  if (newConceptIds.length === 0) {
    return
  }

  console.log(`[tag-new-concepts] Tagging ${newConceptIds.length} new concept(s) on all existing images...`)

  // Load the new concepts from seed file
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json')
  const seedContent = await fs.readFile(seedPath, 'utf-8')
  const allConcepts = JSON.parse(seedContent)
  const newConcepts = allConcepts.filter((c: any) => newConceptIds.includes(c.id))

  if (newConcepts.length === 0) {
    console.warn(`[tag-new-concepts] No concept data found for new IDs`)
    return
  }

  // Embed the new concepts (if not already embedded)
  const conceptEmbeddings = new Map<string, number[]>()
  
  for (const concept of newConcepts) {
    // Check if concept already exists in database with embedding
    const existingConcept = await prisma.concept.findUnique({
      where: { id: concept.id },
    })

    if (existingConcept && existingConcept.embedding) {
      // Use existing embedding
      conceptEmbeddings.set(concept.id, existingConcept.embedding as unknown as number[])
      continue
    }

    // Embed the new concept using centralized method
    const { generateConceptEmbedding } = await import('@/lib/concept-embeddings')
    let normalized: number[]
    try {
      normalized = await generateConceptEmbedding(
        concept.label,
        concept.synonyms || [],
        concept.related || []
      )
    } catch (error: any) {
      console.warn(`[tag-new-concepts] No embeddings for concept ${concept.id}: ${error.message}`)
      continue
    }
    
    conceptEmbeddings.set(concept.id, normalized)
    
    // Ensure concept exists in database with embedding
    await prisma.concept.upsert({
      where: { id: concept.id },
      update: {
        label: concept.label,
        locale: 'en',
        synonyms: concept.synonyms || [],
        related: concept.related || [],
        weight: 1.0,
        embedding: normalized as any,
      },
      create: {
        id: concept.id,
        label: concept.label,
        locale: 'en',
        synonyms: concept.synonyms || [],
        related: concept.related || [],
        weight: 1.0,
        embedding: normalized as any,
      },
    })
  }

  if (conceptEmbeddings.size === 0) {
    console.warn(`[tag-new-concepts] No embeddings created for new concepts`)
    return
  }

  console.log(`[tag-new-concepts] Embedded ${conceptEmbeddings.size} new concept(s)`)

  // Get all active images with embeddings
  // Use a simpler query to avoid Prisma type issues
  const sites = await prisma.site.findMany({
    where: {
      imageUrl: { not: null },
    },
    include: {
      images: {
        where: {
          embedding: { isNot: null },
        },
        include: {
          embedding: true,
        },
      },
    },
  })
  
  // Filter out images without URLs in JavaScript (simpler than Prisma query)
  for (const site of sites) {
    site.images = site.images.filter((img: any) => img.url != null)
  }

  const images: Array<{ id: string; embedding: { vector: any } }> = []
  for (const site of sites) {
    if (site.imageUrl) {
      const image = site.images.find(img => img.url === site.imageUrl && img.embedding)
      if (image && image.embedding) {
        images.push({
          id: image.id,
          embedding: image.embedding,
        })
      }
    }
  }

  console.log(`[tag-new-concepts] Processing ${images.length} existing images...`)

  let totalTagsAdded = 0
  let imagesWithTags = 0

  for (const image of images) {
    const imageVec = image.embedding.vector as unknown as number[]
    if (!imageVec || imageVec.length === 0) continue

    let tagsAddedForImage = 0

    try {
      // Check each new concept against this image
      for (const [conceptId, conceptVec] of conceptEmbeddings.entries()) {
        const similarity = cosineSimilarity(imageVec, conceptVec)
        
        // Only tag if similarity is above threshold
        if (similarity >= TAG_CONFIG.MIN_SCORE) {
          // Check if tag already exists (don't update existing tags)
          const existing = await prisma.imageTag.findUnique({
            where: {
              imageId_conceptId: {
                imageId: image.id,
                conceptId: conceptId,
              },
            },
          })
          
          if (!existing) {
            // Only create new tags (keep existing tags)
            await prisma.imageTag.create({
              data: {
                imageId: image.id,
                conceptId: conceptId,
                score: similarity,
              },
            })
            tagsAddedForImage++
            totalTagsAdded++
          }
        }
      }

      if (tagsAddedForImage > 0) {
        imagesWithTags++
      }
    } catch (error: any) {
      console.error(`[tag-new-concepts] Error processing image ${image.id}: ${error.message}`)
    }
  }

  console.log(`[tag-new-concepts] ✅ Tagging complete:`)
  console.log(`   📋 New concepts: ${newConceptIds.length}`)
  console.log(`   🖼️  Images processed: ${images.length}`)
  console.log(`   🏷️  Images tagged: ${imagesWithTags}`)
  console.log(`   🏷️  Total tags added: ${totalTagsAdded}`)
  
  // Note: We don't trigger hub detection here because we're tagging existing images with new concepts
  // Hub detection should only run for newly added images, not when existing images get new tags
  // If you want to update hub scores when tags change, you'd need to recalculate all images
  // For now, we skip hub detection here to keep it fast
}

