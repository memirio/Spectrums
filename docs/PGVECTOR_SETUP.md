# pgvector Setup Guide

This guide explains how to set up pgvector for fast approximate nearest neighbor (ANN) search.

## Prerequisites

- Supabase PostgreSQL database
- Access to Supabase SQL Editor

## Step 1: Enable pgvector Extension

Run this in Supabase SQL Editor:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

## Step 2: Add Vector Column

Run the migration:

```bash
# Apply the migration
npx prisma migrate dev --name add_pgvector
```

Or manually run in Supabase SQL Editor:

```sql
-- Add vector column (temporary name during migration)
ALTER TABLE "image_embeddings" ADD COLUMN IF NOT EXISTS "vector_pg" vector(768);
```

## Step 3: Migrate Existing Embeddings

Run the migration script:

```bash
npx tsx scripts/migrate_embeddings_to_pgvector.ts
```

This will:
- Read all embeddings from the JSON `vector` column
- Convert them to pgvector format
- Update the `vector_pg` column

## Step 4: Create Vector Index

Run in Supabase SQL Editor:

```sql
-- Create IVFFlat index for fast similarity search
CREATE INDEX IF NOT EXISTS "image_embeddings_vector_pg_idx" ON "image_embeddings" 
USING ivfflat ("vector_pg" vector_cosine_ops)
WITH (lists = 100);
```

**Note**: The `lists` parameter should be approximately `rows / 1000` for optimal performance. Adjust based on your dataset size.

## Step 5: Finalize Migration

After verifying all embeddings are migrated:

```sql
-- Drop old JSON column
ALTER TABLE "image_embeddings" DROP COLUMN IF EXISTS "vector";

-- Rename vector_pg to vector
ALTER TABLE "image_embeddings" RENAME COLUMN "vector_pg" TO "vector";

-- Update index name
DROP INDEX IF EXISTS "image_embeddings_vector_pg_idx";
CREATE INDEX IF NOT EXISTS "image_embeddings_vector_idx" ON "image_embeddings" 
USING ivfflat ("vector" vector_cosine_ops)
WITH (lists = 100);
```

## Step 6: Update Code

The search route (`src/app/api/search/route.ts`) has been updated to use pgvector queries when available.

## Performance Benefits

- **Before**: O(n) linear scan through all embeddings (436+ images)
- **After**: O(log n) approximate nearest neighbor search (top K candidates only)

Expected speedup: **10-100x faster** for search queries.

## Query Example

```sql
-- Find top 10 most similar embeddings
SELECT 
  ie."imageId",
  ie.vector <=> $1::vector AS distance
FROM "image_embeddings" ie
JOIN "images" i ON i.id = ie."imageId"
WHERE i.category = 'website'
ORDER BY ie.vector <=> $1::vector
LIMIT 10;
```

The `<=>` operator computes cosine distance (1 - cosine similarity).

## Troubleshooting

### Index not being used

If queries are still slow, the index might not be used. Check with:

```sql
EXPLAIN ANALYZE
SELECT * FROM "image_embeddings"
ORDER BY vector <=> $1::vector
LIMIT 10;
```

Look for "Index Scan" in the output.

### Migration errors

If migration fails, check:
1. pgvector extension is enabled: `SELECT * FROM pg_extension WHERE extname = 'vector';`
2. Vector column exists: `SELECT column_name FROM information_schema.columns WHERE table_name = 'image_embeddings';`
3. Vector format is correct: `SELECT vector FROM "image_embeddings" LIMIT 1;`

