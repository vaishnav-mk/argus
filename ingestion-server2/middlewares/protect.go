package middlewares

import "github.com/gin-gonic/gin"

func VerifyToken(c *gin.Context) {
	token := c.Query("token")
	if token != "123" {
		c.JSON(401, gin.H{
			"message": "Unauthorized",
		})
		c.Abort()
	}
	c.Next()
}
