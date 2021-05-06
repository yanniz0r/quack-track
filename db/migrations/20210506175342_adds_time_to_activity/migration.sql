-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Activity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "namespaceId" INTEGER NOT NULL,
    "clockStartedAt" DATETIME,
    "clockSeconds" INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY ("namespaceId") REFERENCES "Namespace" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Activity" ("id", "name", "namespaceId") SELECT "id", "name", "namespaceId" FROM "Activity";
DROP TABLE "Activity";
ALTER TABLE "new_Activity" RENAME TO "Activity";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
