import { BaseSearchStrategy } from './base-strategy'
import { EnhancedPlace } from '../enhanced-types'

export class BrandedEstablishmentStrategy extends BaseSearchStrategy {
  name = 'BrandedEstablishment'
  priority = 1

  applicableFor(place: EnhancedPlace): boolean {
    // Apply this strategy for places with brand names or chain establishments
    return !!(
      place.brand_name || 
      place.metadata?.businessInfo?.isChain ||
      place.metadata?.businessInfo?.parentBrand
    )
  }

  generateQueries(place: EnhancedPlace): string[] {
    const queries: string[] = []
    const brandName = place.brand_name || place.metadata?.businessInfo?.parentBrand

    if (!brandName) {
      return [place.name]
    }

    // Primary query: Brand name + establishment type + location
    if (place.establishment_type) {
      queries.push(`${brandName} ${place.establishment_type}`)
    }

    // Secondary query: Full place name + location context
    queries.push(place.name)

    // Tertiary query: Brand name + specific location
    if (place.name.includes(brandName)) {
      const locationPart = place.name.replace(brandName, '').trim()
      if (locationPart) {
        queries.push(`${brandName} ${locationPart}`)
      }
    }

    // Add brand-specific variations
    if (brandName.toLowerCase() === 'corner house') {
      queries.push('Corner House ice cream parlor')
      queries.push('Corner House death by chocolate')
    } else if (brandName.toLowerCase() === 'social') {
      queries.push(`${place.name} gastropub`)
      queries.push(`Social restaurant bar ${place.name.includes('Church Street') ? 'Church Street' : ''}`)
    }

    return queries
  }

  enhanceQuery(query: string, place: EnhancedPlace): string {
    const parts = [query]
    
    // For branded establishments, prioritize brand identity
    if (place.metadata?.searchHints?.mustIncludeTerms) {
      // Don't add generic location terms if we have specific must-include terms
      const locationQualifiers = place.metadata.searchHints.locationQualifiers || ['Bangalore']
      parts.push(...locationQualifiers)
    } else {
      parts.push('Bangalore', 'India')
    }
    
    // Add establishment context
    if (place.establishment_type && !query.includes(place.establishment_type)) {
      parts.push(place.establishment_type.replace('-', ' '))
    }
    
    return parts.join(' ')
  }
}