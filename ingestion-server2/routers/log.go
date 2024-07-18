package routers

import (
	"server/controllers"
	"server/middlewares"

	"github.com/gin-gonic/gin"
)

func LogRouter(config *gin.Engine) {
	debug := config.Group("/logs")
	{
		debug.GET("/count", middlewares.AddUUID, controllers.CountLogs)
		debug.GET("/", middlewares.AddUUID, controllers.GetLogs)
		debug.POST("/", middlewares.AddUUID, controllers.PostLog)
	}
}
