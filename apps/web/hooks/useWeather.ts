'use client'

import { useState, useEffect } from 'react'

export interface WeatherData {
  temperature: number
  condition: 'sunny' | 'rainy' | 'cloudy' | 'partly-cloudy'
  description: string
  humidity: number
  windSpeed: number
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setIsLoading(true)
        
        // Call the weather API endpoint
        const response = await fetch('/api/weather')
        
        if (!response.ok) {
          throw new Error('Failed to fetch weather data')
        }
        
        const data = await response.json()
        
        // Transform the API response to our WeatherData format
        const weatherData: WeatherData = {
          temperature: Math.round(data.temperature),
          condition: mapWeatherCondition(data.weather),
          description: data.description,
          humidity: data.humidity,
          windSpeed: data.windSpeed
        }
        
        setWeather(weatherData)
        setError(null)
      } catch (err) {
        console.error('Error fetching weather:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch weather')
        
        // Set default weather data as fallback
        setWeather({
          temperature: 25,
          condition: 'sunny',
          description: 'Clear sky',
          humidity: 65,
          windSpeed: 10
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchWeather()
    // Update weather every 10 minutes
    const interval = setInterval(fetchWeather, 600000)
    
    return () => clearInterval(interval)
  }, [])
  
  return { weather, isLoading, error }
}

function mapWeatherCondition(weather: string): WeatherData['condition'] {
  const condition = weather.toLowerCase()
  
  if (condition.includes('rain') || condition.includes('drizzle')) {
    return 'rainy'
  }
  if (condition.includes('cloud')) {
    if (condition.includes('partly') || condition.includes('few')) {
      return 'partly-cloudy'
    }
    return 'cloudy'
  }
  
  return 'sunny'
}