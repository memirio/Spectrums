// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { 
  prisma?: PrismaClient
  pool?: Pool
}

function getPrismaClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL || ''
  
  // For direct PostgreSQL connections (like Supabase), use driver adapter (no binaries needed)
  // This works in serverless environments like Vercel
  if (dbUrl && (dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://'))) {
    try {
      console.log('[prisma] Using driver adapter to connect to Supabase (no binaries needed)')
      console.log('[prisma] DATABASE_URL starts with:', dbUrl.substring(0, 30))
      
      // CRITICAL: Reuse pool across serverless invocations to avoid "max clients reached" errors
      // In Vercel/serverless, each function invocation can create a new instance,
      // but we must reuse the same Pool to stay within Supabase Session Pooler limits (1 connection)
      if (!globalForPrisma.pool) {
        globalForPrisma.pool = new Pool({
          connectionString: dbUrl,
          max: 1, // Session pooler only allows 1 connection
          idleTimeoutMillis: 30000, // Close idle connections after 30s
          connectionTimeoutMillis: 5000, // Timeout after 5s
        })
        console.log('[prisma] Created new connection pool')
      } else {
        console.log('[prisma] Reusing existing connection pool')
      }
      
      const adapter = new PrismaPg(globalForPrisma.pool)
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

// Always reuse the same instance in serverless (Vercel) to avoid connection pool exhaustion
globalForPrisma.prisma = prisma

export { prisma }
