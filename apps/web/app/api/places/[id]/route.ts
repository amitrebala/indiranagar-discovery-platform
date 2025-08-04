import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updatePlaceSchema } from '@/lib/validations'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/places/[id] - Get single place
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('places')
      .select(`
        *,
        companion_activities (*),
        place_images (*)
      `)
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Place not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to fetch place', details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ place: data })
    
  } catch (error) {
    console.error('Get place error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/places/[id] - Update place
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()
    
    // Validate input
    const validationResult = updatePlaceSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      )
    }
    
    const updateData = validationResult.data
    
    // Update place
    const { data, error } = await supabase
      .from('places')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Place not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to update place', details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { place: data, message: 'Place updated successfully' }
    )
    
  } catch (error) {
    console.error('Update place error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/places/[id] - Delete place
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // Delete place (CASCADE will handle related records)
    const { error } = await supabase
      .from('places')
      .delete()
      .eq('id', id)
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete place', details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { message: 'Place deleted successfully' }
    )
    
  } catch (error) {
    console.error('Delete place error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}