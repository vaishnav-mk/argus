package kafka

import (
	"context"
	"encoding/json"
	"fmt"
	"server/types"
	"sync"
	"time"

	"github.com/segmentio/kafka-go"
)

func KafkaProducer(topics []string, logChannel chan types.Message, numWorkers int, batchSize int, batchTimeout time.Duration) {
	var wg sync.WaitGroup

	for _, topic := range topics {
		writer := kafka.NewWriter(kafka.WriterConfig{
			Brokers:  []string{"localhost:9092"},
			Topic:    topic,
			Balancer: &kafka.LeastBytes{},
		})

		defer writer.Close()

		for i := 0; i < numWorkers; i++ {
			wg.Add(1)
			go worker(writer, logChannel, &wg, batchSize, batchTimeout)
		}
	}

	wg.Wait()
}

func worker(writer *kafka.Writer, logChannel chan types.Message, wg *sync.WaitGroup, batchSize int, batchTimeout time.Duration) {
	defer wg.Done()
	batch := make([]kafka.Message, 0, batchSize)
	timer := time.NewTimer(batchTimeout)

	for {
		select {
		case log := <-logChannel:
			topic := log.Topic
			message, err := json.Marshal(log.Message)
			if err != nil {
				fmt.Printf("Error marshaling log for Kafka topic %s: %v\n", topic, err)
				continue
			}

			batch = append(batch, kafka.Message{
				Key:   []byte(log.Message.Timestamp),
				Value: message,
			})

			fmt.Printf("Total logs in batch for Kafka topic %s: %d\n", topic, len(batch))
			fmt.Printf("Total logs in channel: %d\n", len(logChannel))
			fmt.Printf("Total logs in writer: %d\n", writer.Stats().Writes)
			fmt.Printf("Log: %v\n", log.Message)

			if len(batch) == batchSize || timer.C != nil {
				err := writeToKafka(writer, batch)
				if err != nil {
					fmt.Printf("Error writing batch to Kafka topic %s: %v\n", topic, err)
				}
				batch = make([]kafka.Message, 0, batchSize)
				timer.Reset(batchTimeout)
			}

		case <-timer.C:
			if len(batch) > 0 {
				err := writeToKafka(writer, batch)
				if err != nil {
					fmt.Printf("Error writing batch to Kafka topic %s: %v\n", batch[0].Topic, err)
				}
				batch = make([]kafka.Message, 0, batchSize)
			}
		}
	}
}

func writeToKafka(writer *kafka.Writer, batch []kafka.Message) error {
	err := writer.WriteMessages(context.Background(), batch...)
	if err != nil {
		return fmt.Errorf("error writing message to Kafka topic: %w", err)
	}
	return nil
}
