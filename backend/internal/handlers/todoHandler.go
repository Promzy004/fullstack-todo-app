package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/golang-jwt/jwt/v5"

	"todo-app/config"
	"todo-app/internal/models"
)

func GetTasks(w http.ResponseWriter, r *http.Request) {
	
	userID, err := ExtractUserIDFromCookie(r)

	if err != nil {
		json.NewEncoder(w).Encode(map[string]string{
			"error": err.Error(),
		})
		return
	}

	// query db
	rows, err := config.DB.Query("SELECT id, task, completed, user_id FROM todos WHERE user_id = ?", userID)
	if err != nil {
		http.Error(w, "Error fetching tasks", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	tasks := []models.Task{}

	for rows.Next() {
		var t models.Task
		rows.Scan(&t.ID, &t.Title, &t.Completed, &t.UserID)
		tasks = append(tasks, t)
	}
	json.NewEncoder(w).Encode(tasks)
}

func CreateTask(w http.ResponseWriter, r *http.Request) {

	userID, err := ExtractUserIDFromCookie(r)

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

	res, err := config.DB.Exec("INSERT INTO todos (task, completed, user_id) VALUES (?, ?, ?)",
		input.Title, false, userID)
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
	userID, _ := ExtractUserIDFromCookie(r)

	taskID, _ := strconv.Atoi(chi.URLParam(r, "id"))

	var task models.Task
	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	_, err := config.DB.Exec("UPDATE tasks SET title=?, completed=? WHERE id=? AND user_id=?",
		task.Title, task.Completed, taskID, userID)
	if err != nil {
		http.Error(w, "Error updating task", http.StatusInternalServerError)
		return
	}

	task.ID = taskID
	task.UserID = userID
	json.NewEncoder(w).Encode(task)
}

func DeleteTask(w http.ResponseWriter, r *http.Request) {
	userID, _ := ExtractUserIDFromCookie(r)

	taskID, _ := strconv.Atoi(chi.URLParam(r, "id"))

	_, err := config.DB.Exec("DELETE FROM tasks WHERE id=? AND user_id=?", taskID, userID)
	if err != nil {
		http.Error(w, "Error deleting task", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "Task deleted"})
}

// ExtractUserIDFromCookie extracts the JWT from the "token" cookie and returns the userID
func ExtractUserIDFromCookie(r *http.Request) (int, error) {
    // 1️⃣ Get the cookie
    cookie, err := r.Cookie("token")
    if err != nil {
        return 0, fmt.Errorf("no token cookie found")
    }

    tokenString := cookie.Value
    // fmt.Println("JWT from cookie:", tokenString) // optional for debugging

    // 2️⃣ Prepare claims struct
    claims := &Claims{} //uses the address of the struct in the authHandler

    // 3️⃣ Parse and validate token
    token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
        return []byte(os.Getenv("JWT_SECRET")), nil
    })

    if err != nil || !token.Valid {
        return 0, fmt.Errorf("invalid token")
    }

    // 4️⃣ Return userID from claims
    return claims.UserID, nil
}