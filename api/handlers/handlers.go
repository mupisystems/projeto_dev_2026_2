package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"net/mail"
	"net/url"
	"strconv"
	"strings"
	"time"

	"github.com/brezelle/api/models"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type App struct {
	DB        *sql.DB
	JWTSecret string
}

type submissionInput struct {
	BrandName    string `json:"brand_name"`
	Email        string `json:"email"`
	Instagram    string `json:"instagram"`
	CollabTypeID int64  `json:"collab_type_id"`
	ProposedDate string `json:"proposed_date"`
	Pitch        string `json:"pitch"`
}

type statusInput struct {
	Status string `json:"status"`
}

func (app *App) PublicCollabTypes(writer http.ResponseWriter, request *http.Request) {
	rows, err := app.DB.Query(`SELECT id, title, active, created_at, updated_at FROM collab_types WHERE active = 1 ORDER BY id`)
	if err != nil {
		serverError(writer, err)
		return
	}
	defer rows.Close()
	types := make([]models.CollabType, 0)
	for rows.Next() {
		item, err := scanCollabType(rows)
		if err != nil {
			serverError(writer, err)
			return
		}
		types = append(types, item)
	}
	writeJSON(writer, http.StatusOK, types)
}

func (app *App) CreateSubmission(writer http.ResponseWriter, request *http.Request) {
	var input submissionInput
	if err := json.NewDecoder(request.Body).Decode(&input); err != nil {
		badRequest(writer, "Envie um JSON válido.")
		return
	}
	if message := validateSubmission(app.DB, input); message != "" {
		badRequest(writer, message)
		return
	}

	now := time.Now().UTC().Format(time.RFC3339)
	result, err := app.DB.Exec(`INSERT INTO submissions (brand_name, email, instagram, collab_type_id, proposed_date, pitch, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?)`, strings.TrimSpace(input.BrandName), strings.ToLower(strings.TrimSpace(input.Email)), strings.TrimSpace(input.Instagram), input.CollabTypeID, input.ProposedDate, strings.TrimSpace(input.Pitch), now, now)
	if err != nil {
		serverError(writer, err)
		return
	}
	id, err := result.LastInsertId()
	if err != nil {
		serverError(writer, err)
		return
	}
	writeJSON(writer, http.StatusCreated, map[string]interface{}{"id": id, "status": "pending", "message": "Proposta enviada com sucesso."})
}

func (app *App) Login(writer http.ResponseWriter, request *http.Request) {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(request.Body).Decode(&input); err != nil {
		badRequest(writer, "Envie um JSON válido.")
		return
	}
	var id int64
	var hash string
	err := app.DB.QueryRow(`SELECT id, password_hash FROM admins WHERE email = ?`, strings.ToLower(strings.TrimSpace(input.Email))).Scan(&id, &hash)
	if err != nil || bcrypt.CompareHashAndPassword([]byte(hash), []byte(input.Password)) != nil {
		writeJSON(writer, http.StatusUnauthorized, map[string]string{"error": "Email ou senha incorretos."})
		return
	}
	claims := jwt.MapClaims{"sub": strconv.FormatInt(id, 10), "email": strings.ToLower(strings.TrimSpace(input.Email)), "exp": time.Now().Add(24 * time.Hour).Unix(), "iat": time.Now().Unix()}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString([]byte(app.JWTSecret))
	if err != nil {
		serverError(writer, err)
		return
	}
	writeJSON(writer, http.StatusOK, map[string]interface{}{"token": signed, "admin": map[string]interface{}{"id": id, "email": strings.ToLower(strings.TrimSpace(input.Email))}})
}

func (app *App) Logout(writer http.ResponseWriter, request *http.Request) {
	writer.WriteHeader(http.StatusNoContent)
}

