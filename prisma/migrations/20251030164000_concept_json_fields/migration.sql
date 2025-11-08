-- CreateTable
CREATE TABLE "sites" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "imageUrl" TEXT,
    "author" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "tag_aliases" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alias" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    CONSTRAINT "tag_aliases_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "site_tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "siteId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    CONSTRAINT "site_tags_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "site_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "images" (
    "id" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "ImageEmbedding" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "imageId" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "vector" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ImageEmbedding_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "images" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Concept" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "locale" TEXT DEFAULT 'en',
    "synonyms" JSONB NOT NULL,
    "related" JSONB NOT NULL,
    "weight" REAL DEFAULT 1.0,
    "embedding" JSONB NOT NULL
);

-- CreateTable
CREATE TABLE "image_tags" (
    "imageId" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "score" REAL NOT NULL,

    PRIMARY KEY ("imageId", "conceptId"),
    CONSTRAINT "image_tags_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "images" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "image_tags_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tag_aliases_alias_key" ON "tag_aliases"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "site_tags_siteId_tagId_key" ON "site_tags"("siteId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "ImageEmbedding_imageId_key" ON "ImageEmbedding"("imageId");
