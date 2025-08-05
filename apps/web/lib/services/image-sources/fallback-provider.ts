import { ImageResult } from './types'
import { EnhancedPlace } from './enhanced-types'

interface FallbackImage {
  path: string
  caption: string
  categories: string[]
  establishments: string[]
}

export class FallbackImageProvider {
  private fallbackImages: FallbackImage[] = [
    {
      path: '/images/fallbacks/restaurant-generic.jpg',
      caption: 'Restaurant in Indiranagar',
      categories: ['Food & Dining'],
      establishments: ['restaurant', 'cafe', 'gastropub', 'bar']
    },
    {
      path: '/images/fallbacks/ice-cream-parlor.jpg',
      caption: 'Ice cream parlor',
      categories: ['Food & Dining'],
      establishments: ['ice-cream-parlor', 'dessert-shop']
    },
    {
      path: '/images/fallbacks/metro-station.jpg',
      caption: 'Metro station entrance',
      categories: ['Transportation'],
      establishments: ['metro-station', 'railway-station']
    },
    {
      path: '/images/fallbacks/shopping-store.jpg',
      caption: 'Shopping store',
      categories: ['Shopping'],
      establishments: ['store', 'boutique', 'mall']
    },
    {
      path: '/images/fallbacks/park-generic.jpg',
      caption: 'Park in Indiranagar',
      categories: ['Parks & Recreation'],
      establishments: ['park', 'garden', 'playground']
    },
    {
      path: '/images/fallbacks/temple-generic.jpg',
      caption: 'Temple',
      categories: ['Religious Places'],
      establishments: ['temple', 'church', 'mosque']
    },
    {
      path: '/images/fallbacks/street-view.jpg',
      caption: 'Street view in Indiranagar',
      categories: ['Other'],
      establishments: ['landmark', 'street', 'junction']
    }
  ]

  private defaultFallback: FallbackImage = {
    path: '/images/placeholder-place.jpg',
    caption: 'Place in Indiranagar',
    categories: [],
    establishments: []
  }

  getFallbackImage(place: EnhancedPlace): ImageResult {
    // Try to find a matching fallback based on establishment type
    if (place.establishment_type) {
      const establishmentMatch = this.fallbackImages.find(fallback =>
        fallback.establishments.includes(place.establishment_type!)
      )
      if (establishmentMatch) {
        return this.createImageResult(establishmentMatch, place)
      }
    }

    // Try to find a matching fallback based on category
    if (place.category) {
      const categoryMatch = this.fallbackImages.find(fallback =>
        fallback.categories.includes(place.category!)
      )
      if (categoryMatch) {
        return this.createImageResult(categoryMatch, place)
      }
    }

    // Use default fallback
    return this.createImageResult(this.defaultFallback, place)
  }

  private createImageResult(fallback: FallbackImage, place: EnhancedPlace): ImageResult {
    return {
      url: fallback.path,
      thumbnail: fallback.path,
      width: 1200,
      height: 800,
      attribution: {
        author: 'Indiranagar Discovery',
        source: 'Local',
        license: 'Platform Asset'
      },
      relevanceScore: 0.3, // Low score to prioritize real images
      tags: [
        'fallback',
        place.category || 'place',
        place.establishment_type || 'location'
      ]
    }
  }

  // Create placeholder images programmatically (for initial setup)
  async generatePlaceholderImages(): Promise<void> {
    // This would be run during build time to generate SVG placeholders
    // For now, we'll assume static images are provided
    console.log('Placeholder images should be added to /public/images/fallbacks/')
    console.log('Required images:', this.fallbackImages.map(f => f.path))
  }
}