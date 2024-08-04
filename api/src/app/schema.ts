import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),

  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updateAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
});

export const postsTable = sqliteTable("posts", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),

  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updateAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
});

export type InsertUserRecordType = typeof usersTable.$inferInsert;
export type UserRecordType = typeof usersTable.$inferSelect;

export type InsertPostUserRecordType = typeof postsTable.$inferInsert;
export type PostUserRecordType = typeof postsTable.$inferSelect;
