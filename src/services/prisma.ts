import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../prisma/generated/client";

export const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: "file:./data/tractoret.db" }),
});
