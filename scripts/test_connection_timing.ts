#!/usr/bin/env tsx
/**
 * Test connection timing to understand network latency
 */

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { performance } from 'perf_hooks'

async function main() {
  try {
    console.log('Testing connection and query timing...\n')
    
    // Test 1: First connection (cold start)
    console.log('Test 1: Cold start connection')
    const coldStart = performance.now()
    await prisma.$queryRaw`SELECT 1`
    const coldEnd = performance.now()
    console.log(`  Time: ${(coldEnd - coldStart).toFixed(2)}ms\n`)
    
    // Test 2: Warm connection
    console.log('Test 2: Warm connection (reused)')
    const warmStart = performance.now()
    await prisma.$queryRaw`SELECT 1`
    const warmEnd = performance.now()
    console.log(`  Time: ${(warmEnd - warmStart).toFixed(2)}ms\n`)
    
    // Test 3: Actual findMany query
    console.log('Test 3: findMany query')
    const queryStart = performance.now()
    const sites = await prisma.site.findMany({
      orderBy: [
        { createdAt: 'desc' },
        { id: 'asc' }
      ],
      take: 61,
      skip: 0,
    })
    const queryEnd = performance.now()
    console.log(`  Time: ${(queryEnd - queryStart).toFixed(2)}ms`)
    console.log(`  Rows: ${sites.length}\n`)
    
    // Test 4: Multiple queries to see if connection improves
    console.log('Test 4: Multiple queries (connection reuse)')
    const times: number[] = []
    for (let i = 0; i < 5; i++) {
      const start = performance.now()
      await prisma.site.findMany({
        orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
        take: 61,
        skip: 0,
      })
      const end = performance.now()
      times.push(end - start)
      console.log(`  Query ${i + 1}: ${(end - start).toFixed(2)}ms`)
    }
    const avg = times.reduce((a, b) => a + b, 0) / times.length
    console.log(`  Average: ${avg.toFixed(2)}ms\n`)
    
    // Test 5: Raw SQL query timing
    console.log('Test 5: Raw SQL query (bypassing Prisma overhead)')
    const rawStart = performance.now()
    const rawResult = await prisma.$queryRawUnsafe<any[]>(`
      SELECT "id", "title", "description", "url", "imageUrl", "author", "createdAt", "updatedAt"
      FROM "sites"
      ORDER BY "createdAt" DESC, "id" ASC
      LIMIT 61
    `)
    const rawEnd = performance.now()
    console.log(`  Time: ${(rawEnd - rawStart).toFixed(2)}ms`)
    console.log(`  Rows: ${rawResult.length}\n`)
    
    // Test 6: Connection pool info
    console.log('Test 6: Connection pool statistics')
    const poolInfo = await prisma.$queryRawUnsafe<any[]>(`
      SELECT 
        count(*) as total_connections,
        count(*) FILTER (WHERE state = 'active') as active_connections,
        count(*) FILTER (WHERE state = 'idle') as idle_connections
      FROM pg_stat_activity
      WHERE datname = current_database()
      AND pid != pg_backend_pid();
    `)
    console.log('  Pool info:', poolInfo[0])
    
  } catch (error: any) {
    console.error('Error:', error.message)
    if (error.stack) {
      console.error('Stack:', error.stack)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

