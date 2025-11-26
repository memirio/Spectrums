#!/usr/bin/env tsx
/**
 * Setup Supabase Database
 * 
 * This script helps you migrate from SQLite to Supabase PostgreSQL.
 * 
 * Usage:
 *   tsx scripts/setup_supabase.ts
 * 
 * It will:
 * 1. Check if DATABASE_URL points to Supabase
 * 2. Update Prisma schema to use PostgreSQL
 * 3. Generate Prisma client
 * 4. Push schema to Supabase
 * 5. Optionally migrate data from SQLite
 */

import 'dotenv/config'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const SCHEMA_PATH = path.join(process.cwd(), 'prisma/schema.prisma')

function checkSupabaseConnection() {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    console.error('❌ DATABASE_URL not found in .env')
    process.exit(1)
  }

  if (!dbUrl.includes('supabase.co')) {
    console.error('❌ DATABASE_URL does not point to Supabase')
    console.error('   Current:', dbUrl.substring(0, 50) + '...')
    console.error('\n   Please update DATABASE_URL in .env to your Supabase connection string')
    console.error('   Example: postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres')
    process.exit(1)
  }

  console.log('✅ DATABASE_URL points to Supabase')
  return dbUrl
}

function updatePrismaSchema() {
  console.log('\n📝 Updating Prisma schema to use PostgreSQL...')
  
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8')
  
  // Check if already PostgreSQL
  if (schema.includes('provider = "postgresql"')) {
    console.log('✅ Schema already configured for PostgreSQL')
    return
  }

  // Update provider
  const updated = schema.replace(
    /provider = "sqlite"/,
    'provider = "postgresql"'
  )

  fs.writeFileSync(SCHEMA_PATH, updated)
  console.log('✅ Updated schema to use PostgreSQL')
}

function generatePrismaClient() {
  console.log('\n🔧 Generating Prisma client...')
  try {
    execSync('npx prisma generate', { stdio: 'inherit' })
    console.log('✅ Prisma client generated')
  } catch (error) {
    console.error('❌ Failed to generate Prisma client')
    throw error
  }
}

function pushSchema() {
  console.log('\n🚀 Pushing schema to Supabase...')
  console.log('   This will create all tables in your Supabase database')
  
  try {
    execSync('npx prisma db push', { stdio: 'inherit' })
    console.log('✅ Schema pushed to Supabase')
  } catch (error) {
    console.error('❌ Failed to push schema')
    console.error('   Make sure your Supabase project is active and the connection string is correct')
    throw error
  }
}

function main() {
  console.log('🚀 Setting up Supabase database...\n')

  try {
    // Step 1: Check connection
    checkSupabaseConnection()

    // Step 2: Update schema
    updatePrismaSchema()

    // Step 3: Generate client
    generatePrismaClient()

    // Step 4: Push schema
    pushSchema()

    console.log('\n✅ Setup complete!')
    console.log('\n📋 Next steps:')
    console.log('   1. Verify tables in Supabase dashboard')
    console.log('   2. Run seed script: npx tsx scripts/seed_concepts.ts')
    console.log('   3. (Optional) Migrate data from SQLite: npx tsx scripts/migrate_to_supabase.ts')
    console.log('\n💡 Tip: Use Prisma Studio to explore your database:')
    console.log('   npx prisma studio')
  } catch (error) {
    console.error('\n❌ Setup failed:', error)
    process.exit(1)
  }
}

main()

