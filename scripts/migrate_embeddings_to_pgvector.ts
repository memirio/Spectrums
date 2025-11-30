#!/usr/bin/env tsx
/**
 * Migrate embeddings from JSON to pgvector
 * 
 * This script:
 * 1. Reads all embeddings from the JSON column
 * 2. Converts them to pgvector format
 * 3. Updates the vector_pg column
 * 4. Verifies the migration
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function migrateEmbeddings() {
  console.log('🔄 Starting embedding migration to pgvector...\n')
  
  try {
    // Get all embeddings with JSON vectors that don't have vector_pg yet
    // Use a simpler query that checks for NULL vector_pg
    const allEmbeddings = await prisma.imageEmbedding.findMany({
      where: {
        vector: { not: null },
      },
      select: {
        id: true,
        imageId: true,
        vector: true,
        model: true,
      },
    })
    
    // Filter to only those that need migration (check vector_pg is NULL)
    // We'll check this by trying to update and seeing if it's already set
    const embeddings = allEmbeddings
    
    console.log(`📊 Found ${embeddings.length} embeddings to migrate\n`)
    
    if (embeddings.length === 0) {
      console.log('✅ No embeddings to migrate. All done!')
      return
    }
    
    let migrated = 0
    let errors = 0
    
    for (const emb of embeddings) {
      try {
        const vector = emb.vector as unknown as number[]
        
        if (!Array.isArray(vector) || vector.length !== 768 || vector.length === 0) {
          console.warn(`⚠️  Skipping ${emb.id}: invalid vector (length: ${vector?.length || 0})`)
          errors++
          continue
        }
        
        // Validate vector has valid numbers
        if (vector.some(v => typeof v !== 'number' || isNaN(v) || !isFinite(v))) {
          console.warn(`⚠️  Skipping ${emb.id}: vector contains invalid numbers`)
          errors++
          continue
        }
        
        // Convert to pgvector format: '[0.1,0.2,0.3,...]'
        const vectorStr = '[' + vector.join(',') + ']'
        
        // Update using raw SQL to set vector_pg column (only if not already set)
        // Use a simpler WHERE clause to avoid empty vector comparison issues
        const result = await prisma.$executeRawUnsafe(`
          UPDATE "image_embeddings"
          SET "vector_pg" = $1::vector
          WHERE id = $2
          AND "vector_pg" IS NULL
        `, vectorStr, emb.id)
        
        // If no rows updated, check if it's already set (skip if so)
        if (result === 0) {
          // Already migrated, skip
          continue
        }
        
        migrated++
        
        if (migrated % 100 === 0) {
          console.log(`✅ Migrated ${migrated}/${embeddings.length} embeddings...`)
        }
      } catch (error: any) {
        console.error(`❌ Error migrating ${emb.id}:`, error.message)
        errors++
      }
    }
    
    console.log(`\n✅ Migration complete!`)
    console.log(`   Migrated: ${migrated}`)
    console.log(`   Errors: ${errors}`)
    
    // Verify migration (check for non-null vector_pg)
    const verified = await prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count
      FROM "image_embeddings"
      WHERE "vector_pg" IS NOT NULL
    `
    
    console.log(`\n📊 Verification:`)
    console.log(`   Embeddings with pgvector: ${verified[0].count}`)
    
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

migrateEmbeddings()
  .catch(console.error)

