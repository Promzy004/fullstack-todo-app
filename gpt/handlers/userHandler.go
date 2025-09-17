package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"todo-app/config"
	"todo-app/internal/models"
)

// CreateUserHandler handles POST /users
func CreateUserHandler(w http.ResponseWriter, r *http.Request) {
	var u models.User
	if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	if err := u.Create(config.DB); err != nil {
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(u)
}

// GetUsersHandler handles GET /users
func GetUsersHandler(w http.ResponseWriter, r *http.Request) {
	users, err := models.GetAllUsers(config.DB)
	if err != nil {
		http.Error(w, "Failed to fetch users", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(users)
}

// GetUserHandler handles GET /users/{id}
func GetUserHandler(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Query().Get("id")
	id, _ := strconv.Atoi(idStr)

	u, err := models.GetUserByID(config.DB, id)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(u)
}

// UpdateUserHandler handles PUT /users/{id}
func UpdateUserHandler(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Query().Get("id")
	id, _ := strconv.Atoi(idStr)

	var input models.User
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	user, err := models.GetUserByID(config.DB, id)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Update only provided fields (for simplicity, assume all fields)
	user.Email = input.Email
	user.FirstName = input.FirstName
	user.LastName = input.LastName
	user.Password = input.Password

	if err := user.Update(config.DB); err != nil {
		http.Error(w, "Failed to update user", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(user)
}

// DeleteUserHandler handles DELETE /users/{id}
func DeleteUserHandler(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Query().Get("id")
	id, _ := strconv.Atoi(idStr)

	user := &models.User{ID: id}
	if err := user.Delete(config.DB); err != nil {
		http.Error(w, "Failed to delete user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent) // 204 No Content
}
