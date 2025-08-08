import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

// This is a Vercel Cron Job that runs automatically
// Configure in vercel.json: "crons": [{"path": "/api/cron/fetch-events", "schedule": "0 */6 * * *"}]

// Simple Google Places fetcher (no external dependencies needed)
async function fetchGooglePlacesEvents() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.log('Google Places API key not configured');
    return [];
  }

  const events = [];
  const lat = 12.9716; // Indiranagar
  const lng = 77.6411;
  const radius = 2000;

  try {
    // Search for nearby places
    const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant|cafe|bar&key=${apiKey}`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.results) {
      for (const place of searchData.results.slice(0, 5)) { // Limit to 5 for demo
        // Get place details
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,geometry,opening_hours,website,photos,editorial_summary&key=${apiKey}`;
        const detailsResponse = await fetch(detailsUrl);
        const details = await detailsResponse.json();

        if (details.result) {
          const result = details.result;
          events.push({
            external_id: place.place_id,
            title: `Visit ${result.name}`,
            description: result.editorial_summary?.overview || `Popular spot in Indiranagar`,
            category: place.types?.includes('restaurant') ? 'dining' : 'venue',
            start_time: new Date().toISOString(),
            end_time: new Date(Date.now() + 7200000).toISOString(), // 2 hours
            venue_name: result.name,
            venue_address: result.formatted_address,
            latitude: result.geometry?.location?.lat,
            longitude: result.geometry?.location?.lng,
            external_url: result.website,
            cost_type: 'free',
            quality_score: 0.8,
            moderation_status: 'pending',
            is_active: true
          });
        }
      }
    }
  } catch (error) {
    console.error('Error fetching from Google Places:', error);
  }

  return events;
}

export async function GET(request: NextRequest) {
  try {
    // Verify this is a valid cron request (in production)
    if (process.env.NODE_ENV === 'production') {
      const authHeader = headers().get('authorization');
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    console.log('🔄 Starting scheduled event fetch...');
    
    const supabase = await createClient();
    
    // Fetch events from various sources
    const googleEvents = await fetchGooglePlacesEvents();
    
    // Store in staging table
    let newEventsCount = 0;
    for (const event of googleEvents) {
      // Check if event already exists
      const { data: existing } = await supabase
        .from('discovered_events')
        .select('id')
        .eq('external_id', event.external_id)
        .single();

      if (!existing) {
        const { error } = await supabase
          .from('discovered_events')
          .insert(event);

        if (!error) {
          newEventsCount++;
        } else {
          console.error('Error inserting event:', error);
        }
      }
    }

    // Log fetch history
    await supabase
      .from('fetch_history')
      .insert({
        source_id: 'google-places',
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        status: 'success',
        events_found: googleEvents.length,
        events_processed: newEventsCount,
        execution_time_ms: Date.now()
      });

    console.log(`✅ Fetch completed. Found ${googleEvents.length} events, added ${newEventsCount} new`);

    return NextResponse.json({
      success: true,
      message: `Fetched ${googleEvents.length} events, added ${newEventsCount} new`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// Allow manual triggering in development
export async function POST(request: NextRequest) {
  return GET(request);
}