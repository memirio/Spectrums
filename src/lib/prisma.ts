// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function getPrismaClient(): PrismaClient {
  // For direct PostgreSQL connections (like Supabase), use driver adapter (no binaries needed)
  // This works in serverless environments like Vercel
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('prisma://') && !process.env.DATABASE_URL.startsWith('prisma+postgres://')) {
    try {
      console.log('[prisma] Using driver adapter to connect to Supabase (no binaries needed)')
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 1, // Limit connections for serverless
      })
      const adapter = new PrismaPg(pool)
      return new PrismaClient({ adapter })
    } catch (error) {
      console.error('[prisma] Failed to create adapter:', error)
      throw new Error(`Failed to initialize Prisma with adapter: ${error}`)
    }
  }
  
  // Fallback to default client (for local development or if adapter fails)
  console.log('[prisma] Using default PrismaClient')
  return new PrismaClient({
    // log: ['query','error','warn'], // uncomment for debugging
  })
}

const prisma = globalForPrisma.prisma ?? getPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }
