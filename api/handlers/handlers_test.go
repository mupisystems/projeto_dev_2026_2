package handlers

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"

	"github.com/brezelle/api/db"
	"github.com/brezelle/api/middleware"
)

func testApp(t *testing.T) (*App, *sql.DB) {
	t.Helper()
	path := filepath.Join(t.TempDir(), "test.db")
	database, err := db.Open(path)
	if err != nil {
		t.Fatal(err)
	}
	if err = db.Migrate(database); err != nil {
		t.Fatal(err)
	}
	if err = db.Seed(database); err != nil {
		t.Fatal(err)
	}
	return &App{DB: database, JWTSecret: "test-secret"}, database
}

func testRouter(app *App) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("POST /submissions", app.CreateSubmission)
	mux.HandleFunc("POST /auth/login", app.Login)
	protected := middleware.RequireJWT(app.JWTSecret)
	mux.Handle("GET /submissions", protected(http.HandlerFunc(app.ListSubmissions)))
	mux.Handle("PATCH /submissions/", protected(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { app.UpdateSubmission(w, r, 1) })))
	return mux
}

func TestCreateSubmissionValidAndInvalid(t *testing.T) {
	app, database := testApp(t)
	defer database.Close()
	var typeID int64
	if err := database.QueryRow(`SELECT id FROM collab_types LIMIT 1`).Scan(&typeID); err != nil {
		t.Fatal(err)
	}
	handler := testRouter(app)
	valid := map[string]interface{}{"brand_name": "Studio Norte", "email": "hello@studionorte.com", "instagram": "@studionorte", "collab_type_id": typeID, "proposed_date": "2027-06-10", "pitch": "Uma coleção que cruza materiais técnicos com a linguagem da cidade."}
	body, _ := json.Marshal(valid)
	response := httptest.NewRecorder()
	handler.ServeHTTP(response, httptest.NewRequest(http.MethodPost, "/submissions", bytes.NewReader(body)))
	if response.Code != http.StatusCreated {
		t.Fatalf("valid submission status = %d, body = %s", response.Code, response.Body.String())
	}

	invalid := map[string]interface{}{"brand_name": "A", "email": "nope", "collab_type_id": typeID, "proposed_date": "not-a-date", "pitch": "curto"}
	body, _ = json.Marshal(invalid)
	response = httptest.NewRecorder()
	handler.ServeHTTP(response, httptest.NewRequest(http.MethodPost, "/submissions", bytes.NewReader(body)))
	if response.Code != http.StatusBadRequest {
		t.Fatalf("invalid submission status = %d", response.Code)
	}
	var count int
	if err := database.QueryRow(`SELECT COUNT(*) FROM submissions`).Scan(&count); err != nil {
		t.Fatal(err)
	}
	if count != 1 {
		t.Fatalf("invalid submission was persisted; count = %d", count)
	}
}

func TestProtectedRouteWithoutJWT(t *testing.T) {
	app, database := testApp(t)
	defer database.Close()
	response := httptest.NewRecorder()
	testRouter(app).ServeHTTP(response, httptest.NewRequest(http.MethodGet, "/submissions", nil))
	if response.Code != http.StatusUnauthorized {
		t.Fatalf("protected status = %d", response.Code)
	}
}

func TestChangeSubmissionStatus(t *testing.T) {
	app, database := testApp(t)
	defer database.Close()
	var typeID int64
	_ = database.QueryRow(`SELECT id FROM collab_types LIMIT 1`).Scan(&typeID)
	result, err := database.Exec(`INSERT INTO submissions (brand_name, email, instagram, collab_type_id, proposed_date, pitch, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'pending', datetime('now'), datetime('now'))`, "Studio", "studio@example.com", "@studio", typeID, "2027-07-01", "Uma proposta detalhada para um drop especial.")
	if err != nil {
		t.Fatal(err)
	}
	id, _ := result.LastInsertId()
	body := bytes.NewBufferString(`{"status":"confirmed"}`)
	request := httptest.NewRequest(http.MethodPatch, "/submissions/1", body)
	request.Header.Set("Authorization", "Bearer "+testToken(t, app))
	response := httptest.NewRecorder()
	app.UpdateSubmission(response, request, id)
	if response.Code != http.StatusOK {
		t.Fatalf("patch status = %d, body = %s", response.Code, response.Body.String())
	}
	var status string
	if err = database.QueryRow(`SELECT status FROM submissions WHERE id = ?`, id).Scan(&status); err != nil {
		t.Fatal(err)
	}
	if status != "confirmed" {
		t.Fatalf("status = %s", status)
	}
	var logs int
	if err = database.QueryRow(`SELECT COUNT(*) FROM submission_logs WHERE submission_id = ?`, id).Scan(&logs); err != nil {
		t.Fatal(err)
	}
	if logs != 1 {
		t.Fatalf("logs = %d", logs)
	}
}

func testToken(t *testing.T, app *App) string {
	t.Helper()
	handler := testRouter(app)
	response := httptest.NewRecorder()
	handler.ServeHTTP(response, httptest.NewRequest(http.MethodPost, "/auth/login", bytes.NewBufferString(`{"email":"admin@brezelle.com","password":"admin123"}`)))
	if response.Code != http.StatusOK {
		t.Fatalf("login status = %d", response.Code)
	}
	var payload struct {
		Token string `json:"token"`
	}
	if err := json.Unmarshal(response.Body.Bytes(), &payload); err != nil {
		t.Fatal(err)
	}
	return payload.Token
}

func TestMain(m *testing.M) { os.Exit(m.Run()) }
