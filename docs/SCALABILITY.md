# Scalability & Speed Considerations

## Current Architecture

### Vector Storage
- **Current**: SQLite with JSON storage for 768-d CLIP embeddings
- **Location**: `ImageEmbedding.vector` (JSON column)
- **Model**: `Xenova/clip-vit-large-patch14` (768 dimensions)
- **Category**: Stored as metadata in `Image.category` (indexed)

### Search Performance
- **Current**: Linear scan through all embeddings (O(n) where n = number of images)
- **Category Filtering**: Database-level filtering using indexed `category` column
- **Caching**: Query embeddings and search results cached in-memory (see `src/lib/search-cache.ts`)

## Scalability Improvements

### 1. ANN/Vector Index Integration

For "many entries" and "really fast search", integrate an ANN (Approximate Nearest Neighbor) vector index:

#### Recommended Options:
- **SQLite+VSS** (Vector Similarity Search extension) - Best for SQLite-based setup
- **Qdrant** - Fast, self-hosted, supports metadata filtering
- **Weaviate** - Full-featured vector database with GraphQL
- **FAISS** (Facebook AI Similarity Search) - Library for in-process indexing
- **HNSW** (Hierarchical Navigable Small World) - Algorithm used by many vector DBs

#### Integration Strategy:

```typescript
// Example: SQLite+VSS integration
// Store in index:
// - 768-d embedding vector
// - assetId (imageId)
// - category as metadata (for filtering)

// Query:
// 1. If category specified: filter by category at index time (ideal)
// 2. If category = "all": query globally, get top K (500-1000), then filter in memory if needed
```

#### Implementation Plan:

1. **Add vector index table** (if using SQLite+VSS):
   ```sql
   CREATE VIRTUAL TABLE image_embeddings_vss USING vss0(
     vector(768),
     imageId TEXT,
     category TEXT
   );
   ```

2. **Sync embeddings to index**:
   - On image creation/update: insert/update in vector index
   - Keep SQLite `ImageEmbedding` table as source of truth
   - Index is a read-optimized view

3. **Update search API**:
   - Use vector index for Stage 1 retrieval (fast ANN search)
   - Filter by category at index time if supported
   - Fallback to current linear search if index unavailable

### 2. Category Filtering at Index Time

**Ideal**: Filter by category in the vector index query (fastest)

**Fallback**: Retrieve top K globally (500-1000), then filter by category in memory

**Current Implementation**:
- Database-level filtering when category specified (uses indexed `category` column)
- Global retrieval when `category = "all"`

### 3. Caching Strategy

#### Query Embedding Cache
- **What**: Cached CLIP text embeddings for queries
- **TTL**: 1 hour (embeddings don't change)
- **Location**: In-memory (can be moved to Redis in production)
- **Implementation**: `src/lib/search-cache.ts`

#### Search Result Cache
- **What**: Cached top results per (query, category) pair
- **TTL**: 5 minutes (results may change as new images are added)
- **Location**: In-memory (can be moved to Redis in production)
- **When to use**: When catalog doesn't change frequently
- **When to skip**: Paginated queries (limit/offset specified)

#### Cache Invalidation
- Clear query cache when new images added (optional, TTL handles it)
- Clear result cache when new images added (recommended)
- Manual cache clearing via `clearSearchCaches()`

### 4. Shared Infrastructure

#### Tagging & Reranker
- **Unified**: Same tagging pipeline for all categories
- **Category-aware**: Category influences ranking via:
  - Category-specific query expansions (Stage 2 reranking)
  - Category metadata in features
  - Category filtering (Stage 1 retrieval)
- **No per-category reimplementation**: One pipeline, category is just a parameter

#### Embedding Generation
- **Unified**: Same CLIP model (768-d) for all categories
- **Same dimensionality**: All assets use same embedding space
- **Shared table**: `ImageEmbedding` table stores all embeddings

## Performance Targets

### Current (SQLite + Linear Search)
- **Small dataset** (< 1,000 images): < 100ms
- **Medium dataset** (1,000 - 10,000 images): 100-500ms
- **Large dataset** (> 10,000 images): 500ms - 2s

### With ANN/Vector Index
- **Small dataset**: < 50ms
- **Medium dataset**: < 100ms
- **Large dataset** (100,000+ images): < 200ms

## Migration Path

### Phase 1: Add Caching (✅ Complete)
- Query embedding cache
- Search result cache
- In-memory implementation (can upgrade to Redis later)

### Phase 2: Add Vector Index (Future)
1. Choose vector index solution (SQLite+VSS recommended for SQLite setup)
2. Create index table
3. Sync existing embeddings to index
4. Update search API to use index for Stage 1 retrieval
5. Keep SQLite as source of truth, index as read-optimized view

### Phase 3: Production Optimizations (Future)
1. Move caches to Redis (shared across instances)
2. Add query result pre-warming for common queries
3. Implement incremental index updates (only update changed embeddings)
4. Add monitoring/metrics for search performance

## Notes

- **Category filtering**: Currently uses database index (fast). With vector index, can filter at index time (even faster).
- **Caching**: Helps with common queries. For unique queries, still need to compute embeddings and search.
- **Scalability**: Current setup works well for < 10,000 images. For larger datasets, vector index becomes essential.

## Adding New Categories

The system is designed to be **category-agnostic**. Adding a new category requires no new code paths:

1. **One embedding model** (CLIP, 768-d) - works for all categories
2. **One tagging system** - same concepts, same pipeline
3. **One reranker** - category is just metadata
4. **One index** - category is just a filter flag

**To add a new category:**
- Just use the category string when ingesting images
- Search works automatically with category filtering
- Optional: Add category-specific query expansions or UI labels

See `docs/ADDING_NEW_CATEGORIES.md` for detailed instructions.

