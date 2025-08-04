# External APIs & Integration Architecture

## Weather API Integration Strategy

**Primary API Configuration:**
- **OpenWeatherMap API** - Free tier: 1,000 calls/day
- **WeatherAPI.com** - Backup service: 1M calls/month
- **Upstash Redis** - Caching layer: 10,000 commands/day free

**Security & Credential Management:**
```typescript
// Environment Variables Strategy
OPENWEATHER_API_KEY=your_primary_key
WEATHERAPI_KEY=your_backup_key  
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

**Rate Limiting & Caching:**
- 30-minute cache for weather data per location
- 60 API calls per hour per IP address limit
- Automatic failover between primary and backup APIs
- Seasonal defaults for complete API failures

**Fallback Mechanisms:**
1. **Cache First** - Check Redis cache for recent data
2. **Primary API** - OpenWeatherMap for fresh data  
3. **Backup API** - WeatherAPI.com if primary fails
4. **Seasonal Defaults** - Bangalore weather patterns if all APIs fail
5. **Manual Entry** - User-provided weather as last resort

**Integration Points:**
```typescript
// API Route Implementation
GET /api/weather?lat=12.9716&lon=77.5946
Response: {
  condition: 'clear' | 'rain' | 'cloudy' | 'storm',
  temperature: number,
  humidity: number,
  fallback: boolean,
  source: 'api' | 'cache' | 'manual' | 'default',
  recommendations: string[]
}
```

## Weather API Implementation Example

```typescript
// app/api/weather/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCachedWeather, cacheWeather, checkRateLimit } from '@/lib/weather/cache';

const API_KEYS = {
  primary: process.env.OPENWEATHER_API_KEY!,
  backup: process.env.WEATHERAPI_KEY!,
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  
  if (!lat || !lon) {
    return NextResponse.json(
      { error: 'Latitude and longitude coordinates required' }, 
      { status: 400 }
    );
  }

  // Rate limiting check
  const isRateLimited = await checkRateLimit(request);
  if (isRateLimited) {
    return NextResponse.json(
      { error: 'Rate limit exceeded', fallback: 'manual' }, 
      { status: 429 }
    );
  }

  // Check cache first
  const cached = await getCachedWeather(parseFloat(lat), parseFloat(lon));
  if (cached && !isStale(cached)) {
    return NextResponse.json({ ...cached, source: 'cache' });
  }

  // Primary API attempt
  try {
    const weather = await fetchWeatherData(lat, lon, 'primary');
    await cacheWeather(parseFloat(lat), parseFloat(lon), weather);
    return NextResponse.json({ ...weather, source: 'api', fallback: false });
  } catch (error) {
    console.warn('Primary weather API failed:', error);
    
    // Fallback to secondary API
    try {
      const weather = await fetchWeatherData(lat, lon, 'backup');
      await cacheWeather(parseFloat(lat), parseFloat(lon), weather);
      return NextResponse.json({ ...weather, source: 'api', fallback: false });
    } catch (backupError) {
      console.warn('Backup weather API failed:', backupError);
      
      // Graceful degradation with seasonal defaults
      const seasonalWeather = getSeasonalDefault();
      return NextResponse.json({
        ...seasonalWeather,
        source: 'default',
        fallback: true,
        message: 'Weather data temporarily unavailable - showing seasonal suggestions'
      });
    }
  }
}

async function fetchWeatherData(lat: string, lon: string, apiType: 'primary' | 'backup') {
  if (apiType === 'primary') {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEYS.primary}&units=metric`,
      { next: { revalidate: 1800 } } // 30 minutes
    );
    
    if (!response.ok) throw new Error(`OpenWeatherMap API error: ${response.status}`);
    
    const data = await response.json();
    return transformOpenWeatherResponse(data);
  } else {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEYS.backup}&q=${lat},${lon}`,
      { next: { revalidate: 1800 } }
    );
    
    if (!response.ok) throw new Error(`WeatherAPI error: ${response.status}`);
    
    const data = await response.json();
    return transformWeatherAPIResponse(data);
  }
}

