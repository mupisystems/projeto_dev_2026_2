package db

import (
	"database/sql"
	"fmt"

	_ "modernc.org/sqlite"
)

func Open(path string) (*sql.DB, error) {
	if path == "" {
		path = "./brezelle.db"
	}

	database, err := sql.Open("sqlite", path)
	if err != nil {
		return nil, err
	}
	database.SetMaxOpenConns(1)
	if _, err = database.Exec("PRAGMA foreign_keys = ON"); err != nil {
		database.Close()
		return nil, err
	}
	return database, nil
}

func Migrate(database *sql.DB) error {
	statements := []string{
		`CREATE TABLE IF NOT EXISTS collab_types (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT NOT NULL UNIQUE,
			active INTEGER NOT NULL DEFAULT 1,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL
		)`,
		`CREATE TABLE IF NOT EXISTS admins (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			email TEXT NOT NULL UNIQUE,
			password_hash TEXT NOT NULL,
			created_at TEXT NOT NULL
		)`,
		`CREATE TABLE IF NOT EXISTS submissions (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			brand_name TEXT NOT NULL,
			email TEXT NOT NULL,
			instagram TEXT NOT NULL,
			collab_type_id INTEGER NOT NULL,
			proposed_date TEXT NOT NULL,
			pitch TEXT NOT NULL CHECK (length(pitch) <= 500),
			status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL,
			FOREIGN KEY (collab_type_id) REFERENCES collab_types(id)
		)`,
		`CREATE TABLE IF NOT EXISTS submission_logs (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			submission_id INTEGER NOT NULL,
			from_status TEXT,
			to_status TEXT NOT NULL CHECK (to_status IN ('pending', 'confirmed', 'cancelled')),
			changed_at TEXT NOT NULL,
			FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE
		)`,
		`CREATE INDEX IF NOT EXISTS idx_submissions_proposed_date ON submissions(proposed_date)`,
		`CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status)`,
	}

	for _, statement := range statements {
		if _, err := database.Exec(statement); err != nil {
			return fmt.Errorf("migration failed: %w", err)
		}
	}
	return nil
}
