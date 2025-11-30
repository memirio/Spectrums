// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function getPrismaClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL || ''
  
  // For direct PostgreSQL connections (like Supabase), use driver adapter (no binaries needed)
  // This works in serverless environments like Vercel
  if (dbUrl && (dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://'))) {
    try {
      console.log('[prisma] Using driver adapter to connect to Supabase (no binaries needed)')
      console.log('[prisma] DATABASE_URL starts with:', dbUrl.substring(0, 30))
      const pool = new Pool({
        connectionString: dbUrl,
        max: 1, // Limit connections for serverless
      })
      const adapter = new PrismaPg(pool)
      const client = new PrismaClient({ adapter })
      console.log('[prisma] PrismaClient created successfully with adapter')
      return client
    } catch (error) {
      console.error('[prisma] Failed to create adapter:', error)
      throw new Error(`Failed to initialize Prisma with adapter: ${error}`)
    }
  }
  
  // Fallback to default client (for local development or if adapter fails)
  console.log('[prisma] Using default PrismaClient')
  console.log('[prisma] DATABASE_URL type:', typeof process.env.DATABASE_URL)
  console.log('[prisma] DATABASE_URL starts with:', dbUrl.substring(0, 30))
  return new PrismaClient({
    // log: ['query','error','warn'], // uncomment for debugging
  })
}

const prisma = globalForPrisma.prisma ?? getPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }
