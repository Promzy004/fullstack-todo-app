package config

import (
	"database/sql"
	"log"
	"os"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func ConnectDatabase() {
	driverName := os.Getenv("DB_CONNECTION")
	dsn := GetDBDSN()
	db, err := sql.Open(driverName, dsn)

	if err != nil {
		panic(err)
	}

	// Test the connection
	if err := db.Ping(); err != nil {
		log.Fatalf("Failed to ping DB: %v", err)
	}
	
	// See "Important settings" section.
	db.SetConnMaxLifetime(time.Minute * 3)
	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(10)

	DB = db
}