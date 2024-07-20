package initializers

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

var RedisClient *redis.Client

var ctx = context.TODO()

var CacheExpirationTime = time.Second * 30 // cache for 30 seconds

func ConnectToCache() {
	RedisClient = redis.NewClient(&redis.Options{
		Addr:     CONFIG.REDIS_HOST + ":" + CONFIG.REDIS_PORT,
		DB:       0,
		PoolSize: 1000,
	})

	if err := RedisClient.Ping(ctx).Err(); err != nil {
		fmt.Println("Redis connection Error: %v", err)
	} else {
		fmt.Println("Connected to redis!")
	}
}
