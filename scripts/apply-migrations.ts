#!/usr/bin/env tsx
/**
 * Apply pending Prisma migrations
 * 
 * This script applies all pending migrations to the database.
 * Run this in your production environment or locally with DATABASE_URL set.
 */

import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { join } from 'path'

const migrationsDir = join(process.cwd(), 'prisma', 'migrations')

if (!existsSync(migrationsDir)) {
  console.error('❌ Migrations directory not found:', migrationsDir)
  process.exit(1)
}

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set')
  console.error('   Please set DATABASE_URL before running migrations')
  process.exit(1)
}

console.log('🔄 Applying pending migrations...')
console.log('   Database:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@'))

try {
  // Use migrate deploy for production (doesn't create new migrations, just applies existing ones)
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: process.env
  })
  console.log('✅ Migrations applied successfully!')
} catch (error: any) {
  console.error('❌ Failed to apply migrations:', error.message)
  process.exit(1)
}

