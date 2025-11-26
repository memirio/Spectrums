#!/usr/bin/env tsx
/**
 * Migrate Data from SQLite to Supabase
 * 
 * This script migrates all data from your local SQLite database to Supabase PostgreSQL.
 * 
 * Prerequisites:
 * 1. Supabase project created and DATABASE_URL set in .env
 * 2. Schema already pushed to Supabase (run setup_supabase.ts first)
 * 
 * Usage:
 *   tsx scripts/migrate_to_supabase.ts [sqlite-db-path]
 * 
 * Example:
 *   tsx scripts/migrate_to_supabase.ts prisma/dev-new.db
 */

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import Database from 'better-sqlite3'
import path from 'path'

const SQLITE_DB_PATH = process.argv[2] || path.join(process.cwd(), 'prisma/dev-new.db')

async function migrate() {
  console.log('🔄 Migrating data from SQLite to Supabase...\n')
  console.log(`📁 SQLite DB: ${SQLITE_DB_PATH}`)
  console.log(`☁️  Supabase: ${process.env.DATABASE_URL?.substring(0, 50)}...\n`)

  // Connect to SQLite
  if (!require('fs').existsSync(SQLITE_DB_PATH)) {
    console.error(`❌ SQLite database not found: ${SQLITE_DB_PATH}`)
    process.exit(1)
  }

  const sqlite = new Database(SQLITE_DB_PATH, { readonly: true })
  const prisma = new PrismaClient()

  try {
    // Migrate Sites
    console.log('📦 Migrating Sites...')
    const sites = sqlite.prepare('SELECT * FROM sites').all() as any[]
    let siteCount = 0
    for (const site of sites) {
      try {
        await prisma.site.upsert({
          where: { id: site.id },
          update: {
            title: site.title,
            description: site.description,
            url: site.url,
            imageUrl: site.imageUrl,
            author: site.author,
            createdAt: new Date(site.createdAt),
            updatedAt: new Date(site.updatedAt),
          },
          create: {
            id: site.id,
            title: site.title,
            description: site.description,
            url: site.url,
            imageUrl: site.imageUrl,
            author: site.author,
            createdAt: new Date(site.createdAt),
            updatedAt: new Date(site.updatedAt),
          },
        })
        siteCount++
      } catch (error: any) {
        console.warn(`  ⚠️  Failed to migrate site ${site.id}: ${error.message}`)
      }
    }
    console.log(`✅ Migrated ${siteCount}/${sites.length} sites`)

    // Migrate Tags
    console.log('\n📦 Migrating Tags...')
    const tags = sqlite.prepare('SELECT * FROM tags').all() as any[]
    let tagCount = 0
    for (const tag of tags) {
      try {
        await prisma.tag.upsert({
          where: { id: tag.id },
          update: {
            name: tag.name,
            createdAt: new Date(tag.createdAt),
          },
          create: {
            id: tag.id,
            name: tag.name,
            createdAt: new Date(tag.createdAt),
          },
        })
        tagCount++
      } catch (error: any) {
        console.warn(`  ⚠️  Failed to migrate tag ${tag.id}: ${error.message}`)
      }
    }
    console.log(`✅ Migrated ${tagCount}/${tags.length} tags`)

    // Migrate Images
    console.log('\n📦 Migrating Images...')
    const images = sqlite.prepare('SELECT * FROM images').all() as any[]
    let imageCount = 0
    for (const image of images) {
      try {
        await (prisma.image as any).upsert({
          where: { id: image.id },
          update: {
            siteId: image.siteId,
            sourceUrl: image.sourceUrl,
            category: image.category || 'website',
            url: image.url,
            width: image.width,
            height: image.height,
            bytes: image.bytes,
            hubCount: image.hubCount,
            hubScore: image.hubScore,
            hubAvgCosineSimilarity: image.hubAvgCosineSimilarity,
            hubAvgCosineSimilarityMargin: image.hubAvgCosineSimilarityMargin,
            createdAt: new Date(image.createdAt),
            updatedAt: new Date(image.updatedAt),
          },
          create: {
            id: image.id,
            siteId: image.siteId,
            sourceUrl: image.sourceUrl,
            category: image.category || 'website',
            url: image.url,
            width: image.width,
            height: image.height,
            bytes: image.bytes,
            hubCount: image.hubCount,
            hubScore: image.hubScore,
            hubAvgCosineSimilarity: image.hubAvgCosineSimilarity,
            hubAvgCosineSimilarityMargin: image.hubAvgCosineSimilarityMargin,
            createdAt: new Date(image.createdAt),
            updatedAt: new Date(image.updatedAt),
          },
        })
        imageCount++
      } catch (error: any) {
        console.warn(`  ⚠️  Failed to migrate image ${image.id}: ${error.message}`)
      }
    }
    console.log(`✅ Migrated ${imageCount}/${images.length} images`)

    // Migrate ImageEmbeddings
    console.log('\n📦 Migrating Image Embeddings...')
    const embeddings = sqlite.prepare('SELECT * FROM image_embeddings').all() as any[]
    let embeddingCount = 0
    for (const emb of embeddings) {
      try {
        await prisma.imageEmbedding.upsert({
          where: { id: emb.id },
          update: {
            imageId: emb.imageId,
            model: emb.model,
            vector: JSON.parse(emb.vector as string),
            contentHash: emb.contentHash,
            createdAt: new Date(emb.createdAt),
          },
          create: {
            id: emb.id,
            imageId: emb.imageId,
            model: emb.model,
            vector: JSON.parse(emb.vector as string),
            contentHash: emb.contentHash,
            createdAt: new Date(emb.createdAt),
          },
        })
        embeddingCount++
      } catch (error: any) {
        console.warn(`  ⚠️  Failed to migrate embedding ${emb.id}: ${error.message}`)
      }
    }
    console.log(`✅ Migrated ${embeddingCount}/${embeddings.length} embeddings`)

    // Migrate Concepts
    console.log('\n📦 Migrating Concepts...')
    const concepts = sqlite.prepare('SELECT * FROM Concept').all() as any[]
    let conceptCount = 0
    for (const concept of concepts) {
      try {
        await prisma.concept.upsert({
          where: { id: concept.id },
          update: {
            label: concept.label,
            locale: concept.locale,
            synonyms: JSON.parse(concept.synonyms as string),
            related: JSON.parse(concept.related as string),
            opposites: concept.opposites ? JSON.parse(concept.opposites as string) : null,
            weight: concept.weight,
            embedding: JSON.parse(concept.embedding as string),
          },
          create: {
            id: concept.id,
            label: concept.label,
            locale: concept.locale,
            synonyms: JSON.parse(concept.synonyms as string),
            related: JSON.parse(concept.related as string),
            opposites: concept.opposites ? JSON.parse(concept.opposites as string) : null,
            weight: concept.weight,
            embedding: JSON.parse(concept.embedding as string),
          },
        })
        conceptCount++
      } catch (error: any) {
        console.warn(`  ⚠️  Failed to migrate concept ${concept.id}: ${error.message}`)
      }
    }
    console.log(`✅ Migrated ${conceptCount}/${concepts.length} concepts`)

    // Migrate ImageTags
    console.log('\n📦 Migrating Image Tags...')
    const imageTags = sqlite.prepare('SELECT * FROM image_tags').all() as any[]
    let imageTagCount = 0
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
      } catch (error: any) {
        console.warn(`  ⚠️  Failed to migrate image tag: ${error.message}`)
      }
    }
    console.log(`✅ Migrated ${imageTagCount}/${imageTags.length} image tags`)

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
    console.log(`   Sites: ${siteCount}`)
    console.log(`   Tags: ${tagCount}`)
    console.log(`   Images: ${imageCount}`)
    console.log(`   Embeddings: ${embeddingCount}`)
    console.log(`   Concepts: ${conceptCount}`)
    console.log(`   Image Tags: ${imageTagCount}`)
    console.log(`   Query Expansions: ${expansionCount}`)
  } finally {
    sqlite.close()
    await prisma.$disconnect()
  }
}

migrate().catch(console.error)

