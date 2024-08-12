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
};
