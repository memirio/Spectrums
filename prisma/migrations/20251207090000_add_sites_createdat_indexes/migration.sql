-- Add indexes to optimize sites.findMany() query performance
-- These indexes are critical for the orderBy clause: createdAt DESC, id ASC

-- Index for createdAt DESC sorting (most common query pattern)
CREATE INDEX IF NOT EXISTS "sites_createdAt_desc_idx" ON "sites"("createdAt" DESC);

-- Composite index for the exact orderBy clause (optimal performance)
CREATE INDEX IF NOT EXISTS "sites_createdAt_id_idx" ON "sites"("createdAt" DESC, "id" ASC);
