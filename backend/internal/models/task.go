package models

import "github.com/golang-jwt/jwt/v5"

type Task struct {
	ID        int    `json:"id"`
	Title     *string `json:"title"`
	Completed bool   `json:"completed"`
	UserID    int    `json:"user_id"`
}

// Claims stored in the token
type Claims struct {
	UserID int `json:"user_id"`
	jwt.RegisteredClaims
}
