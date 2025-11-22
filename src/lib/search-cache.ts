/**
 * Search Result Caching
 * 
 * Caches query embeddings and search results for common queries to improve performance.
 * 
 * Strategy:
 * - Cache query embeddings (expensive to compute)
 * - Cache top results per (query, category) pair (if catalog doesn't change frequently)
 * - Use in-memory cache with TTL for fast access
 * - Cache key: hash(query + category + limit + offset)
 */

interface CachedQueryEmbedding {
  query: string
  embedding: number[]
  timestamp: number
}

interface CachedSearchResult {
  query: string
  category: string | null
  results: any[]
  timestamp: number
}

// In-memory caches (can be replaced with Redis in production)
const queryEmbeddingCache = new Map<string, CachedQueryEmbedding>()
const searchResultCache = new Map<string, CachedSearchResult>()

// TTLs (Time To Live) in milliseconds
const QUERY_EMBEDDING_TTL = 60 * 60 * 1000 // 1 hour (embeddings don't change)
const SEARCH_RESULT_TTL = 5 * 60 * 1000 // 5 minutes (results may change as new images are added)

/**
 * Generate cache key for query embedding
 */
function getQueryEmbeddingCacheKey(query: string): string {
  return `query_emb:${query.toLowerCase().trim()}`
}

/**
 * Generate cache key for search results
 */
function getSearchResultCacheKey(query: string, category: string | null, limit: number | null, offset: number): string {
  const categoryPart = category || 'all'
  const limitPart = limit || 'none'
  return `search:${query.toLowerCase().trim()}:${categoryPart}:${limitPart}:${offset}`
}

/**
 * Get cached query embedding
 */
export function getCachedQueryEmbedding(query: string): number[] | null {
  const key = getQueryEmbeddingCacheKey(query)
  const cached = queryEmbeddingCache.get(key)
  
  if (!cached) return null
  
  // Check if expired
  const age = Date.now() - cached.timestamp
  if (age > QUERY_EMBEDDING_TTL) {
    queryEmbeddingCache.delete(key)
    return null
  }
  
  return cached.embedding
}

/**
 * Cache query embedding
 */
export function cacheQueryEmbedding(query: string, embedding: number[]): void {
  const key = getQueryEmbeddingCacheKey(query)
  queryEmbeddingCache.set(key, {
    query: query.toLowerCase().trim(),
    embedding,
    timestamp: Date.now(),
  })
  
  // Limit cache size (keep most recent 1000 entries)
  if (queryEmbeddingCache.size > 1000) {
    const entries = Array.from(queryEmbeddingCache.entries())
    entries.sort((a, b) => b[1].timestamp - a[1].timestamp)
    const toKeep = entries.slice(0, 1000)
    queryEmbeddingCache.clear()
    toKeep.forEach(([k, v]) => queryEmbeddingCache.set(k, v))
  }
}

/**
 * Get cached search results
 */
export function getCachedSearchResults(
  query: string,
  category: string | null,
  limit: number | null,
  offset: number
): any | null {
  const key = getSearchResultCacheKey(query, category, limit, offset)
  const cached = searchResultCache.get(key)
  
  if (!cached) return null
  
  // Check if expired
  const age = Date.now() - cached.timestamp
  if (age > SEARCH_RESULT_TTL) {
    searchResultCache.delete(key)
    return null
  }
  
  return cached.results
}

/**
 * Cache search results
 */
export function cacheSearchResults(
  query: string,
  category: string | null,
  limit: number | null,
  offset: number,
  results: any
): void {
  const key = getSearchResultCacheKey(query, category, limit, offset)
  searchResultCache.set(key, {
    query: query.toLowerCase().trim(),
    category,
    results,
    timestamp: Date.now(),
  })
  
  // Limit cache size (keep most recent 500 entries)
  if (searchResultCache.size > 500) {
    const entries = Array.from(searchResultCache.entries())
    entries.sort((a, b) => b[1].timestamp - a[1].timestamp)
    const toKeep = entries.slice(0, 500)
    searchResultCache.clear()
    toKeep.forEach(([k, v]) => searchResultCache.set(k, v))
  }
}

/**
 * Clear all caches (useful when new images are added)
 */
export function clearSearchCaches(): void {
  queryEmbeddingCache.clear()
  searchResultCache.clear()
}

/**
 * Clear only search result cache (keep query embeddings - they don't change)
 * Use this when new images are added to invalidate search results
 */
export function clearSearchResultCache(): void {
  searchResultCache.clear()
}

/**
 * Clear cache for a specific query
 */
export function clearQueryCache(query: string): void {
  const key = getQueryEmbeddingCacheKey(query)
  queryEmbeddingCache.delete(key)
  
  // Clear all search result caches for this query
  const queryLower = query.toLowerCase().trim()
  for (const [cacheKey] of searchResultCache.entries()) {
    if (cacheKey.includes(`:${queryLower}:`)) {
      searchResultCache.delete(cacheKey)
    }
  }
}

