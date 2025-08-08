import { Redis } from '@upstash/redis';

// Determine if we should use Upstash (cloud) or IORedis (local)
const useUpstash = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

export function getRedisClient() {
  // Always use Upstash for serverless compatibility
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.log('🌐 Using Upstash Redis (Cloud)');
    return new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  } else {
    console.log('⚠️ Redis not configured - queue features disabled');
    return null;
  }
}