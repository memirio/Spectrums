-- Add category and sourceUrl to Image table
-- Since SQLite doesn't support ALTER COLUMN to change nullability,
-- we need to recreate the table

-- Step 1: Create new table with updated schema
CREATE TABLE "images_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "siteId" TEXT,
    "sourceUrl" TEXT,
    "category" TEXT NOT NULL DEFAULT 'website',
    "url" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "bytes" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "hubCount" INTEGER,
    "hubScore" REAL,
    "hubAvgCosineSimilarity" REAL,
    "hubAvgCosineSimilarityMargin" REAL,
    FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Step 2: Copy data from old table to new table
INSERT INTO "images_new" (
    "id", "siteId", "url", "width", "height", "bytes", 
    "createdAt", "updatedAt", "hubCount", "hubScore", 
    "hubAvgCosineSimilarity", "hubAvgCosineSimilarityMargin", "category"
)
SELECT 
    "id", "siteId", "url", "width", "height", "bytes",
    "createdAt", "updatedAt", "hubCount", "hubScore",
    "hubAvgCosineSimilarity", "hubAvgCosineSimilarityMargin", 'website' as "category"
FROM "images";

-- Step 3: Drop old table
DROP TABLE "images";

-- Step 4: Rename new table
ALTER TABLE "images_new" RENAME TO "images";

-- Step 5: Recreate unique constraint
CREATE UNIQUE INDEX "images_siteId_url_key" ON "images"("siteId", "url");

-- Step 6: Create index on category for fast filtering
CREATE INDEX "images_category_idx" ON "images"("category");

