import { NextRequest, NextResponse } from 'next/server'
import { WalkingDirection } from '@/lib/types/journey'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const fromLat = searchParams.get('from_lat')
    const fromLng = searchParams.get('from_lng')
    const toLat = searchParams.get('to_lat')
    const toLng = searchParams.get('to_lng')

    if (!fromLat || !fromLng || !toLat || !toLng) {
      return NextResponse.json(
        { error: 'Missing coordinates' },
        { status: 400 }
      )
    }

    // Calculate simple walking directions
    // In production, this would use Google Maps Directions API
    const from = [parseFloat(fromLat), parseFloat(fromLng)]
    const to = [parseFloat(toLat), parseFloat(toLng)]
    
    // Calculate distance using Haversine formula
    const R = 6371e3 // Earth's radius in meters
    const φ1 = from[0] * Math.PI / 180
    const φ2 = to[0] * Math.PI / 180
    const Δφ = (to[0] - from[0]) * Math.PI / 180
    const Δλ = (to[1] - from[1]) * Math.PI / 180

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const distance = R * c

    // Estimate walking time (average walking speed: 5 km/h)
    const walkingSpeedMps = 5 * 1000 / 3600 // meters per second
    const estimatedSeconds = distance / walkingSpeedMps
    const estimatedMinutes = Math.ceil(estimatedSeconds / 60)

    // Generate simple path (for now, just direct line)
    // In production, this would be the actual route from Google Maps
    const path = [
      from,
      // Add intermediate points for curved path
      [
        from[0] + (to[0] - from[0]) * 0.3,
        from[1] + (to[1] - from[1]) * 0.3
      ],
      [
        from[0] + (to[0] - from[0]) * 0.7,
        from[1] + (to[1] - from[1]) * 0.7
      ],
      to
    ]

    // Generate landmarks based on area
    const landmarks = generateLandmarks(from, to)

    const directions: WalkingDirection = {
      from_coordinates: from,
      to_coordinates: to,
      path,
      distance_meters: Math.round(distance),
      estimated_minutes: estimatedMinutes,
      landmarks
    }

    return NextResponse.json(directions)
  } catch (error) {
    console.error('Error generating directions:', error)
    return NextResponse.json(
      { error: 'Failed to generate directions' },
      { status: 500 }
    )
  }
}

function generateLandmarks(from: number[], to: number[]): string[] {
  // Simple landmark generation based on Indiranagar knowledge
  const landmarks = []
  
  // Check if route passes through main areas
  const avgLat = (from[0] + to[0]) / 2
  const avgLng = (from[1] + to[1]) / 2
  
  if (avgLat > 12.971 && avgLat < 12.975) {
    landmarks.push('100 Feet Road')
  }
  
  if (avgLng > 77.640 && avgLng < 77.645) {
    landmarks.push('CMH Road')
  }
  
  if (avgLat > 12.968 && avgLat < 12.972) {
    landmarks.push('12th Main Road')
  }
  
  if (landmarks.length === 0) {
    landmarks.push('Indiranagar')
  }
  
  return landmarks
}