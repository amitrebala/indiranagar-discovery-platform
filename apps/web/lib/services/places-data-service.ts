import { googlePlacesService, NearbySearchResult, PlaceDetails } from './google-places'
import { createClient } from '@/lib/supabase/client'
import type { Place } from '@/lib/validations'

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

interface PlaceSearchOptions {
  bounds?: google.maps.LatLngBounds
  categories?: string[]
  keyword?: string
  openNow?: boolean
  minRating?: number
  maxResults?: number
}

interface EnhancedPlaceData extends Place {
  google_place_id?: string
  is_open_now?: boolean
  current_opening_hours?: string
  photos?: string[]
  user_ratings_total?: number
  price_level?: number
  popular_times?: any
  live_busyness?: number
}

class PlacesDataService {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private requestDeduplication: Map<string, Promise<any>> = new Map()
  private supabase = createClient()
  
  // Cache TTLs in milliseconds
  private readonly CACHE_TTL = {
    STATIC_DATA: 24 * 60 * 60 * 1000,  // 24 hours for place details
    DYNAMIC_DATA: 15 * 60 * 1000,       // 15 minutes for opening hours
    SEARCH_RESULTS: 5 * 60 * 1000,      // 5 minutes for search results
    VIEWPORT_PLACES: 2 * 60 * 1000      // 2 minutes for viewport queries
  }

  /**
   * Get places within map viewport with smart caching and Google Places integration
   */
  async getViewportPlaces(
    bounds: { north: number; south: number; east: number; west: number },
    options: PlaceSearchOptions = {}
  ): Promise<EnhancedPlaceData[]> {
    const cacheKey = `viewport:${JSON.stringify({ bounds, options })}`
    
    // Check cache first
    const cached = this.getCached<EnhancedPlaceData[]>(cacheKey, this.CACHE_TTL.VIEWPORT_PLACES)
    if (cached) return cached

    // Deduplicate concurrent requests
    if (this.requestDeduplication.has(cacheKey)) {
      return this.requestDeduplication.get(cacheKey)!
    }

    const request = this.fetchViewportPlaces(bounds, options)
    this.requestDeduplication.set(cacheKey, request)
    
    try {
      const result = await request
      this.setCache(cacheKey, result, this.CACHE_TTL.VIEWPORT_PLACES)
      return result
    } finally {
      this.requestDeduplication.delete(cacheKey)
    }
  }

  private async fetchViewportPlaces(
    bounds: { north: number; south: number; east: number; west: number },
    options: PlaceSearchOptions
  ): Promise<EnhancedPlaceData[]> {
    // Calculate center point for Google Places search
    const centerLat = (bounds.north + bounds.south) / 2
    const centerLng = (bounds.east + bounds.west) / 2
    
    // Calculate radius (diagonal of viewport in meters)
    const radius = this.calculateViewportRadius(bounds)

    // Fetch from both sources in parallel
    const [googlePlaces, supabasePlaces] = await Promise.all([
      this.fetchGooglePlacesInViewport(centerLat, centerLng, radius, options),
      this.fetchSupabasePlacesInBounds(bounds)
    ])

    // Merge and deduplicate places
    return this.mergePlaceData(googlePlaces, supabasePlaces, options)
  }

  private async fetchGooglePlacesInViewport(
    lat: number,
    lng: number,
    radius: number,
    options: PlaceSearchOptions
  ): Promise<NearbySearchResult[]> {
    const places: NearbySearchResult[] = []
    
    // Fetch places for each category
    const categories = options.categories || ['restaurant', 'cafe', 'bar', 'shopping_mall', 'park']
    
    for (const category of categories) {
      try {
        const results = await googlePlacesService.searchNearby(
          lat,
          lng,
          Math.min(radius, 2000), // Google Places max radius is 50km, but we limit to 2km
          category,
          options.keyword
        )
        
        // Filter by additional criteria
        const filtered = results.filter(place => {
          if (options.minRating && place.rating && place.rating < options.minRating) {
            return false
          }
          if (options.openNow && place.opening_hours && !place.opening_hours.open_now) {
            return false
          }
          return true
        })
        
        places.push(...filtered)
      } catch (error) {
        console.error(`Error fetching ${category} places:`, error)
      }
    }

    // Remove duplicates and limit results
    const uniquePlaces = Array.from(
      new Map(places.map(p => [p.place_id, p])).values()
    )
    
    return uniquePlaces.slice(0, options.maxResults || 100)
  }

