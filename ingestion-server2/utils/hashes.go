package utils

import (
	"crypto/sha256"
	"fmt"
	"strings"

	"github.com/gin-gonic/gin"
)

func GetHash(c *gin.Context) string {
	fields := []string{"message", "level", "resource_id", "trace_id", "span_id", "commit", "metadata", "start", "end"}
	var values []string

	for _, field := range fields {
		values = append(values, c.DefaultQuery(field, ""))
	}

	combinedString := strings.Join(values, ",")
	fmt.Println("combinedString: ", combinedString)

	hash := sha256.New()
	hash.Write([]byte(combinedString))
	hashValue := fmt.Sprintf("%x", hash.Sum(nil))

	return hashValue
}
