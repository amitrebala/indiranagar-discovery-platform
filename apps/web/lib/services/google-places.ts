import { EnhancedPlace } from '@/lib/types/enhanced-place'

const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

export interface PlaceDetails {
  place_id: string
  name: string
  formatted_address: string
  formatted_phone_number?: string
  international_phone_number?: string
  website?: string
  rating?: number
  user_ratings_total?: number
  price_level?: number
  opening_hours?: {
    open_now?: boolean
    periods?: Array<{
      open: { day: number; time: string }
      close?: { day: number; time: string }
    }>
    weekday_text?: string[]
  }
  photos?: Array<{
    photo_reference: string
    height: number
    width: number
    html_attributions: string[]
  }>
  reviews?: Array<{
    author_name: string
    rating: number
    relative_time_description: string
    text: string
    time: number
  }>
  types?: string[]
  business_status?: string
  geometry?: {
    location: {
      lat: number
      lng: number
    }
  }
  editorial_summary?: {
    overview?: string
  }
}

export interface NearbySearchResult {
  place_id: string
  name: string
  vicinity: string
  rating?: number
  user_ratings_total?: number
  price_level?: number
  types?: string[]
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  opening_hours?: {
    open_now?: boolean
  }
  photos?: Array<{
    photo_reference: string
    height: number
    width: number
  }>
  distance?: number
}

export interface AutocompleteResult {
  place_id: string
  description: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
  types: string[]
}

class GooglePlacesService {
  private apiKey: string
  private baseUrl = 'https://places.googleapis.com/v1'
  private legacyBaseUrl = 'https://maps.googleapis.com/maps/api/place'

  constructor() {
    if (!GOOGLE_PLACES_API_KEY) {
      console.warn('Google Places API key not configured')
    }
    this.apiKey = GOOGLE_PLACES_API_KEY || ''
  }

  private isConfigured(): boolean {
    return !!this.apiKey
  }

  /**
   * Get detailed information about a place
   */
  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    if (!this.isConfigured()) return null

