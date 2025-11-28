#!/usr/bin/env tsx
/**
 * Migrate Remaining Data from SQLite to Supabase
 * 
 * Migrates ImageTags and QueryExpansions (skips concepts since they're already seeded)
 */

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import Database from 'better-sqlite3'
import path from 'path'

const SQLITE_DB_PATH = path.join(process.cwd(), 'prisma/dev-new.db')

async function migrate() {
  console.log('🔄 Migrating remaining data from SQLite to Supabase...\n')
  console.log(`📁 SQLite DB: ${SQLITE_DB_PATH}`)
  console.log(`☁️  Supabase: ${process.env.DATABASE_URL?.substring(0, 50)}...\n`)

  if (!require('fs').existsSync(SQLITE_DB_PATH)) {
    console.error(`❌ SQLite database not found: ${SQLITE_DB_PATH}`)
    process.exit(1)
  }

  const sqlite = new Database(SQLITE_DB_PATH, { readonly: true })
  const prisma = new PrismaClient()

  try {
    // Migrate ImageTags
    console.log('📦 Migrating Image Tags...')
    const imageTags = sqlite.prepare('SELECT * FROM image_tags').all() as any[]
    let imageTagCount = 0
    let skipped = 0
    for (const it of imageTags) {
      try {
        await prisma.imageTag.upsert({
          where: {
            imageId_conceptId: {
              imageId: it.imageId,
              conceptId: it.conceptId,
            },
          },
          update: {
            score: it.score,
          },
          create: {
            imageId: it.imageId,
            conceptId: it.conceptId,
            score: it.score,
          },
        })
        imageTagCount++
        if (imageTagCount % 100 === 0) {
          console.log(`   Progress: ${imageTagCount}/${imageTags.length}...`)
        }
      } catch (error: any) {
        if (error.message?.includes('Foreign key constraint')) {
          skipped++
        } else {
          console.warn(`  ⚠️  Failed to migrate image tag: ${error.message}`)
        }
      }
    }
    console.log(`✅ Migrated ${imageTagCount}/${imageTags.length} image tags (${skipped} skipped)`)

    // Migrate QueryExpansions
    console.log('\n📦 Migrating Query Expansions...')
    const expansions = sqlite.prepare('SELECT * FROM query_expansions').all() as any[]
    let expansionCount = 0
    for (const exp of expansions) {
      try {
        await prisma.queryExpansion.upsert({
          where: {
            term_expansion_source_category: {
              term: exp.term,
              expansion: exp.expansion,
              source: exp.source,
              category: exp.category || 'global',
            },
          },
          update: {
            model: exp.model,
            createdAt: new Date(exp.createdAt),
            lastUsedAt: new Date(exp.lastUsedAt),
          },
          create: {
            term: exp.term,
            expansion: exp.expansion,
            source: exp.source,
            category: exp.category || 'global',
            model: exp.model,
            createdAt: new Date(exp.createdAt),
            lastUsedAt: new Date(exp.lastUsedAt),
          },
        })
        expansionCount++
      } catch (error: any) {
        console.warn(`  ⚠️  Failed to migrate expansion: ${error.message}`)
      }
    }
    console.log(`✅ Migrated ${expansionCount}/${expansions.length} query expansions`)

    console.log('\n✅ Migration complete!')
    console.log('\n📋 Summary:')
    console.log(`   Image Tags: ${imageTagCount}`)
    console.log(`   Query Expansions: ${expansionCount}`)
  } finally {
    sqlite.close()
    await prisma.$disconnect()
  }
}

migrate().catch(console.error)

