package routers

import (
	"server/controllers"
	"server/middlewares"

	"github.com/gin-gonic/gin"
)

func DebugRouter(config *gin.Engine) {
	debug := config.Group("/debug", middlewares.VerifyToken)
	{
		debug.GET("/ping", middlewares.AddUUID, controllers.Ping)
	}
}
