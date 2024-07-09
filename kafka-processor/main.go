package main

import (
	"fmt"
	"server/kafka"
	loghandler "server/log-handler"
	"server/scylla"

	"github.com/gocql/gocql"
)

const kafkaBrokerHost = "localhost:9092"

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
	go kafka.KafkaConsumer(kafkaBrokerHost, logChannel, topics)

	for log := range logChannel {
		loghandler.HandleLog(log, session)
	}
}
