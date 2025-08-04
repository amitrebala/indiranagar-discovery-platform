import type { WeatherData } from './types'
import type { Place } from '@/lib/validations'

export interface WeatherRecommendation {
  place: Place
  suitability_score: number
  weather_reasoning: string[]
  alternative_suggestions: Place[]
  optimal_timing: TimeWindow
}

export interface TimeWindow {
  start: string
  end: string
  description: string
}

export interface Coordinates {
  latitude: number
  longitude: number
}

export class WeatherRecommendationEngine {
  generateRecommendations(
    weatherData: WeatherData,
    userLocation: Coordinates
  ): WeatherRecommendation[] {
    // This would typically get places from a service/store
    // For now, we'll use an empty array and the caller should pass places
    const places: Place[] = this.getPlacesFromStore()
    
    return places
      .map(place => ({
        place,
        suitability_score: this.calculateWeatherSuitability(place, weatherData),
        weather_reasoning: this.generateWeatherReasoning(place, weatherData),
        alternative_suggestions: this.getAlternatives(place, weatherData, places),
        optimal_timing: this.getOptimalTiming(place, weatherData)
      }))
      .filter(rec => rec.suitability_score > 0.3) // Only show reasonably suitable places
      .sort((a, b) => b.suitability_score - a.suitability_score)
  }

  adaptToWeatherChange(
    currentJourney: any,
    newWeather: WeatherData
  ): any {
    const impact = this.analyzeJourneyWeatherImpact(currentJourney, newWeather)
    
    if (impact.severity === 'high') {
      return {
        recommend_postpone: true,
        alternative_indoor_journey: this.generateIndoorAlternative(currentJourney),
        safe_shelter_locations: this.findNearbyShelter(currentJourney.current_location),
        reasoning: impact.reasons
      }
    }
    
    return {
      minor_adjustments: impact.suggestions,
      continue_with_caution: true,
      timing_recommendations: this.getTimingRecommendations(newWeather),
      reasoning: impact.reasons
    }
  }

  private calculateWeatherSuitability(place: Place, weather: WeatherData): number {
    let score = 0.5 // Base score

    // Check if place has weather suitability data
    if (!place.weather_suitability || place.weather_suitability.length === 0) {
      return score // Return neutral score if no data
    }

    const suitableConditions = place.weather_suitability
    const currentCondition = weather.condition.toLowerCase()

    // Direct condition match
    if (suitableConditions.includes(currentCondition)) {
      score = 1.0
    }
    // Partial matches and related conditions
    else if (this.hasCompatibleConditions(suitableConditions, weather)) {
      score = 0.8
    }
    // Indoor/covered places for bad weather
    else if (this.isIndoorSuitable(suitableConditions, weather)) {
      score = 0.9
    }
    // Opposite conditions (lower score)
    else if (this.hasConflictingConditions(suitableConditions, weather)) {
      score = 0.2
    }

    // Adjust based on temperature extremes
    score = this.adjustForTemperature(score, weather, place)
    
    // Adjust based on humidity
    score = this.adjustForHumidity(score, weather, place)

    return Math.max(0, Math.min(1, score))
  }

  private hasCompatibleConditions(suitableConditions: string[], weather: WeatherData): boolean {
    const condition = weather.condition.toLowerCase()
    
    // Rain-related compatibility
    if (condition.includes('rain') || condition === 'rainy') {
      return suitableConditions.some(c => 
        c.includes('indoor') || c.includes('covered') || c.includes('shelter')
      )
    }
    
    // Sun-related compatibility
    if (condition.includes('sun') || condition === 'sunny') {
      return suitableConditions.some(c => 
        c.includes('outdoor') || c.includes('garden') || c.includes('patio')
      )
    }
    
    // Cloud-related compatibility
    if (condition.includes('cloud') || condition === 'cloudy') {
      return suitableConditions.some(c => 
        c.includes('outdoor') || c.includes('walk')
      )
    }

    return false
  }

  private isIndoorSuitable(suitableConditions: string[], weather: WeatherData): boolean {
    const hasIndoorOptions = suitableConditions.some(c => 
      c.includes('indoor') || c.includes('covered') || c.includes('air-conditioned')
    )
    
    const needsIndoor = weather.condition === 'rainy' || 
                       weather.condition === 'hot' || 
                       weather.temperature > 35

    return hasIndoorOptions && needsIndoor
  }

  private hasConflictingConditions(suitableConditions: string[], weather: WeatherData): boolean {
    const condition = weather.condition.toLowerCase()
    
    // Outdoor places during rain
    if (condition === 'rainy' && suitableConditions.some(c => 
      c.includes('outdoor') && !c.includes('covered')
    )) {
      return true
    }
    
    // Indoor-only places during perfect weather
    if (condition === 'sunny' && weather.temperature < 30 && 
        suitableConditions.every(c => c.includes('indoor'))) {
      return true
    }

    return false
  }

