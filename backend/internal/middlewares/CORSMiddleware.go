package middlewares

import "net/http"

// CORS middleware
func CORSMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        origin := r.Header.Get("Origin")
        // w.Header().Set("Access-Control-Allow-Origin", "http://127.0.0.1:5173")
        if origin == "http://localhost:5173" || origin == "http://127.0.0.1:5173" {
            w.Header().Set("Access-Control-Allow-Origin", origin)
        }
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        w.Header().Set("Access-Control-Allow-Credentials", "true")

        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusNoContent)
            return
        }

        next.ServeHTTP(w, r)
    })
}