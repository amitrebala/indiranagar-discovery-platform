'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, CheckCircle, X, Clock, MapPin, Umbrella, Sun, Thermometer, Droplets } from 'lucide-react'
import type { WeatherData } from '@/lib/weather/types'

interface WeatherAlert {
  id: string
  type: 'info' | 'warning' | 'severe'
  title: string
  message: string
  icon: React.ReactNode
  actions?: AlertAction[]
  timestamp: number
  expiresAt?: number
  dismissible: boolean
}

interface AlertAction {
  label: string
  action: () => void
  type: 'primary' | 'secondary'
}

interface WeatherAlertsProps {
  weather?: WeatherData
  previousWeather?: WeatherData
  className?: string
  onAlertAction?: (alertId: string, actionType: string) => void
}

export function WeatherAlerts({ 
  weather, 
  previousWeather, 
  className = '',
  onAlertAction 
}: WeatherAlertsProps) {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([])
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (weather) {
      const newAlerts = generateWeatherAlerts(weather, previousWeather)
      setAlerts(newAlerts.filter(alert => !dismissedAlerts.has(alert.id)))
    }
  }, [weather, previousWeather, dismissedAlerts])

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]))
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }

  const handleAlertAction = (alert: WeatherAlert, action: AlertAction) => {
    action.action()
    onAlertAction?.(alert.id, action.label)
    
    // Auto-dismiss after action if it's not a severe alert
    if (alert.type !== 'severe') {
      dismissAlert(alert.id)
    }
  }

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'severe':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'severe':
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'info':
        return <CheckCircle className="w-5 h-5 text-blue-600" />
      default:
        return <CheckCircle className="w-5 h-5 text-gray-600" />
    }
  }

  if (alerts.length === 0) {
    return null
  }

  return (
    <div className={`weather-alerts space-y-3 ${className}`}>
      {alerts.map((alert) => (
        <WeatherAlertCard
          key={alert.id}
          alert={alert}
          onDismiss={dismissAlert}
          onAction={handleAlertAction}
          styles={getAlertStyles(alert.type)}
        />
      ))}
    </div>
  )
}

interface WeatherAlertCardProps {
  alert: WeatherAlert
  onDismiss: (alertId: string) => void
  onAction: (alert: WeatherAlert, action: AlertAction) => void
  styles: string
}

