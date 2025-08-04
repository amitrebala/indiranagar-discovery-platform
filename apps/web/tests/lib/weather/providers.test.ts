import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchFromOpenWeatherMap, fetchFromWeatherAPI, getFallbackWeather } from '@/lib/weather/providers'

// Mock environment variables
vi.mock('process', () => ({
  env: {
    OPENWEATHER_API_KEY: 'test-openweather-key',
    WEATHERAPI_KEY: 'test-weatherapi-key'
  }
}))

describe('Weather Providers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchFromOpenWeatherMap', () => {
    it('should fetch weather data successfully', async () => {
      const result = await fetchFromOpenWeatherMap(12.975, 77.615)
      
      expect(result).toBeDefined()
      expect(result?.source).toBe('openweather')
      expect(result?.temperature).toBe(25)
      expect(result?.condition).toBeDefined()
      expect(result?.recommendations).toBeInstanceOf(Array)
    })

    it('should return null when API key is missing', async () => {
      vi.stubEnv('OPENWEATHER_API_KEY', '')
      
      const result = await fetchFromOpenWeatherMap(12.975, 77.615)
      expect(result).toBeNull()
    })
  })

  describe('fetchFromWeatherAPI', () => {
    it('should fetch weather data successfully', async () => {
      const result = await fetchFromWeatherAPI(12.975, 77.615)
      
      expect(result).toBeDefined()
      expect(result?.source).toBe('weatherapi')
      expect(result?.temperature).toBe(25)
      expect(result?.condition).toBeDefined()
    })

    it('should return null when API key is missing', async () => {
      vi.stubEnv('WEATHERAPI_KEY', '')
      
      const result = await fetchFromWeatherAPI(12.975, 77.615)
      expect(result).toBeNull()
    })
  })

  describe('getFallbackWeather', () => {
    it('should return fallback weather data', () => {
      const result = getFallbackWeather(12.975, 77.615)
      
      expect(result).toBeDefined()
      expect(result.source).toBe('fallback')
      expect(result.temperature).toBeGreaterThan(0)
      expect(result.condition).toBeDefined()
      expect(result.recommendations).toBeInstanceOf(Array)
      expect(result.recommendations.length).toBeGreaterThan(0)
    })

    it('should return seasonal weather patterns', () => {
      // Test different months
      const originalDate = Date
      
      // Mock January (winter)
      vi.setSystemTime(new Date('2024-01-15'))
      const winterWeather = getFallbackWeather(12.975, 77.615)
      expect(winterWeather.condition).toBe('cool')
      expect(winterWeather.temperature).toBe(22)
      
      // Mock June (monsoon)
      vi.setSystemTime(new Date('2024-06-15'))
      const monsoonWeather = getFallbackWeather(12.975, 77.615)
      expect(monsoonWeather.condition).toBe('rainy')
      expect(monsoonWeather.temperature).toBe(23)
      
      // Mock April (summer)
      vi.setSystemTime(new Date('2024-04-15'))
      const summerWeather = getFallbackWeather(12.975, 77.615)
      expect(summerWeather.condition).toBe('hot')
      expect(summerWeather.temperature).toBe(30)
    })
  })
})