import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const connections = new Map<string, Database.Database>();

const defaultDbPath = () => {
  const root = process.cwd();
  return path.join(root, "data", "dev.sqlite");
};

export const getDb = () => {
  const dbPath = process.env.DB_PATH ?? defaultDbPath();
  if (connections.has(dbPath)) {
    return connections.get(dbPath)!;
  }

  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  connections.set(dbPath, db);
  return db;
};

export const runMigrations = (db: Database.Database) => {
  db.exec(
    "CREATE TABLE IF NOT EXISTS migrations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, run_at TEXT DEFAULT CURRENT_TIMESTAMP)"
  );

  const migrationsDir = path.join(process.cwd(), "apps", "api", "migrations");
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  const applied = new Set(
    db.prepare("SELECT name FROM migrations").all().map((row) => (row as { name: string }).name)
  );

  for (const file of migrationFiles) {
    if (applied.has(file)) continue;
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    db.exec(sql);
    db.prepare("INSERT INTO migrations (name) VALUES (?)").run(file);
  }
};
