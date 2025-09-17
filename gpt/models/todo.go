package models

import (
	"database/sql"
	"time"
)

// Todo struct represents a row in the todos table
type Todo struct {
	ID        int       `json:"id"`
	Task      string    `json:"task"`
	UserID    int       `json:"user_id"` // relates to users.id
	Completed bool      `json:"completed"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Create inserts a new todo into the database
func (t *Todo) Create(db *sql.DB) error {
	query := "INSERT INTO todos (task, user_id) VALUES (?, ?)"
	res, err := db.Exec(query, t.Task, t.UserID)
	if err != nil {
		return err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return err
	}
	t.ID = int(id)
	return nil
}

// GetAllTodos fetches all todos
func GetAllTodos(db *sql.DB) ([]*Todo, error) {
	rows, err := db.Query("SELECT id, task, user_id, completed, created_at, updated_at FROM todos")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var todos []*Todo
	for rows.Next() {
		t := &Todo{}
		if err := rows.Scan(&t.ID, &t.Task, &t.UserID, &t.Completed, &t.CreatedAt, &t.UpdatedAt); err != nil {
			return nil, err
		}
		todos = append(todos, t)
	}
	return todos, nil
}

// GetTodoByID fetches a single todo by ID
func GetTodoByID(db *sql.DB, id int) (*Todo, error) {
	row := db.QueryRow("SELECT id, task, user_id, completed, created_at, updated_at FROM todos WHERE id = ?", id)
	t := &Todo{}
	err := row.Scan(&t.ID, &t.Task, &t.UserID, &t.Completed, &t.CreatedAt, &t.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return t, nil
}

// Update modifies an existing todo
func (t *Todo) Update(db *sql.DB) error {
	query := "UPDATE todos SET task=?, completed=?, updated_at=NOW() WHERE id=?"
	_, err := db.Exec(query, t.Task, t.Completed, t.ID)
	return err
}

// Delete removes a todo
func (t *Todo) Delete(db *sql.DB) error {
	_, err := db.Exec("DELETE FROM todos WHERE id=?", t.ID)
	return err
}