  private async fetchSupabasePlacesInBounds(
    bounds: { north: number; south: number; east: number; west: number }
  ): Promise<Place[]> {
    const { data, error } = await this.supabase
      .from('places')
      .select('*')
      .gte('latitude', bounds.south)
      .lte('latitude', bounds.north)
      .gte('longitude', bounds.west)
      .lte('longitude', bounds.east)
      .eq('status', 'active')

    if (error) {
      console.error('Error fetching Supabase places:', error)
      return []
    }

    return data || []
  }

  private mergePlaceData(
    googlePlaces: NearbySearchResult[],
    supabasePlaces: Place[],
    options: PlaceSearchOptions
  ): EnhancedPlaceData[] {
    const mergedMap = new Map<string, EnhancedPlaceData>()

    // Add Supabase places first (they have richer custom data)
    for (const place of supabasePlaces) {
      const enhanced: EnhancedPlaceData = {
        ...place,
        photos: place.images?.map(img => img.url) || []
      }
      mergedMap.set(place.id, enhanced)
    }

    // Add or enhance with Google Places data
    for (const googlePlace of googlePlaces) {
      // Check if we already have this place from Supabase
      const existingPlace = Array.from(mergedMap.values()).find(
        p => p.google_place_id === googlePlace.place_id ||
             (p.name.toLowerCase() === googlePlace.name.toLowerCase() &&
              Math.abs(p.latitude - googlePlace.geometry.location.lat) < 0.001 &&
              Math.abs(p.longitude - googlePlace.geometry.location.lng) < 0.001)
      )

      if (existingPlace) {
        // Enhance existing place with live Google data
        existingPlace.is_open_now = googlePlace.opening_hours?.open_now
        existingPlace.rating = googlePlace.rating || existingPlace.rating
        existingPlace.user_ratings_total = googlePlace.user_ratings_total
        existingPlace.price_level = googlePlace.price_level
        existingPlace.google_place_id = googlePlace.place_id
        
        if (googlePlace.photos?.length) {
          existingPlace.photos = [
            ...(existingPlace.photos || []),
            ...googlePlace.photos.slice(0, 3).map(p => `/api/places/photo?reference=${p.photo_reference}`)
          ]
        }
      } else {
        // Add new place from Google
        const newPlace: EnhancedPlaceData = {
          id: `google_${googlePlace.place_id}`,
          name: googlePlace.name,
          description: googlePlace.vicinity,
          latitude: googlePlace.geometry.location.lat,
          longitude: googlePlace.geometry.location.lng,
          address: googlePlace.vicinity,
          category: this.mapGoogleTypeToCategory(googlePlace.types || []),
          rating: googlePlace.rating,
          status: 'active',
          google_place_id: googlePlace.place_id,
          is_open_now: googlePlace.opening_hours?.open_now,
          user_ratings_total: googlePlace.user_ratings_total,
          price_level: googlePlace.price_level,
          photos: googlePlace.photos?.slice(0, 3).map(p => 
            `/api/places/photo?reference=${p.photo_reference}`
          ) || [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        mergedMap.set(newPlace.id, newPlace)
      }
    }

    return Array.from(mergedMap.values())
  }

  /**
   * Search places with autocomplete
   */
  async searchPlaces(query: string, sessionToken?: string): Promise<EnhancedPlaceData[]> {
    if (!query || query.length < 2) return []

    const cacheKey = `search:${query}`
    const cached = this.getCached<EnhancedPlaceData[]>(cacheKey, this.CACHE_TTL.SEARCH_RESULTS)
    if (cached) return cached

    try {
      // Get autocomplete suggestions
      const suggestions = await googlePlacesService.getAutocompleteSuggestions(
        query,
        sessionToken,
        { lat: 12.9716, lng: 77.6411 }, // Indiranagar center
        2000 // 2km radius
      )

      // Get details for top suggestions
      const places: EnhancedPlaceData[] = []
      for (const suggestion of suggestions.slice(0, 5)) {
        const details = await this.getPlaceDetails(suggestion.place_id)
        if (details) {
          places.push(details)
        }
      }

      this.setCache(cacheKey, places, this.CACHE_TTL.SEARCH_RESULTS)
      return places
    } catch (error) {
      console.error('Error searching places:', error)
      return []
    }
  }

  /**
   * Get detailed place information
   */
  async getPlaceDetails(placeId: string): Promise<EnhancedPlaceData | null> {
    const cacheKey = `details:${placeId}`
    const cached = this.getCached<EnhancedPlaceData>(cacheKey, this.CACHE_TTL.STATIC_DATA)
    if (cached) return cached

    try {
      // Check if it's a Google place ID or Supabase ID
      if (placeId.startsWith('google_')) {
        const googlePlaceId = placeId.replace('google_', '')
        const details = await googlePlacesService.getPlaceDetails(googlePlaceId)
        
        if (!details) return null

        const enhanced: EnhancedPlaceData = {
          id: placeId,
          name: details.name,
          description: details.editorial_summary?.overview || details.formatted_address,
          latitude: details.geometry?.location.lat || 0,
          longitude: details.geometry?.location.lng || 0,
          address: details.formatted_address,
          category: this.mapGoogleTypeToCategory(details.types || []),
          rating: details.rating,
          phone: details.formatted_phone_number,
          website: details.website,
          status: 'active',
          google_place_id: googlePlaceId,
          is_open_now: details.opening_hours?.open_now,
          current_opening_hours: googlePlacesService.formatOpeningHours(details.opening_hours),
          user_ratings_total: details.user_ratings_total,
          price_level: details.price_level,
          photos: details.photos?.slice(0, 5).map(p => 
            `/api/places/photo?reference=${p.photo_reference}`
          ) || [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        this.setCache(cacheKey, enhanced, this.CACHE_TTL.STATIC_DATA)
        return enhanced
      } else {
        // Fetch from Supabase
        const { data, error } = await this.supabase
          .from('places')
          .select('*')
          .eq('id', placeId)
          .single()

        if (error || !data) return null

        // Enhance with Google data if available
        if (data.google_place_id) {
          const googleDetails = await googlePlacesService.getPlaceDetails(data.google_place_id)
          if (googleDetails) {
            data.is_open_now = googleDetails.opening_hours?.open_now
            data.current_opening_hours = googlePlacesService.formatOpeningHours(googleDetails.opening_hours)
            data.user_ratings_total = googleDetails.user_ratings_total
            data.price_level = googleDetails.price_level
          }
        }

        this.setCache(cacheKey, data, this.CACHE_TTL.STATIC_DATA)
        return data
      }
    } catch (error) {
      console.error('Error fetching place details:', error)
      return null
    }
  }

  /**
   * Get real-time status for multiple places
   */
  async getPlacesLiveStatus(placeIds: string[]): Promise<Map<string, { isOpen: boolean; status: string }>> {
    const statusMap = new Map<string, { isOpen: boolean; status: string }>()

    await Promise.all(
      placeIds.map(async (placeId) => {
        const details = await this.getPlaceDetails(placeId)
        if (details) {
          statusMap.set(placeId, {
            isOpen: details.is_open_now || false,
            status: details.current_opening_hours || 'Hours not available'
          })
        }
      })
    )

    return statusMap
  }

  // Helper methods
  private getCached<T>(key: string, ttl: number): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null
    
    if (Date.now() - entry.timestamp > ttl) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data as T
  }

  private setCache<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  private calculateViewportRadius(bounds: { north: number; south: number; east: number; west: number }): number {
    const latDiff = bounds.north - bounds.south
    const lngDiff = bounds.east - bounds.west
    
    // Approximate conversion to meters (at Bangalore's latitude)
    const latMeters = latDiff * 111000
    const lngMeters = lngDiff * 111000 * Math.cos(12.9716 * Math.PI / 180)
    
    // Return diagonal distance / 2 as radius
    return Math.sqrt(latMeters * latMeters + lngMeters * lngMeters) / 2
  }

  private mapGoogleTypeToCategory(types: string[]): string {
    const categoryMap: Record<string, string> = {
      restaurant: 'Restaurant',
      cafe: 'Cafe',
      bar: 'Bar',
      night_club: 'Nightlife',
      shopping_mall: 'Shopping',
      clothing_store: 'Shopping',
      park: 'Outdoor',
      gym: 'Fitness',
      spa: 'Wellness',
      bakery: 'Bakery',
      food: 'Food',
      point_of_interest: 'Attraction'
    }

    for (const type of types) {
      if (categoryMap[type]) {
        return categoryMap[type]
      }
    }

    return 'Other'
  }

  /**
   * Clear cache (useful for testing or manual refresh)
   */
  clearCache(): void {
    this.cache.clear()
    this.requestDeduplication.clear()
  }
}

export const placesDataService = new PlacesDataService()