package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"todo-app/internal/routes"

	"todo-app/config"

	"todo-app/internal/middlewares"

	"github.com/go-chi/chi/v5"
)

func main() {
	// DO NOT load local .env in production
	// Only load .env if running locally
	if os.Getenv("RAILWAY_ENVIRONMENT") == "" {
		config.LoadEnv()
	}

	port := os.Getenv("PORT")
	r := chi.NewRouter()
	r.Use(middlewares.CORSMiddleware)
	routes.APIRoutes(r)

	// Serve frontend static files + React Router fallback
	r.HandleFunc("/*", func(w http.ResponseWriter, r *http.Request) {
		distDir := "./dist"
		path := filepath.Join(distDir, r.URL.Path)

		// Serve index.html for React routes if file doesn't exist
		if _, err := os.Stat(path); os.IsNotExist(err) {
			http.ServeFile(w, r, filepath.Join(distDir, "index.html"))
			return
		}

		// Otherwise serve the static file
		http.FileServer(http.Dir(distDir)).ServeHTTP(w, r)
	})

	//database connection
	config.ConnectDatabase()
	defer config.DB.Close()

	fmt.Println("Server is running ...")
	fmt.Printf("Running server on [http://127.0.0.1:%s]\n", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
