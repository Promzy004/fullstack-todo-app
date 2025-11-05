package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"

	"todo-app/config"
	"todo-app/internal/models"
	"todo-app/internal/utils"
)

func GetTasks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	userID, err := utils.ExtractUserIDFromCookie(r)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": err.Error(),
		})
		return
	}

	// query db
	rows, err := config.DB.Query("SELECT id, title, completed, description, due_date, priority, user_id FROM todos WHERE user_id = ? AND deleted_at IS NULL ORDER BY created_at DESC", userID)
	if err != nil {
		http.Error(w, "Error fetching tasks", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	tasks := []models.Task{}

	for rows.Next() {
		var t models.Task
		rows.Scan(&t.ID, &t.Title, &t.Completed, &t.Description, &t.DueDate, &t.Priority, &t.UserID)
		tasks = append(tasks, t)
	}
	
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(tasks)
}

func CreateTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	userID, err := utils.ExtractUserIDFromCookie(r)

	if err != nil {
		json.NewEncoder(w).Encode(map[string]string{
			"error": err.Error(),
		})
		return
	}

	var input models.Task
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	if input.Title == nil {
		json.NewEncoder(w).Encode(map[string]string{
			"error": "title is required",
		})
		return
	}

	res, err := config.DB.Exec("INSERT INTO todos (title, completed, description, priority, due_date, user_id) VALUES (?, ?, ?, ?, ?, ?)",
		input.Title, false, input.Description, input.Priority, input.DueDate, userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	id, _ := res.LastInsertId()
	input.ID = int(id)
	input.UserID = userID
	input.Completed = false
	json.NewEncoder(w).Encode(map[string]string{
		"message": "task successfuly created",
	})
}

func UpdateTask(w http.ResponseWriter, r *http.Request) {
	userID, _ := utils.ExtractUserIDFromCookie(r)

	taskID, _ := strconv.Atoi(chi.URLParam(r, "id"))

	var task models.Task
	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	_, err := config.DB.Exec("UPDATE todos SET completed=? WHERE id=? AND user_id=?", task.Completed, taskID, userID)
	if err != nil {
		http.Error(w, "Error updating task", http.StatusInternalServerError)
		return
	}

	task.ID = taskID
	task.UserID = userID
	json.NewEncoder(w).Encode(map[string]string{
		"message": "task updated",
	})
}

func DeleteTask(w http.ResponseWriter, r *http.Request) {
	userID, _ := utils.ExtractUserIDFromCookie(r)

	taskID, _ := strconv.Atoi(chi.URLParam(r, "id"))

	_, err := config.DB.Exec("UPDATE todos SET deleted_at = ? WHERE id=? AND user_id=?", time.Now().Add(time.Hour * 1), taskID, userID)
	if err != nil {
		http.Error(w, "Error deleting task", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "Task deleted"})
}

func GetATask(w http.ResponseWriter, r *http.Request) {
	userID, _ := utils.ExtractUserIDFromCookie(r)

	taskID, _ := strconv.Atoi(chi.URLParam(r, "id"))

	var t models.Task
	err := config.DB.QueryRow("SELECT id, title, completed, description, due_date, priority, user_id FROM todos WHERE id = ? AND user_id = ?", taskID, userID).Scan(&t.ID, &t.Title, &t.Completed, &t.Description, &t.DueDate, &t.Priority, &t.UserID)
	if err != nil {
		http.Error(w, "Error fetching task", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(t)
}