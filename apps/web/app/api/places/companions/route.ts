import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY

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

async function searchNearby(
  lat: number,
  lng: number,
  radius: number = 1500,
  type?: string,
  keyword?: string
) {
  if (!GOOGLE_PLACES_API_KEY) return []

  try {
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&key=${GOOGLE_PLACES_API_KEY}`
    
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
      const results = data.results.map((place: any) => ({
        ...place,
        distance: calculateDistance(
          lat,
          lng,
          place.geometry.location.lat,
          place.geometry.location.lng
        )
      }))

      // Sort by distance
      return results.sort((a: any, b: any) => 
        (a.distance || 0) - (b.distance || 0)
      )
    }

    return []
  } catch (error) {
    console.error('Error searching nearby places:', error)
    return []
  }
}

async function getCompanionActivities(
  lat: number,
  lng: number,
  category: 'before' | 'after',
  placeType?: string
) {
  if (!GOOGLE_PLACES_API_KEY) return []

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
  const results: any[] = []

  // Search for each type
  for (const type of params.types) {
    const places = await searchNearby(lat, lng, params.radius, type)
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

function getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
  if (!GOOGLE_PLACES_API_KEY || !photoReference) {
    return '/images/placeholder-place.jpg'
  }

  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const lat = parseFloat(searchParams.get('lat') || '0')
    const lng = parseFloat(searchParams.get('lng') || '0')
    const category = searchParams.get('category') as 'before' | 'after' || 'after'
    const placeType = searchParams.get('type') || undefined

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      )
    }

    if (!GOOGLE_PLACES_API_KEY) {
      return NextResponse.json(
        { error: 'Service not configured' },
        { status: 500 }
      )
    }

    // Get companion activities from Google Places
    const companions = await getCompanionActivities(
      lat,
      lng,
      category,
      placeType
    )

    // Format the response
    const formattedCompanions = companions.map(place => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity,
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      price_level: place.price_level,
      distance: place.distance ? `${Math.round(place.distance)}m` : undefined,
      open_now: place.opening_hours?.open_now,
      types: place.types,
      photo_url: place.photos?.[0] 
        ? getPhotoUrl(place.photos[0].photo_reference, 400)
        : null,
      coordinates: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      }
    }))

    return NextResponse.json({
      success: true,
      category,
      companions: formattedCompanions,
      total: formattedCompanions.length
    })
  } catch (error) {
    console.error('Error fetching companion activities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch companion activities' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { placeId, lat, lng } = await request.json()

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Coordinates are required' },
        { status: 400 }
      )
    }

    if (!GOOGLE_PLACES_API_KEY) {
      return NextResponse.json(
        { error: 'Service not configured' },
        { status: 500 }
      )
    }

    // Get both before and after companion activities
    const [beforeActivities, afterActivities] = await Promise.all([
      getCompanionActivities(lat, lng, 'before'),
      getCompanionActivities(lat, lng, 'after')
    ])

    // Format the response
    const formatCompanions = (places: any[]) => places.map(place => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity,
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      price_level: place.price_level,
      distance: place.distance ? `${Math.round(place.distance)}m` : undefined,
      open_now: place.opening_hours?.open_now,
      types: place.types,
      photo_url: place.photos?.[0] 
        ? getPhotoUrl(place.photos[0].photo_reference, 400)
        : null,
      coordinates: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      }
    }))

    return NextResponse.json({
      success: true,
      before: formatCompanions(beforeActivities),
      after: formatCompanions(afterActivities),
      total: beforeActivities.length + afterActivities.length
    })
  } catch (error) {
    console.error('Error fetching companion activities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch companion activities' },
      { status: 500 }
    )
  }
}