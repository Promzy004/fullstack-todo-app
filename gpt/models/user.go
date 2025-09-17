package models

import (
	"database/sql"
	"time"
)

// User struct represents a row in the users table
type User struct {
	ID        int       `json:"id"`
	Email     string    `json:"email"`
	FirstName string    `json:"firstname"`
	LastName  string    `json:"lastname"`
	Password  string    `json:"-"` // hide password in JSON responses
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Create inserts a new user into the database
func (u *User) Create(db *sql.DB) error {
	query := "INSERT INTO users (email, firstname, lastname, password) VALUES (?, ?, ?, ?)"
	res, err := db.Exec(query, u.Email, u.FirstName, u.LastName, u.Password)
	if err != nil {
		return err
	}

	id, err := res.LastInsertId()
	if err != nil {
		return err
	}
	u.ID = int(id)
	return nil
}

// GetAllUsers fetches all users from the database
func GetAllUsers(db *sql.DB) ([]*User, error) {
	rows, err := db.Query("SELECT id, email, firstname, lastname, password, created_at, updated_at FROM users")
	if err != nil {
		return nil, err
	}
	defer rows.Close() // ensures resources are released

	var users []*User
	for rows.Next() {
		u := &User{}
		if err := rows.Scan(&u.ID, &u.Email, &u.FirstName, &u.LastName, &u.Password, &u.CreatedAt, &u.UpdatedAt); err != nil {
			return nil, err
		}
		users = append(users, u)
	}
	return users, nil
}

// GetUserByID fetches a single user by ID
func GetUserByID(db *sql.DB, id int) (*User, error) {
	row := db.QueryRow("SELECT id, email, firstname, lastname, password, created_at, updated_at FROM users WHERE id = ?", id)
	u := &User{}
	err := row.Scan(&u.ID, &u.Email, &u.FirstName, &u.LastName, &u.Password, &u.CreatedAt, &u.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return u, nil
}

// Update modifies an existing user in the database
func (u *User) Update(db *sql.DB) error {
	query := "UPDATE users SET email=?, firstname=?, lastname=?, password=?, updated_at=NOW() WHERE id=?"
	_, err := db.Exec(query, u.Email, u.FirstName, u.LastName, u.Password, u.ID)
	return err
}

// Delete removes a user from the database
func (u *User) Delete(db *sql.DB) error {
	_, err := db.Exec("DELETE FROM users WHERE id=?", u.ID)
	return err
}
