import { SearchStrategy } from './types'
import { EnhancedPlace } from '../enhanced-types'
import { ImageResult } from '../types'

export abstract class BaseSearchStrategy implements SearchStrategy {
  abstract name: string
  abstract priority: number

  abstract applicableFor(place: EnhancedPlace): boolean
  abstract generateQueries(place: EnhancedPlace): string[]

  scoreResult(place: EnhancedPlace, image: ImageResult): number {
    let score = image.relevanceScore || 0.5
    
    // Boost score if place name appears in image description
    const placeName = place.name.toLowerCase()
    const description = (image.tags?.join(' ') || '').toLowerCase()
    
    if (description.includes(placeName)) {
      score += 0.2
    }

    // Boost score for matching brand names
    if (place.brand_name) {
      const brandName = place.brand_name.toLowerCase()
      if (description.includes(brandName)) {
        score += 0.3
      }
    }

    // Apply metadata hints
    if (place.metadata?.searchHints) {
      const { mustIncludeTerms = [], avoidTerms = [] } = place.metadata.searchHints
      
      // Check for must-include terms
      const hasRequiredTerms = mustIncludeTerms.some(term => 
        description.includes(term.toLowerCase())
      )
      if (hasRequiredTerms) {
        score += 0.2
      }
      
      // Penalize for avoid terms
      const hasAvoidTerms = avoidTerms.some(term => 
        description.includes(term.toLowerCase())
      )
      if (hasAvoidTerms) {
        score -= 0.3
      }
    }

    return Math.max(0, Math.min(1, score))
  }

  enhanceQuery(query: string, place: EnhancedPlace): string {
    const parts = [query]
    
    // Add location qualifiers if available
    if (place.metadata?.searchHints?.locationQualifiers) {
      parts.push(...place.metadata.searchHints.locationQualifiers)
    } else {
      parts.push('Bangalore', 'India')
    }
    
    return parts.join(' ')
  }
}