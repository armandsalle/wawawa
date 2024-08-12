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
  createUser: (user: InsertUserRecordType): Promise<UserRecordType> => {
    return db
      .insert(usersTable)
      .values(user)
      .returning()
      .then((rows) => rows[0]);
  },
  deleteUser: (id: number): Promise<Pick<UserRecordType, "name">> => {
    return db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning({
        name: usersTable.name,
      })
      .then((rows) => rows[0]);
  },
};
