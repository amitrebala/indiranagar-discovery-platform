import { describe, it, expect } from 'vitest'
import { 
  validateIndiranagar, 
  validateRating,
  createPlaceSchema,
  weatherConditionSchema,
  activityTypeSchema 
} from '@/lib/validations'

describe('Validation Functions', () => {
  describe('validateIndiranagar', () => {
    it('should accept coordinates within Indiranagar bounds', () => {
      expect(validateIndiranagar(12.97, 77.64)).toBe(true)
      expect(validateIndiranagar(12.95, 77.58)).toBe(true)
      expect(validateIndiranagar(13.00, 77.65)).toBe(true)
    })

    it('should reject coordinates outside Indiranagar bounds', () => {
      expect(validateIndiranagar(12.94, 77.64)).toBe(false)
      expect(validateIndiranagar(13.01, 77.64)).toBe(false)
      expect(validateIndiranagar(12.97, 77.57)).toBe(false)
      expect(validateIndiranagar(12.97, 77.66)).toBe(false)
    })
  })

  describe('validateRating', () => {
    it('should accept valid ratings', () => {
      expect(validateRating(1.0)).toBe(true)
      expect(validateRating(3.5)).toBe(true)
      expect(validateRating(5.0)).toBe(true)
      expect(validateRating(4.3)).toBe(true)
    })

    it('should reject invalid ratings', () => {
      expect(validateRating(0.9)).toBe(false)
      expect(validateRating(5.1)).toBe(false)
      expect(validateRating(4.35)).toBe(false)
      expect(validateRating(3.25)).toBe(false)
    })
  })

  describe('Schema Validations', () => {
    it('should validate weather conditions', () => {
      expect(weatherConditionSchema.parse('sunny')).toBe('sunny')
      expect(weatherConditionSchema.parse('rainy')).toBe('rainy')
      expect(() => weatherConditionSchema.parse('invalid')).toThrow()
    })

    it('should validate activity types', () => {
      expect(activityTypeSchema.parse('before')).toBe('before')
      expect(activityTypeSchema.parse('after')).toBe('after')
      expect(() => activityTypeSchema.parse('during')).toThrow()
    })

    it('should validate place creation data', () => {
      const validPlace = {
        name: 'Test Place',
        description: 'A test place with good description',
        latitude: 12.97,
        longitude: 77.64,
        rating: 4.2,
        category: 'Restaurant',
        weather_suitability: ['sunny', 'cloudy']
      }

      expect(() => createPlaceSchema.parse(validPlace)).not.toThrow()
    })

    it('should reject invalid place data', () => {
      const invalidPlace = {
        name: '',
        description: 'Short',
        latitude: 12.90, // Outside bounds
        longitude: 77.64,
        rating: 6.0, // Invalid rating
      }

      expect(() => createPlaceSchema.parse(invalidPlace)).toThrow()
    })
  })
})