import { db } from "../db";
import { type UserRecordType, usersTable } from "./schema";

export const userStore = {
  getUsers: (): Promise<UserRecordType[]> => {
    return db.select().from(usersTable);
  },
};
