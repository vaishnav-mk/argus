package main

import (
	"fmt"
	"server/kafka"
	"server/scylla"
	"slices"
	"strconv"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gocql/gocql"
)

var topics = []string{"logs"}

var startTime time.Time

func uptime() time.Duration {
	return time.Since(startTime)
}

func init() {
	startTime = time.Now()
}

func main() {
	router := gin.Default()
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE"}
	router.Use(cors.New(config))

	logChannel := make(chan kafka.Message, 100)
	go kafka.KafkaProducer(topics, logChannel, 100, 100, 1*time.Second)

	cluster := scylla.CreateCluster(gocql.Quorum, "argus_logs", "localhost")
	session, err := gocql.NewSession(*cluster)

	if err != nil {
		fmt.Println("Error connecting to ScyllaDB:", err)
		return
	}
	defer session.Close()

	router.POST("/log/:topic", func(c *gin.Context) {
		topic := c.Param("topic")

		if !slices.Contains(topics, topic) {
			c.JSON(400, gin.H{"message": "Invalid topic"})
			return
		}

		var log kafka.Log
		if err := c.BindJSON(&log); err != nil {
			c.JSON(400, gin.H{"message": "Invalid log"})
			return
		}

		if log.Timestamp == "" {
			c.JSON(400, gin.H{"message": "Invalid log"})
			return
		}

		fmt.Printf("Received log: %+v\n", log)

		logChannel <- kafka.Message{
			Topic:   topic,
			Message: log,
		}

		c.JSON(202, gin.H{"message": "Log received"})
	})

	router.GET("/logs/:x", func(c *gin.Context) {
		x := c.Param("x")
		MaxFetch, err := strconv.Atoi(x)
		if err != nil {
			c.JSON(400, gin.H{"message": "Invalid query parameter"})
			return
		}
		scylla.GetLogs(session, c, MaxFetch)
	})

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Server is running",
			"uptime":  uptime().String(),
		})
	})

	router.GET("/logs/count", func(c *gin.Context) { scylla.CountLogs(session, c) })

	fmt.Println("Server is running")
	if err := router.Run(":5000"); err != nil {
		fmt.Println("Error starting server:", err)
	}
}
