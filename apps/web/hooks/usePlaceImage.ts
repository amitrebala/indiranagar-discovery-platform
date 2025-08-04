import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { ImageSourceManager, ImageResult } from '@/lib/services/image-sources'
import type { Place, PlaceImage } from '@/lib/supabase/types'

type ImageLoadStatus = 'idle' | 'loading' | 'success' | 'error'

interface UsePlaceImageResult {
  imageUrl: string | undefined
  thumbnailUrl: string | undefined
  attribution: ImageResult['attribution'] | undefined
  status: ImageLoadStatus
  error: Error | null
  refetch: () => void
  isFromCache: boolean
}

const PLACEHOLDER_IMAGE = '/images/placeholder-place.jpg'
const IMAGE_CACHE_KEY_PREFIX = 'place-image-'
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

interface CachedImage {
  url: string
  thumbnailUrl?: string
  attribution?: ImageResult['attribution']
  timestamp: number
}

let imageSourceManager: ImageSourceManager | null = null

function getImageSourceManager(): ImageSourceManager {
  if (!imageSourceManager) {
    imageSourceManager = new ImageSourceManager()
  }
  return imageSourceManager
}

function getCacheKey(placeId: string): string {
  return `${IMAGE_CACHE_KEY_PREFIX}${placeId}`
}

function getCachedImage(placeId: string): CachedImage | null {
  if (typeof window === 'undefined') return null
  
  try {
    const cached = localStorage.getItem(getCacheKey(placeId))
    if (!cached) return null
    
    const data = JSON.parse(cached) as CachedImage
    const now = Date.now()
    
    if (now - data.timestamp > CACHE_DURATION) {
      localStorage.removeItem(getCacheKey(placeId))
      return null
    }
    
    return data
  } catch {
    return null
  }
}

function setCachedImage(placeId: string, image: Omit<CachedImage, 'timestamp'>): void {
  if (typeof window === 'undefined') return
  
  try {
    const data: CachedImage = {
      ...image,
      timestamp: Date.now(),
    }
    localStorage.setItem(getCacheKey(placeId), JSON.stringify(data))
  } catch (error) {
    console.error('Failed to cache image:', error)
  }
}

export function usePlaceImage(place: Place): UsePlaceImageResult {
  const [imageUrl, setImageUrl] = useState<string | undefined>()
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>()
  const [attribution, setAttribution] = useState<ImageResult['attribution'] | undefined>()
  const [status, setStatus] = useState<ImageLoadStatus>('idle')
  const [error, setError] = useState<Error | null>(null)
  const [isFromCache, setIsFromCache] = useState(false)

  const discoverImage = useCallback(async () => {
    if (!place.id || !place.name) {
      setImageUrl(PLACEHOLDER_IMAGE)
      setStatus('success')
      return
    }

    setStatus('loading')
    setError(null)
    setIsFromCache(false)

    try {
      // 1. Check cache first
      const cached = getCachedImage(place.id)
      if (cached) {
        setImageUrl(cached.url)
        setThumbnailUrl(cached.thumbnailUrl)
        setAttribution(cached.attribution)
        setIsFromCache(true)
        setStatus('success')
        return
      }

      // 2. Check existing place_images in database
      const { data: existingImages, error: dbError } = await supabase
        .from('place_images')
        .select('*')
        .eq('place_id', place.id)
        .order('is_primary', { ascending: false })
        .order('sort_order')
        .limit(1)

      if (dbError) {
        console.error('Database error:', dbError)
      } else if (existingImages && existingImages.length > 0) {
        const primaryImage = existingImages[0] as PlaceImage
        const imageUrl = getImageUrl(primaryImage.storage_path)
        
        setImageUrl(imageUrl)
        setCachedImage(place.id, { url: imageUrl })
        setStatus('success')
        return
      }

      // 3. Search external sources
      const manager = getImageSourceManager()
      const discovered = await manager.findImages(place.name, {
        location: place.latitude && place.longitude 
          ? { lat: place.latitude, lng: place.longitude }
          : undefined,
        limit: 1,
      })

      if (discovered.length > 0) {
        const bestImage = discovered[0]
        setImageUrl(bestImage.url)
        setThumbnailUrl(bestImage.thumbnail)
        setAttribution(bestImage.attribution)
        
        // Cache the discovered image
        setCachedImage(place.id, {
          url: bestImage.url,
          thumbnailUrl: bestImage.thumbnail,
          attribution: bestImage.attribution,
        })

        // Optionally save to database for future use
        if (process.env.NEXT_PUBLIC_AUTO_SAVE_IMAGES === 'true') {
          await saveDiscoveredImage(place.id, bestImage)
        }

        setStatus('success')
      } else {
        // No images found, use placeholder
        setImageUrl(PLACEHOLDER_IMAGE)
        setStatus('success')
      }
    } catch (err) {
      console.error('Image discovery error:', err)
      setError(err instanceof Error ? err : new Error('Failed to discover image'))
      setImageUrl(PLACEHOLDER_IMAGE)
      setStatus('error')
    }
  }, [place.id, place.name, place.latitude, place.longitude])

  useEffect(() => {
    discoverImage()
  }, [discoverImage])

  return {
    imageUrl,
    thumbnailUrl,
    attribution,
    status,
    error,
    refetch: discoverImage,
    isFromCache,
  }
}

function getImageUrl(storagePath: string): string {
  if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
    return storagePath
  }

  if (storagePath.startsWith('places/')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    return `${supabaseUrl}/storage/v1/object/public/place-images/${storagePath}`
  }

  return storagePath
}

async function saveDiscoveredImage(placeId: string, image: ImageResult): Promise<void> {
  try {
    const { error } = await supabase.from('place_images').insert({
      place_id: placeId,
      storage_path: image.url,
      caption: `Photo by ${image.attribution.author} on ${image.attribution.source}`,
      is_primary: true,
      sort_order: 0,
    })

    if (error) {
      console.error('Failed to save discovered image:', error)
    }
  } catch (error) {
    console.error('Error saving discovered image:', error)
  }
}