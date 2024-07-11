package main

import (
	"fmt"
	"server/kafka"
	loghandler "server/log-handler"
	"server/scylla"
	"sync"

	"github.com/gocql/gocql"
)

const (
	kafkaBrokerHost = "localhost:9092"
	numWorkers      = 100
)

var topics = []string{"logs"}

func main() {
	cluster := scylla.CreateCluster(gocql.Quorum, "argus_logs", "localhost")
	session, err := gocql.NewSession(*cluster)
	if err != nil {
		fmt.Println("Error connecting to ScyllaDB:", err)
		return
	}
	defer session.Close()

	logChannel := make(chan kafka.Log, 1000)

	kafka.KafkaConsumer(kafkaBrokerHost, logChannel, topics)

	for i := 0; i < numWorkers; i++ {
		go worker(logChannel, session)
	}

	select {}
}

func worker(logChannel chan kafka.Log, session *gocql.Session) {
	var wg sync.WaitGroup
	var count int

	for i := 0; i < numWorkers; i++ {
		go func() {
			for log := range logChannel {
				count++
				wg.Add(1)
				go loghandler.HandleLog(log, session, &wg)
			}
		}()
	}

	wg.Wait()
}
