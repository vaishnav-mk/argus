package scylla

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/gocql/gocql"
)

type Log struct {
	Level      string                 `json:"level"`
	Message    string                 `json:"message"`
	ResourceID string                 `json:"resourceID"`
	Timestamp  string                 `json:"timestamp"`
	TraceID    string                 `json:"traceID"`
	SpanID     string                 `json:"spanID"`
	Commit     string                 `json:"commit"`
	Metadata   map[string]interface{} `json:"metadata"`
}

func CountLogs(session *gocql.Session, context *gin.Context) {
	q := session.Query("SELECT COUNT(*) FROM argus_logs.logs")
	var count int
	err := q.Scan(&count)
	if err != nil {
		context.JSON(500, gin.H{"message": "Error counting logs"})
		return
	}
	context.JSON(200, gin.H{"count": count})
}

func GetLogs(session *gocql.Session, context *gin.Context, x int) {
	q := session.Query("SELECT * FROM argus_logs.logs LIMIT ?", x)
	var level, message, resourceID, timestamp, traceID, spanID, commit string
	var logs []Log
	it := q.Iter()
	for it.Scan(&level, &message, &resourceID, &timestamp, &traceID, &spanID, &commit) {
		logs = append(logs, Log{
			Level:      level,
			Message:    message,
			ResourceID: resourceID,
			Timestamp:  timestamp,
			TraceID:    traceID,
			SpanID:     spanID,
			Commit:     commit,
		})
	}
	if err := it.Close(); err != nil {
		fmt.Println("Error closing iterator:", err)
	}
	context.JSON(200, gin.H{"logs": logs})
}
