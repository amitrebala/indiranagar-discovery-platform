import type { Place } from '@/lib/validations'

export type PriceRange = 'any' | 'budget' | 'moderate' | 'premium'
export type TimeRange = 'any' | 'quick' | 'moderate' | 'leisurely'
export type CrowdLevel = 'any' | 'low' | 'moderate' | 'high'
export type AccessibilityFeature = 'wheelchair' | 'parking' | 'quiet' | 'family-friendly'

export interface SearchFilters {
  categories: string[]
  price_range: PriceRange
  time_requirement: TimeRange
  weather_suitability: string[]
  crowd_level: CrowdLevel
  accessibility_features: AccessibilityFeature[]
  distance_km?: number
}

export interface SearchContext {
  current_weather?: WeatherData
  time_of_day: 'morning' | 'afternoon' | 'evening'
  user_location?: Coordinates
  user_preferences?: UserPreferences
  search_history: SearchHistoryItem[]
}

export interface WeatherData {
  condition: string
  temperature: number
  humidity: number
  description: string
}

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface UserPreferences {
  preferred_categories: string[]
  dietary_restrictions: string[]
  mobility_needs: string[]
}

export interface SearchHistoryItem {
  query: string
  timestamp: number
}

export interface SearchResult {
  place: Place
  relevance_score: number
  distance_km?: number
  matching_factors: string[]
  contextual_recommendations: string[]
}

export class SearchEngine {
  private places: Place[] = []

  setPlaces(places: Place[]) {
    this.places = places
  }

  search(
    query: string,
    filters: SearchFilters,
    context?: SearchContext
  ): SearchResult[] {
    // Apply basic text filtering first
    let filteredPlaces = this.filterByText(query)
    
    // Apply category filters
    if (filters.categories.length > 0) {
      filteredPlaces = filteredPlaces.filter(place => 
        place.category && filters.categories.includes(place.category.toLowerCase())
      )
    }

    // Apply weather suitability filters
    if (filters.weather_suitability.length > 0) {
      filteredPlaces = filteredPlaces.filter(place =>
        place.weather_suitability?.some(condition =>
          filters.weather_suitability.includes(condition)
        ) || false
      )
    }

    // Apply distance filter
    if (filters.distance_km && context?.user_location) {
      filteredPlaces = filteredPlaces.filter(place => {
        const distance = this.calculateDistance(
          context.user_location!,
          { latitude: place.latitude, longitude: place.longitude }
        )
        return distance <= filters.distance_km!
      })
    }

    // Convert to search results with relevance scoring
    const results = filteredPlaces.map(place => ({
      place,
      relevance_score: this.calculateRelevanceScore(place, query, filters, context),
      distance_km: context?.user_location 
        ? this.calculateDistance(
            context.user_location, 
            { latitude: place.latitude, longitude: place.longitude }
          )
        : undefined,
      matching_factors: this.identifyMatchingFactors(place, query, filters),
      contextual_recommendations: this.generateContextualRecommendations(place, context)
    }))

    // Sort by relevance score
    return results.sort((a, b) => b.relevance_score - a.relevance_score)
  }

  private filterByText(query: string): Place[] {
    if (!query || query.length < 2) return this.places

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0)
    
