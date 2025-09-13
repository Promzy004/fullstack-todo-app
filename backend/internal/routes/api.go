package routes

import (
	"github.com/go-chi/chi/v5"
	"net/http"
)

func APIRoutes(r chi.Router) {
	r.Get("/", func (w http.ResponseWriter, request *http.Request) {
		w.Write([]byte("index page"))
	})
}