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
    const { query, fields } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
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

    const requestedFields = fields || [
      'place_id',
      'name',
      'formatted_address',
      'geometry',
      'rating',
      'opening_hours',
      'photos'
    ]

    const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=${requestedFields.join(',')}&key=${GOOGLE_PLACES_API_KEY}`

    // Make request to Google Places API
    const response = await fetch(url)
    const data = await response.json()

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', data.status, data.error_message)
      return NextResponse.json(
        { error: 'Failed to search places', status: data.status },
        { status: 500 }
      )
    }

    // Log usage for monitoring
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown'
    console.log(`[Places Search] Origin: ${origin}, IP: ${clientIp}, Query: ${query}`)

    return NextResponse.json({
      result: data.candidates && data.candidates.length > 0 ? data.candidates[0] : null,
      status: data.status
    })
  } catch (error) {
    console.error('Places search error:', error)
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