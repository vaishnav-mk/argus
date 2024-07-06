package main

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/segmentio/kafka-go"
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

var startTime time.Time

func uptime() time.Duration {
	return time.Since(startTime)
}

func init() {
	startTime = time.Now()
}

func main() {
	router := gin.Default()

	topic := "logs"
	partition := 0
	conn, err := connect(topic, partition)

	if err != nil {
		fmt.Println("Error connecting to Kafka:", err)
		return
	}
	defer conn.Close()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE"}
	router.Use(cors.New(config))

	router.POST("/log", func(c *gin.Context) {
		var log Log
		if err := c.BindJSON(&log); err != nil {
			c.JSON(400, gin.H{"message": "Invalid log"})
			return
		}

		if log.Timestamp == "" {
			c.JSON(400, gin.H{"message": "Invalid log"})
			return
		}

		produce(conn, log)
		c.JSON(202, gin.H{"message": "Log received"})
	})

	router.GET("/logs", func(c *gin.Context) {
		logs := consume(conn)

		if len(logs) == 0 {
			c.JSON(200, gin.H{"message": "No logs available"})
			return
		}

		c.JSON(200, gin.H{"logs": logs, "count": len(logs)})
	})

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Server is running",
			"uptime":  uptime().String(),
		})
	})

	router.GET("/logs/count", func(c *gin.Context) {
		count, err := getLogCount(conn)
		if err != nil {
			c.JSON(500, gin.H{"message": "Error getting log count"})
			return
		}

		c.JSON(200, gin.H{"count": count})
	})

	fmt.Println("Server is running")
	if err := router.Run(":5000"); err != nil {
		fmt.Println("Error starting server:", err)
	}
}

func connect(topic string, partition int) (*kafka.Conn, error) {
	conn, err := kafka.DialLeader(context.Background(), "tcp", "localhost:9092", topic, partition)
	if err != nil {
		fmt.Println("Error connecting to Kafka:", err)
		return nil, err
	}
	return conn, nil
}

func produce(conn *kafka.Conn, log Log) {
	conn.SetWriteDeadline(time.Now().Add(10 * time.Second))

	data, err := json.Marshal(log)
	if err != nil {
		fmt.Println("Error marshaling log:", err)
		return
	}

	_, err = conn.WriteMessages(
		kafka.Message{Value: data},
	)
	if err != nil {
		fmt.Println("Error producing message:", err)
	}
}

func consume(conn *kafka.Conn) []Log {
	conn.SetReadDeadline(time.Now().Add(10 * time.Second))
	batch := conn.ReadBatch(10e3, 5e6) // 10KB min/max size

	defer batch.Close()

	var logs []Log
	buffer := make([]byte, 5e6) // 5MB max message size

	for {
		msgSize, err := batch.Read(buffer)
		if err != nil {
			if err.Error() != "EOF" {
				fmt.Println("Error consuming message:", err)
			}
			break
		}

		var log Log
		if err := json.Unmarshal(buffer[:msgSize], &log); err != nil {
			fmt.Println("Error unmarshaling log:", err)
			fmt.Println(string(buffer[:msgSize]))
			continue
		}
		logs = append(logs, log)
	}

	return logs
}

func getLogCount(conn *kafka.Conn) (int, error) {
	conn.SetReadDeadline(time.Now().Add(10 * time.Second))
	startOffset, err := conn.ReadFirstOffset()
	if err != nil {
		fmt.Println("Error getting first offset:", err)
	}
	endOffset, err := conn.ReadLastOffset()
	if err != nil {
		fmt.Println("Error getting last offset:", err)
	}
	return int(endOffset - startOffset), nil
}
