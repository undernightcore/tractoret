-- CreateTable
CREATE TABLE "Group" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "interval" INTEGER NOT NULL,
    "workers" INTEGER NOT NULL,
    "stockIfPresent" TEXT NOT NULL,
    "priceLocator" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Link" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "last" TEXT NOT NULL,
    "lastPrice" TEXT NOT NULL,
    "lastStock" BOOLEAN NOT NULL,
    "lastChecked" DATETIME NOT NULL,
    "lastChanged" DATETIME NOT NULL,
    "groupId" INTEGER NOT NULL,
    CONSTRAINT "Link_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_key" ON "Group"("name");
