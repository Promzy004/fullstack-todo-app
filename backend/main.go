package main

import (
	"fmt"
	"net/http"
	"os"
	"todo-app/internal/routes"

	"todo-app/config"

	"github.com/go-chi/chi/v5"
	"todo-app/internal/middlewares"
)

func main() {
	config.LoadEnv()
	port := os.Getenv("PORT")
	r := chi.NewRouter()
	r.Use(middlewares.CORSMiddleware)
	routes.APIRoutes(r)

	//database connection
	config.ConnectDatabase()
	defer config.DB.Close()


	fmt.Println("Server is running ...")
	fmt.Printf("Running server on [http://127.0.0.1:%s]\n", port)
	http.ListenAndServe(":"+port, r)
}