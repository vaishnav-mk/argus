package routers

import (
	"server/controllers"
	"server/middlewares"

	"github.com/gin-gonic/gin"
)

func LogRouter(config *gin.Engine) {
	logs := config.Group("/logs")
	{
		logs.POST("/data", middlewares.AddUUID, controllers.GetLogs)
		logs.POST("/search", middlewares.AddUUID, controllers.SearchLogs)
		logs.GET("/count", middlewares.AddUUID, controllers.CountLogs)
		logs.GET("/:log_id", middlewares.AddUUID, controllers.GetLog)

		logs.POST("/", middlewares.AddUUID, controllers.PostLog)

		logs.DELETE("/:log_id", middlewares.AddUUID, middlewares.VerifyToken, controllers.DeleteLog)
	}
}
