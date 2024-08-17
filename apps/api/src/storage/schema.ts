import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import * as v from "valibot";
import { usersTable } from "../user/schema";

export const documentsTable = sqliteTable("documents", {
  id: integer("id").primaryKey(),
  uri: text("uri").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id),

  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const insertDocumentSchema = v.object({
  uri: v.pipe(v.string(), v.trim(), v.minLength(1)),
  userId: v.pipe(v.number(), v.integer(), v.minValue(1)),
});

export type InsertDocumentRecordType = typeof documentsTable.$inferInsert;
export type DocumentRecordType = typeof documentsTable.$inferSelect;
