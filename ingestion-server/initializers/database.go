package initializers

import (
	"log"
	"time"

	"github.com/gocql/gocql"
)

var DB *gocql.Session

func ConnectToScylla() *gocql.Session {
	var err error

	retryPolicy := &gocql.ExponentialBackoffRetryPolicy{
		Min:        time.Second,
		Max:        10 * time.Second,
		NumRetries: 5,
	}
	cluster := gocql.NewCluster(CONFIG.SCYLLA_HOST)
	cluster.Keyspace = CONFIG.SCYLLA_KEYSPACE
	cluster.Timeout = 5 * time.Second
	cluster.RetryPolicy = retryPolicy
	cluster.Consistency = gocql.Quorum
	cluster.PoolConfig.HostSelectionPolicy = gocql.TokenAwareHostPolicy(gocql.RoundRobinHostPolicy())

	DB, err = cluster.CreateSession()
	if err != nil {
		log.Fatal("Failed to Connect to the database: ", err)
	} else {
		log.Println("Connected to Scylla!")
	}
	return DB
}