func (app *App) ListSubmissions(writer http.ResponseWriter, request *http.Request) {
	query := request.URL.Query()
	page := positiveInt(query.Get("page"), 1)
	limit := positiveInt(query.Get("limit"), 10)
	if limit > 100 {
		limit = 100
	}
	status := query.Get("status")
	if status != "" && !validStatus(status) {
		badRequest(writer, "Filtro de status inválido.")
		return
	}
	search, _ := url.QueryUnescape(query.Get("search"))
	search = strings.TrimSpace(search)
	where := " WHERE 1=1"
	args := []interface{}{}
	if status != "" {
		where += " AND s.status = ?"
		args = append(args, status)
	}
	if search != "" {
		where += " AND (LOWER(s.brand_name) LIKE LOWER(?) OR LOWER(s.email) LIKE LOWER(?))"
		like := "%" + search + "%"
		args = append(args, like, like)
	}
	var total int
	if err := app.DB.QueryRow("SELECT COUNT(*) FROM submissions s"+where, args...).Scan(&total); err != nil {
		serverError(writer, err)
		return
	}
	offset := (page - 1) * limit
	rows, err := app.DB.Query(`SELECT s.id, s.brand_name, s.email, s.instagram, s.collab_type_id, c.title, s.proposed_date, s.pitch, s.status, s.created_at, s.updated_at FROM submissions s JOIN collab_types c ON c.id = s.collab_type_id`+where+` ORDER BY s.proposed_date ASC, s.created_at DESC LIMIT ? OFFSET ?`, append(args, limit, offset)...)
	if err != nil {
		serverError(writer, err)
		return
	}
	defer rows.Close()
	items := make([]models.Submission, 0)
	for rows.Next() {
		var item models.Submission
		if err := rows.Scan(&item.ID, &item.BrandName, &item.Email, &item.Instagram, &item.CollabTypeID, &item.CollabType, &item.ProposedDate, &item.Pitch, &item.Status, &item.CreatedAt, &item.UpdatedAt); err != nil {
			serverError(writer, err)
			return
		}
		item.Logs = app.submissionLogs(item.ID)
		items = append(items, item)
	}
	counts := map[string]int{}
	countRows, err := app.DB.Query(`SELECT status, COUNT(*) FROM submissions GROUP BY status`)
	if err == nil {
		defer countRows.Close()
		for countRows.Next() {
			var key string
			var count int
			_ = countRows.Scan(&key, &count)
			counts[key] = count
		}
	}
	writeJSON(writer, http.StatusOK, map[string]interface{}{"data": items, "pagination": map[string]int{"page": page, "limit": limit, "total": total, "pages": (total + limit - 1) / limit}, "counts": map[string]int{"pending": counts["pending"], "confirmed": counts["confirmed"], "cancelled": counts["cancelled"]}})
}

func (app *App) UpdateSubmission(writer http.ResponseWriter, request *http.Request, id int64) {
	var input statusInput
	if err := json.NewDecoder(request.Body).Decode(&input); err != nil {
		badRequest(writer, "Envie um JSON válido.")
		return
	}
	if !validStatus(input.Status) {
		badRequest(writer, "Status inválido. Use pending, confirmed ou cancelled.")
		return
	}
	var current string
	if err := app.DB.QueryRow(`SELECT status FROM submissions WHERE id = ?`, id).Scan(&current); err == sql.ErrNoRows {
		http.Error(writer, "Not found", http.StatusNotFound)
		return
	} else if err != nil {
		serverError(writer, err)
		return
	}
	if current == input.Status {
		writeJSON(writer, http.StatusOK, map[string]string{"status": current, "message": "Status já estava atualizado."})
		return
	}
	now := time.Now().UTC().Format(time.RFC3339)
	tx, err := app.DB.Begin()
	if err != nil {
		serverError(writer, err)
		return
	}
	if _, err = tx.Exec(`UPDATE submissions SET status = ?, updated_at = ? WHERE id = ?`, input.Status, now, id); err == nil {
		_, err = tx.Exec(`INSERT INTO submission_logs (submission_id, from_status, to_status, changed_at) VALUES (?, ?, ?, ?)`, id, current, input.Status, now)
	}
	if err != nil {
		_ = tx.Rollback()
		serverError(writer, err)
		return
	}
	if err = tx.Commit(); err != nil {
		serverError(writer, err)
		return
	}
	writeJSON(writer, http.StatusOK, map[string]string{"status": input.Status, "message": "Status atualizado."})
}

func (app *App) AllCollabTypes(writer http.ResponseWriter, request *http.Request) {
	rows, err := app.DB.Query(`SELECT id, title, active, created_at, updated_at FROM collab_types ORDER BY id`)
	if err != nil {
		serverError(writer, err)
		return
	}
	defer rows.Close()
	types := make([]models.CollabType, 0)
	for rows.Next() {
		item, err := scanCollabType(rows)
		if err != nil {
			serverError(writer, err)
			return
		}
		types = append(types, item)
	}
	writeJSON(writer, http.StatusOK, types)
}

func (app *App) CreateCollabType(writer http.ResponseWriter, request *http.Request) {
	var input struct {
		Title  string `json:"title"`
		Active *bool  `json:"active"`
	}
	if err := json.NewDecoder(request.Body).Decode(&input); err != nil {
		badRequest(writer, "Envie um JSON válido.")
		return
	}
	title := strings.TrimSpace(input.Title)
	if len([]rune(title)) < 3 || len([]rune(title)) > 80 {
		badRequest(writer, "O título deve ter entre 3 e 80 caracteres.")
		return
	}
	active := true
	if input.Active != nil {
		active = *input.Active
	}
	now := time.Now().UTC().Format(time.RFC3339)
	result, err := app.DB.Exec(`INSERT INTO collab_types (title, active, created_at, updated_at) VALUES (?, ?, ?, ?)`, title, boolInt(active), now, now)
	if err != nil {
		if strings.Contains(err.Error(), "UNIQUE") {
			badRequest(writer, "Já existe uma opção com este título.")
			return
		}
		serverError(writer, err)
		return
	}
	id, _ := result.LastInsertId()
	writeJSON(writer, http.StatusCreated, map[string]interface{}{"id": id, "title": title, "active": active})
}

