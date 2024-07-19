package config

import (
	"context"
	"encoding/json"
	"fmt"
	"server/initializers"
	"server/types"
)

type LogCache struct {
	NextPageState string
	Logs          []types.Log
}

var ctx = context.TODO()

func GetCache(key string) LogCache {
	data, err := initializers.RedisClient.Get(ctx, key).Result()
	if err != nil {
		fmt.Println(err)
		return LogCache{}
	}

	var logs LogCache
	err = json.Unmarshal([]byte(data), &logs)
	if err != nil {
		fmt.Println(err)
		return LogCache{}
	}

	return logs
}

func GetCacheKeys() []string {
	keys, err := initializers.RedisClient.Keys(ctx, "*").Result()
	if err != nil {
		Logger.Warnw("Failed to get cache keys", "Error", err)
		return nil
	}

	return keys
}

func SetCache(key string, logs LogCache) {
	data, err := json.Marshal(logs)
	if err != nil {
		Logger.Warnw("Failed to marshal logs", "Error", err)
	}
	if err := initializers.RedisClient.Set(ctx, key, data, initializers.CacheExpirationTime).Err(); err != nil {
		Logger.Warnw("Failed to set cache", "Error", err)
	}
}

func RemoveCache(key string) {
	err := initializers.RedisClient.Del(ctx, key).Err()
	if err != nil {
		Logger.Warnw("Failed to remove cache", "Error", err)
	}
}

func FlushCache() {
	err := initializers.RedisClient.FlushAll(ctx).Err()
	if err != nil {
		Logger.Warnw("Failed to flush cache", "Error", err)
	}
}
