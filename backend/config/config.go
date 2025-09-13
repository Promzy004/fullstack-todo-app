package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

func LoadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func GetEnv(key string, fallback string) string {
	value := os.Getenv(key)		//get the value of the key specified in the .env file

	// checks if the key has a value, if it doesn't then it would use the default specified value
	if value == "" {
		return fallback
	}

	return value
}

func GetDBDSN() string {
	user := GetEnv("DB_USERNAME", "root")
	host := GetEnv("DB_HOST", "127.0.0.1")
	port := GetEnv("DB_PORT", "3306")
	dbName := GetEnv("DB_DATABASE", "")
	password := GetEnv("DB_PASSWORD", "")

	return fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", user, password, host, port, dbName)
}