    try {
      const fields = [
        'place_id',
        'name',
        'formatted_address',
        'formatted_phone_number',
        'international_phone_number',
        'website',
        'rating',
        'user_ratings_total',
        'price_level',
        'opening_hours',
        'photos',
        'reviews',
        'types',
        'business_status',
        'geometry',
        'editorial_summary'
      ].join(',')

      const url = `${this.legacyBaseUrl}/details/json?place_id=${placeId}&fields=${fields}&key=${this.apiKey}`
      
      const response = await fetch(url)
      const data = await response.json()

      if (data.status === 'OK' && data.result) {
        return data.result as PlaceDetails
      }

      console.error('Place details error:', data.status)
      return null
    } catch (error) {
      console.error('Error fetching place details:', error)
      return null
    }
  }

  /**
   * Search for places nearby a location
   */
  async searchNearby(
    lat: number,
    lng: number,
    radius: number = 1500,
    type?: string,
    keyword?: string
  ): Promise<NearbySearchResult[]> {
    if (!this.isConfigured()) return []

    try {
      let url = `${this.legacyBaseUrl}/nearbysearch/json?location=${lat},${lng}&radius=${radius}&key=${this.apiKey}`
      
      if (type) {
        url += `&type=${type}`
      }
      
      if (keyword) {
        url += `&keyword=${encodeURIComponent(keyword)}`
      }

      const response = await fetch(url)
      const data = await response.json()

      if (data.status === 'OK' && data.results) {
        // Calculate distances
        const results = data.results.map((place: NearbySearchResult) => ({
          ...place,
          distance: this.calculateDistance(
            lat,
            lng,
            place.geometry.location.lat,
            place.geometry.location.lng
          )
        }))

        // Sort by distance
        return results.sort((a: NearbySearchResult, b: NearbySearchResult) => 
          (a.distance || 0) - (b.distance || 0)
        )
      }

      return []
    } catch (error) {
      console.error('Error searching nearby places:', error)
      return []
    }
  }

  /**
   * Get autocomplete suggestions for place search
   */
  async getAutocompleteSuggestions(
    input: string,
    sessionToken?: string,
    location?: { lat: number; lng: number },
    radius?: number
  ): Promise<AutocompleteResult[]> {
    if (!this.isConfigured() || !input) return []

    try {
      let url = `${this.legacyBaseUrl}/autocomplete/json?input=${encodeURIComponent(input)}&key=${this.apiKey}`
      
      if (sessionToken) {
        url += `&sessiontoken=${sessionToken}`
      }
      
      if (location) {
        url += `&location=${location.lat},${location.lng}`
        if (radius) {
          url += `&radius=${radius}`
        }
      }

      // Restrict to India for Indiranagar focus
      url += '&components=country:in'

      const response = await fetch(url)
      const data = await response.json()

      if (data.status === 'OK' && data.predictions) {
        return data.predictions as AutocompleteResult[]
      }

      return []
    } catch (error) {
      console.error('Error getting autocomplete suggestions:', error)
      return []
    }
  }

  /**
   * Get a photo URL from a photo reference
   */
  getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
    if (!this.isConfigured() || !photoReference) {
      return '/images/placeholder-place.jpg'
    }

    return `${this.legacyBaseUrl}/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${this.apiKey}`
  }

  /**
   * Find places by text query
   */
  async findPlaceFromText(query: string, fields?: string[]): Promise<PlaceDetails | null> {
    if (!this.isConfigured() || !query) return null

    try {
      const requestedFields = fields || [
        'place_id',
        'name',
        'formatted_address',
        'geometry',
        'rating',
        'opening_hours',
        'photos'
      ]

      const url = `${this.legacyBaseUrl}/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=${requestedFields.join(',')}&key=${this.apiKey}`

      const response = await fetch(url)
      const data = await response.json()

      if (data.status === 'OK' && data.candidates && data.candidates.length > 0) {
        return data.candidates[0] as PlaceDetails
      }

      return null
    } catch (error) {
      console.error('Error finding place from text:', error)
      return null
    }
  }

  /**
   * Enrich existing place data with Google Places information
   */
  async enrichPlaceData(place: Partial<EnhancedPlace>): Promise<Partial<EnhancedPlace>> {
    if (!this.isConfigured()) return place

    try {
      // Try to find the place using name and address
      const query = `${place.name} ${place.address || ''} Indiranagar Bangalore`
      const googlePlace = await this.findPlaceFromText(query)

      if (!googlePlace || !googlePlace.place_id) {
        return place
      }

      // Get detailed information
      const details = await this.getPlaceDetails(googlePlace.place_id)
      
      if (!details) {
        return place
      }

      // Merge Google data with existing place data
      const enrichedPlace: Partial<EnhancedPlace> = {
        ...place,
        google_place_id: details.place_id,
        phone: details.formatted_phone_number || place.phone,
        website: details.website || place.website,
        rating: details.rating || place.rating,
        price_level: details.price_level,
        opening_hours: details.opening_hours?.weekday_text,
        business_status: details.business_status,
        user_ratings_total: details.user_ratings_total,
        editorial_summary: details.editorial_summary?.overview,
        google_types: details.types
      }

      // Add Google photos if available
      if (details.photos && details.photos.length > 0) {
        enrichedPlace.google_photos = details.photos.slice(0, 5).map(photo => ({
          url: this.getPhotoUrl(photo.photo_reference, 800),
          attribution: photo.html_attributions?.[0] || 'Google Places'
        }))
      }

      // Add latest reviews if available
      if (details.reviews && details.reviews.length > 0) {
        enrichedPlace.google_reviews = details.reviews.slice(0, 3).map(review => ({
          author: review.author_name,
          rating: review.rating,
          text: review.text,
          time: review.relative_time_description
        }))
      }

      return enrichedPlace
    } catch (error) {
      console.error('Error enriching place data:', error)
      return place
    }
  }

  /**
   * Get companion activities near a place
   */
  async getCompanionActivities(
    lat: number,
    lng: number,
    category: 'before' | 'after',
    placeType?: string
  ): Promise<NearbySearchResult[]> {
    if (!this.isConfigured()) return []

    // Define search parameters based on category
    const searchParams = {
      before: {
        types: ['cafe', 'bakery', 'bar'],
        keywords: ['coffee', 'breakfast', 'tea', 'juice'],
        radius: 500
      },
      after: {
        types: ['bar', 'dessert', 'ice_cream_shop', 'cafe'],
        keywords: ['drinks', 'dessert', 'ice cream', 'cocktail'],
        radius: 500
      }
    }

    const params = searchParams[category]
    const results: NearbySearchResult[] = []

    // Search for each type
    for (const type of params.types) {
      const places = await this.searchNearby(lat, lng, params.radius, type)
      results.push(...places)
    }

    // Remove duplicates and sort by rating and distance
    const uniquePlaces = Array.from(
      new Map(results.map(place => [place.place_id, place])).values()
    )

    return uniquePlaces
      .sort((a, b) => {
        // Prioritize by rating first, then distance
        const ratingDiff = (b.rating || 0) - (a.rating || 0)
        if (Math.abs(ratingDiff) > 0.5) return ratingDiff
        return (a.distance || 0) - (b.distance || 0)
      })
      .slice(0, 5) // Return top 5 suggestions
  }

  /**
   * Calculate distance between two coordinates in meters
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180
    const φ2 = lat2 * Math.PI / 180
    const Δφ = (lat2 - lat1) * Math.PI / 180
    const Δλ = (lng2 - lng1) * Math.PI / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // Distance in meters
  }

  /**
   * Format opening hours for display
   */
  formatOpeningHours(openingHours?: PlaceDetails['opening_hours']): string {
    if (!openingHours || !openingHours.weekday_text) {
      return 'Hours not available'
    }

    const today = new Date().getDay()
    const todayText = openingHours.weekday_text[today === 0 ? 6 : today - 1]
    
    if (openingHours.open_now !== undefined) {
      const status = openingHours.open_now ? 'Open' : 'Closed'
      return `${status} • ${todayText}`
    }

    return todayText
  }
}

export const googlePlacesService = new GooglePlacesService()