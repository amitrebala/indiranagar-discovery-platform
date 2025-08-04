import { describe, it, expect, beforeEach } from 'vitest'
import { 
  getCachedWeather, 
  setCachedWeather, 
  generateCacheKey, 
  clearWeatherCache,
  getCacheStats 
} from '@/lib/weather/cache'

describe('Weather Cache', () => {
  beforeEach(() => {
    clearWeatherCache()
  })

  describe('generateCacheKey', () => {
    it('should generate consistent cache keys', () => {
      const key1 = generateCacheKey(12.975, 77.615)
      const key2 = generateCacheKey(12.975, 77.615)
      
      expect(key1).toBe(key2)
      expect(key1).toBe('weather_12.975_77.615')
    })

    it('should generate different keys for different coordinates', () => {
      const key1 = generateCacheKey(12.975, 77.615)
      const key2 = generateCacheKey(12.976, 77.615)
      
      expect(key1).not.toBe(key2)
    })
  })

  describe('setCachedWeather and getCachedWeather', () => {
    const mockWeatherData = {
      condition: 'sunny' as const,
      temperature: 25,
      humidity: 65,
      description: 'Clear sky',
      recommendations: ['Perfect weather!'],
      timestamp: Date.now()
    }

    it('should cache and retrieve weather data', () => {
      setCachedWeather(12.975, 77.615, mockWeatherData)
      const cached = getCachedWeather(12.975, 77.615)
      
      expect(cached).toBeDefined()
      expect(cached?.condition).toBe('sunny')
      expect(cached?.temperature).toBe(25)
      expect(cached?.source).toBe('cache')
    })

    it('should return null for non-existent cache', () => {
      const cached = getCachedWeather(12.975, 77.615)
      expect(cached).toBeNull()
    })

    it('should handle cache expiration', () => {
      // Mock Date.now to simulate time passing
      const originalNow = Date.now
      const startTime = 1000000
      
      Date.now = vi.fn(() => startTime)
      setCachedWeather(12.975, 77.615, mockWeatherData)
      
      // Simulate 35 minutes later (cache expires after 30 minutes)
      Date.now = vi.fn(() => startTime + (35 * 60 * 1000))
      
      const cached = getCachedWeather(12.975, 77.615)
      expect(cached).toBeNull()
      
      // Restore Date.now
      Date.now = originalNow
    })
  })

  describe('clearWeatherCache', () => {
    it('should clear all cached data', () => {
      const mockWeatherData = {
        condition: 'sunny' as const,
        temperature: 25,
        humidity: 65,
        description: 'Clear sky',  
        recommendations: ['Perfect weather!'],
        timestamp: Date.now()
      }

      setCachedWeather(12.975, 77.615, mockWeatherData)
      setCachedWeather(12.976, 77.616, mockWeatherData)
      
      expect(getCacheStats().size).toBe(2)
      
      clearWeatherCache()
      
      expect(getCacheStats().size).toBe(0)
      expect(getCachedWeather(12.975, 77.615)).toBeNull()
    })
  })

  describe('getCacheStats', () => {
    it('should return accurate cache statistics', () => {
      const mockWeatherData = {
        condition: 'sunny' as const,
        temperature: 25,
        humidity: 65,
        description: 'Clear sky',
        recommendations: ['Perfect weather!'],
        timestamp: Date.now()
      }

      expect(getCacheStats().size).toBe(0)
      
      setCachedWeather(12.975, 77.615, mockWeatherData)
      setCachedWeather(12.976, 77.616, mockWeatherData)
      
      const stats = getCacheStats()
      expect(stats.size).toBe(2)
      expect(stats.keys).toContain('weather_12.975_77.615')
      expect(stats.keys).toContain('weather_12.976_77.616')
    })
  })
})