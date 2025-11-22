-- Add category column to QueryExpansion table
-- Since SQLite doesn't support ALTER COLUMN to add a column with a default to an existing table with a compound primary key,
-- we need to recreate the table

-- Step 1: Create new table with category column
CREATE TABLE "query_expansions_new" (
    "term" TEXT NOT NULL,
    "expansion" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'global',
    "model" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("term", "expansion", "source", "category")
);

-- Step 2: Copy existing data, setting category to 'global' for all existing rows
INSERT INTO "query_expansions_new" (
    "term", "expansion", "source", "category", "model", "createdAt", "lastUsedAt"
)
SELECT 
    "term", "expansion", "source", 'global' as "category", "model", "createdAt", "lastUsedAt"
FROM "query_expansions";

-- Step 3: Drop old table
DROP TABLE "query_expansions";

-- Step 4: Rename new table
ALTER TABLE "query_expansions_new" RENAME TO "query_expansions";

-- Step 5: Recreate indexes
CREATE INDEX "query_expansions_term_source_category_idx" ON "query_expansions"("term", "source", "category");

