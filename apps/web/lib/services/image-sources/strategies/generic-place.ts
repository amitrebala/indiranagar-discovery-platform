import { BaseSearchStrategy } from './base-strategy'
import { EnhancedPlace } from '../enhanced-types'

export class GenericPlaceStrategy extends BaseSearchStrategy {
  name = 'GenericPlace'
  priority = 3 // Lowest priority, fallback strategy

  applicableFor(_place: EnhancedPlace): boolean {
    // This is the fallback strategy, always applicable
    return true
  }

  generateQueries(place: EnhancedPlace): string[] {
    const queries: string[] = []
    
    // Primary: Place name with category
    if (place.category) {
      queries.push(`${place.name} ${place.category}`)
    } else {
      queries.push(place.name)
    }
    
    // Secondary: Use search keywords if available
    if (place.search_keywords && place.search_keywords.length > 0) {
      const keywordQuery = place.search_keywords.slice(0, 3).join(' ')
      queries.push(keywordQuery)
    }
    
    // Tertiary: Name with generic qualifiers
    queries.push(`${place.name} Indiranagar`)
    
    return queries
  }

  enhanceQuery(query: string, _place: EnhancedPlace): string {
    const parts = [query]
    
    // Always add location context for generic places
    if (!query.includes('Indiranagar')) {
      parts.push('Indiranagar')
    }
    if (!query.includes('Bangalore')) {
      parts.push('Bangalore')
    }
    
    return parts.join(' ')
  }
}