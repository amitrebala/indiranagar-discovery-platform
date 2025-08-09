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

    // Rate limiting check (implement with Redis in production)
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown'
    
    // Parse request body
    const { input, sessionToken, location, radius } = await request.json()

    if (!input) {
      return NextResponse.json(
        { error: 'Input query is required' },
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

    // Build Google Places API URL
    let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${GOOGLE_PLACES_API_KEY}`
    
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

    // Make request to Google Places API
    const response = await fetch(url)
    const data = await response.json()

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', data.status, data.error_message)
      return NextResponse.json(
        { error: 'Failed to fetch suggestions', status: data.status },
        { status: 500 }
      )
    }

    // Log usage for monitoring (implement proper analytics in production)
    console.log(`[Places Autocomplete] Origin: ${origin}, IP: ${clientIp}, Results: ${data.predictions?.length || 0}`)

    return NextResponse.json({
      predictions: data.predictions || [],
      status: data.status
    })
  } catch (error) {
    console.error('Places autocomplete error:', error)
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