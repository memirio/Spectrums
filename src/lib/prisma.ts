// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = globalThis as unknown as { prisma?: ReturnType<typeof getPrismaClient> }

function getPrismaClient() {
  // If using Prisma Accelerate (prisma:// or prisma+postgres:// URL)
  if (process.env.DATABASE_URL?.startsWith('prisma://') || process.env.DATABASE_URL?.startsWith('prisma+postgres://')) {
    console.log('[prisma] Using Prisma Accelerate')
    return new PrismaClient({
      accelerateUrl: process.env.DATABASE_URL,
    }).$extends(withAccelerate())
  }
  
  // For direct PostgreSQL connections, use default client
  // (This will use binaries, but works for local development)
  console.log('[prisma] Using default PrismaClient (direct connection)')
  return new PrismaClient({
    // log: ['query','error','warn'], // uncomment for debugging
  })
}

const prisma = globalForPrisma.prisma ?? getPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }
