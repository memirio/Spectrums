// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

// Use driver adapter for serverless (no binaries needed)
let prisma: PrismaClient

if (process.env.VERCEL || process.env.DATABASE_URL?.includes('prisma://')) {
  // Use driver adapter in serverless/Vercel environment (no binaries needed)
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1, // Limit connections for serverless
  })
  const adapter = new PrismaPg(pool)
  prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })
} else {
  // Use default client for local development
  prisma = globalForPrisma.prisma ?? new PrismaClient({
    // log: ['query','error','warn'], // uncomment for debugging
  })
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }
