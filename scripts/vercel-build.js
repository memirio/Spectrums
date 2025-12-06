#!/usr/bin/env node
/**
 * Vercel build script that conditionally runs migrations
 * This ensures migrations only run when DATABASE_URL is properly set
 */

const { execSync } = require('child_process')

const DUMMY_DATABASE_URL = 'postgresql://dummy:dummy@dummy:5432/dummy'
const DATABASE_URL = process.env.DATABASE_URL

console.log('🔨 Running Prisma generate...')
try {
  execSync('npx prisma generate', { stdio: 'inherit' })
} catch (error) {
  console.error('❌ Prisma generate failed:', error.message)
  process.exit(1)
}

// Check if DATABASE_URL is set and not the dummy value
if (DATABASE_URL && DATABASE_URL !== DUMMY_DATABASE_URL && !DATABASE_URL.includes('dummy')) {
  console.log('🔄 Applying database migrations...')
  try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' })
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    // Don't fail the build if migrations fail - they might already be applied
    console.warn('⚠️  Continuing build despite migration error...')
  }
} else {
  console.log('⏭️  Skipping migrations: DATABASE_URL not set or is dummy value')
  console.log('   DATABASE_URL:', DATABASE_URL ? 'set (hidden)' : 'not set')
}

console.log('🏗️  Building Next.js application...')
try {
  execSync('next build', { stdio: 'inherit' })
} catch (error) {
  console.error('❌ Build failed:', error.message)
  process.exit(1)
}

