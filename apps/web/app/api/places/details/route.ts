import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
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
    const { placeId, fields } = await request.json()

    if (!placeId) {
      return NextResponse.json(
        { error: 'Place ID is required' },
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

    // Default fields if not specified
    const requestedFields = fields || [
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
    ]

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${requestedFields.join(',')}&key=${GOOGLE_PLACES_API_KEY}`
    
    // Make request to Google Places API
    const response = await fetch(url)
    const data = await response.json()

    if (data.status !== 'OK') {
      console.error('Google Places API error:', data.status, data.error_message)
      return NextResponse.json(
        { error: 'Failed to fetch place details', status: data.status },
        { status: 500 }
      )
    }

    // Log usage for monitoring
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown'
    console.log(`[Places Details] Origin: ${origin}, IP: ${clientIp}, Place: ${data.result?.name}`)

    return NextResponse.json({
      result: data.result,
      status: data.status
    })
  } catch (error) {
    console.error('Places details error:', error)
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