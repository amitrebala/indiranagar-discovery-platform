import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createPlaceSchema } from '@/lib/validations'

// GET /api/places - List all places
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const category = searchParams.get('category')
    const featured = searchParams.get('featured') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    // Build query
    let query = supabase
      .from('places')
      .select(`
        *,
        companion_activities (*),
        place_images (*)
      `)
      .order('rating', { ascending: false })
      .range(offset, offset + limit - 1)
    
    // Apply filters
    if (category) {
      query = query.eq('category', category)
    }
    
    // Featured places filter - get high-rated places with recent updates or specific categories
    if (featured) {
      query = query
        .gte('rating', 4.0)
        .limit(5)
        .order('updated_at', { ascending: false })
    }
    
    const { data, error, count } = await query
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch places', details: error.message },
        { status: 500 }
      )
    }
    
    // For featured requests, return just the places array
    if (featured) {
      return NextResponse.json(data)
    }
    
    return NextResponse.json({
      places: data,
      pagination: {
        limit,
        offset,
        total: count
      }
    })
    
  } catch (error) {
    console.error('Places API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/places - Create new place
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    // Validate input
    const validationResult = createPlaceSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      )
    }
    
    const placeData = validationResult.data
    
    // Insert place
    const { data, error } = await supabase
      .from('places')
      .insert([placeData])
      .select()
      .single()
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to create place', details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { place: data, message: 'Place created successfully' },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Create place error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}