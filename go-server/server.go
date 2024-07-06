package main

import (
	"context"
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

		produce(conn, []string{fmt.Sprintf("%v", log)})
		c.JSON(200, gin.H{"message": "Log received"})
	})

	router.GET("/log", func(c *gin.Context) {
		minSize := 0
		maxSize := 1
		logs := consume(conn, minSize, maxSize)

		if len(logs) == 0 {
			c.JSON(200, gin.H{"message": "No logs available"})
			return
		}

		c.JSON(200, gin.H{"logs": logs})
	})

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Server is running",
			"uptime":  uptime().String(),
		})
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

func produce(conn *kafka.Conn, msgs []string) {
	conn.SetWriteDeadline(time.Now().Add(10 * time.Second))

	for _, msg := range msgs {
		_, err := conn.WriteMessages(
			kafka.Message{Value: []byte(msg)},
		)
		if err != nil {
			fmt.Println("Error producing message:", err)
		}
	}
}

func consume(conn *kafka.Conn, minSize int, maxSize int) []string {
	conn.SetReadDeadline(time.Now().Add(10 * time.Second))
	batch := conn.ReadBatch(minSize, maxSize)

	defer batch.Close()

	var logs []string
	buffer := make([]byte, 10e3) // 10KB

	for {
		msgSize, err := batch.Read(buffer)
		if err != nil {
			fmt.Println("Error consuming message:", err)
			break
		}
		logs = append(logs, string(buffer[:msgSize]))
	}

	return logs
}
