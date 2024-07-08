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

func KafkaProducer(topics []string, logChannel chan Log) {
	for _, topic := range topics {
		go func(topic string) {
			writer := kafka.NewWriter(kafka.WriterConfig{
				Brokers:  []string{"localhost:9092"},
				Topic:    topic,
				Balancer: &kafka.LeastBytes{},
			})

			defer writer.Close()

			for log := range logChannel {
				message, err := json.Marshal(log)
				if err != nil {
					fmt.Printf("Error marshaling log for Kafka topic %s: %v\n", topic, err)
					continue
				}
				fmt.Printf("Writing message to Kafka topic %s: %s\n", topic, message)

				err = writer.WriteMessages(context.Background(),
					kafka.Message{
						Key:   []byte(log.ResourceID),
						Value: message,
					},
				)
				if err != nil {
					fmt.Printf("Error writing message to Kafka topic %s: %v\n", topic, err)
				}
			}
		}(topic)
	}
}
