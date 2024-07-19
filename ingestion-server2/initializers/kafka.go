package initializers

import (
	"server/kafka"
	"server/types"
	"time"

	"github.com/rs/zerolog/log"
)

type BuffersType struct {
	LogChannel chan types.Message
}

var Buffers BuffersType
var topics = []string{"logs"}

func InitializeBuffers(names map[string]int) {
	for name, size := range names {
		switch name {
		case "LogChannel":
			Buffers.LogChannel = make(chan types.Message, size)
		}
		log.Printf("Buffer %s initialized with size %d", name, size)
	}
}

func InitializeKafka() {
	go kafka.KafkaProducer(topics, Buffers.LogChannel, 100, 100, 1*time.Second)
	log.Print("Kafka producer initialized")
}