function getSeasonalDefault() {
  const month = new Date().getMonth();
  
  // Bangalore seasonal patterns
  if (month >= 5 && month <= 9) { // Monsoon (June-October)
    return {
      condition: 'rain' as const,
      temperature: 24,
      humidity: 80,
      recommendations: [
        'Consider covered routes like Commercial Street', 
        'Indoor activities recommended - malls and cafes',
        'Umbrella essential for outdoor exploration'
      ]
    };
  } else if (month >= 2 && month <= 4) { // Summer (March-May)
    return {
      condition: 'clear' as const,
      temperature: 28,
      humidity: 60,
      recommendations: [
        'Stay hydrated during exploration', 
        'Early morning (7-10am) or evening (5-8pm) visits recommended',
        'Seek shade during midday hours'
      ]
    };
  } else { // Winter (November-February)
    return {
      condition: 'clear' as const,
      temperature: 22,
      humidity: 70,
      recommendations: [
        'Perfect weather for exploration', 
        'All outdoor activities suitable',
        'Great for walking tours and photography'
      ]
    };
  }
}

function isStale(cachedData: any): boolean {
  const cacheAge = Date.now() - new Date(cachedData.timestamp).getTime();
  return cacheAge > 30 * 60 * 1000; // 30 minutes
}
```

## Redis Caching Implementation

```typescript
// lib/weather/cache.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function getCachedWeather(lat: number, lon: number) {
  const key = `weather:${lat.toFixed(4)}:${lon.toFixed(4)}`;
  try {
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached as string) : null;
  } catch (error) {
    console.warn('Redis cache read error:', error);
    return null;
  }
}

export async function cacheWeather(lat: number, lon: number, data: any) {
  const key = `weather:${lat.toFixed(4)}:${lon.toFixed(4)}`;
  const weatherData = {
    ...data,
    timestamp: new Date().toISOString()
  };
  
  try {
    // Cache for 30 minutes (1800 seconds)
    await redis.setex(key, 1800, JSON.stringify(weatherData));
  } catch (error) {
    console.warn('Redis cache write error:', error);
  }
}

export async function checkRateLimit(request: NextRequest): Promise<boolean> {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
  const key = `rate_limit:${ip}`;
  
  try {
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, 3600); // 1 hour window
    }
    
    return current > 60; // 60 calls per hour per IP
  } catch (error) {
    console.warn('Rate limiting error:', error);
    return false; // Allow on Redis errors
  }
}
```

## Error Handling & Monitoring

```typescript
// lib/weather/monitoring.ts
export function logWeatherAPIUsage(
  apiType: 'primary' | 'backup' | 'cache' | 'default',
  success: boolean,
  responseTime?: number
) {
  console.log(`Weather API: ${apiType} - ${success ? 'SUCCESS' : 'FAILURE'}`, {
    timestamp: new Date().toISOString(),
    apiType,
    success,
    responseTime,
    location: 'Indiranagar, Bangalore'
  });
  
  // In production, send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Send to Vercel Analytics or Sentry
  }
}

export function alertOnRepeatedFailures(failureCount: number) {
  if (failureCount >= 3) {
    console.error('Weather API: Multiple consecutive failures detected', {
      failureCount,
      timestamp: new Date().toISOString(),
      action: 'Consider switching to backup service'
    });
  }
}
```

## Environment Variable Setup Guide

**Required API Accounts:**
1. **OpenWeatherMap** (Primary)
   - Sign up at: https://openweathermap.org/api
   - Free tier: 1,000 calls/day
   - Get API key from dashboard

2. **WeatherAPI.com** (Backup)
   - Sign up at: https://www.weatherapi.com/
   - Free tier: 1M calls/month
   - Get API key from account settings

3. **Upstash Redis** (Caching)
   - Sign up at: https://upstash.com/
   - Free tier: 10,000 commands/day
   - Create database and get REST URL + Token

**Environment Configuration:**
```bash
# .env.local (Development)
OPENWEATHER_API_KEY=your_openweather_api_key_here
WEATHERAPI_KEY=your_weatherapi_key_here
UPSTASH_REDIS_REST_URL=https://your-redis-endpoint.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here

# Vercel Environment Variables (Production)
# Add these through Vercel dashboard or CLI
vercel env add OPENWEATHER_API_KEY
vercel env add WEATHERAPI_KEY
vercel env add UPSTASH_REDIS_REST_URL
vercel env add UPSTASH_REDIS_REST_TOKEN
```

This external API integration architecture ensures reliable weather-aware functionality while maintaining free hosting constraints and providing enterprise-grade reliability through multiple fallback layers.