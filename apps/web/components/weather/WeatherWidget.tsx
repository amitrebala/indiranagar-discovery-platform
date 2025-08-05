'use client'

import { motion } from 'framer-motion'
import { Cloud, CloudRain, Sun, Wind, Droplets } from 'lucide-react'
import { WeatherData } from '@/hooks/useWeather'
import { Skeleton } from '@/components/ui/Skeleton'

interface WeatherWidgetProps {
  weather: WeatherData | null
  loading: boolean
}

export function WeatherWidget({ weather, loading }: WeatherWidgetProps) {
  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <Skeleton className="h-8 w-24 mb-4" />
        <Skeleton className="h-12 w-32 mb-2" />
        <Skeleton className="h-4 w-full" />
      </div>
    )
  }
  
  if (!weather) return null
  
  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'rainy':
        return <CloudRain size={32} />
      case 'cloudy':
        return <Cloud size={32} />
      case 'partly-cloudy':
        return <Cloud size={32} />
      default:
        return <Sun size={32} />
    }
  }
  
  const getWeatherRecommendation = () => {
    if (weather.condition === 'rainy') {
      return 'Great day for cozy cafes ☕'
    }
    if (weather.temperature > 30) {
      return 'Perfect for rooftop dining 🌅'
    }
    if (weather.temperature < 20) {
      return 'Ideal for hot street food 🍜'
    }
    return 'Beautiful weather for exploring 🚶'
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-white/60 mb-1">Indiranagar Weather</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">{weather.temperature}°</span>
            <span className="text-white/80">{weather.description}</span>
          </div>
        </div>
        <div className="text-white/80">
          {getWeatherIcon()}
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-white/60 mb-3">
        <div className="flex items-center gap-1">
          <Droplets size={16} />
          <span>{weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-1">
          <Wind size={16} />
          <span>{weather.windSpeed} km/h</span>
        </div>
      </div>
      
      <p className="text-sm text-white/90 font-medium">
        {getWeatherRecommendation()}
      </p>
    </motion.div>
  )
}