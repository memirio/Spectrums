# Performance Analysis Report - Initial Page Load

## Executive Summary

**Total Request Time**: 750-980ms (varies between requests)

**Critical Finding**: The `prisma.site.findMany()` query is taking **650-860ms**, which represents **87-88% of the total request time**. This is the primary bottleneck.

## Detailed Breakdown

### Operation Timings (Average across multiple requests)

| Operation | Duration | % of Total | Status |
|-----------|----------|------------|--------|
| **`findMany` query** | **650-860ms** | **87-88%** | 🔴 **CRITICAL BOTTLENECK** |
| Image fetching query | 91-116ms | 12-15% | 🟡 Slow but acceptable |
| Response serialization | <1ms | <0.1% | ✅ Fast |
| Data processing | <0.2ms | <0.1% | ✅ Fast |

### Sample Request Breakdown

**Request 1 (746.53ms total):**
- `findMany`: 651.23ms (87.2%)
- Image query: 91.20ms (12.2%)
- Serialization: 0.98ms (0.1%)
- Processing: 0.13ms (0.02%)

**Request 2 (753.52ms total):**
- `findMany`: 657.94ms (87.3%)
- Image query: 92.08ms (12.2%)
- Serialization: 0.81ms (0.1%)
- Processing: 0.07ms (0.01%)

**Request 3 (983.20ms total):**
- `findMany`: 864.31ms (87.9%)
- Image query: 115.38ms (11.7%)
- Serialization: 0.78ms (0.1%)
- Processing: 0.08ms (0.01%)

## Root Cause Analysis

### Primary Issue: `findMany` Query Performance

The query being executed:
```typescript
prisma.site.findMany({
  orderBy: [
    { createdAt: 'desc' },
    { id: 'asc' }
  ],
  take: 61, // limit + 1
  skip: 0,
})
```

**Why it's slow:**
1. **Missing or inefficient index on `createdAt`**: Sorting by `createdAt DESC` requires either:
   - An index on `createdAt` (preferably descending)
   - A composite index on `(createdAt DESC, id ASC)` for optimal performance
2. **Large table size**: If the `sites` table has many rows, even with an index, sorting can be slow
3. **Network latency**: Connection between Vercel and Supabase adds overhead
4. **Query execution overhead**: PostgreSQL query planner and execution time

### Secondary Issue: Image Fetching Query

The image fetching query takes 91-116ms:
```sql
SELECT "siteId", "url", "category"
FROM "images"
WHERE "siteId" IN ($1, $2, ..., $60)
ORDER BY "id" DESC
```

**Why it's slow:**
1. **IN clause with 60 parameters**: While indexes help, large IN clauses can be slower
2. **ORDER BY on large result set**: Even with indexes, ordering 60+ results takes time

## Recommendations

### 1. **CRITICAL: Add Database Indexes**

Add indexes to optimize the `findMany` query:

```sql
-- Index for createdAt (descending) - most important
CREATE INDEX IF NOT EXISTS "sites_createdAt_desc_idx" ON "sites"("createdAt" DESC);

-- Composite index for the exact orderBy clause (optimal)
CREATE INDEX IF NOT EXISTS "sites_createdAt_id_idx" ON "sites"("createdAt" DESC, "id" ASC);
```

**Expected Impact**: Should reduce `findMany` time from 650-860ms to **50-150ms** (80-90% improvement)

### 2. Optimize Image Query

Consider using a more efficient approach:
- Use `DISTINCT ON` instead of `ORDER BY` + JavaScript filtering
- Or fetch images in a single query with a JOIN (if we can restructure)

**Expected Impact**: Should reduce image query time from 91-116ms to **20-50ms** (50-70% improvement)

### 3. Consider Caching

For the initial page load (no filters), consider:
- Caching the first 60 sites for a short period (30-60 seconds)
- Using Vercel's edge caching if possible

**Expected Impact**: Could reduce total time to **<100ms** for cached requests

### 4. Connection Pooling Optimization

The connection pool is being created on each request (cold start). Consider:
- Pre-warming connections
- Using connection pooling more efficiently

**Expected Impact**: May reduce cold start overhead by 50-100ms

## Priority Actions

1. **IMMEDIATE**: Add `createdAt DESC` index to `sites` table
2. **HIGH**: Add composite index `(createdAt DESC, id ASC)` to `sites` table
3. **MEDIUM**: Optimize image fetching query
4. **LOW**: Implement caching for initial page load

## Expected Performance After Optimizations

**Current**: 750-980ms
**After indexes**: **150-250ms** (70-80% improvement)
**After all optimizations**: **100-200ms** (80-90% improvement)

## Next Steps

1. Create migration to add indexes
2. Test performance after indexes are added
3. Monitor logs to verify improvements
4. Implement additional optimizations if needed

