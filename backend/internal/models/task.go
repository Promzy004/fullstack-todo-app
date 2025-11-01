package models

import "time"


type Task struct {
	ID        int    `json:"id"`
	Title     *string `json:"title"`
	Completed bool   `json:"completed"`
	UserID    int    `json:"-"`
	Description *string `json:"description"`
	DueDate   *time.Time `json:"due_date"`
	Priority  *string `json:"priority"`
	DeletedAt *string `json:"-"`
}