func (app *App) UpdateCollabType(writer http.ResponseWriter, request *http.Request, id int64) {
	var input struct {
		Title  *string `json:"title"`
		Active *bool   `json:"active"`
	}
	if err := json.NewDecoder(request.Body).Decode(&input); err != nil {
		badRequest(writer, "Envie um JSON válido.")
		return
	}
	if input.Title == nil && input.Active == nil {
		badRequest(writer, "Informe title ou active para atualizar.")
		return
	}
	var title string
	var active int
	if err := app.DB.QueryRow(`SELECT title, active FROM collab_types WHERE id = ?`, id).Scan(&title, &active); err == sql.ErrNoRows {
		http.Error(writer, "Not found", http.StatusNotFound)
		return
	} else if err != nil {
		serverError(writer, err)
		return
	}
	if input.Title != nil {
		title = strings.TrimSpace(*input.Title)
		if len([]rune(title)) < 3 || len([]rune(title)) > 80 {
			badRequest(writer, "O título deve ter entre 3 e 80 caracteres.")
			return
		}
	}
	if input.Active != nil {
		active = boolInt(*input.Active)
	}
	_, err := app.DB.Exec(`UPDATE collab_types SET title = ?, active = ?, updated_at = ? WHERE id = ?`, title, active, time.Now().UTC().Format(time.RFC3339), id)
	if err != nil {
		if strings.Contains(err.Error(), "UNIQUE") {
			badRequest(writer, "Já existe uma opção com este título.")
			return
		}
		serverError(writer, err)
		return
	}
	writeJSON(writer, http.StatusOK, map[string]interface{}{"id": id, "title": title, "active": active == 1})
}

func validateSubmission(database *sql.DB, input submissionInput) string {
	if len([]rune(strings.TrimSpace(input.BrandName))) < 2 || len([]rune(strings.TrimSpace(input.BrandName))) > 100 {
		return "Informe um nome de marca ou artista entre 2 e 100 caracteres."
	}
	if _, err := mail.ParseAddress(strings.TrimSpace(input.Email)); err != nil || !strings.Contains(strings.TrimSpace(input.Email), "@") {
		return "Informe um email válido."
	}
	if len([]rune(strings.TrimSpace(input.Instagram))) < 2 || len([]rune(strings.TrimSpace(input.Instagram))) > 100 {
		return "Informe o Instagram da marca ou artista."
	}
	if input.CollabTypeID < 1 {
		return "Escolha um tipo de collab."
	}
	var active int
	if err := database.QueryRow(`SELECT active FROM collab_types WHERE id = ?`, input.CollabTypeID).Scan(&active); err == sql.ErrNoRows || active != 1 {
		return "Escolha uma opção de collab ativa."
	}
	if _, err := time.Parse("2006-01-02", input.ProposedDate); err != nil {
		return "Informe uma data pretendida válida."
	}
	pitch := strings.TrimSpace(input.Pitch)
	if len([]rune(pitch)) < 20 || len([]rune(pitch)) > 500 {
		return "O pitch deve ter entre 20 e 500 caracteres."
	}
	return ""
}

func (app *App) submissionLogs(id int64) []models.SubmissionLog {
	rows, err := app.DB.Query(`SELECT id, COALESCE(from_status, ''), to_status, changed_at FROM submission_logs WHERE submission_id = ? ORDER BY changed_at DESC`, id)
	if err != nil {
		return []models.SubmissionLog{}
	}
	defer rows.Close()
	logs := []models.SubmissionLog{}
	for rows.Next() {
		var log models.SubmissionLog
		if rows.Scan(&log.ID, &log.FromStatus, &log.ToStatus, &log.ChangedAt) == nil {
			logs = append(logs, log)
		}
	}
	return logs
}

func scanCollabType(scanner interface{ Scan(...interface{}) error }) (models.CollabType, error) {
	var item models.CollabType
	var active int
	err := scanner.Scan(&item.ID, &item.Title, &active, &item.CreatedAt, &item.UpdatedAt)
	item.Active = active == 1
	return item, err
}
func validStatus(status string) bool {
	return status == "pending" || status == "confirmed" || status == "cancelled"
}
func positiveInt(value string, fallback int) int {
	number, err := strconv.Atoi(value)
	if err != nil || number < 1 {
		return fallback
	}
	return number
}
func boolInt(value bool) int {
	if value {
		return 1
	}
	return 0
}
func writeJSON(writer http.ResponseWriter, status int, value interface{}) {
	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(status)
	_ = json.NewEncoder(writer).Encode(value)
}
func badRequest(writer http.ResponseWriter, message string) {
	writeJSON(writer, http.StatusBadRequest, map[string]string{"error": message})
}
func serverError(writer http.ResponseWriter, err error) {
	fmt.Printf("server error: %v\n", err)
	writeJSON(writer, http.StatusInternalServerError, map[string]string{"error": "Não foi possível concluir a operação."})
}
