package controllers

import (
	"encoding/json"
	"fmt"
	"server/config"
	"server/initializers"
	"server/types"
	"server/utils"

	"github.com/gin-gonic/gin"
)

func CountLogs(c *gin.Context) {
	q := initializers.DB.Query("SELECT COUNT(*) FROM argus_logs.logs")
	var count int
	err := q.Scan(&count)
	if err != nil {
		c.JSON(500, gin.H{"message": "Error counting logs"})
		return
	}
	c.JSON(200, gin.H{"count": count})
}

func GetLogs(c *gin.Context) {
	limit := c.DefaultQuery("limit", "10")

	searchHash := utils.GetHash(c)
	cachedLogs := config.GetCache(searchHash)
	// fmt.Println("cachedLogs: ", cachedLogs)

	if cachedLogs != nil {
		c.JSON(200, gin.H{"logs": cachedLogs, "count": len(cachedLogs), "cached": true})
		return
	}

	q := initializers.DB.Query("SELECT * FROM argus_logs.logs LIMIT ?", limit)
	var level, message, resourceID, timestamp, traceID, spanID, commit, metadata string
	var logs []types.Log
	it := q.Iter()
	for it.Scan(&timestamp, &commit, &level, &message, &metadata, &resourceID, &spanID, &traceID) {
		fmt.Println("metadata: ", metadata)
		metadataBytes := []byte(metadata)
		var metadataMap map[string]interface{}
		err := json.Unmarshal(metadataBytes, &metadataMap)
		if err != nil {
			fmt.Println("Error unmarshalling metadata:", err)
			continue
		}
		fmt.Println("map: ", metadataMap)
		logs = append(logs, types.Log{
			Level:      level,
			Message:    message,
			ResourceID: resourceID,
			Timestamp:  timestamp,
			TraceID:    traceID,
			SpanID:     spanID,
			Commit:     commit,
			Metadata:   metadataMap,
		})
	}
	if err := it.Close(); err != nil {
		fmt.Println("Error closing iterator:", err)
	}
	if len(logs) == 0 {
		c.JSON(404, gin.H{"message": "No logs found"})
		return
	}

	go config.SetCache(searchHash, logs)

	c.JSON(200, gin.H{"logs": logs, "count": len(logs), "cached": false})
}

func PostLog(c *gin.Context) {
	var log types.Log

	topic := c.Param("topic")
	if err := c.BindJSON(&log); err != nil {
		c.JSON(400, gin.H{"message": "Invalid log"})
		return
	}

	if log.Timestamp == "" {
		c.JSON(400, gin.H{"message": "Invalid log"})
		return
	}

	fmt.Printf("Received log: %+v\n", log)

	initializers.Buffers.LogChannel <- types.Message{
		Topic:   topic,
		Message: log,
	}

	c.JSON(202, gin.H{"message": "Log received"})
}
