package models

type User struct {
	ID       int    `json:"id"`
	Firstname string `json:"firstname"`
	Lastname string `json:"lastname"`
	Email    string `json:"email"`
	Password string `json:"-"` 
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
	},
}
