import { NextRequest, NextResponse } from 'next/server'
import { googlePlacesService } from '@/lib/services/google-places'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { placeId } = await request.json()

    if (!placeId) {
      return NextResponse.json(
        { error: 'Place ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get the place from database
    const { data: place, error: placeError } = await supabase
      .from('places')
      .select('*')
      .eq('id', placeId)
      .single()

    if (placeError || !place) {
      return NextResponse.json(
        { error: 'Place not found' },
        { status: 404 }
      )
    }

    // Enrich with Google Places data
    const enrichedData = await googlePlacesService.enrichPlaceData(place)

    // Update the place in database with enriched data
    const { data: updatedPlace, error: updateError } = await supabase
      .from('places')
      .update({
        google_place_id: enrichedData.google_place_id,
        rating: enrichedData.rating,
        price_level: enrichedData.price_level,
        phone: enrichedData.phone || place.phone,
        website: enrichedData.website || place.website,
        opening_hours: enrichedData.opening_hours,
        business_status: enrichedData.business_status,
        metadata: {
          ...place.metadata,
          google_enriched: true,
          google_types: enrichedData.google_types,
          user_ratings_total: enrichedData.user_ratings_total,
          editorial_summary: enrichedData.editorial_summary,
          google_photos: enrichedData.google_photos,
          google_reviews: enrichedData.google_reviews,
          enriched_at: new Date().toISOString()
        }
      })
      .eq('id', placeId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating place:', updateError)
      return NextResponse.json(
        { error: 'Failed to update place' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      place: updatedPlace,
      enriched: true
    })
  } catch (error) {
    console.error('Error enriching place:', error)
    return NextResponse.json(
      { error: 'Failed to enrich place data' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const placeId = searchParams.get('placeId')
    const googlePlaceId = searchParams.get('googlePlaceId')

    if (googlePlaceId) {
      // Get details directly from Google Places
      const details = await googlePlacesService.getPlaceDetails(googlePlaceId)
      return NextResponse.json(details)
    }

    if (placeId) {
      // Get place from database and check if it needs enrichment
      const supabase = await createClient()
      const { data: place, error } = await supabase
        .from('places')
        .select('*')
        .eq('id', placeId)
        .single()

      if (error || !place) {
        return NextResponse.json(
          { error: 'Place not found' },
          { status: 404 }
        )
      }

      // Check if place has Google data
      if (place.google_place_id) {
        const details = await googlePlacesService.getPlaceDetails(place.google_place_id)
        return NextResponse.json(details)
      }

      // Try to find and enrich
      const enrichedData = await googlePlacesService.enrichPlaceData(place)
      return NextResponse.json(enrichedData)
    }

    return NextResponse.json(
      { error: 'Place ID or Google Place ID required' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error getting place details:', error)
    return NextResponse.json(
      { error: 'Failed to get place details' },
      { status: 500 }
    )
  }
}