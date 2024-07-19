package controllers

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"server/config"
	"server/initializers"
	"server/types"
	"server/utils"
	"strconv"

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
	limit, err := strconv.Atoi(c.DefaultQuery("limit", "10"))
	if err != nil {
		c.JSON(400, gin.H{"message": "Invalid limit"})
		return
	}
	pageStateParam := c.DefaultQuery("page_state", "")
	var pageState []byte
	if pageStateParam != "" {
		pageState, err = base64.StdEncoding.DecodeString(pageStateParam)
		if err != nil {
			c.JSON(400, gin.H{"message": "Invalid pageState"})
			return
		}
	}

	searchHash := utils.GetHash(c)
	fmt.Println(searchHash + "_page_" + pageStateParam)
	cachedLogs := config.GetCache(searchHash + "_page_" + pageStateParam)

	if cachedLogs.Logs != nil {
		c.JSON(200, gin.H{"logs": cachedLogs.Logs, "count": len(cachedLogs.Logs), "cached": true, "nextPageState": cachedLogs.NextPageState})
		return
	}

	q := initializers.DB.Query("SELECT * FROM argus_logs.logs").PageSize(limit).PageState(pageState)
	var level, message, resourceID, timestamp, traceID, spanID, commit, metadata string
	var logs []types.Log
	it := q.Iter()
	for it.Scan(&timestamp, &commit, &level, &message, &metadata, &resourceID, &spanID, &traceID) {
		metadataBytes := []byte(metadata)
		var metadataMap map[string]interface{}
		err := json.Unmarshal(metadataBytes, &metadataMap)
		if err != nil {
			fmt.Println("Error unmarshalling metadata:", err)
			continue
		}
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
	nextPageState := it.PageState()
	if err := it.Close(); err != nil {
		fmt.Println("Error closing iterator:", err)
	}
	if len(logs) == 0 {
		c.JSON(404, gin.H{"message": "No logs found"})
		return
	}
	nextPageStateStr := base64.StdEncoding.EncodeToString(nextPageState)

	go config.SetCache(searchHash+"_page_"+pageStateParam, config.LogCache{NextPageState: nextPageStateStr, Logs: logs})

	c.JSON(200, gin.H{"logs": logs, "count": len(logs), "cached": false, "nextPageState": nextPageStateStr})
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

func GetLog(c *gin.Context) {
	logID := c.Param("log_id")
	q := initializers.DB.Query("SELECT * FROM argus_logs.logs WHERE timestamp = ?", logID)
	var level, message, resourceID, timestamp, traceID, spanID, commit, metadata string
	if err := q.Scan(&timestamp, &commit, &level, &message, &metadata, &resourceID, &spanID, &traceID); err != nil {
		c.JSON(404, gin.H{"message": "Log not found"})
		return
	}
	metadataBytes := []byte(metadata)
	var metadataMap map[string]interface{}
	err := json.Unmarshal(metadataBytes, &metadataMap)
	if err != nil {
		fmt.Println("Error unmarshalling metadata:", err)
		c.JSON(500, gin.H{"message": "Error getting log"})
		return
	}
	log := types.Log{
		Level:      level,
		Message:    message,
		ResourceID: resourceID,
		Timestamp:  timestamp,
		TraceID:    traceID,
		SpanID:     spanID,
		Commit:     commit,
		Metadata:   metadataMap,
	}
	c.JSON(200, gin.H{"log": log})
}

func DeleteLog(c *gin.Context) {
	logID := c.Param("log_id")
	if logID == "" {
		c.JSON(400, gin.H{"message": "Invalid log ID"})
		return
	}

	q := initializers.DB.Query("DELETE FROM argus_logs.logs WHERE timestamp = ?", logID)
	if err := q.Exec(); err != nil {
		fmt.Println("Error deleting log:", err)
		c.JSON(500, gin.H{"message": "Error deleting log"})
		return
	}
	c.JSON(200, gin.H{"message": "Log deleted"})
}
