import { createClient } from './client'

// Storage bucket names
export const STORAGE_BUCKETS = {
  PLACE_IMAGES: 'place-images',
  PLACE_DOCUMENTS: 'place-documents',
  THUMBNAILS: 'thumbnails',
} as const

// Storage configuration
export const STORAGE_CONFIG = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  THUMBNAIL_SIZE: 300,
} as const

// Client-side storage functions
export async function uploadPlaceImage(file: File, placeId: string): Promise<string> {
  const supabase = createClient()
  
  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${placeId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS.PLACE_IMAGES)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }

  return data.path
}

export async function getPlaceImageUrl(path: string): Promise<string> {
  const supabase = createClient()
  
  const { data } = supabase.storage
    .from(STORAGE_BUCKETS.PLACE_IMAGES)
    .getPublicUrl(path)

  return data.publicUrl
}

export async function deletePlaceImage(path: string): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.PLACE_IMAGES)
    .remove([path])

  if (error) {
    throw new Error(`Delete failed: ${error.message}`)
  }
}

// Server-side storage functions
export async function uploadPlaceImageServer(file: File, placeId: string): Promise<string> {
  // For server-side use in API routes
  const supabase = createClient()
  
  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${placeId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS.PLACE_IMAGES)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }

  return data.path
}

// Image optimization utilities
export function generateThumbnailPath(originalPath: string): string {
  const parts = originalPath.split('/')
  const filename = parts.pop()
  const directory = parts.join('/')
  return directory ? `${directory}/thumb_${filename}` : `thumb_${filename}`
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > STORAGE_CONFIG.MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 50MB limit' }
  }

  // Check file type
  const allowedTypes = STORAGE_CONFIG.ALLOWED_TYPES as readonly string[]
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type must be JPEG, PNG, or WebP' }
  }

  return { valid: true }
}

// Storage policy helpers (for setup)
export const STORAGE_POLICIES = {
  PLACE_IMAGES_PUBLIC_READ: `
    CREATE POLICY "Public read access for place images" ON storage.objects
    FOR SELECT USING (bucket_id = 'place-images');
  `,
  PLACE_IMAGES_AUTH_WRITE: `
    CREATE POLICY "Authenticated users can upload place images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'place-images' AND auth.role() = 'authenticated');
  `,
  PLACE_IMAGES_AUTH_UPDATE: `
    CREATE POLICY "Authenticated users can update own place images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'place-images' AND auth.role() = 'authenticated');
  `,
  PLACE_IMAGES_AUTH_DELETE: `
    CREATE POLICY "Authenticated users can delete own place images" ON storage.objects
    FOR DELETE USING (bucket_id = 'place-images' AND auth.role() = 'authenticated');
  `
}