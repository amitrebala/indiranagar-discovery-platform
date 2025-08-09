'use client'

import React, { useEffect, useState } from 'react'
import { Cloud, CloudRain, Sun, Wind, Thermometer, Droplets, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { JourneyExperience } from '@/lib/types/journey'
import { cn } from '@/lib/utils'

interface WeatherData {
  condition: string
  temperature: number
  feels_like: number
  humidity: number
  wind_speed: number
  description: string
  recommendations: {
    timing: string
    clothing: string[]
    items: string[]
  }
}

interface JourneyWeatherCardProps {
  journey: JourneyExperience
  className?: string
}

const weatherIcons: Record<string, React.ReactNode> = {
  clear: <Sun className="h-5 w-5" />,
  clouds: <Cloud className="h-5 w-5" />,
  rain: <CloudRain className="h-5 w-5" />,
  wind: <Wind className="h-5 w-5" />
}

export function JourneyWeatherCard({ journey, className }: JourneyWeatherCardProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/weather')
        if (!response.ok) throw new Error('Failed to fetch weather')
        
        const data = await response.json()
        setWeather(data)
      } catch (err) {
        console.error('Error fetching weather:', err)
        setError('Unable to load weather data')
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [])

  if (loading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardHeader>
          <div className="h-4 bg-muted rounded w-32" />
          <div className="h-3 bg-muted rounded w-48 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="h-20 bg-muted rounded" />
        </CardContent>
      </Card>
    )
  }

  if (error || !weather) {
    return null
  }

  const isWeatherSuitable = journey.weather_suitability?.includes(
    weather.condition.toLowerCase() as any
  ) ?? true

  const getWeatherAdvice = () => {
    const advice = []
    
    if (weather.condition === 'rain') {
      advice.push('Bring an umbrella or raincoat')
      advice.push('Consider indoor alternatives for outdoor stops')
    }
    
    if (weather.temperature > 30) {
      advice.push('Stay hydrated and take breaks in shade')
      advice.push('Best to start early morning or late afternoon')
    }
    
    if (weather.temperature < 15) {
      advice.push('Wear layers for comfortable walking')
      advice.push('Hot beverages at cafes will be extra enjoyable')
    }
    
    if (weather.wind_speed > 20) {
      advice.push('Secure loose items and consider wind-resistant clothing')
    }
    
    return advice
  }

  const weatherAdvice = getWeatherAdvice()

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">Weather Conditions</CardTitle>
            <CardDescription>Current conditions for your journey</CardDescription>
          </div>
          {weatherIcons[weather.condition.toLowerCase()] || weatherIcons.clouds}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Temperature and Conditions */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{Math.round(weather.temperature)}°C</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Feels like {Math.round(weather.feels_like)}°C
            </p>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center gap-2 justify-end">
              <Droplets className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{weather.humidity}%</span>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Wind className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{weather.wind_speed} km/h</span>
            </div>
          </div>
        </div>

        {/* Weather Description */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium capitalize">{weather.description}</p>
          <Badge variant={isWeatherSuitable ? "success" : "warning"}>
            {isWeatherSuitable ? 'Good for journey' : 'Check alternatives'}
          </Badge>
        </div>

        {/* Weather Advice */}
        {weatherAdvice.length > 0 && (
          <Alert className={cn(
            "border",
            isWeatherSuitable ? "border-blue-200 bg-blue-50 dark:bg-blue-950" : "border-yellow-200 bg-yellow-50 dark:bg-yellow-950"
          )}>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Weather Tips</AlertTitle>
            <AlertDescription>
              <ul className="mt-2 space-y-1">
                {weatherAdvice.map((advice, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {advice}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Journey-specific recommendations */}
        {!isWeatherSuitable && journey.alternatives && journey.alternatives.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-sm font-medium mb-2">Alternative Suggestions:</p>
            <ul className="space-y-1">
              {journey.alternatives.slice(0, 2).map((alt, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  • {alt.reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Optimal timing based on weather */}
        {journey.optimal_times && journey.optimal_times.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-sm font-medium mb-1">Best times today:</p>
            <div className="flex gap-2 flex-wrap">
              {journey.optimal_times.map((time, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {time.start_hour}:00 - {time.end_hour}:00
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}