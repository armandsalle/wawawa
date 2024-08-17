import { eq } from "drizzle-orm";
import { db } from "../db";
import {
  type InsertUserRecordType,
  type UserRecordType,
  usersTable,
} from "./schema";

export const userStore = {
  getUsers: (): Promise<UserRecordType[]> => {
    return db.select().from(usersTable);
  },
  byClerkId: (clerkId: string): Promise<UserRecordType | null> => {
    return db
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkId, clerkId))
      .then((rows) => rows[0] ?? null);
  },
  createUser: (user: InsertUserRecordType): Promise<UserRecordType> => {
    return db
      .insert(usersTable)
      .values(user)
      .returning()
      .then((rows) => rows[0]);
  },
};
