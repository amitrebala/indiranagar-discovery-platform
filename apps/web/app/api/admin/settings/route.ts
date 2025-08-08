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
    .from('site_settings')
    .select('*')
    .single()

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Return default settings if none exist
  const defaultSettings = {
    siteName: 'Indiranagar Discovery Platform',
    siteDescription: 'Discover the heart of Bangalore',
    contactEmail: 'admin@indiranagar.com',
    maintenanceMode: false,
    allowComments: true,
    allowRatings: true,
    weatherEnabled: true,
    analyticsEnabled: true,
    maxUploadSize: 5242880,
    defaultMapCenter: { lat: 12.9716, lng: 77.5946 },
    socialLinks: {}
  }

  return NextResponse.json(data || defaultSettings)
}

export async function PUT(request: NextRequest) {
  const isAdmin = await verifyAdminAuth(request)
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const settings = await request.json()
  const supabase = await createClient()

  const { error } = await supabase
    .from('site_settings')
    .upsert({
      id: 1, // Single row for settings
      ...settings,
      updated_at: new Date().toISOString()
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}