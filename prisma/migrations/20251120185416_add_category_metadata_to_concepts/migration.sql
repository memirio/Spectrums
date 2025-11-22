-- Add category metadata fields to Concept table
-- applicableCategories: JSON array of category strings
-- embeddingStrategy: String enum for embedding generation strategy

-- Add applicableCategories column (JSON, nullable, defaults to ["website"] for existing concepts)
ALTER TABLE "Concept" ADD COLUMN "applicableCategories" TEXT;

-- Add embeddingStrategy column (String, nullable, defaults to "website_style" for existing concepts)
ALTER TABLE "Concept" ADD COLUMN "embeddingStrategy" TEXT;

-- Update existing concepts with defaults
-- Set applicableCategories to ["website"] for all existing concepts
UPDATE "Concept" SET "applicableCategories" = '["website"]' WHERE "applicableCategories" IS NULL;

-- Set embeddingStrategy to "website_style" for all existing concepts
UPDATE "Concept" SET "embeddingStrategy" = 'website_style' WHERE "embeddingStrategy" IS NULL;

