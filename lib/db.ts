import Database from 'better-sqlite3'
import path from 'path'

const db = new Database(path.join(process.cwd(), 'demos.db'))

db.exec(`
  CREATE TABLE IF NOT EXISTS demos (
    id          TEXT PRIMARY KEY,
    port        INTEGER NOT NULL,
    status      TEXT DEFAULT 'running',
    expires_at  INTEGER NOT NULL,
    created_at  INTEGER DEFAULT (unixepoch()),
    title       TEXT,
    description TEXT
  )
`)

export default db