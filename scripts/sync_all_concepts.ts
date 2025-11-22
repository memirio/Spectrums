/**
 * Sync all concepts to all required places:
 * 1. Sync concept-opposites.ts from seed_concepts.json
 * 2. Seed concepts to database (with updated synonyms, related, opposites)
 */

import 'dotenv/config'
import { syncOppositesFromSeed } from '../src/lib/update-concept-opposites'
import { prisma } from '../src/lib/prisma'
import * as fs from 'fs/promises'
import * as path from 'path'
import { generateConceptEmbedding } from '../src/lib/concept-embeddings'

type Concept = {
  id: string
  label: string
  synonyms?: string[]
  related?: string[]
  opposites?: string[]
  category?: string
  applicableCategories?: string[] // e.g. ["website", "packaging"]
  embeddingStrategy?: string // e.g. "generic", "website_style", "packaging_style"
}

async function main() {
  console.log('═'.repeat(70))
  console.log('🔄 Syncing All Concepts')
  console.log('═'.repeat(70))
  console.log()
  
  // Step 1: Sync concept-opposites.ts
  console.log('📝 Step 1: Syncing concept-opposites.ts from seed_concepts.json...')
  console.log()
  try {
    await syncOppositesFromSeed()
    console.log('✅ Step 1 complete: concept-opposites.ts synced')
    console.log()
  } catch (error: any) {
    console.error('❌ Step 1 failed:', error.message)
    process.exit(1)
  }
  
  // Step 2: Load concepts from seed file
  console.log('📚 Step 2: Loading concepts from seed_concepts.json...')
  const seedPath = path.join(process.cwd(), 'src', 'concepts', 'seed_concepts.json')
  const seedContent = await fs.readFile(seedPath, 'utf-8')
  const concepts: Concept[] = JSON.parse(seedContent)
  console.log(`✅ Loaded ${concepts.length} concepts`)
  console.log()
  
  // Step 3: Seed concepts to database
  console.log('💾 Step 3: Seeding concepts to database...')
  console.log('   This will update embeddings with new synonyms and related terms')
  console.log('   and store opposites in the database.')
  console.log()
  
  let upserted = 0
  let skipped = 0
  let errors = 0
  
  for (let i = 0; i < concepts.length; i++) {
    const concept = concepts[i]
    
    if ((i + 1) % 100 === 0) {
      console.log(`   Processing ${i + 1}/${concepts.length}...`)
    }
    
    try {
      // Generate embedding with updated synonyms and related
      const embedding = await generateConceptEmbedding(
        concept.label,
        concept.synonyms || [],
        concept.related || []
      )
      
      // Set defaults for category metadata
      const applicableCategories = concept.applicableCategories || ['website']
      const embeddingStrategy = concept.embeddingStrategy || 'website_style'
      
      // Upsert concept with all data
      await prisma.concept.upsert({
        where: { id: concept.id },
        update: {
          label: concept.label,
          locale: 'en',
          synonyms: concept.synonyms || [],
          related: concept.related || [],
          opposites: concept.opposites || [],
          weight: 1.0,
          embedding: embedding,
          applicableCategories: applicableCategories,
          embeddingStrategy: embeddingStrategy,
        },
        create: {
          id: concept.id,
          label: concept.label,
          locale: 'en',
          synonyms: concept.synonyms || [],
          related: concept.related || [],
          opposites: concept.opposites || [],
          weight: 1.0,
          embedding: embedding,
          applicableCategories: applicableCategories,
          embeddingStrategy: embeddingStrategy,
        }
      })
      
      upserted++
    } catch (error: any) {
      console.error(`   ⚠️  Error processing ${concept.id}: ${error.message}`)
      errors++
      skipped++
    }
  }
  
  console.log()
  console.log('✅ Step 3 complete: Database seeded')
  console.log(`   Upserted: ${upserted}`)
  console.log(`   Skipped: ${skipped}`)
  console.log()
  
  // Summary
  console.log('═'.repeat(70))
  console.log('📊 Summary')
  console.log('═'.repeat(70))
  console.log('✅ concept-opposites.ts synced from seed_concepts.json')
  console.log(`✅ ${upserted} concepts seeded to database`)
  console.log(`   - Updated embeddings with new synonyms/related`)
  console.log(`   - Stored opposites in database`)
  if (errors > 0) {
    console.log(`⚠️  ${errors} concepts had errors`)
  }
  console.log()
  console.log('═'.repeat(70))
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })

