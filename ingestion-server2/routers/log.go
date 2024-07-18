package routers

import (
	"server/controllers"
	"server/middlewares"

	"github.com/gin-gonic/gin"
)

func LogRouter(config *gin.Engine) {
	debug := config.Group("/logs", middlewares.VerifyToken)
	{
		debug.GET("/count", middlewares.AddUUID, controllers.Count)
	}
}
