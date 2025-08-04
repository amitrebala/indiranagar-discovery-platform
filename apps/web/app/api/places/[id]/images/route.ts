import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { uploadPlaceImageServer, validateImageFile } from '@/lib/supabase/storage'
import { createPlaceImageSchema } from '@/lib/validations'

interface RouteParams {
  params: Promise<{ id: string }>
}

// POST /api/places/[id]/images - Upload place image
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: placeId } = await params
    const supabase = await createClient()
    
    // Verify place exists
    const { data: place, error: placeError } = await supabase
      .from('places')
      .select('id')
      .eq('id', placeId)
      .single()
    
    if (placeError || !place) {
      return NextResponse.json(
        { error: 'Place not found' },
        { status: 404 }
      )
    }
    
    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const caption = formData.get('caption') as string
    const isPrimary = formData.get('is_primary') === 'true'
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }
    
    // Validate file
    const validation = validateImageFile(file)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }
    
    // Upload to storage
    const storagePath = await uploadPlaceImageServer(file, placeId)
    
    // If this is primary, unset other primary images
    if (isPrimary) {
      await supabase
        .from('place_images')
        .update({ is_primary: false })
        .eq('place_id', placeId)
        .eq('is_primary', true)
    }
    
    // Create image record
    const imageData = {
      place_id: placeId,
      storage_path: storagePath,
      caption: caption || null,
      is_primary: isPrimary,
      sort_order: 0
    }
    
    const validationResult = createPlaceImageSchema.safeParse(imageData)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid image data', details: validationResult.error.issues },
        { status: 400 }
      )
    }
    
    const { data, error } = await supabase
      .from('place_images')
      .insert([validationResult.data])
      .select()
      .single()
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to create image record', details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { image: data, message: 'Image uploaded successfully' },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/places/[id]/images - Get place images
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: placeId } = await params
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('place_images')
      .select('*')
      .eq('place_id', placeId)
      .order('is_primary', { ascending: false })
      .order('sort_order', { ascending: true })
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch images', details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ images: data })
    
  } catch (error) {
    console.error('Get images error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}