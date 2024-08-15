import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import * as v from "valibot";

export const usersTable = sqliteTable("users", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),

  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updateAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
});

const EmailSchema = v.pipe(v.string(), v.trim(), v.email());
export const insertUserSchema = v.object({
  name: v.pipe(v.string(), v.trim(), v.minLength(1)),
  email: EmailSchema,
});

export type InsertUserRecordType = typeof usersTable.$inferInsert;
export type UserRecordType = typeof usersTable.$inferSelect;
