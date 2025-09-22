package models

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type User struct {
	ID       int    `json:"id"`
	Firstname string `json:"firstname"`
	Lastname string `json:"lastname"`
	Email    string `json:"email"`
	VerifiedAt *time.Time `json:"verified_at"`
	Code    string `json:"-"`
	Password string `json:"-"` 
}

// Claims stored in the token
type Claims struct {
	UserID int 				`json:"user_id"`
	UserFirstname string 	`json:"firstname"`
	UserLastname string 	`json:"lastname"`
	UserEmail string 		`json:"email"`
	jwt.RegisteredClaims
}

type UserRegister struct {
	Firstname string	`json:"firstname" validate:"required,min=3"`
	Lastname string 	`json:"lastname" validate:"required,min=3"`
	Email    string 	`json:"email" validate:"required,email"`
	Password string		`json:"password" validate:"required"`
}

type UserLogin struct {
	Email    string 	`json:"email" validate:"required,email"`
	Password string		`json:"password" validate:"required"`
}

type ResetCode struct {
	Email string `json:"email" validate:"required,email"`
}

type Verify struct {
	Email string `json:"email" validate:"required,email"`
	Code string `json:"code" validate:"required"`
}

type Update struct {
	Email *string `json:"email" validate:"omitempty,email"`
	Firstname *string	`json:"firstname" validate:"omitempty,min=3"`
	Lastname *string 	`json:"lastname" validate:"omitempty,min=3"`
	Password *string		`json:"password" validate:"omitempty,min=6"`
}

var ValidationMessages = map[string]map[string]string{
	"email": {
		"required": "email field is required",
		"email": "email format is not supported",
		"unique": "email already exist",
	},
	"firstname": {
		"required": "firstname is required",
		"min": "firstname must not be less than 3 characters",
	},
	"lastname": {
		"required": "lastname is required",
		"min": "lastname must not be less than 3 characters",
	},
	"password": {
		"required": "Password is required",
		"min": "lastname must not be less than 6 characters",
	},
	"code": {
		"required": "Verification code is required",
	},
}
