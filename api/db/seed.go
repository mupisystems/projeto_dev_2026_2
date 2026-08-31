package db

import (
	"database/sql"
	"time"

	"golang.org/x/crypto/bcrypt"
)

func Seed(database *sql.DB) error {
	now := time.Now().UTC().Format(time.RFC3339)
	for _, title := range []string{"Coleção Cápsula", "Drop Conjunto", "Conteúdo Editorial"} {
		if _, err := database.Exec(`INSERT OR IGNORE INTO collab_types (title, active, created_at, updated_at) VALUES (?, 1, ?, ?)`, title, now, now); err != nil {
			return err
		}
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	_, err = database.Exec(`INSERT OR IGNORE INTO admins (email, password_hash, created_at) VALUES (?, ?, ?)`, "admin@brezelle.com", string(passwordHash), now)
	return err
}
