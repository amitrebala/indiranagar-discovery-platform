import { NextRequest, NextResponse } from 'next/server'
import { getCachedWeather, setCachedWeather } from '@/lib/weather/cache'
import { fetchFromOpenWeatherMap, fetchFromWeatherAPI, getFallbackWeather } from '@/lib/weather/providers'
import { validateIndiranagar } from '@/lib/validations'

// Rate limiting storage (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimitStore.get(ip)
  
  if (!limit || now > limit.resetTime) {
    // Reset limit every hour
    rateLimitStore.set(ip, { count: 1, resetTime: now + 60 * 60 * 1000 })
    return true
  }
  
  if (limit.count >= 60) { // 60 calls per hour per IP
    return false
  }
  
  limit.count++
  return true
}

export async function GET(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    // Get coordinates from query params
    const { searchParams } = new URL(request.url)
    const latStr = searchParams.get('lat')
    const lngStr = searchParams.get('lng')
    
    if (!latStr || !lngStr) {
      return NextResponse.json(
        { error: 'Missing latitude or longitude parameters' },
        { status: 400 }
      )
    }
    
    const lat = parseFloat(latStr)
    const lng = parseFloat(lngStr)
    
    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: 'Invalid latitude or longitude values' },
        { status: 400 }
      )
    }
    
    // Validate coordinates are within Indiranagar bounds
    if (!validateIndiranagar(lat, lng)) {
      return NextResponse.json(
        { error: 'Coordinates must be within Indiranagar boundaries' },
        { status: 400 }
      )
    }
    
    // Check cache first
    const cachedWeather = getCachedWeather(lat, lng)
    if (cachedWeather) {
      return NextResponse.json({
        success: true,
        data: cachedWeather
      })
    }
    
    // Try primary API (OpenWeatherMap)
    let weatherData = await fetchFromOpenWeatherMap(lat, lng)
    
    // Try backup API if primary fails
    if (!weatherData) {
      weatherData = await fetchFromWeatherAPI(lat, lng)
    }
    
    // Use fallback if both APIs fail
    if (!weatherData) {
      weatherData = getFallbackWeather()
    }
    
    // Cache the result
    setCachedWeather(lat, lng, weatherData)
    
    return NextResponse.json({
      success: true,
      data: weatherData
    })
    
  } catch (error) {
    console.error('Weather API error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}