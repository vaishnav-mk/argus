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
	buffers := map[string]int{
		"LogChannel": 1000,
	}

	initializers.LoadEnv()
	initializers.ConnectToCache()
	initializers.ConnectToScylla()
	initializers.InitializeBuffers(buffers)
	initializers.InitializeKafka()

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
