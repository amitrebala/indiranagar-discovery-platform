import { describe, it, expect } from 'vitest'
import { BrandedEstablishmentStrategy } from '../../../../../lib/services/image-sources/strategies/branded-establishment'
import { EnhancedPlace } from '../../../../../lib/services/image-sources/enhanced-types'
import { ImageResult } from '../../../../../lib/services/image-sources/types'

describe('BrandedEstablishmentStrategy', () => {
  const strategy = new BrandedEstablishmentStrategy()

  describe('applicableFor', () => {
    it('should apply to places with brand names', () => {
      const place: EnhancedPlace = {
        id: 'test-1',
        name: 'Corner House Ice Cream',
        brand_name: 'Corner House',
        description: 'Ice cream parlor',
        latitude: 12.9716,
        longitude: 77.6411,
        rating: 4.5,
        category: 'Food & Dining',
        has_amit_visited: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      expect(strategy.applicableFor(place)).toBe(true)
    })

    it('should apply to chain establishments', () => {
      const place: EnhancedPlace = {
        id: 'test-2',
        name: 'Social',
        description: 'Gastropub',
        latitude: 12.9716,
        longitude: 77.6411,
        rating: 4.5,
        category: 'Food & Dining',
        has_amit_visited: true,
        metadata: {
          businessInfo: { isChain: true }
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      expect(strategy.applicableFor(place)).toBe(true)
    })

    it('should not apply to non-branded places', () => {
      const place: EnhancedPlace = {
        id: 'test-3',
        name: 'Random Restaurant',
        description: 'Local eatery',
        latitude: 12.9716,
        longitude: 77.6411,
        rating: 4.0,
        category: 'Food & Dining',
        has_amit_visited: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      expect(strategy.applicableFor(place)).toBe(false)
    })
  })

  describe('generateQueries', () => {
    it('should generate specific queries for Corner House', () => {
      const place: EnhancedPlace = {
        id: 'test-1',
        name: 'Corner House Ice Cream',
        brand_name: 'Corner House',
        establishment_type: 'ice-cream-parlor',
        description: 'Ice cream parlor',
        latitude: 12.9716,
        longitude: 77.6411,
        rating: 4.5,
        category: 'Food & Dining',
        has_amit_visited: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const queries = strategy.generateQueries(place)
      
      expect(queries).toContain('Corner House ice-cream-parlor')
      expect(queries).toContain('Corner House Ice Cream')
      expect(queries).toContain('Corner House ice cream parlor')
      expect(queries).toContain('Corner House death by chocolate')
    })

    it('should generate queries for Social brand', () => {
      const place: EnhancedPlace = {
        id: 'test-2',
        name: 'Church Street Social',
        brand_name: 'Social',
        establishment_type: 'gastropub',
        description: 'Gastropub',
        latitude: 12.9716,
        longitude: 77.6411,
        rating: 4.5,
        category: 'Food & Dining',
        has_amit_visited: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const queries = strategy.generateQueries(place)
      
      expect(queries).toContain('Social gastropub')
      expect(queries).toContain('Church Street Social')
      expect(queries).toContain('Church Street Social gastropub')
      expect(queries.some(q => q.includes('Social restaurant bar'))).toBe(true)
    })
  })

  describe('scoreResult', () => {
    it('should score higher for images with brand name in tags', () => {
      const place: EnhancedPlace = {
        id: 'test-1',
        name: 'Corner House Ice Cream',
        brand_name: 'Corner House',
        description: 'Ice cream parlor',
        latitude: 12.9716,
        longitude: 77.6411,
        rating: 4.5,
        category: 'Food & Dining',
        has_amit_visited: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const goodImage: ImageResult = {
        url: 'https://example.com/corner-house.jpg',
        attribution: { author: 'Test', source: 'Test' },
        tags: ['corner house', 'ice cream', 'bangalore'],
        relevanceScore: 0.5,
        metadata: { searchStrategy: 'Test' }
      }
      
      const badImage: ImageResult = {
        url: 'https://example.com/random-ice-cream.jpg',
        attribution: { author: 'Test', source: 'Test' },
        tags: ['ice cream', 'dessert'],
        relevanceScore: 0.5,
        metadata: { searchStrategy: 'Test' }
      }
      
      const goodScore = strategy.scoreResult(place, goodImage)
      const badScore = strategy.scoreResult(place, badImage)
      
      expect(goodScore).toBeGreaterThan(badScore)
    })

    it('should penalize images with avoid terms', () => {
      const place: EnhancedPlace = {
        id: 'test-1',
        name: 'Corner House Ice Cream',
        brand_name: 'Corner House',
        description: 'Ice cream parlor',
        latitude: 12.9716,
        longitude: 77.6411,
        rating: 4.5,
        category: 'Food & Dining',
        has_amit_visited: true,
        metadata: {
          searchHints: {
            avoidTerms: ['home', 'house']
          }
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const image: ImageResult = {
        url: 'https://example.com/house.jpg',
        attribution: { author: 'Test', source: 'Test' },
        tags: ['house', 'home', 'building'],
        relevanceScore: 0.5,
        metadata: { searchStrategy: 'Test' }
      }
      
      const score = strategy.scoreResult(place, image)
      
      expect(score).toBeLessThan(0.5)
    })
  })
})