#!/usr/bin/env tsx
/**
 * Baseline existing migrations for a database that already has the schema
 * This marks all existing migrations as applied without running them
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { createHash } from 'crypto'

async function baselineMigrations() {
  console.log('🔄 Baselining migrations for existing database...\n')

  const migrationsDir = join(process.cwd(), 'prisma', 'migrations')
  const migrations = readdirSync(migrationsDir)
    .filter(name => /^\d+_/.test(name))
    .sort()

  console.log(`Found ${migrations.length} migrations to baseline\n`)

  // Create migrations table if it doesn't exist
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
      "id" VARCHAR(36) PRIMARY KEY,
      "checksum" VARCHAR(64) NOT NULL,
      "finished_at" TIMESTAMP,
      "migration_name" VARCHAR(255) NOT NULL,
      "logs" TEXT,
      "rolled_back_at" TIMESTAMP,
      "started_at" TIMESTAMP NOT NULL DEFAULT now(),
      "applied_steps_count" INTEGER NOT NULL DEFAULT 0
    )
  `)

  console.log('✅ Created _prisma_migrations table\n')

  // Mark each migration as applied
  for (const migration of migrations) {
    const migrationPath = join(migrationsDir, migration, 'migration.sql')
    let checksum = ''
    
    try {
      const migrationSQL = readFileSync(migrationPath, 'utf-8')
      checksum = createHash('sha256').update(migrationSQL).digest('hex')
    } catch (error) {
      console.warn(`⚠️  Could not read ${migrationPath}, using empty checksum`)
    }

    const migrationName = migration
    const id = createHash('md5').update(migrationName).digest('hex').substring(0, 36)

    // Check if already exists
    const existing = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
      `SELECT id FROM "_prisma_migrations" WHERE migration_name = $1`,
      migrationName
    )

    if (existing.length > 0) {
      console.log(`⏭️  ${migrationName} - already marked as applied`)
      continue
    }

    // Insert as applied
    await prisma.$executeRawUnsafe(`
      INSERT INTO "_prisma_migrations" 
        (id, checksum, finished_at, migration_name, started_at, applied_steps_count)
      VALUES 
        ($1, $2, now(), $3, now(), 1)
      ON CONFLICT (id) DO NOTHING
    `, id, checksum, migrationName)

    console.log(`✅ ${migrationName} - marked as applied`)
  }

  console.log(`\n✅ Successfully baselined ${migrations.length} migrations!`)
  console.log('   You can now run `npm run migrate:deploy` to apply new migrations')
}

baselineMigrations()
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

