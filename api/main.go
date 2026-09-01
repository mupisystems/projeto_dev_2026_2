package main

import (
	"bufio"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/brezelle/api/db"
	"github.com/brezelle/api/handlers"
	"github.com/brezelle/api/middleware"
)

func main() {
	loadDotEnv()
	database, err := db.Open(env("DB_PATH", "./brezelle.db"))
	if err != nil {
		log.Fatal(err)
	}
	defer database.Close()
	if err = db.Migrate(database); err != nil {
		log.Fatal(err)
	}
	if err = db.Seed(database); err != nil {
		log.Fatal(err)
	}

	app := &handlers.App{DB: database, JWTSecret: env("JWT_SECRET", "brezelle-development-secret-change-me")}
	protected := middleware.RequireJWT(app.JWTSecret)
	mux := http.NewServeMux()
	mux.HandleFunc("POST /submissions", app.CreateSubmission)
	mux.HandleFunc("GET /collab-types", app.PublicCollabTypes)
	mux.HandleFunc("POST /auth/login", app.Login)
	mux.HandleFunc("POST /auth/logout", app.Logout)
	mux.Handle("GET /submissions", protected(http.HandlerFunc(app.ListSubmissions)))
	mux.Handle("PATCH /submissions/", protected(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		app.UpdateSubmission(writer, request, routeID(request.URL.Path, "/submissions/"))
	})))
	mux.Handle("GET /collab-types/all", protected(http.HandlerFunc(app.AllCollabTypes)))
	mux.Handle("POST /collab-types", protected(http.HandlerFunc(app.CreateCollabType)))
	mux.Handle("PATCH /collab-types/", protected(http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		app.UpdateCollabType(writer, request, routeID(request.URL.Path, "/collab-types/"))
	})))

	port := env("PORT", "8080")
	log.Printf("Brezelle API running on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, cors(mux)))
}

func loadDotEnv() {
	paths := []string{".env", "api/.env"}
	for _, path := range paths {
		file, err := os.Open(path)
		if err != nil {
			continue
		}

		scanner := bufio.NewScanner(file)
		for scanner.Scan() {
			line := strings.TrimSpace(scanner.Text())
			if line == "" || strings.HasPrefix(line, "#") {
				continue
			}

			key, value, found := strings.Cut(line, "=")
			if !found {
				continue
			}
			key = strings.TrimSpace(strings.TrimPrefix(key, "export "))
			value = strings.Trim(strings.TrimSpace(value), "\"'")
			if key != "" && os.Getenv(key) == "" {
				_ = os.Setenv(key, value)
			}
		}
		_ = file.Close()
	}
}

func routeID(path, prefix string) int64 {
	var id int64
	_, _ = fmt.Sscanf(strings.TrimPrefix(path, prefix), "%d", &id)
	return id
}
func env(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
func cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		origin := os.Getenv("CORS_ORIGIN")
		if origin == "" {
			origin = "http://localhost:3000"
		}
		writer.Header().Set("Access-Control-Allow-Origin", origin)
		writer.Header().Set("Access-Control-Allow-Credentials", "true")
		writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS")
		if request.Method == http.MethodOptions {
			writer.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(writer, request)
	})
}
