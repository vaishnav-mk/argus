package middlewares

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func AddUUID(c *gin.Context) {
	uuid := uuid.New()
	c.Set("uuid", uuid)
	// fmt.Printf("The request with uuid %s is started \n", uuid)
	// startTime := time.Now()
	c.Next()
	// fmt.Printf("The request with uuid %s is completed in %v \n", uuid, time.Since(startTime))
}
