import { Redis } from '@upstash/redis';

let redisClient: Redis | null = null;

export function getRedisClient(): Redis {
    if (redisClient) return redisClient;

    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        throw new Error('Redis environment variables are missing. Please add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to your .env.local file.');
    }

    redisClient = new Redis({ url, token });
    return redisClient;
}
