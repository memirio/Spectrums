-- Add contentHash column to ImageEmbedding table
ALTER TABLE "ImageEmbedding" ADD COLUMN "contentHash" TEXT;

-- Create unique index on contentHash (allows multiple NULLs in SQLite)
CREATE UNIQUE INDEX "ImageEmbedding_contentHash_key" ON "ImageEmbedding"("contentHash") WHERE "contentHash" IS NOT NULL;

-- Create regular index for queries
CREATE INDEX "ImageEmbedding_contentHash_idx" ON "ImageEmbedding"("contentHash");

