export interface WeatherData {
  condition: 'sunny' | 'rainy' | 'cloudy' | 'hot' | 'cool' | 'humid'
  temperature: number
  humidity: number
  description: string
  recommendations: string[]
  source: 'cache' | 'openweather' | 'weatherapi' | 'fallback'
  timestamp: number
}

export interface WeatherAPIResponse {
  main: {
    temp: number
    humidity: number
  }
  weather: Array<{
    main: string
    description: string
  }>
}

export interface WeatherAPIComResponse {
  current: {
    temp_c: number
    humidity: number
    condition: {
      text: string
    }
  }
}

export interface CachedWeatherData extends WeatherData {
  cacheKey: string
  expiresAt: number
}