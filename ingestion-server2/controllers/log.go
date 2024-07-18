package controllers

import (
	"server/initializers"

	"github.com/gin-gonic/gin"
)

func Count(c *gin.Context) {
	q := initializers.DB.Query("SELECT COUNT(*) FROM argus_logs.logs")
	var count int
	err := q.Scan(&count)
	if err != nil {
		c.JSON(500, gin.H{"message": "Error counting logs"})
		return
	}
	c.JSON(200, gin.H{"count": count})

}
