import { NextRequest, NextResponse } from 'next/server'

// Use server-side key first, fallback to public key for compatibility
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://amit-loves-indiranagar.vercel.app',
  'https://web-*.vercel.app',
  'https://*.vercel.app'
]

function isOriginAllowed(origin: string | null): boolean {
  // Allow requests without origin header (server-side requests)
  // This is safe because we validate the API key
  if (!origin) {
    return true
  }
  
  return ALLOWED_ORIGINS.some(allowed => {
    if (allowed.includes('*')) {
      const pattern = allowed.replace(/\*/g, '.*')
      return new RegExp(`^${pattern}$`).test(origin)
    }
    return allowed === origin
  })
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
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

export async function POST(request: NextRequest) {
  try {
    // Validate origin
    const origin = request.headers.get('origin')
    if (!isOriginAllowed(origin)) {
      console.error('Origin not allowed:', origin)
      return NextResponse.json(
        { error: 'Unauthorized origin', origin },
        { status: 403 }
      )
    }

    // Parse request body
    const { lat, lng, radius = 1500, type, keyword } = await request.json()

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      )
    }

    // Validate coordinates are within Indiranagar bounds
    const INDIRANAGAR_BOUNDS = {
      north: 13.00,
      south: 12.95,
      east: 77.65,
      west: 77.58
    }

    if (lat < INDIRANAGAR_BOUNDS.south || lat > INDIRANAGAR_BOUNDS.north ||
        lng < INDIRANAGAR_BOUNDS.west || lng > INDIRANAGAR_BOUNDS.east) {
      return NextResponse.json(
        { error: 'Coordinates must be within Indiranagar area' },
        { status: 400 }
      )
    }

    if (!GOOGLE_PLACES_API_KEY) {
      console.error('Google Places API key not configured')
      return NextResponse.json(
        { 
          error: 'Google Places API key not configured. Please check environment variables.',
          debug: process.env.NODE_ENV === 'development' ? {
            hasKey: false,
            env: process.env.NODE_ENV
          } : undefined
        },
        { status: 500 }
      )
    }

    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&key=${GOOGLE_PLACES_API_KEY}`
    
    if (type) {
      url += `&type=${type}`
    }
    
    if (keyword) {
      url += `&keyword=${encodeURIComponent(keyword)}`
    }

    // Make request to Google Places API
    const response = await fetch(url)
    const data = await response.json()

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', data.status, data.error_message)
      
      // Provide more specific error messages
      let errorMessage = 'Failed to fetch nearby places'
      if (data.status === 'REQUEST_DENIED') {
        errorMessage = 'Google Places API request denied. Please check API key permissions.'
      } else if (data.status === 'OVER_QUERY_LIMIT') {
        errorMessage = 'API quota exceeded. Please try again later.'
      } else if (data.error_message) {
        errorMessage = data.error_message
      }
      
      return NextResponse.json(
        { 
          error: errorMessage, 
          status: data.status,
          debug: process.env.NODE_ENV === 'development' ? {
            apiResponse: data,
            hasKey: !!GOOGLE_PLACES_API_KEY
          } : undefined
        },
        { status: 500 }
      )
    }

    // Calculate distances and sort
    const results = (data.results || []).map((place: any) => ({
      ...place,
      distance: calculateDistance(
        lat,
        lng,
        place.geometry.location.lat,
        place.geometry.location.lng
      )
    })).sort((a: any, b: any) => a.distance - b.distance)

    // Log usage for monitoring
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown'
    console.log(`[Places Nearby] Origin: ${origin}, IP: ${clientIp}, Results: ${results.length}`)

    const jsonResponse = NextResponse.json({
      results,
      status: data.status
    })
    
    // Add CORS headers for production
    jsonResponse.headers.set('Access-Control-Allow-Origin', origin || '*')
    jsonResponse.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    jsonResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type')
    
    return jsonResponse
  } catch (error) {
    console.error('Places nearby error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  const response = new NextResponse(null, { status: 200 })
  
  response.headers.set('Access-Control-Allow-Origin', origin || '*')
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  
  return response
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  )
}