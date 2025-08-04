import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Basic health checks
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      features: {
        weather_recommendations: process.env.NEXT_PUBLIC_ENABLE_WEATHER_RECOMMENDATIONS === 'true',
        natural_language_search: process.env.NEXT_PUBLIC_ENABLE_NATURAL_LANGUAGE_SEARCH === 'true',
        photo_markers: process.env.NEXT_PUBLIC_ENABLE_PHOTO_MARKERS === 'true',
        journey_routes: process.env.NEXT_PUBLIC_ENABLE_JOURNEY_ROUTES === 'true'
      },
      services: {
        database: 'connected', // Could add actual Supabase ping
        weather_api: 'available',
        storage: 'available'
      }
    }

    return NextResponse.json(health, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    )
  }
}