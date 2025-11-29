// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

// Use driver adapter for serverless (no binaries needed)
// Always use adapter when DATABASE_URL is present (Vercel/production)
function getPrismaClient(): PrismaClient {
  // If using Prisma Accelerate (prisma:// URL), use default client
  // Accelerate handles everything through Prisma's cloud (no binaries needed)
  if (process.env.DATABASE_URL?.startsWith('prisma://')) {
    console.log('[prisma] Using Prisma Accelerate (Data Proxy)')
    return new PrismaClient()
  }
  
  // For direct PostgreSQL connections, use driver adapter (no binaries needed)
  if (process.env.DATABASE_URL) {
    try {
      console.log('[prisma] Using driver adapter (no binaries needed)')
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 1, // Limit connections for serverless
      })
      const adapter = new PrismaPg(pool)
      const client = new PrismaClient({ adapter })
      console.log('[prisma] PrismaClient created with adapter')
      return client
    } catch (error) {
      console.error('[prisma] Failed to create adapter, falling back to default:', error)
      // Fallback to default if adapter fails
      return new PrismaClient()
    }
  } else {
    console.log('[prisma] Using default PrismaClient (no DATABASE_URL)')
    // Use default client for local development (no DATABASE_URL)
    return new PrismaClient({
      // log: ['query','error','warn'], // uncomment for debugging
    })
  }
}

const prisma =
  globalForPrisma.prisma ?? getPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }
