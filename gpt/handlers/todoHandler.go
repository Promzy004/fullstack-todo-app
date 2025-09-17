package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"todo-app/config"
	"todo-app/internal/models"
)

// CreateTodoHandler handles POST /todos
func CreateTodoHandler(w http.ResponseWriter, r *http.Request) {
	var t models.Todo
	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	if err := t.Create(config.DB); err != nil {
		http.Error(w, "Failed to create todo", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(t)
}

// GetTodosHandler handles GET /todos
func GetTodosHandler(w http.ResponseWriter, r *http.Request) {
	todos, err := models.GetAllTodos(config.DB)
	if err != nil {
		http.Error(w, "Failed to fetch todos", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(todos)
}

// GetTodoHandler handles GET /todos/{id}
func GetTodoHandler(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Query().Get("id")
	id, _ := strconv.Atoi(idStr)

	t, err := models.GetTodoByID(config.DB, id)
	if err != nil {
		http.Error(w, "Todo not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(t)
}

// UpdateTodoHandler handles PUT /todos/{id}
func UpdateTodoHandler(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Query().Get("id")
	id, _ := strconv.Atoi(idStr)

	var input models.Todo
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	todo, err := models.GetTodoByID(config.DB, id)
	if err != nil {
		http.Error(w, "Todo not found", http.StatusNotFound)
		return
	}

	todo.Task = input.Task
	todo.Completed = input.Completed

	if err := todo.Update(config.DB); err != nil {
		http.Error(w, "Failed to update todo", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(todo)
}

// DeleteTodoHandler handles DELETE /todos/{id}
func DeleteTodoHandler(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Query().Get("id")
	id, _ := strconv.Atoi(idStr)

	todo := &models.Todo{ID: id}
	if err := todo.Delete(config.DB); err != nil {
		http.Error(w, "Failed to delete todo", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
