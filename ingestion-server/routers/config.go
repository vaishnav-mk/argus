package routers

import (
	"github.com/gin-gonic/gin"
)

func Config(app *gin.Engine) {
	DebugRouter(app)
	LogRouter(app)
}
