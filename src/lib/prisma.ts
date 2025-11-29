// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

// Use driver adapter for serverless (no binaries needed)
// Always use adapter in production/Vercel, fallback to default in development
function getPrismaClient(): PrismaClient {
  // Use driver adapter if:
  // 1. Running on Vercel (VERCEL env var is set)
  // 2. In production environment
  // 3. DATABASE_URL contains 'prisma://' (Prisma Data Proxy)
  const useAdapter = 
    process.env.VERCEL === '1' || 
    process.env.NODE_ENV === 'production' ||
    process.env.DATABASE_URL?.includes('prisma://')

  if (useAdapter && process.env.DATABASE_URL) {
    // Use driver adapter in serverless/Vercel environment (no binaries needed)
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 1, // Limit connections for serverless
    })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
  } else {
    // Use default client for local development
    return new PrismaClient({
      // log: ['query','error','warn'], // uncomment for debugging
    })
  }
}

const prisma =
  globalForPrisma.prisma ?? getPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }
