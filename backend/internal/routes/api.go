package routes

import (
	"todo-app/internal/handlers"

	"github.com/go-chi/chi/v5"
)

func APIRoutes(r chi.Router) {
	r.Patch("/api/auth/resend-code", handlers.ResendCode)
	r.Patch("/api/update-info", handlers.UpdateInfo)
	r.Post("/api/auth/register", handlers.Register)
	r.Post("/api/create-task", handlers.CreateTask)
	r.Patch("/api/update/{id}", handlers.UpdateTask)
	r.Delete("/api/delete/{id}", handlers.DeleteTask)
	r.Post("/api/auth/logout", handlers.Logout)
	r.Post("/api/auth/login", handlers.Login)
	r.Get("/api/tasks", handlers.GetTasks)
	r.Post("/api/verify", handlers.Verify)
	r.Get("/api/user", handlers.User)
}