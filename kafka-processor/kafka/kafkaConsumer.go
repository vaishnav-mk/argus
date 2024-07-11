package kafka

import (
	"context"
	"encoding/json"
	"fmt"

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

func KafkaConsumer(kafkaBrokerHost string, logChannel chan Log, topics []string) {
	for _, topic := range topics {
		go func(topic string) {
			reader := kafka.NewReader(kafka.ReaderConfig{
				Brokers:  []string{kafkaBrokerHost},
				Topic:    topic,
				MaxBytes: 10e6,
			})

			fmt.Printf("Number of messages in Kafka topic %s: %d\n", topic, reader.Stats().Messages)

			defer reader.Close()

			var count int

			for {
				message, err := reader.FetchMessage(context.Background())
				if err != nil {
					fmt.Printf("Error fetching message from Kafka for topic %s: %v\n", topic, err)
					continue
				}

				var log Log
				err = json.Unmarshal(message.Value, &log)
				if err != nil {
					fmt.Printf("Error decoding log from Kafka message for topic %s: %v\n", topic, err)
					continue
				}

				count++
				fmt.Println("Total logs received:", count)

				logChannel <- log

				reader.CommitMessages(context.Background(), message)
			}
		}(topic)
	}
}
