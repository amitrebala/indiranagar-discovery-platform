import { WeatherData, CachedWeatherData } from './types'

// In-memory cache for development (replace with Redis in production)
const weatherCache = new Map<string, CachedWeatherData>()

export function generateCacheKey(lat: number, lng: number): string {
  return `weather_${lat.toFixed(3)}_${lng.toFixed(3)}`
}

export function getCachedWeather(lat: number, lng: number): WeatherData | null {
  const cacheKey = generateCacheKey(lat, lng)
  const cached = weatherCache.get(cacheKey)
  
  if (!cached) return null
  
  // Check if cache is expired (30 minutes)
  if (Date.now() > cached.expiresAt) {
    weatherCache.delete(cacheKey)
    return null
  }
  
  return {
    condition: cached.condition,
    temperature: cached.temperature,
    humidity: cached.humidity,
    description: cached.description,
    recommendations: cached.recommendations,
    source: 'cache',
    timestamp: cached.timestamp
  }
}

export function setCachedWeather(lat: number, lng: number, weatherData: Omit<WeatherData, 'source'>): void {
  const cacheKey = generateCacheKey(lat, lng)
  const expiresAt = Date.now() + (30 * 60 * 1000) // 30 minutes
  
  const cachedData: CachedWeatherData = {
    ...weatherData,
    source: 'cache',
    cacheKey,
    expiresAt
  }
  
  weatherCache.set(cacheKey, cachedData)
}

export function clearWeatherCache(): void {
  weatherCache.clear()
}

export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: weatherCache.size,
    keys: Array.from(weatherCache.keys())
  }
}