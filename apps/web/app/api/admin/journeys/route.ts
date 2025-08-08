import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyAdminAuth } from '@/lib/admin/auth'

export async function GET(request: NextRequest) {
  const isAdmin = await verifyAdminAuth(request)
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('journeys')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdminAuth(request)
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const journey = await request.json()
  const supabase = await createClient()

  // Save the journey
  const { data: journeyData, error: journeyError } = await supabase
    .from('journeys')
    .insert({
      name: journey.name,
      slug: journey.slug,
      description: journey.description,
      mood: journey.mood,
      difficulty: journey.difficulty,
      duration: journey.duration,
      distance: journey.distance,
      best_time: journey.bestTime,
      themes: journey.themes,
      published: true
    })
    .select()
    .single()

  if (journeyError) {
    return NextResponse.json({ error: journeyError.message }, { status: 500 })
  }

  // Save journey stops
  if (journey.stops && journey.stops.length > 0) {
    const stops = journey.stops.map((stop: any) => ({
      journey_id: journeyData.id,
      place_id: stop.placeId,
      stop_order: stop.order,
      duration_minutes: stop.duration,
      activities: stop.activities,
      description: stop.notes,
      tips: stop.notes
    }))

    const { error: stopsError } = await supabase
      .from('journey_stops')
      .insert(stops)

    if (stopsError) {
      console.error('Error saving journey stops:', stopsError)
    }
  }

  return NextResponse.json({ id: journeyData.id })
}

export async function PUT(request: NextRequest) {
  const isAdmin = await verifyAdminAuth(request)
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const journey = await request.json()
  const supabase = await createClient()

  // Update the journey
  const { error: journeyError } = await supabase
    .from('journeys')
    .update({
      name: journey.name,
      slug: journey.slug,
      description: journey.description,
      mood: journey.mood,
      difficulty: journey.difficulty,
      duration: journey.duration,
      distance: journey.distance,
      best_time: journey.bestTime,
      themes: journey.themes,
      updated_at: new Date().toISOString()
    })
    .eq('id', journey.id)

  if (journeyError) {
    return NextResponse.json({ error: journeyError.message }, { status: 500 })
  }

  // Delete existing stops and re-create them
  await supabase
    .from('journey_stops')
    .delete()
    .eq('journey_id', journey.id)

  // Save journey stops
  if (journey.stops && journey.stops.length > 0) {
    const stops = journey.stops.map((stop: any) => ({
      journey_id: journey.id,
      place_id: stop.placeId,
      stop_order: stop.order,
      duration_minutes: stop.duration,
      activities: stop.activities,
      description: stop.notes,
      tips: stop.notes
    }))

    const { error: stopsError } = await supabase
      .from('journey_stops')
      .insert(stops)

    if (stopsError) {
      console.error('Error saving journey stops:', stopsError)
    }
  }

  return NextResponse.json({ id: journey.id })
}