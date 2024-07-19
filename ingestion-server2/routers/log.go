package routers

import (
	"server/controllers"
	"server/middlewares"

	"github.com/gin-gonic/gin"
)

func LogRouter(config *gin.Engine) {
	logs := config.Group("/logs")
	{
		logs.GET("/", middlewares.AddUUID, controllers.GetLogs)
		logs.GET("/count", middlewares.AddUUID, controllers.CountLogs)
		logs.GET("/:log_id", middlewares.AddUUID, controllers.GetLog)

		logs.POST("/", middlewares.AddUUID, controllers.PostLog)

		logs.DELETE("/:log_id", middlewares.AddUUID, middlewares.VerifyToken, controllers.DeleteLog)
	}
}
