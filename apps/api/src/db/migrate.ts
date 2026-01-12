import { getDb, runMigrations } from "./index";

const db = getDb();
runMigrations(db);
console.log("Migrations applied");
