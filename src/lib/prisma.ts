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
      
      // ROOT CAUSE FIX: In Vercel serverless, each function invocation is isolated.
      // globalThis doesn't persist between invocations, so we can't reliably reuse pools.
      // Instead, we create a minimal pool per invocation that closes connections quickly.
      // 
      // IMPORTANT: Use Supabase Transaction Pooler (port 6543) for better concurrency.
      // Transaction Pooler URL: postgresql://postgres.PROJECT_REF:[PASSWORD]@aws-REGION.pooler.supabase.com:6543/postgres
      const isTransactionPooler = dbUrl.includes(':6543') || dbUrl.includes('pooler.supabase.com')
      
      // For serverless: Use minimal pool size (1 connection per invocation)
      // Transaction Pooler handles the actual pooling at Supabase's end
      // Each Vercel function invocation gets its own pool, which is fine because
      // Transaction Pooler can handle many concurrent connections
      
      // Vercel-specific: Connection establishment takes longer due to:
      // - Cold starts (function initialization)
      // - Network latency between Vercel and Supabase
      // - Connection pool initialization
      // Increase timeout for Vercel environments (detected by VERCEL env var)
      // Increased to 15s to handle cold starts and network latency more reliably
      const isVercel = !!process.env.VERCEL
      const connectionTimeout = isVercel ? 15000 : 5000 // 15s on Vercel, 5s locally
      
      if (!globalForPrisma.pool) {
        globalForPrisma.pool = new Pool({
          connectionString: dbUrl,
          max: 1, // One connection per serverless function invocation
          min: 0, // Don't keep idle connections
          idleTimeoutMillis: 30000, // Keep connections longer (30s) to reduce reconnection overhead
          connectionTimeoutMillis: connectionTimeout, // Longer timeout on Vercel for cold starts + network latency
          // For Transaction Pooler, connections are pooled at Supabase's end
          // We just need to ensure we don't leak connections
          // Add statement_timeout to prevent long-running queries from blocking
          // Reduced to 20s to leave buffer for Vercel's 30s timeout
          statement_timeout: 20000, // 20s max query time (Vercel timeout is 30s)
          // Keep connections alive to reduce reconnection overhead
          keepAlive: true,
          keepAliveInitialDelayMillis: 10000,
        })
        console.log(`[prisma] Created connection pool (pooler: ${isTransactionPooler ? 'Transaction' : 'Session'}, timeout: ${connectionTimeout}ms, Vercel: ${isVercel})`)
        
        // Handle pool errors gracefully
        globalForPrisma.pool.on('error', (err) => {
          console.error('[prisma] Pool error:', err.message)
          console.error('[prisma] Pool error stack:', err.stack)
        })
        
        // Log connection events for debugging
        globalForPrisma.pool.on('connect', () => {
          console.log('[prisma] New connection established')
        })
        
        globalForPrisma.pool.on('acquire', () => {
          console.log('[prisma] Connection acquired from pool')
        })
        
        globalForPrisma.pool.on('remove', () => {
          console.log('[prisma] Connection removed from pool')
        })
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
  // But Prisma 7 requires adapter when using "client" engine type
  // If DATABASE_URL is missing, throw a clear error
  if (!dbUrl) {
    console.error('[prisma] DATABASE_URL is missing!')
    console.error('[prisma] Available env vars:', Object.keys(process.env).filter(k => k.includes('DATABASE')))
    throw new Error('DATABASE_URL environment variable is required but not set. Please configure it in your Vercel environment variables.')
  }
  
  console.log('[prisma] Using default PrismaClient (fallback)')
  console.log('[prisma] DATABASE_URL type:', typeof process.env.DATABASE_URL)
  console.log('[prisma] DATABASE_URL starts with:', dbUrl.substring(0, 30))
  
  // If we reach here, DATABASE_URL exists but doesn't start with postgresql://
  // This shouldn't happen in production, but handle it gracefully
  return new PrismaClient({
    // log: ['query','error','warn'], // uncomment for debugging
  })
}

const prisma = globalForPrisma.prisma ?? getPrismaClient()

// In serverless, try to reuse but don't rely on it persisting
// Each invocation may create a new instance, which is fine with Transaction Pooler
if (process.env.NODE_ENV === 'production') {
  globalForPrisma.prisma = prisma
} else {
  globalForPrisma.prisma = prisma
}

export { prisma }
