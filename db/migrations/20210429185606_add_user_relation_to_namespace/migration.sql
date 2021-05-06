/*
  Warnings:

  - Added the required column `userId` to the `Namespace` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Namespace" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Namespace" ("id", "createdAt", "updatedAt", "name") SELECT "id", "createdAt", "updatedAt", "name" FROM "Namespace";
DROP TABLE "Namespace";
ALTER TABLE "new_Namespace" RENAME TO "Namespace";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
