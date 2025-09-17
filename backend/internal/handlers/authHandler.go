package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"todo-app/config"
	"todo-app/internal/models"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// Claims stored in the token
type Claims struct {
	UserID int `json:"user_id"`
	jwt.RegisteredClaims
}

func Register(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var input models.UserRegister
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid Input"})
		return
	}

	// checks to validate user inputs
	errors := validateInput(input)
	if (len(errors) > 0) {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(errors)
		return
	}

	// hash user password inputted
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(input.Password), 12)

	// query db, to insert the information
	_, err := config.DB.Exec(
		"INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)",
		input.Firstname, input.Lastname, input.Email, string(hashedPassword),
	)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "User already exist"})
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Registration successful"})
}


func validateInput(input any) map[string]string {
	var validate = validator.New()
	errorMessages := make(map[string]string)

	if err := validate.Struct(input); err != nil {
		errors := err.(validator.ValidationErrors)

		for _, e := range errors {
			field := strings.ToLower(e.Field())
			tag := strings.ToLower(e.Tag())
			if value, ok := models.ValidationMessages[field]; ok {
				if msg, exist := value[tag]; exist {
				errorMessages[field] = msg
				}
			}
		}
	}
	
	return errorMessages

}



// type contextKey string

// const ContextUserID contextKey = "userID"

// GenerateToken creates a signed JWT for a user ID
func GenerateToken(userID int, ttl time.Duration) (string, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return "", fmt.Errorf("JWT_SECRET not set")
	}

	exp := time.Now().Add(ttl)
	claims := &Claims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(exp),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "todo-app",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}


func Login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var input models.User
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid Input"})
		return
	}

	var user models.User
	err := config.DB.QueryRow("SELECT id, password FROM users WHERE email = ?", input.Email).
		Scan(&user.ID, &user.Password)
	if err != nil {
		http.Error(w, "User not found", http.StatusUnauthorized)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		http.Error(w, "Invalid password", http.StatusUnauthorized)
		return
	}

	// ✅ Generate JWT (24h expiry)
	tokenString, err := GenerateToken(user.ID, 24*time.Hour)
	if err != nil {
		http.Error(w, "Could not generate token", http.StatusInternalServerError)
		return
	}

	// ✅ Set cookie with JWT
    http.SetCookie(w, &http.Cookie{
        Name:     "token",
        Value:    tokenString,
        Expires:  time.Now().Add(24 * time.Hour),
        HttpOnly: true,  // prevent JS access (XSS protection)
        Path:     "/",
        SameSite: http.SameSiteStrictMode, // blocks cross-site use
    })

	// ✅ Return token as JSON
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Login successful",
	})
}


