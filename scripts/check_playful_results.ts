#!/usr/bin/env tsx
/**
 * Check why certain images are ranking high for "playful" vibe filter
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { embedTextBatch } from '../src/lib/embeddings'

async function main() {
  // Get playful extensions
  const playfulExtensions = await prisma.queryExpansion.findMany({
    where: {
      term: 'playful',
      source: 'vibefilter'
    },
    select: {
      category: true,
      expansion: true,
      embedding: true
    },
    orderBy: { createdAt: 'desc' }
  })

  console.log('Playful vibe extensions:\n')
  playfulExtensions.forEach(ext => {
    console.log(`Category: ${ext.category}`)
    console.log(`Extension: ${ext.expansion}`)
    console.log(`Has embedding: ${ext.embedding ? 'Yes' : 'No'}`)
    console.log('')
  })

  // Get the problematic images
  const urls = [
    'https://middlename.co.uk/',
    'https://www.early.works/',
    'https://www.sananes.co/',
    'https://www.brandium.nl/'
  ]

  const websiteExtension = playfulExtensions.find(e => e.category === 'website')
  if (!websiteExtension || !websiteExtension.embedding) {
    console.log('❌ No website extension found for playful')
    await prisma.$disconnect()
    return
  }

  const queryEmbedding = websiteExtension.embedding as unknown as number[]
  console.log(`\nChecking similarity scores for problematic images:\n`)

  for (const url of urls) {
    const normalized = url.replace(/\/$/, '')
    const site = await prisma.site.findFirst({
      where: { url: normalized },
      include: { 
        images: { 
          take: 1,
          include: {
            embedding: {
              select: {
                vector: true
              }
            },
            tags: {
              include: {
                concept: {
                  select: {
                    label: true
                  }
                }
              },
              orderBy: { score: 'desc' },
              take: 10
            }
          }
        }
      }
    })
    
    if (site && site.images[0]) {
      const img = site.images[0]
      const imgEmbedding = img.embedding?.vector as unknown as number[]
      
      if (imgEmbedding && Array.isArray(imgEmbedding)) {
        // Calculate cosine similarity
        const dotProduct = queryEmbedding.reduce((sum, val, i) => sum + val * imgEmbedding[i], 0)
        const queryMagnitude = Math.sqrt(queryEmbedding.reduce((sum, val) => sum + val * val, 0))
        const imgMagnitude = Math.sqrt(imgEmbedding.reduce((sum, val) => sum + val * val, 0))
        const cosineSimilarity = dotProduct / (queryMagnitude * imgMagnitude)
        
        console.log(`${site.title}:`)
        console.log(`  Cosine Similarity: ${cosineSimilarity.toFixed(4)}`)
        console.log(`  Top tags: ${img.tags.slice(0, 5).map(t => t.concept.label).join(', ')}`)
        
        // Check if any tags match "playful" concepts
        const playfulConcepts = await prisma.concept.findMany({
          where: {
            OR: [
              { label: { contains: 'playful', mode: 'insensitive' } },
              { synonyms: { array_contains: ['playful'] } },
              { related: { array_contains: ['playful'] } }
            ]
          },
          select: { id: true, label: true }
        })
        
        const hasPlayfulTag = img.tags.some(t => 
          playfulConcepts.some(pc => pc.id === t.conceptId)
        )
        console.log(`  Has playful-related tag: ${hasPlayfulTag}`)
        console.log('')
      }
    }
  }

  await prisma.$disconnect()
}

main().catch(console.error)

