// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

// Use driver adapter for serverless (no binaries needed)
// Always use adapter when DATABASE_URL is present (Vercel/production)
function getPrismaClient(): PrismaClient {
  // If using Prisma Accelerate (prisma:// or prisma+postgres:// URL), use default client
  // Accelerate handles everything through Prisma's cloud (no binaries needed)
  if (process.env.DATABASE_URL?.startsWith('prisma://') || process.env.DATABASE_URL?.startsWith('prisma+postgres://')) {
    console.log('[prisma] Using Prisma Accelerate (Data Proxy)')
    return new PrismaClient()
  }
  
  // For direct PostgreSQL connections (like Supabase), use driver adapter (no binaries needed)
  if (process.env.DATABASE_URL) {
    try {
      console.log('[prisma] Using driver adapter to connect to Supabase (no binaries needed)')
      console.log('[prisma] DATABASE_URL starts with:', process.env.DATABASE_URL.substring(0, 30))
      
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 1, // Limit connections for serverless
      })
      
      console.log('[prisma] Pool created, creating adapter...')
      const adapter = new PrismaPg(pool)
      console.log('[prisma] Adapter created, creating PrismaClient...')
      
      const client = new PrismaClient({ adapter })
      console.log('[prisma] PrismaClient created successfully with adapter')
      
      // Test the connection immediately to verify it works
      client.$connect().then(() => {
        console.log('[prisma] Successfully connected to database via adapter')
      }).catch((err) => {
        console.error('[prisma] Failed to connect via adapter:', err)
      })
      
      return client
    } catch (error) {
      console.error('[prisma] Failed to create adapter:', error)
      console.error('[prisma] Error details:', JSON.stringify(error, null, 2))
      // Don't fallback to default - throw error so we know it failed
      throw new Error(`Failed to initialize Prisma with adapter: ${error}`)
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
