import { ImageResult } from './types'
import { EnhancedPlace } from './enhanced-types'

export class ImageValidator {
  private bannedTerms = [
    'stock photo',
    'illustration',
    'cartoon',
    'drawing',
    'sketch',
    'render',
    '3d model',
    'clipart',
    'vector'
  ]

  private inappropriateTerms = [
    'nsfw',
    'adult',
    'nude',
    'explicit'
  ]

  validateImage(image: ImageResult, place: EnhancedPlace): boolean {
    // Check for inappropriate content
    if (this.hasInappropriateContent(image)) {
      return false
    }

    // Check for banned visual styles (unless specifically requested)
    if (this.hasBannedVisualStyle(image) && !this.isArtisticPlaceType(place)) {
      return false
    }

    // Validate dimensions
    if (!this.hasValidDimensions(image)) {
      return false
    }

    // Check relevance based on tags
    if (!this.hasRelevantTags(image, place)) {
      return false
    }

    return true
  }

  private hasInappropriateContent(image: ImageResult): boolean {
    const allText = [
      ...(image.tags || []),
      image.attribution.author,
      image.attribution.source
    ].join(' ').toLowerCase()

    return this.inappropriateTerms.some(term => 
      allText.includes(term)
    )
  }

  private hasBannedVisualStyle(image: ImageResult): boolean {
    const tags = (image.tags || []).join(' ').toLowerCase()
    
    return this.bannedTerms.some(term => 
      tags.includes(term)
    )
  }

  private isArtisticPlaceType(place: EnhancedPlace): boolean {
    const artisticTypes = ['art-gallery', 'museum', 'creative-space', 'studio']
    const artisticCategories = ['Arts & Culture', 'Creative Spaces']
    
    return !!(
      (place.establishment_type && artisticTypes.includes(place.establishment_type)) ||
      (place.category && artisticCategories.includes(place.category))
    )
  }

  private hasValidDimensions(image: ImageResult): boolean {
    if (!image.width || !image.height) {
      return true // Can't validate, assume ok
    }

    // Minimum dimensions
    if (image.width < 400 || image.height < 300) {
      return false
    }

    // Maximum aspect ratio (too wide or too tall)
    const aspectRatio = image.width / image.height
    if (aspectRatio > 3 || aspectRatio < 0.33) {
      return false
    }

    return true
  }

  private hasRelevantTags(image: ImageResult, place: EnhancedPlace): boolean {
    // If no tags, can't validate relevance this way
    if (!image.tags || image.tags.length === 0) {
      return true
    }

    const tags = image.tags.join(' ').toLowerCase()
    
    // Check for avoid terms from metadata
    if (place.metadata?.searchHints?.avoidTerms) {
      const hasAvoidTerms = place.metadata.searchHints.avoidTerms.some(term =>
        tags.includes(term.toLowerCase())
      )
      if (hasAvoidTerms) {
        return false
      }
    }

    // For branded places, ensure brand relevance
    if (place.brand_name) {
      const brandLower = place.brand_name.toLowerCase()
      const hasBrandReference = tags.includes(brandLower) || 
        tags.includes(place.name.toLowerCase())
      
      // If tags mention a different brand, reject
      const competitorBrands = this.getCompetitorBrands(place)
      const hasCompetitor = competitorBrands.some(brand => 
        tags.includes(brand.toLowerCase())
      )
      
      if (hasCompetitor && !hasBrandReference) {
        return false
      }
    }

    return true
  }

  private getCompetitorBrands(place: EnhancedPlace): string[] {
    const brandCompetitors: Record<string, string[]> = {
      'corner house': ['baskin robbins', 'naturals', 'cream stone'],
      'social': ['toit', 'arbor', 'windmills'],
      'starbucks': ['costa', 'cafe coffee day', 'third wave'],
    }

    const brand = place.brand_name?.toLowerCase()
    return brand ? (brandCompetitors[brand] || []) : []
  }

  // Score image based on quality factors
  scoreImageQuality(image: ImageResult): number {
    let score = 0.5

    // Dimension scoring
    if (image.width && image.height) {
      if (image.width >= 1920 && image.height >= 1080) {
        score += 0.2
      } else if (image.width >= 1280 && image.height >= 720) {
        score += 0.1
      }
    }

    // Attribution scoring (prefer professional sources)
    const professionalSources = ['unsplash', 'pexels', 'shutterstock']
    if (professionalSources.includes(image.attribution.source.toLowerCase())) {
      score += 0.1
    }

    // Tag relevance (more specific tags = better)
    if (image.tags && image.tags.length > 3 && image.tags.length < 10) {
      score += 0.1
    }

    return Math.min(score, 1)
  }
}