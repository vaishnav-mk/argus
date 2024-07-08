package main

import (
	"fmt"
	"server/kafka"
	"server/scylla"
	"strconv"
	"time"

	"github.com/gin-contrib/cors"
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

const kafkaBroker = "localhost:9092"

var topics = []string{"auth", "database", "email", "payment", "server", "services"}

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

	logChannel := make(chan kafka.Log, 100)
	kafka.KafkaProducer(topics, (chan kafka.Log)(logChannel))

	cluster := scylla.CreateCluster(gocql.Quorum, "argus_logs", "localhost")
	session, err := gocql.NewSession(*cluster)

	if err != nil {
		fmt.Println("Error connecting to ScyllaDB:", err)
		return
	}
	defer session.Close()

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

		logChannel <- kafka.Log(log)

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
