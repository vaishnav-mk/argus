package main

import (
	"fmt"
	"server/config"
	"server/initializers"
	"server/routers"

	"github.com/gin-contrib/logger"
	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnv()
	initializers.ConnectToCache()
	initializers.ConnectToScylla()

	config.AddLogger()
}

func main() {
	defer config.LoggerCleanUp()
	app := gin.Default()

	app.Use(config.CorsConfig())
	app.Use(logger.SetLogger())
	// app.Use(config.RATE_LIMITER())

	routers.Config(app)

	if err := app.Run(":5000"); err != nil {
		fmt.Println("Error starting server:", err)
	}
	fmt.Println("Server is running")
}
