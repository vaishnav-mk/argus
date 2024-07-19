package config

import (
	"context"
	"encoding/json"
	"server/initializers"
	"server/types"
)

var ctx = context.TODO()

func GetCache(key string) []types.Log {
	data, err := initializers.RedisClient.Get(ctx, key).Result()
	if err != nil {
		Logger.Warnw("Failed to get cache", "Error", err)
		return nil
	}

	var logs []types.Log
	if err := json.Unmarshal([]byte(data), &logs); err != nil {
		Logger.Warnw("Failed to unmarshal logs", "Error", err)
		return nil
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

func SetCache(key string, logs []types.Log) {
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
