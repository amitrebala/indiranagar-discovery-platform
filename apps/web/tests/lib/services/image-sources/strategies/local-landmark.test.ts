import { describe, it, expect } from 'vitest'
import { LocalLandmarkStrategy } from '../../../../../lib/services/image-sources/strategies/local-landmark'
import { EnhancedPlace } from '../../../../../lib/services/image-sources/enhanced-types'

describe('LocalLandmarkStrategy', () => {
  const strategy = new LocalLandmarkStrategy()

  describe('applicableFor', () => {
    it('should apply to metro stations', () => {
      const place: EnhancedPlace = {
        id: 'test-1',
        name: 'Indiranagar Metro Station',
        establishment_type: 'metro-station',
        description: 'Metro station',
        latitude: 12.9716,
        longitude: 77.6411,
        rating: 4.0,
        category: 'Transportation',
        has_amit_visited: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      expect(strategy.applicableFor(place)).toBe(true)
    })

    it('should apply to landmarks', () => {
      const place: EnhancedPlace = {
        id: 'test-2',
        name: 'Ulsoor Lake',
        establishment_type: 'lake',
        description: 'Lake',
        latitude: 12.9716,
        longitude: 77.6411,
        rating: 4.0,
        category: 'Parks & Recreation',
        has_amit_visited: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      expect(strategy.applicableFor(place)).toBe(true)
    })

    it('should apply based on landmark keywords', () => {
      const place: EnhancedPlace = {
        id: 'test-3',
        name: 'St. Mary\'s Basilica',
        search_keywords: ['church', 'basilica', 'landmark'],
        description: 'Church',
        latitude: 12.9716,
        longitude: 77.6411,
        rating: 4.5,
        category: 'Religious Places',
        has_amit_visited: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      expect(strategy.applicableFor(place)).toBe(true)
    })

    it('should not apply to regular establishments', () => {
      const place: EnhancedPlace = {
        id: 'test-4',
        name: 'Corner House',
        establishment_type: 'ice-cream-parlor',
        description: 'Ice cream',
        latitude: 12.9716,
        longitude: 77.6411,
        rating: 4.5,
        category: 'Food & Dining',
        has_amit_visited: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      expect(strategy.applicableFor(place)).toBe(false)
    })
  })

  describe('generateQueries', () => {
    it('should generate specific queries for metro stations', () => {
      const place: EnhancedPlace = {
        id: 'test-1',
        name: 'Indiranagar Metro Station',
        establishment_type: 'metro-station',
        description: 'Metro station',
        latitude: 12.9716,
        longitude: 77.6411,
        rating: 4.0,
        category: 'Transportation',
        has_amit_visited: false,
        metadata: {
          searchHints: {
            locationQualifiers: ['Purple Line']
          }
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const queries = strategy.generateQueries(place)
      
      expect(queries).toContain('Indiranagar Metro Station Namma Metro Bangalore')
      expect(queries).toContain('Indiranagar Metro Station Purple Line')
      expect(queries).toContain('Indiranagar Metro Station metro station entrance')
    })

    it('should generate queries for other landmarks', () => {
      const place: EnhancedPlace = {
        id: 'test-2',
        name: 'Ulsoor Lake',
        establishment_type: 'lake',
        description: 'Lake',
        latitude: 12.9716,
        longitude: 77.6411,
        rating: 4.0,
        category: 'Parks & Recreation',
        has_amit_visited: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const queries = strategy.generateQueries(place)
      
      expect(queries).toContain('Ulsoor Lake')
      expect(queries).toContain('Ulsoor Lake lake')
      expect(queries).toContain('Ulsoor Lake landmark Bangalore')
    })
  })

  describe('enhanceQuery', () => {
    it('should add Namma Metro context for metro stations', () => {
      const place: EnhancedPlace = {
        id: 'test-1',
        name: 'Indiranagar Metro Station',
        establishment_type: 'metro-station',
        description: 'Metro station',
        latitude: 12.9716,
        longitude: 77.6411,
        rating: 4.0,
        category: 'Transportation',
        has_amit_visited: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const enhanced = strategy.enhanceQuery('Indiranagar Metro Station', place)
      
      expect(enhanced).toContain('Bangalore')
      expect(enhanced).toContain('Namma Metro')
    })

    it('should use location qualifiers for other landmarks', () => {
      const place: EnhancedPlace = {
        id: 'test-2',
        name: 'Ulsoor Lake',
        establishment_type: 'lake',
        description: 'Lake',
        latitude: 12.9716,
        longitude: 77.6411,
        rating: 4.0,
        category: 'Parks & Recreation',
        has_amit_visited: true,
        metadata: {
          searchHints: {
            locationQualifiers: ['Ulsoor', 'Bangalore']
          }
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const enhanced = strategy.enhanceQuery('Ulsoor Lake', place)
      
      expect(enhanced).toContain('Ulsoor')
      expect(enhanced).toContain('Bangalore')
    })
  })
})