  private adjustForTemperature(score: number, weather: WeatherData, place: Place): number {
    const temp = weather.temperature
    
    // Extreme heat adjustments
    if (temp > 35) {
      if (place.weather_suitability?.includes('indoor') || 
          place.weather_suitability?.includes('air-conditioned')) {
        return Math.min(1, score + 0.2)
      } else if (place.weather_suitability?.includes('outdoor')) {
        return Math.max(0, score - 0.3)
      }
    }
    
    // Cold adjustments
    if (temp < 15) {
      if (place.weather_suitability?.includes('indoor') || 
          place.weather_suitability?.includes('heated')) {
        return Math.min(1, score + 0.15)
      }
    }

    return score
  }

  private adjustForHumidity(score: number, weather: WeatherData, place: Place): number {
    const humidity = weather.humidity
    
    // High humidity adjustments
    if (humidity > 80) {
      if (place.weather_suitability?.includes('air-conditioned') || 
          place.weather_suitability?.includes('indoor')) {
        return Math.min(1, score + 0.1)
      } else if (place.weather_suitability?.includes('outdoor')) {
        return Math.max(0, score - 0.15)
      }
    }

    return score
  }

  private generateWeatherReasoning(place: Place, weather: WeatherData): string[] {
    const reasons: string[] = []
    const condition = weather.condition.toLowerCase()
    const temp = weather.temperature
    const humidity = weather.humidity

    // Direct condition matches
    if (place.weather_suitability?.includes(condition)) {
      reasons.push(`Perfect for ${condition} weather`)
    }

    // Temperature-based reasoning
    if (temp > 30 && place.weather_suitability?.includes('indoor')) {
      reasons.push('Air-conditioned comfort during hot weather')
    } else if (temp > 30 && place.weather_suitability?.includes('covered')) {
      reasons.push('Shaded areas provide relief from heat')
    } else if (temp < 20 && place.weather_suitability?.includes('indoor')) {
      reasons.push('Warm indoor environment')
    }

    // Rain-specific reasoning
    if (condition === 'rainy') {
      if (place.weather_suitability?.includes('covered')) {
        reasons.push('Covered seating protects from rain')
      } else if (place.weather_suitability?.includes('indoor')) {
        reasons.push('Stay dry indoors while enjoying the atmosphere')
      }
    }

    // Sunny weather reasoning
    if (condition === 'sunny' && temp < 30) {
      if (place.weather_suitability?.includes('outdoor')) {
        reasons.push('Perfect weather for outdoor dining/activities')
      } else if (place.weather_suitability?.includes('garden')) {
        reasons.push('Beautiful outdoor spaces to enjoy')
      }
    }

    // Humidity reasoning
    if (humidity > 80 && place.weather_suitability?.includes('air-conditioned')) {
      reasons.push('Escape the humidity in comfortable air conditioning')
    }

    // Rating-based reasoning
    if (place.rating && place.rating >= 4.5) {
      reasons.push('Highly rated experience worth visiting regardless')
    }

    // Default reasoning if no specific matches
    if (reasons.length === 0) {
      reasons.push('Suitable for current weather conditions')
    }

    return reasons
  }

  private getAlternatives(place: Place, weather: WeatherData, allPlaces: Place[]): Place[] {
    // Find places with similar category but better weather suitability
    return allPlaces
      .filter(p => 
        p.id !== place.id && 
        p.category === place.category &&
        this.calculateWeatherSuitability(p, weather) > this.calculateWeatherSuitability(place, weather)
      )
      .slice(0, 2)
  }

  private getOptimalTiming(place: Place, weather: WeatherData): TimeWindow {
    const condition = weather.condition
    const temp = weather.temperature

    // Hot weather timing
    if (condition === 'hot' || temp > 32) {
      if (place.weather_suitability?.includes('outdoor')) {
        return {
          start: '06:00',
          end: '09:00',
          description: 'Early morning before heat peaks'
        }
      } else {
        return {
          start: '10:00',
          end: '22:00',
          description: 'Indoor comfort available all day'
        }
      }
    }

    // Rainy weather timing
    if (condition === 'rainy') {
      return {
        start: '10:00',
        end: '20:00',
        description: 'Best during covered hours'
      }
    }

    // Perfect weather
    if (condition === 'sunny' && temp >= 20 && temp <= 30) {
      return {
        start: '08:00',
        end: '20:00',
        description: 'Perfect all day long'
      }
    }

    // Default timing
    return {
      start: '10:00',
      end: '18:00',
      description: 'Standard visiting hours'
    }
  }

