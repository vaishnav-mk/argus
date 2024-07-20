package config

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func CorsConfig() gin.HandlerFunc {
	config := cors.DefaultConfig()
	// config.AllowOrigins = []string{initializers.CONFIG.FRONTEND_URL} TODO: Change this to the frontend URL
	config.AllowOrigins = []string{"*"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE"}

	return cors.New(config)
}
