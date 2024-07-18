package config

import (
	"server/initializers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func CorsConfig() gin.HandlerFunc {
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{initializers.CONFIG.FRONTEND_URL}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE"}

	return cors.New(config)
}