    return this.places.filter(place => {
      const searchableText = [
        place.name,
        place.description,
        place.category,
        place.best_time_to_visit,
        ...(place.weather_suitability || [])
      ].join(' ').toLowerCase()

      return searchTerms.every(term => searchableText.includes(term))
    })
  }

  private calculateRelevanceScore(
    place: Place,
    query: string,
    filters: SearchFilters,
    context?: SearchContext
  ): number {
    let score = 0

    // Text relevance (30%)
    score += this.calculateTextRelevance(place, query) * 0.3

    // Rating weight (25%)
    score += (place.rating || 0) / 5 * 0.25

    // Proximity bonus (20%)
    if (context?.user_location) {
      const distance = this.calculateDistance(
        context.user_location,
        { latitude: place.latitude, longitude: place.longitude }
      )
      score += this.calculateProximityScore(distance) * 0.2
    }

    // Weather suitability (15%)
    if (context?.current_weather) {
      score += this.calculateWeatherSuitability(place, context.current_weather) * 0.15
    }

    // Time context (10%)
    if (context?.time_of_day) {
      score += this.calculateTimeContextScore(place, context.time_of_day) * 0.1
    }

    return Math.min(score, 1) // Normalize to 0-1
  }

  private calculateTextRelevance(place: Place, query: string): number {
    if (!query) return 0

    const searchTerms = query.toLowerCase().split(' ')
    const placeText = [place.name, place.description, place.category || ''].join(' ').toLowerCase()
    
    let relevance = 0
    let totalTerms = searchTerms.length

    searchTerms.forEach(term => {
      if (place.name.toLowerCase().includes(term)) {
        relevance += 0.4 // Name matches are most important
      } else if (place.category?.toLowerCase().includes(term)) {
        relevance += 0.3 // Category matches are second
      } else if (placeText.includes(term)) {
        relevance += 0.2 // Description matches are third
      }
    })

    return Math.min(relevance / totalTerms, 1)
  }

  private calculateProximityScore(distance: number): number {
    // Score decreases exponentially with distance
    // 1.0 for 0km, 0.8 for 0.5km, 0.5 for 1km, 0.2 for 2km, 0.05 for 5km
    return Math.max(0, Math.exp(-distance * 1.5))
  }

  private calculateWeatherSuitability(place: Place, weather: WeatherData): number {
    if (!place.weather_suitability) return 0.5 // Neutral if no data

    const suitableConditions = place.weather_suitability
    const currentCondition = weather.condition.toLowerCase()

    // Direct match
    if (suitableConditions.includes(currentCondition as any)) {
      return 1.0
    }

    // Partial matches
    if (currentCondition.includes('rain') && suitableConditions.includes('rainy')) {
      return 0.8
    }
    if (currentCondition.includes('sun') && suitableConditions.includes('sunny')) {
      return 0.8
    }
    if (currentCondition.includes('cloud') && suitableConditions.includes('cloudy')) {
      return 0.6
    }

    return 0.3 // Default low score for mismatched weather
  }

  private calculateTimeContextScore(place: Place, timeOfDay: string): number {
    if (!place.best_time_to_visit) return 0.5

    const bestTime = place.best_time_to_visit.toLowerCase()
    
    if (bestTime.includes(timeOfDay)) {
      return 1.0
    }

    // Partial matches based on common patterns
    if (timeOfDay === 'morning' && bestTime.includes('breakfast')) return 0.8
    if (timeOfDay === 'afternoon' && bestTime.includes('lunch')) return 0.8
    if (timeOfDay === 'evening' && (bestTime.includes('dinner') || bestTime.includes('night'))) return 0.8

    return 0.5
  }

  private identifyMatchingFactors(
    place: Place,
    query: string,
    filters: SearchFilters
  ): string[] {
    const factors: string[] = []

    // Text matches
    const queryTerms = query.toLowerCase().split(' ')
    if (queryTerms.some(term => place.name.toLowerCase().includes(term))) {
      factors.push('Name match')
    }
    if (queryTerms.some(term => place.category?.toLowerCase().includes(term))) {
      factors.push('Category match')
    }

    // Filter matches
    if (filters.categories.includes(place.category?.toLowerCase() || '')) {
      factors.push(`Category: ${place.category}`)
    }

    // Rating
    if (place.rating && place.rating >= 4.0) {
      factors.push('Highly rated')
    }

    // Weather suitability
    if (place.weather_suitability && place.weather_suitability.length > 0) {
      factors.push(`Weather: ${place.weather_suitability.join(', ')}`)
    }

    return factors
  }

  private generateContextualRecommendations(
    place: Place,
    context?: SearchContext
  ): string[] {
    const recommendations: string[] = []

    // Time-based recommendations
    if (context?.time_of_day === 'morning' && place.category?.includes('cafe')) {
      recommendations.push('Perfect for morning coffee')
    }
    if (context?.time_of_day === 'evening' && place.category?.includes('restaurant')) {
      recommendations.push('Great for dinner')
    }

    // Rating-based recommendations
    if (place.rating && place.rating >= 4.5) {
      recommendations.push('Exceptional reviews')
    }

    // Weather-based recommendations
    if (context?.current_weather?.condition.includes('rain') && 
        place.weather_suitability?.includes('rainy')) {
      recommendations.push('Perfect for rainy weather')
    }

    return recommendations
  }

  private calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371 // Earth's radius in km
    const dLat = this.deg2rad(coord2.latitude - coord1.latitude)
    const dLon = this.deg2rad(coord2.longitude - coord1.longitude)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(coord1.latitude)) * Math.cos(this.deg2rad(coord2.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c
    return d
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180)
  }
}

// Singleton instance
export const searchEngine = new SearchEngine()