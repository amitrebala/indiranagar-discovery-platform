import { BaseSearchStrategy } from './base-strategy'
import { EnhancedPlace } from '../enhanced-types'

export class LocalLandmarkStrategy extends BaseSearchStrategy {
  name = 'LocalLandmark'
  priority = 2

  private landmarkTypes = [
    'metro-station',
    'railway-station',
    'bus-station',
    'monument',
    'landmark',
    'temple',
    'church',
    'mosque',
    'park',
    'lake',
    'market'
  ]

  applicableFor(place: EnhancedPlace): boolean {
    // Apply for metro stations, landmarks, and public infrastructure
    const isLandmarkType = place.establishment_type && 
      this.landmarkTypes.includes(place.establishment_type)
    
    const hasLandmarkKeywords = place.search_keywords?.some(keyword => 
      this.landmarkTypes.some(type => keyword.toLowerCase().includes(type))
    )
    
    return !!(isLandmarkType || hasLandmarkKeywords)
  }

  generateQueries(place: EnhancedPlace): string[] {
    const queries: string[] = []
    
    // For metro stations, be very specific
    if (place.establishment_type === 'metro-station') {
      // Primary: Full name with metro system
      queries.push(`${place.name} Namma Metro Bangalore`)
      
      // Secondary: Station name with line color
      if (place.metadata?.searchHints?.locationQualifiers?.includes('Purple Line')) {
        queries.push(`${place.name} Purple Line`)
      }
      
      // Tertiary: Generic but with strong location context
      queries.push(`${place.name} metro station entrance`)
    }
    
    // For other landmarks
    else {
      // Primary: Full name with type
      queries.push(place.name)
      
      // Secondary: Name with establishment type
      if (place.establishment_type) {
        const readableType = place.establishment_type.replace('-', ' ')
        queries.push(`${place.name} ${readableType}`)
      }
      
      // Tertiary: Name with landmark designation
      queries.push(`${place.name} landmark Bangalore`)
    }
    
    return queries
  }

  enhanceQuery(query: string, place: EnhancedPlace): string {
    const parts = [query]
    
    // For landmarks, always include strong location context
    if (place.establishment_type === 'metro-station') {
      // Don't add generic India for metro stations
      if (!query.includes('Bangalore')) {
        parts.push('Bangalore')
      }
      if (!query.includes('Namma Metro') && !query.includes('metro')) {
        parts.push('Namma Metro')
      }
    } else {
      // For other landmarks, use standard location qualifiers
      const qualifiers = place.metadata?.searchHints?.locationQualifiers || 
        ['Indiranagar', 'Bangalore']
      parts.push(...qualifiers)
    }
    
    return parts.join(' ')
  }
}