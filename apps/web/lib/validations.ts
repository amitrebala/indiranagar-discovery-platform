import { z } from 'zod'

// Weather conditions enum
export const weatherConditionSchema = z.enum(['sunny', 'rainy', 'cloudy', 'hot', 'cool', 'humid', 'indoor', 'covered', 'outdoor', 'air-conditioned', 'heated', 'garden'])

// Activity type enum
export const activityTypeSchema = z.enum(['before', 'after'])

// Bangalore coordinate boundaries (expanded to include outskirts)
const BANGALORE_BOUNDS = {
  lat: { min: 12.70, max: 13.20 },
  lng: { min: 77.40, max: 77.80 }
}

// Place validation schemas
export const placeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  latitude: z.number()
    .min(BANGALORE_BOUNDS.lat.min, 'Latitude outside Bangalore boundaries')
    .max(BANGALORE_BOUNDS.lat.max, 'Latitude outside Bangalore boundaries'),
  longitude: z.number()
    .min(BANGALORE_BOUNDS.lng.min, 'Longitude outside Bangalore boundaries')
    .max(BANGALORE_BOUNDS.lng.max, 'Longitude outside Bangalore boundaries'),
  rating: z.number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5')
    .multipleOf(0.1, 'Rating must be in 0.1 increments'),
  category: z.string().max(100).optional().nullable(),
  weather_suitability: z.array(weatherConditionSchema).optional().nullable(),
  accessibility_info: z.string().optional().nullable(),
  best_time_to_visit: z.string().max(100).optional().nullable(),
  has_amit_visited: z.boolean().default(false),
  primary_image: z.string().url().optional().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export const createPlaceSchema = placeSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export const updatePlaceSchema = createPlaceSchema.partial()

// Companion Activity validation schemas
export const companionActivitySchema = z.object({
  id: z.string().uuid(),
  place_id: z.string().uuid(),
  activity_type: activityTypeSchema,
  name: z.string().min(1, 'Activity name is required').max(255),
  description: z.string().optional().nullable(),
  timing_minutes: z.number().positive('Timing must be positive').optional().nullable(),
  weather_dependent: z.boolean().default(false),
  created_at: z.string().datetime(),
})

export const createCompanionActivitySchema = companionActivitySchema.omit({
  id: true,
  created_at: true,
})

// Place Image validation schemas
export const placeImageSchema = z.object({
  id: z.string().uuid(),
  place_id: z.string().uuid(),
  storage_path: z.string().min(1, 'Storage path is required').max(500),
  caption: z.string().optional().nullable(),
  is_primary: z.boolean().default(false),
  sort_order: z.number().int().min(0).default(0),
  created_at: z.string().datetime(),
})

export const createPlaceImageSchema = placeImageSchema.omit({
  id: true,
  created_at: true,
})

// File upload validation
export const imageFileSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 50 * 1024 * 1024, 'File size must be less than 50MB')
    .refine((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), 
      'File must be JPEG, PNG, or WebP'),
  caption: z.string().optional(),
  is_primary: z.boolean().default(false),
})

// Content validation functions
export function validateBangalore(lat: number, lng: number): boolean {
  return lat >= BANGALORE_BOUNDS.lat.min && 
         lat <= BANGALORE_BOUNDS.lat.max &&
         lng >= BANGALORE_BOUNDS.lng.min && 
         lng <= BANGALORE_BOUNDS.lng.max
}

// Legacy function name for backward compatibility
export const validateIndiranagar = validateBangalore

export function validateRating(rating: number): boolean {
  return rating >= 1 && rating <= 5 && (rating * 10) % 1 === 0
}

// Type exports
export type Place = z.infer<typeof placeSchema>
export type CreatePlace = z.infer<typeof createPlaceSchema>
export type UpdatePlace = z.infer<typeof updatePlaceSchema>
export type CompanionActivity = z.infer<typeof companionActivitySchema>
export type CreateCompanionActivity = z.infer<typeof createCompanionActivitySchema>
export type PlaceImage = z.infer<typeof placeImageSchema>
export type CreatePlaceImage = z.infer<typeof createPlaceImageSchema>
export type WeatherCondition = z.infer<typeof weatherConditionSchema>
export type ActivityType = z.infer<typeof activityTypeSchema>