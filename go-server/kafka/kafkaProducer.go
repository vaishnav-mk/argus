package kafka

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/segmentio/kafka-go"
)

type Log struct {
	Level      string `json:"level"`
	Message    string `json:"message"`
	ResourceID string `json:"resourceID"`
	Timestamp  string `json:"timestamp"`
	TraceID    string `json:"traceID"`
	SpanID     string `json:"spanID"`
	Commit     string `json:"commit"`
}

type Message struct {
	Topic   string `json:"topic"`
	Message Log    `json:"message"`
}

func KafkaProducer(topics []string, logChannel chan Message) {
	for _, topic := range topics {
		go func(topic string) {
			writer := kafka.NewWriter(kafka.WriterConfig{
				Brokers:  []string{"localhost:9092"},
				Topic:    topic,
				Balancer: &kafka.LeastBytes{},
			})

			defer writer.Close()

			for log := range logChannel {
				topic := log.Topic
				log := log.Message

				if err := WriteLogToKafka(writer, topic, log); err != nil {
					fmt.Printf("Error writing log to Kafka topic %s: %v\n", topic, err)
				}
			}
		}(topic)
	}
}

func WriteLogToKafka(writer *kafka.Writer, topic string, log Log) error {
	message, err := json.Marshal(log)
	if err != nil {
		return fmt.Errorf("error marshaling log for Kafka topic %s: %w", topic, err)
	}
	fmt.Printf("Writing message to Kafka topic %s: %s\n", topic, message)

	err = writer.WriteMessages(context.Background(),
		kafka.Message{
			Key:   []byte(log.ResourceID),
			Value: message,
		},
	)
	if err != nil {
		return fmt.Errorf("error writing message to Kafka topic %s: %w", topic, err)
	}
	return nil
}
