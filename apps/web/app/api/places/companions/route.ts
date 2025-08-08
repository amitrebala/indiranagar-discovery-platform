import { NextRequest, NextResponse } from 'next/server'
import { googlePlacesService } from '@/lib/services/google-places'

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

    // Get companion activities from Google Places
    const companions = await googlePlacesService.getCompanionActivities(
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
        ? googlePlacesService.getPhotoUrl(place.photos[0].photo_reference, 400)
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

    // Get both before and after companion activities
    const [beforeActivities, afterActivities] = await Promise.all([
      googlePlacesService.getCompanionActivities(lat, lng, 'before'),
      googlePlacesService.getCompanionActivities(lat, lng, 'after')
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
        ? googlePlacesService.getPhotoUrl(place.photos[0].photo_reference, 400)
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