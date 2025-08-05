# 7. CACHING STRATEGY

## 7.1 Cache Layers
```typescript
// lib/cache/index.ts
export class CacheManager {
  // Memory cache for admin dashboard
  private static memoryCache = new Map<string, CacheEntry>();
  
  // Redis for analytics (optional, fallback to memory)
  private static redis = process.env.REDIS_URL 
    ? new Redis(process.env.REDIS_URL)
    : null;
  
  static async get(key: string): Promise<any> {
    // Check memory first
    const memEntry = this.memoryCache.get(key);
    if (memEntry && memEntry.expires > Date.now()) {
      return memEntry.data;
    }
    
    // Check Redis if available
    if (this.redis) {
      const data = await this.redis.get(key);
      if (data) return JSON.parse(data);
    }
    
    return null;
  }
  
  static async set(key: string, data: any, ttl: number = 300) {
    // Set in memory
    this.memoryCache.set(key, {
      data,
      expires: Date.now() + (ttl * 1000)
    });
    
    // Set in Redis if available
    if (this.redis) {
      await this.redis.setex(key, ttl, JSON.stringify(data));
    }
  }
}
```

## 7.2 Cache Keys Strategy
```typescript
const CacheKeys = {
  // Admin dashboard
  DASHBOARD_STATS: 'admin:dashboard:stats',
  PLACES_LIST: (filters: string) => `admin:places:${filters}`,
  
  // Public data
  PLACE_RATINGS: (id: string) => `ratings:place:${id}`,
  COMMENTS: (entity: string, id: string) => `comments:${entity}:${id}`,
  
  // Analytics
  ANALYTICS_DAILY: (date: string) => `analytics:daily:${date}`,
  SEARCH_TRENDS: 'analytics:search:trends'
};
```

---
