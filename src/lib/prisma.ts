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
      // but we must reuse the same Pool to stay within connection limits
      // 
      // IMPORTANT: Use Supabase Transaction Pooler (port 6543) instead of Session Pooler (port 5432)
      // Transaction Pooler allows multiple concurrent connections, Session Pooler only allows 1
      // Transaction Pooler URL format: postgresql://postgres.PROJECT_REF:[PASSWORD]@aws-REGION.pooler.supabase.com:6543/postgres
      const isTransactionPooler = dbUrl.includes(':6543') || dbUrl.includes('pooler.supabase.com')
      const maxConnections = isTransactionPooler ? 5 : 1 // Transaction Pooler allows more connections
      
      if (!globalForPrisma.pool) {
        globalForPrisma.pool = new Pool({
          connectionString: dbUrl,
          max: maxConnections,
          idleTimeoutMillis: 20000, // Close idle connections after 20s
          connectionTimeoutMillis: 10000, // Timeout after 10s
        })
        console.log(`[prisma] Created new connection pool (max: ${maxConnections}, pooler: ${isTransactionPooler ? 'Transaction' : 'Session'})`)
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
