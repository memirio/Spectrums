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
    // Get all embeddings with JSON vectors
    const embeddings = await prisma.$queryRaw<any[]>`
      SELECT 
        id,
        "imageId",
        vector,
        model
      FROM "image_embeddings"
      WHERE vector IS NOT NULL
      AND ("vector_pg" IS NULL OR "vector_pg" = '[]'::vector)
    `
    
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
        
        if (!Array.isArray(vector) || vector.length !== 768) {
          console.warn(`⚠️  Skipping ${emb.id}: invalid vector (length: ${vector?.length || 0})`)
          errors++
          continue
        }
        
        // Convert to pgvector format: '[0.1,0.2,0.3,...]'
        const vectorStr = '[' + vector.join(',') + ']'
        
        // Update using raw SQL to set vector_pg column
        await prisma.$executeRawUnsafe(`
          UPDATE "image_embeddings"
          SET "vector_pg" = $1::vector
          WHERE id = $2
        `, vectorStr, emb.id)
        
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
    
    // Verify migration
    const verified = await prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count
      FROM "image_embeddings"
      WHERE "vector_pg" IS NOT NULL
      AND "vector_pg" != '[]'::vector
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

