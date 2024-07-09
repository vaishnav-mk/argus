package loghandler

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"os"
	"server/kafka"
	"sync"

	"github.com/gocql/gocql"
)

var metadataLock sync.Mutex

func hashLog(log kafka.Log) string {
	hasher := sha256.New()
	hasher.Write([]byte(fmt.Sprintf("%s:%s", log.TraceID, log.SpanID)))
	return hex.EncodeToString(hasher.Sum(nil))
}

func saveMetadataToFile(metadata map[string]string, hash string) error {
	metadataLock.Lock()
	defer metadataLock.Unlock()

	fileName := "metadata.json"
	var metadataMap map[string]map[string]string

	file, err := os.Open(fileName)
	if err != nil {
		if !os.IsNotExist(err) {
			return err
		}
		metadataMap = make(map[string]map[string]string)
	} else {
		defer file.Close()
		decoder := json.NewDecoder(file)
		err = decoder.Decode(&metadataMap)
		if err != nil {
			return err
		}
	}

	metadataMap[hash] = metadata

	file, err = os.Create(fileName)
	if err != nil {
		return err
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	return encoder.Encode(metadataMap)
}

func insertLogToScylla(session *gocql.Session, log kafka.Log, hash string) error {
	query := `INSERT INTO argus_logs.logs (trace_id, span_id, level, message, resource_id, timestamp, commit, metadata_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
	return session.Query(query, log.TraceID, log.SpanID, log.Level, log.Message, log.ResourceID, log.Timestamp, log.Commit, hash).Exec()
}

func HandleLog(log kafka.Log, session *gocql.Session) {
	fmt.Printf("Handling log: %+v\n", log)

	hash := hashLog(log)

	err := saveMetadataToFile(log.Metadata, hash)
	if err != nil {
		fmt.Printf("Error saving metadata to file: %v\n", err)
		return
	}

	err = insertLogToScylla(session, log, hash)
	if err != nil {
		fmt.Printf("Error inserting log to ScyllaDB: %v\n", err)
	}
}
