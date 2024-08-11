import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cwd = path.dirname(__dirname);

export const migrationsDir = path.join(cwd, "src/db/migrations");
