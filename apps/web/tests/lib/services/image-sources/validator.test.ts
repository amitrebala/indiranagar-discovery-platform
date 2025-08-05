import { describe, it, expect } from 'vitest'
import { ImageValidator } from '../../../../lib/services/image-sources/validator'
import { ImageResult } from '../../../../lib/services/image-sources/types'
import { EnhancedPlace } from '../../../../lib/services/image-sources/enhanced-types'

describe('ImageValidator', () => {
  const validator = new ImageValidator()

  const createTestPlace = (overrides?: Partial<EnhancedPlace>): EnhancedPlace => ({
    id: 'test-1',
    name: 'Test Place',
    description: 'Test description',
    latitude: 12.9716,
    longitude: 77.6411,
    rating: 4.5,
    category: 'Food & Dining',
    has_amit_visited: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides
  })

  const createTestImage = (overrides?: Partial<ImageResult>): ImageResult => ({
    url: 'https://example.com/image.jpg',
    width: 1920,
    height: 1080,
    attribution: { author: 'Test Author', source: 'Test Source' },
    tags: ['test', 'image'],
    ...overrides
  })

  describe('validateImage', () => {
    it('should reject images with inappropriate content', () => {
      const place = createTestPlace()
      const image = createTestImage({
        tags: ['restaurant', 'nsfw', 'adult']
      })
      
      expect(validator.validateImage(image, place)).toBe(false)
    })

    it('should reject stock photos for non-artistic places', () => {
      const place = createTestPlace({
        establishment_type: 'restaurant'
      })
      const image = createTestImage({
        tags: ['stock photo', 'restaurant', 'food']
      })
      
      expect(validator.validateImage(image, place)).toBe(false)
    })

    it('should allow artistic images for art galleries', () => {
      const place = createTestPlace({
        establishment_type: 'art-gallery',
        category: 'Arts & Culture'
      })
      const image = createTestImage({
        tags: ['illustration', 'art', 'gallery']
      })
      
      expect(validator.validateImage(image, place)).toBe(true)
    })

    it('should reject images with invalid dimensions', () => {
      const place = createTestPlace()
      
      // Too small
      const smallImage = createTestImage({
        width: 300,
        height: 200
      })
      expect(validator.validateImage(smallImage, place)).toBe(false)
      
      // Too wide aspect ratio
      const wideImage = createTestImage({
        width: 4000,
        height: 1000
      })
      expect(validator.validateImage(wideImage, place)).toBe(false)
    })

    it('should reject images with avoid terms', () => {
      const place = createTestPlace({
        metadata: {
          searchHints: {
            avoidTerms: ['generic', 'stock']
          }
        }
      })
      const image = createTestImage({
        tags: ['restaurant', 'generic', 'food']
      })
      
      expect(validator.validateImage(image, place)).toBe(false)
    })

    it('should reject images with competitor brands', () => {
      const place = createTestPlace({
        brand_name: 'Corner House'
      })
      const image = createTestImage({
        tags: ['baskin robbins', 'ice cream']
      })
      
      expect(validator.validateImage(image, place)).toBe(false)
    })

    it('should accept valid images', () => {
      const place = createTestPlace({
        brand_name: 'Corner House'
      })
      const image = createTestImage({
        tags: ['corner house', 'ice cream', 'bangalore'],
        width: 1920,
        height: 1080
      })
      
      expect(validator.validateImage(image, place)).toBe(true)
    })
  })

  describe('scoreImageQuality', () => {
    it('should score higher for high-resolution images', () => {
      const hdImage = createTestImage({
        width: 1920,
        height: 1080
      })
      const sdImage = createTestImage({
        width: 640,
        height: 480
      })
      
      const hdScore = validator.scoreImageQuality(hdImage)
      const sdScore = validator.scoreImageQuality(sdImage)
      
      expect(hdScore).toBeGreaterThan(sdScore)
    })

    it('should score higher for professional sources', () => {
      const proImage = createTestImage({
        attribution: { author: 'Pro', source: 'Unsplash' }
      })
      const amateurImage = createTestImage({
        attribution: { author: 'Amateur', source: 'Personal' }
      })
      
      const proScore = validator.scoreImageQuality(proImage)
      const amateurScore = validator.scoreImageQuality(amateurImage)
      
      expect(proScore).toBeGreaterThan(amateurScore)
    })

    it('should score higher for images with moderate tag counts', () => {
      const goodTags = createTestImage({
        tags: ['restaurant', 'food', 'bangalore', 'dining', 'indian']
      })
      const tooManyTags = createTestImage({
        tags: Array(15).fill('tag')
      })
      const tooFewTags = createTestImage({
        tags: ['food']
      })
      
      const goodScore = validator.scoreImageQuality(goodTags)
      const manyScore = validator.scoreImageQuality(tooManyTags)
      const fewScore = validator.scoreImageQuality(tooFewTags)
      
      expect(goodScore).toBeGreaterThan(manyScore)
      expect(goodScore).toBeGreaterThan(fewScore)
    })
  })
})