import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY // Server-side only, no NEXT_PUBLIC prefix
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://amit-loves-indiranagar.vercel.app',
  'https://web-*.vercel.app',
  'https://*.vercel.app'
]

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false
  
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
      return NextResponse.json(
        { error: 'Unauthorized origin' },
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
        { error: 'Service not configured' },
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
      return NextResponse.json(
        { error: 'Failed to fetch nearby places', status: data.status },
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

    return NextResponse.json({
      results,
      status: data.status
    })
  } catch (error) {
    console.error('Places nearby error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  )
}