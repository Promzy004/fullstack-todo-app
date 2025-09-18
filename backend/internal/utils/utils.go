package utils

import (
	"fmt"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"
	"todo-app/internal/models"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v5"
)

// validates user input
func ValidateInput(input any) map[string]string {
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


// generate random code, 6 length and return as string
func GenerateCode() string {
	random := rand.New(rand.NewSource(time.Now().UnixNano()))
	randCode := random.Intn((999999 - 100000) + 1 ) + 100000

    return strconv.FormatInt(int64(randCode), 10)
}

// GenerateToken creates a signed JWT for a user ID
func GenerateToken(userID int, userFirstname string, userLastname string, userEmail string, ttl time.Duration) (string, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return "", fmt.Errorf("JWT_SECRET not set")
	}

	exp := time.Now().Add(ttl)
	claims := &models.Claims{
		UserID: userID,
		UserFirstname: userFirstname,
		UserLastname: userLastname,
		UserEmail: userEmail,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(exp),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "todo-app",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

// ExtractUserIDFromCookie extracts the JWT from the "token" cookie and returns the userID
func ExtractUserIDFromCookie(r *http.Request) (int, error) {
    // Get the cookie
    cookie, err := r.Cookie("todo-token")
    if err != nil {
        return 0, fmt.Errorf("no token cookie found")
    }

    tokenString := cookie.Value

    // Prepare claims struct
    claims := &models.Claims{}

    // Parse and validate token, also fill up the claims with address of struct specified
    token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (any, error) {
        return []byte(os.Getenv("JWT_SECRET")), nil
    })

    if err != nil || !token.Valid {
        return 0, fmt.Errorf("invalid token")
    }

    return claims.UserID, nil
}