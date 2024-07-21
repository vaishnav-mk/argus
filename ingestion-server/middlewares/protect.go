package middlewares

import (
	"server/config"
	"server/initializers"

	"github.com/gin-gonic/gin"
)

func VerifyToken(c *gin.Context) {
	token := c.Query("token")
	if token != initializers.CONFIG.AUTH_TOKEN {
		c.JSON(401, gin.H{
			"message": config.UNAUTHORIZED,
		})
		c.Abort()
	}
	c.Next()
}
