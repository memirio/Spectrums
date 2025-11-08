/*
  Warnings:

  - Added the required column `siteId` to the `images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `images` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "siteId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "bytes" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "images_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_images" ("id") SELECT "id" FROM "images";
DROP TABLE "images";
ALTER TABLE "new_images" RENAME TO "images";
CREATE UNIQUE INDEX "images_siteId_url_key" ON "images"("siteId", "url");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