  private analyzeJourneyWeatherImpact(journey: any, weather: WeatherData): any {
    const severity = this.determineImpactSeverity(journey, weather)
    const reasons = this.getImpactReasons(journey, weather)
    const suggestions = this.getAdaptationSuggestions(journey, weather)

    return {
      severity,
      reasons,
      suggestions
    }
  }

  private determineImpactSeverity(journey: any, weather: WeatherData): 'low' | 'medium' | 'high' {
    const condition = weather.condition
    const temp = weather.temperature

    // High impact conditions
    if (condition === 'rainy' && journey.outdoor_heavy) return 'high'
    if (temp > 38 && journey.walking_intensive) return 'high'
    if (temp < 10 && journey.outdoor_heavy) return 'high'

    // Medium impact conditions
    if (condition === 'hot' && journey.outdoor_moderate) return 'medium'
    if (condition === 'humid' && journey.walking_moderate) return 'medium'

    return 'low'
  }

  private getImpactReasons(journey: any, weather: WeatherData): string[] {
    const reasons: string[] = []
    const condition = weather.condition
    const temp = weather.temperature

    if (condition === 'rainy') {
      reasons.push('Heavy rain may affect outdoor portions of journey')
    }
    if (temp > 35) {
      reasons.push('Extreme heat may cause discomfort during walking')
    }
    if (weather.humidity > 85) {
      reasons.push('High humidity may make outdoor activities uncomfortable')
    }

    return reasons
  }

  private getAdaptationSuggestions(journey: any, weather: WeatherData): string[] {
    const suggestions: string[] = []
    const condition = weather.condition

    if (condition === 'rainy') {
      suggestions.push('Bring umbrella or raincoat')
      suggestions.push('Focus on covered/indoor stops first')
    }
    if (weather.temperature > 32) {
      suggestions.push('Start early or postpone to evening')
      suggestions.push('Carry extra water and stay hydrated')
    }

    return suggestions
  }

  private generateIndoorAlternative(journey: any): any {
    // This would create an alternative indoor-focused journey
    return {
      id: `${journey.id}-indoor-alt`,
      name: `Indoor Alternative: ${journey.name}`,
      indoor_focused: true,
      estimated_duration: journey.estimated_duration * 0.8
    }
  }

  private findNearbyShelter(location: any): any[] {
    // This would find nearby sheltered locations
    return [
      { name: 'Metro Station', distance: '200m' },
      { name: 'Shopping Mall', distance: '500m' }
    ]
  }

  private getTimingRecommendations(weather: WeatherData): string[] {
    const recommendations: string[] = []
    const condition = weather.condition
    const temp = weather.temperature

    if (condition === 'hot' || temp > 32) {
      recommendations.push('Visit early morning (7-9 AM) or evening (6-8 PM)')
    }
    if (condition === 'rainy') {
      recommendations.push('Wait for lighter rain or focus on covered areas')
    }
    if (condition === 'sunny' && temp < 30) {
      recommendations.push('Perfect timing for outdoor activities')
    }

    return recommendations
  }

  private getPlacesFromStore(): Place[] {
    // This would integrate with the places store/service
    // For now, return empty array - the component should provide places
    return []
  }
}

// Utility functions for weather-based filtering
export function filterPlacesByWeather(places: Place[], weather: WeatherData): Place[] {
  const engine = new WeatherRecommendationEngine()
  
  return places.filter(place => {
    const suitability = engine['calculateWeatherSuitability'](place, weather)
    return suitability > 0.5
  })
}

export function getWeatherCompatibilityScore(place: Place, weather: WeatherData): number {
  const engine = new WeatherRecommendationEngine()
  return engine['calculateWeatherSuitability'](place, weather)
}

export function getWeatherAdvice(weather: WeatherData): string[] {
  const advice: string[] = []
  const condition = weather.condition
  const temp = weather.temperature
  const humidity = weather.humidity

  if (condition === 'rainy') {
    advice.push('Perfect time for cozy indoor cafes and covered markets')
    advice.push('Bring an umbrella if you plan to walk between places')
  } else if (condition === 'sunny' && temp < 30) {
    advice.push('Ideal weather for outdoor dining and street exploration')
    advice.push('Great day for walking tours and outdoor activities')
  } else if (temp > 32) {
    advice.push('Stay cool in air-conditioned venues during peak hours')
    advice.push('Plan outdoor activities for early morning or evening')
  } else if (humidity > 80) {
    advice.push('Indoor activities recommended for comfort')
    advice.push('Stay hydrated and take breaks in cool places')
  }

  return advice
}