import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createPlaceSchema } from '@/lib/validations'
import { APPROVED_PLACES_WHITELIST } from '@/data/approved-places-whitelist'

// Only show places from approved whitelist
const ALLOWED_PLACE_NAMES = APPROVED_PLACES_WHITELIST

// Google Places API configuration
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

// Helper function to fetch Google Place details including photos
async function fetchGooglePlaceDetails(placeName: string, lat?: number, lng?: number) {
  if (!GOOGLE_PLACES_API_KEY) return null
  
  try {
    // First, search for the place near the given coordinates
    const searchUrl = lat && lng 
      ? `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=100&keyword=${encodeURIComponent(placeName)}&key=${GOOGLE_PLACES_API_KEY}`
      : `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(placeName + ' Indiranagar Bangalore')}&inputtype=textquery&fields=place_id,photos&key=${GOOGLE_PLACES_API_KEY}`
    
    const searchResponse = await fetch(searchUrl)
    const searchData = await searchResponse.json()
    
    if (searchData.results && searchData.results.length > 0) {
      const place = searchData.results[0]
      if (place.photos && place.photos.length > 0) {
        return {
          google_photo_reference: place.photos[0].photo_reference,
          google_place_id: place.place_id
        }
      }
    } else if (searchData.candidates && searchData.candidates.length > 0) {
      const candidate = searchData.candidates[0]
      if (candidate.photos && candidate.photos.length > 0) {
        return {
          google_photo_reference: candidate.photos[0].photo_reference,
          google_place_id: candidate.place_id
        }
      }
    }
    
    return null
  } catch (error) {
    console.error(`Error fetching Google place details for ${placeName}:`, error)
    return null
  }
}

// Helper function to enrich places with Google Photos
async function enrichPlacesWithGooglePhotos(places: any[]) {
  // Only enrich if we have API key
  if (!GOOGLE_PLACES_API_KEY) return places
  
  // Create promises for all places
  const enrichmentPromises = places.map(async (place) => {
    // Skip if place already has an image
    if (place.primary_image) {
      return place
    }
    
    // Try to fetch Google Photos for this place
    const googleData = await fetchGooglePlaceDetails(
      place.name,
      place.latitude,
      place.longitude
    )
    
    if (googleData) {
      return {
        ...place,
        google_photo_reference: googleData.google_photo_reference,
        google_place_id: googleData.google_place_id
      }
    }
    
    return place
  })
  
  // Wait for all enrichments to complete
  return Promise.all(enrichmentPromises)
}

// GET /api/places - List all places
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const category = searchParams.get('category')
    const featured = searchParams.get('featured') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    // Build query
    let query = supabase
      .from('places')
      .select(`
        *,
        companion_activities (*),
        place_images (*)
      `)
      .eq('has_amit_visited', true) // Only show places Amit has visited
      .in('name', ALLOWED_PLACE_NAMES) // ONLY show places from Amit's verified list
      .order('rating', { ascending: false })
      .range(offset, offset + limit - 1)
    
    // Apply filters
    if (category) {
      query = query.eq('category', category)
    }
    
    // Featured places filter - get high-rated places with recent updates or specific categories
    if (featured) {
      query = query
        .gte('rating', 4.0)
        .limit(5)
        .order('updated_at', { ascending: false })
    }
    
    const { data, error, count } = await query
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch places', details: error.message },
        { status: 500 }
      )
    }
    
    // Enrich places with Google Photos data if available
    const enrichedData = await enrichPlacesWithGooglePhotos(data || [])
    
    // For featured requests, return just the places array
    if (featured) {
      return NextResponse.json(enrichedData)
    }
    
    return NextResponse.json({
      places: enrichedData,
      pagination: {
        limit,
        offset,
        total: count
      }
    })
    
  } catch (error) {
    console.error('Places API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/places - Create new place
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    // Validate input
    const validationResult = createPlaceSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      )
    }
    
    const placeData = validationResult.data
    
    // Insert place
    const { data, error } = await supabase
      .from('places')
      .insert([placeData])
      .select()
      .single()
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to create place', details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { place: data, message: 'Place created successfully' },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Create place error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}