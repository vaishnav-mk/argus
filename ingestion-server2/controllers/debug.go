package controllers

import "github.com/gin-gonic/gin"

func Ping(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "pong",
		"uuid":    c.MustGet("uuid"),
		"token":   c.Query("token"),
	})
}
