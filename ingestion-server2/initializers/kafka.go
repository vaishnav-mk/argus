package initializers

import (
	"fmt"
	"server/kafka"
	"server/types"
	"time"
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
		fmt.Println("Buffer initialized: ", name)
	}

	fmt.Println("Buffers initialized")
}

func InitializeKafka() {
	go kafka.KafkaProducer(topics, Buffers.LogChannel, 100, 100, 1*time.Second)
}
