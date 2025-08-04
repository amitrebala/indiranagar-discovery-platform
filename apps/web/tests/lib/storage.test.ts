import { describe, it, expect } from 'vitest'
import { validateImageFile, generateThumbnailPath, STORAGE_CONFIG } from '@/lib/supabase/storage'

// Mock File constructor for testing
class MockFile {
  name: string
  size: number
  type: string

  constructor(name: string, size: number, type: string) {
    this.name = name
    this.size = size
    this.type = type
  }
}

describe('Storage Utilities', () => {
  describe('validateImageFile', () => {
    it('should validate correct image files', () => {
      const validFile = new MockFile('test.jpg', 1024 * 1024, 'image/jpeg') as unknown as File
      const result = validateImageFile(validFile)
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject files that are too large', () => {
      const largeFile = new MockFile('large.jpg', STORAGE_CONFIG.MAX_FILE_SIZE + 1, 'image/jpeg') as unknown as File
      const result = validateImageFile(largeFile)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('File size exceeds 50MB limit')
    })

    it('should reject invalid file types', () => {
      const invalidFile = new MockFile('test.pdf', 1024, 'application/pdf') as unknown as File
      const result = validateImageFile(invalidFile)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('File type must be JPEG, PNG, or WebP')
    })

    it('should accept all allowed image types', () => {
      const jpegFile = new MockFile('test.jpg', 1024, 'image/jpeg') as unknown as File
      const pngFile = new MockFile('test.png', 1024, 'image/png') as unknown as File  
      const webpFile = new MockFile('test.webp', 1024, 'image/webp') as unknown as File

      expect(validateImageFile(jpegFile).valid).toBe(true)
      expect(validateImageFile(pngFile).valid).toBe(true)
      expect(validateImageFile(webpFile).valid).toBe(true)
    })
  })

  describe('generateThumbnailPath', () => {
    it('should generate correct thumbnail paths', () => {
      const originalPath = 'place-123/image.jpg'
      const thumbnailPath = generateThumbnailPath(originalPath)
      expect(thumbnailPath).toBe('place-123/thumb_image.jpg')
    })

    it('should handle nested paths', () => {
      const originalPath = 'places/category/place-123/image.png'
      const thumbnailPath = generateThumbnailPath(originalPath)
      expect(thumbnailPath).toBe('places/category/place-123/thumb_image.png')
    })

    it('should handle single filename', () => {
      const originalPath = 'image.webp'
      const thumbnailPath = generateThumbnailPath(originalPath)
      expect(thumbnailPath).toBe('thumb_image.webp')
    })
  })
})