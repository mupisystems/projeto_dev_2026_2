package models

type CollabType struct {
	ID        int64  `json:"id"`
	Title     string `json:"title"`
	Active    bool   `json:"active"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

type SubmissionLog struct {
	ID         int64  `json:"id"`
	FromStatus string `json:"from_status,omitempty"`
	ToStatus   string `json:"to_status"`
	ChangedAt  string `json:"changed_at"`
}

type Submission struct {
	ID           int64           `json:"id"`
	BrandName    string          `json:"brand_name"`
	Email        string          `json:"email"`
	Instagram    string          `json:"instagram"`
	CollabTypeID int64           `json:"collab_type_id"`
	CollabType   string          `json:"collab_type"`
	ProposedDate string          `json:"proposed_date"`
	Pitch        string          `json:"pitch"`
	Status       string          `json:"status"`
	CreatedAt    string          `json:"created_at"`
	UpdatedAt    string          `json:"updated_at"`
	Logs         []SubmissionLog `json:"logs,omitempty"`
}
