import path from "node:path";

const cwd = path.dirname(__dirname);

export const migrationsDir = path.join(cwd, "src/db/migrations");
