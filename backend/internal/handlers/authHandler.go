package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"todo-app/config"
	"todo-app/internal/mail"
	"todo-app/internal/models"

	"todo-app/internal/utils"

	"golang.org/x/crypto/bcrypt"
)

// register user handler
func Register(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var input models.UserRegister
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": "Invalid Input"})
		return
	}

	// checks to validate user inputs
	errors := utils.ValidateInput(input)
	if (len(errors) > 0) {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]map[string]string {
			"errors": errors,
		})
		return
	}

	// hash user password inputted
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(input.Password), 12)
	code := utils.GenerateCode()

	// query db, to insert the information
	_, err := config.DB.Exec(
		"INSERT INTO users (firstname, lastname, email, password, code) VALUES (?, ?, ?, ?, ?)",
		input.Firstname, input.Lastname, input.Email, string(hashedPassword), code,
	)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"message": "User already exist"})
		return
	}

	//send code to user email
	sendErr := mail.SendCode(input.Email, code)
	if sendErr != nil {
		http.Error(w, sendErr.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Registration successful"})
}


// login user handler
func Login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var input models.UserLogin
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": "Invalid Input"})
		return
	}

	errors := utils.ValidateInput(input)

	if len(errors) > 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]map[string]string {
			"errors": errors,
		})
		return
	}

	var user models.User
	err := config.DB.QueryRow("SELECT id, password FROM users WHERE email = ?", input.Email).Scan(&user.ID, &user.Password)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"message": "User not found"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": "password is incorrect"})
		return
	}

	// calls the GenerateToken function to generate the token
	tokenString, err := utils.GenerateToken(user.ID, 24*time.Hour)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"message": "Could not generate Token"})
		return
	}

	// set token to cookie with http only
    http.SetCookie(w, &http.Cookie{
        Name:     "todo-token",
        Value:    tokenString,
        Expires:  time.Now().Add(24 * time.Hour),
        HttpOnly: true,  // prevent JS access (XSS protection)
        Path:     "/",
        SameSite: http.SameSiteStrictMode, // blocks cross-site use
    })

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Login successful",})
}


// logout user handler
func Logout (w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	http.SetCookie(w, &http.Cookie{
		Name: "todo-token",
		Value: "",
		Expires: time.Now().Add(-time.Hour),
		HttpOnly: true,
		Path: "/",
		SameSite: http.SameSiteStrictMode,
	})

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Successfully logged out",})
}


// resend code handler
func ResendCode(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var input models.ResetCode
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": "Invalid Input"})
		return
	}

	errors := utils.ValidateInput(input)
	if len(errors) > 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]map[string]string {
			"errors": errors,
		})
		return
	}

	var id int 
	err := config.DB.QueryRow("SELECT id FROM users WHERE email = ?", input.Email).Scan(&id)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"message": "User not found"})
		return
	}

	code := utils.GenerateCode()
	_, updateError := config.DB.Exec("UPDATE users SET code = ? where email = ?", code, input.Email)
	if updateError != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"message": "Error updating user"})
		return
	}

	mail.SendCode(input.Email, code)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "verification code sent"})
}


// verify email handler
func Verify(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var input models.Verify
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": "Invalid Input"})
		return
	}

	errors := utils.ValidateInput(input)
	if len(errors) > 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]map[string]string {
			"errors": errors,
		})
		return
	}

	var user models.User
	err := config.DB.QueryRow("SELECT code FROM users WHERE email = ?", input.Email).Scan(&user.Code)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"message": "User not found"})
		return
	}

	if input.Code != user.Code {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"message": "Invalid code entered"})
		return
	}

	_, updateErr := config.DB.Exec("UPDATE users SET verified_at = ? WHERE email = ?", time.Now().UTC(), input.Email)
	if updateErr != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"message": "Could not update user"})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Verification successful"})
}

