package main

import (
	"net/http"
	"os"
	"todo-app/internal/routes"

	"todo-app/config"

	"github.com/go-chi/chi/v5"
)

func main() {
	config.LoadEnv()
	port := os.Getenv("PORT")
	r := chi.NewRouter()
	routes.APIRoutes(r)

	config.ConnectDatabase()
	defer config.DB.Close()


	println("Server is running ...")
	println("Running server on localhost:%s", port)
	http.ListenAndServe(":"+port, r)
}