function WeatherAlertCard({ alert, onDismiss, onAction, styles }: WeatherAlertCardProps) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className={`weather-alert-card p-4 rounded-lg border-2 ${styles}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          {alert.icon}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-sm">{alert.title}</h4>
              <div className="flex items-center gap-1 text-xs opacity-75">
                <Clock className="w-3 h-3" />
                <span>{formatTime(alert.timestamp)}</span>
              </div>
            </div>
            
            <p className="text-sm opacity-90 mb-3">
              {alert.message}
            </p>

            {/* Alert Actions */}
            {alert.actions && alert.actions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {alert.actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => onAction(alert, action)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      action.type === 'primary'
                        ? 'bg-current text-white opacity-90 hover:opacity-100'
                        : 'bg-white/50 hover:bg-white/75 border border-current/20'
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dismiss Button */}
        {alert.dismissible && (
          <button
            onClick={() => onDismiss(alert.id)}
            className="p-1 rounded hover:bg-white/50 transition-colors ml-2"
            title="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expiration indicator */}
      {alert.expiresAt && (
        <div className="mt-2 pt-2 border-t border-current/20">
          <div className="text-xs opacity-60">
            Expires at {formatTime(alert.expiresAt)}
          </div>
        </div>
      )}
    </div>
  )
}

// Alert generation logic
function generateWeatherAlerts(
  currentWeather: WeatherData, 
  previousWeather?: WeatherData
): WeatherAlert[] {
  const alerts: WeatherAlert[] = []
  const now = Date.now()

  // Weather change alerts
  if (previousWeather && previousWeather.condition !== currentWeather.condition) {
    alerts.push(...generateWeatherChangeAlerts(currentWeather, previousWeather, now))
  }

  // Extreme weather alerts
  alerts.push(...generateExtremeWeatherAlerts(currentWeather, now))

  // Opportunity alerts
  alerts.push(...generateOpportunityAlerts(currentWeather, now))

  // Planning alerts
  alerts.push(...generatePlanningAlerts(currentWeather, now))

  return alerts
}

function generateWeatherChangeAlerts(
  current: WeatherData, 
  previous: WeatherData, 
  timestamp: number
): WeatherAlert[] {
  const alerts: WeatherAlert[] = []

  // Rain started
  if (previous.condition !== 'rainy' && current.condition === 'rainy') {
    alerts.push({
      id: 'rain-started',
      type: 'warning',
      title: 'Rain Alert',
      message: 'Rain has started! Consider moving to covered areas or indoor locations.',
      icon: <Umbrella className="w-5 h-5 text-blue-600" />,
      timestamp,
      dismissible: true,
      actions: [
        {
          label: 'Find Indoor Places',
          action: () => console.log('Finding indoor places'),
          type: 'primary'
        },
        {
          label: 'View Covered Routes',
          action: () => console.log('Viewing covered routes'),
          type: 'secondary'
        }
      ]
    })
  }

  // Rain stopped
  if (previous.condition === 'rainy' && current.condition !== 'rainy') {
    alerts.push({
      id: 'rain-stopped',
      type: 'info',
      title: 'Rain Stopped',
      message: 'Great news! The rain has stopped. Perfect time to resume outdoor activities.',
      icon: <Sun className="w-5 h-5 text-yellow-600" />,
      timestamp,
      dismissible: true,
      actions: [
        {
          label: 'Explore Outdoor Places',
          action: () => console.log('Finding outdoor places'),
          type: 'primary'
        }
      ]
    })
  }

  // Temperature change
  const tempChange = Math.abs(current.temperature - previous.temperature)
  if (tempChange >= 5) {
    const direction = current.temperature > previous.temperature ? 'risen' : 'dropped'
    alerts.push({
      id: 'temp-change',
      type: 'info',
      title: 'Temperature Change',
      message: `Temperature has ${direction} by ${tempChange.toFixed(1)}°C. You might want to adjust your plans.`,
      icon: <Thermometer className="w-5 h-5 text-orange-600" />,
      timestamp,
      dismissible: true
    })
  }

  return alerts
}

function generateExtremeWeatherAlerts(weather: WeatherData, timestamp: number): WeatherAlert[] {
  const alerts: WeatherAlert[] = []

  // Extreme heat
  if (weather.temperature > 38) {
    alerts.push({
      id: 'extreme-heat',
      type: 'severe',
      title: 'Extreme Heat Warning',
      message: `Temperature is ${weather.temperature}°C. Avoid outdoor activities and stay hydrated.`,
      icon: <Thermometer className="w-5 h-5 text-red-600" />,
      timestamp,
      expiresAt: timestamp + 4 * 60 * 60 * 1000, // 4 hours
      dismissible: false,
      actions: [
        {
          label: 'Find Air-Conditioned Places',
          action: () => console.log('Finding AC places'),
          type: 'primary'
        },
        {
          label: 'Postpone Outdoor Plans',
          action: () => console.log('Postponing plans'),
          type: 'secondary'
        }
      ]
    })
  }

  // Very high humidity
  if (weather.humidity > 90) {
    alerts.push({
      id: 'high-humidity',
      type: 'warning',
      title: 'High Humidity Alert',
      message: `Humidity is ${weather.humidity}%. Indoor activities recommended for comfort.`,
      icon: <Droplets className="w-5 h-5 text-cyan-600" />,
      timestamp,
      dismissible: true,
      actions: [
        {
          label: 'Find Indoor Venues',
          action: () => console.log('Finding indoor venues'),
          type: 'primary'
        }
      ]
    })
  }

  return alerts
}

function generateOpportunityAlerts(weather: WeatherData, timestamp: number): WeatherAlert[] {
  const alerts: WeatherAlert[] = []

  // Perfect weather
  if (weather.condition === 'sunny' && weather.temperature >= 22 && weather.temperature <= 28) {
    alerts.push({
      id: 'perfect-weather',
      type: 'info',
      title: 'Perfect Weather!',
      message: 'Ideal conditions for outdoor exploration. Great time to visit outdoor cafes and walking areas.',
      icon: <Sun className="w-5 h-5 text-yellow-600" />,
      timestamp,
      dismissible: true,
      actions: [
        {
          label: 'Explore Outdoor Places',
          action: () => console.log('Exploring outdoor places'),
          type: 'primary'
        },
        {
          label: 'Plan Walking Route',
          action: () => console.log('Planning walking route'),
          type: 'secondary'
        }
      ]
    })
  }

  // Good for coffee
  if (weather.condition === 'rainy' || (weather.condition === 'cool' && weather.temperature < 25)) {
    alerts.push({
      id: 'coffee-weather',
      type: 'info',
      title: 'Perfect Coffee Weather',
      message: 'Great weather for cozy cafes and warm beverages. Perfect time for indoor conversations.',
      icon: <span className="text-lg">☕</span>,
      timestamp,
      dismissible: true,
      actions: [
        {
          label: 'Find Cozy Cafes',
          action: () => console.log('Finding cafes'),
          type: 'primary'
        }
      ]
    })
  }

  return alerts
}

function generatePlanningAlerts(weather: WeatherData, timestamp: number): WeatherAlert[] {
  const alerts: WeatherAlert[] = []

  // Early morning recommendation
  const hour = new Date().getHours()
  if (weather.temperature > 30 && hour < 9) {
    alerts.push({
      id: 'early-planning',
      type: 'info',
      title: 'Early Bird Advantage',
      message: 'Great time for outdoor activities before it gets hot. Consider morning exploration.',
      icon: <Sun className="w-5 h-5 text-orange-500" />,
      timestamp,
      dismissible: true,
      actions: [
        {
          label: 'Plan Morning Route',
          action: () => console.log('Planning morning route'),
          type: 'primary'
        }
      ]
    })
  }

  // Evening recommendation
  if (weather.temperature > 32 && hour >= 17) {
    alerts.push({
      id: 'evening-planning',
      type: 'info',
      title: 'Evening Exploration',
      message: 'Temperature is cooling down. Great time to resume outdoor activities.',
      icon: <MapPin className="w-5 h-5 text-purple-600" />,
      timestamp,
      dismissible: true,
      actions: [
        {
          label: 'Find Evening Spots',
          action: () => console.log('Finding evening spots'),
          type: 'primary'
        }
      ]
    })
  }

  return alerts
}