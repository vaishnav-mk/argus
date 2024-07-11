package loghandler

import (
	"encoding/json"
	"fmt"
	"server/kafka"
	"sync"

	"github.com/gocql/gocql"
)

// var metadataLock sync.Mutex

// func hashLog(log kafka.Log) string {
// 	hasher := sha256.New()
// 	hasher.Write([]byte(fmt.Sprintf("%s:%s", log.TraceID, log.SpanID)))
// 	return hex.EncodeToString(hasher.Sum(nil))
// }

// func saveMetadataToFile(metadata map[string]string, hash string) error {
// 	metadataLock.Lock()
// 	defer metadataLock.Unlock()

// 	fileName := "metadata.json"
// 	var metadataMap map[string]map[string]string

// 	file, err := os.Open(fileName)
// 	if err != nil {
// 		if !os.IsNotExist(err) {
// 			return err
// 		}
// 		metadataMap = make(map[string]map[string]string)
// 	} else {
// 		defer file.Close()
// 		decoder := json.NewDecoder(file)
// 		err = decoder.Decode(&metadataMap)
// 		if err != nil {
// 			return err
// 		}
// 	}

// 	metadataMap[hash] = metadata

// 	file, err = os.Create(fileName)
// 	if err != nil {
// 		return err
// 	}
// 	defer file.Close()

// 	encoder := json.NewEncoder(file)
// 	return encoder.Encode(metadataMap)
// }

func insertLogToScylla(session *gocql.Session, log kafka.Log) error {
	var stringifiedMetadata string

	if log.Metadata != nil && len(log.Metadata) > 0 {
		metadataBytes, err := json.Marshal(log.Metadata)
		if err != nil {
			fmt.Printf("Error marshaling metadata: %v\n", err)
			return err
		}
		stringifiedMetadata = string(metadataBytes)
	}

	err := session.Query(`INSERT INTO argus_logs.logs (trace_id, span_id, level, message, resource_id, timestamp, commit, metadata) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
		log.TraceID, log.SpanID, log.Level, log.Message, log.ResourceID, log.Timestamp, log.Commit, stringifiedMetadata).Exec()
	if err != nil {
		fmt.Printf("Error inserting log to ScyllaDB: %v\n", err)
		return err
	}
	fmt.Println("Log inserted to ScyllaDB", log.Timestamp)
	return nil
}

func HandleLog(log kafka.Log, session *gocql.Session, wg *sync.WaitGroup) {
	// fmt.Println("processing", log.SpanID)
	defer wg.Done()
	// hash := hashLog(log)

	// err := saveMetadataToFile(log.Metadata, hash)
	// if err != nil {
	// 	fmt.Printf("Error saving metadata to file: %v\n", err)
	// 	return
	// }

	err := insertLogToScylla(session, log)
	if err != nil {
		fmt.Printf("Error inserting log to ScyllaDB: %v\n", err)
	}
}
