import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Google Places categories that typically have events
const EVENT_PLACE_TYPES = [
  'night_club',
  'bar',
  'restaurant',
  'cafe',
  'museum',
  'art_gallery',
  'movie_theater',
  'stadium',
  'amusement_park',
  'bowling_alley',
  'casino',
  'gym',
  'library',
  'university',
  'church',
  'hindu_temple',
  'mosque',
  'park',
  'shopping_mall',
  'spa',
  'tourist_attraction',
  'zoo'
];

// Indiranagar boundaries
const INDIRANAGAR_CENTER = { lat: 12.9716, lng: 77.6411 };
const SEARCH_RADIUS = 2000; // 2km radius

interface GooglePlace {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: { lat: number; lng: number; };
  };
  types: string[];
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: {
    open_now: boolean;
    weekday_text?: string[];
  };
  photos?: Array<{
    photo_reference: string;
  }>;
  price_level?: number;
}

interface PlaceDetails {
  result: {
    place_id: string;
    name: string;
    formatted_address: string;
    formatted_phone_number?: string;
    website?: string;
    opening_hours?: {
      open_now: boolean;
      weekday_text: string[];
      periods?: Array<{
        open: { day: number; time: string; };
        close?: { day: number; time: string; };
      }>;
    };
    editorial_summary?: {
      overview: string;
    };
    current_opening_hours?: {
      special_days?: Array<{
        date: string;
        exceptional_hours: boolean;
      }>;
    };
    business_status?: string;
    types: string[];
    geometry: {
      location: { lat: number; lng: number; };
    };
    rating?: number;
    user_ratings_total?: number;
    photos?: Array<{
      photo_reference: string;
    }>;
    reviews?: Array<{
      text: string;
      time: number;
      rating: number;
    }>;
  };
}

function inferEventCategory(types: string[]): string {
  if (types.includes('night_club') || types.includes('bar')) return 'nightlife';
  if (types.includes('restaurant') || types.includes('cafe')) return 'dining';
  if (types.includes('museum') || types.includes('art_gallery')) return 'cultural';
  if (types.includes('movie_theater') || types.includes('amusement_park')) return 'entertainment';
  if (types.includes('gym') || types.includes('stadium')) return 'sports';
  if (types.includes('shopping_mall')) return 'shopping';
  if (types.includes('spa')) return 'wellness';
  return 'venue';
}

function generateEventTimes(place: any) {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // For restaurants/cafes: meal times
  if (place.types?.includes('restaurant') || place.types?.includes('cafe')) {
    const lunchStart = new Date(tomorrow);
    lunchStart.setHours(12, 0, 0, 0);
    const dinnerStart = new Date(tomorrow);
    dinnerStart.setHours(19, 0, 0, 0);
    
    return [
      { start: lunchStart, end: new Date(lunchStart.getTime() + 2 * 60 * 60 * 1000) },
      { start: dinnerStart, end: new Date(dinnerStart.getTime() + 3 * 60 * 60 * 1000) }
    ];
  }
  
  // For nightlife: evening events
  if (place.types?.includes('night_club') || place.types?.includes('bar')) {
    const eveningStart = new Date(tomorrow);
    eveningStart.setHours(20, 0, 0, 0);
    return [{ start: eveningStart, end: new Date(eveningStart.getTime() + 4 * 60 * 60 * 1000) }];
  }
  
  // Default: afternoon visit
  const defaultStart = new Date(tomorrow);
  defaultStart.setHours(15, 0, 0, 0);
  return [{ start: defaultStart, end: new Date(defaultStart.getTime() + 2 * 60 * 60 * 1000) }];
}

async function fetchNearbyPlaces(apiKey: string, placeType: string) {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
    `location=${INDIRANAGAR_CENTER.lat},${INDIRANAGAR_CENTER.lng}&` +
    `radius=${SEARCH_RADIUS}&` +
    `type=${placeType}&` +
    `key=${apiKey}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    console.error(`Places API error for ${placeType}:`, data.status, data.error_message);
    return [];
  }
  
  return data.results || [];
}

async function getPlaceDetails(apiKey: string, placeId: string): Promise<PlaceDetails | null> {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?` +
    `place_id=${placeId}&` +
    `fields=place_id,name,formatted_address,formatted_phone_number,website,` +
    `opening_hours,current_opening_hours,editorial_summary,business_status,` +
    `types,geometry,rating,user_ratings_total,photos,reviews&` +
    `key=${apiKey}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.status !== 'OK') {
    console.error(`Place details error for ${placeId}:`, data.status);
    return null;
  }
  
  return data;
}

function createEventFromPlace(place: any, details: PlaceDetails | null) {
  const eventTimes = generateEventTimes(place);
  const category = inferEventCategory(place.types || []);
  
  // Generate event title based on place type and time
  const titles: Record<string, string[]> = {
    dining: ['Lunch at', 'Dinner at', 'Brunch at', 'Happy Hour at'],
    nightlife: ['Live Music at', 'DJ Night at', 'Ladies Night at', 'Weekend Party at'],
    cultural: ['Exhibition at', 'Art Show at', 'Cultural Event at'],
    entertainment: ['Show at', 'Performance at', 'Movie Night at'],
    sports: ['Fitness Session at', 'Game Night at', 'Sports Event at'],
    shopping: ['Shopping Experience at', 'Sale Event at'],
    wellness: ['Wellness Session at', 'Spa Day at'],
    venue: ['Visit', 'Experience', 'Explore']
  };
  
  const titleOptions = titles[category] || titles.venue;
  const titlePrefix = titleOptions[Math.floor(Math.random() * titleOptions.length)];
  
  // Extract interesting details from reviews or editorial summary
  let description = details?.result.editorial_summary?.overview || 
    `Popular ${category} venue in Indiranagar. `;
  
  // Add opening hours info
  if (details?.result.opening_hours?.weekday_text) {
    description += `\n\nHours: ${details.result.opening_hours.weekday_text[0]}`;
  }
  
  // Add special features based on place type
  if (place.rating && place.rating >= 4) {
    description += `\n⭐ Highly rated (${place.rating}/5 from ${place.user_ratings_total || 0} reviews)`;
  }
  
  const events = eventTimes.map((time, index) => ({
    external_id: `${place.place_id}_${index}_${new Date().toISOString().split('T')[0]}`,
    title: `${titlePrefix} ${place.name}`,
    description,
    category,
    start_time: time.start.toISOString(),
    end_time: time.end.toISOString(),
    venue_name: place.name,
    venue_address: details?.result.formatted_address || place.vicinity,
    latitude: place.geometry.location.lat,
    longitude: place.geometry.location.lng,
    external_url: details?.result.website || null,
    cost_type: place.price_level ? (place.price_level <= 1 ? 'free' : 'paid') : 'varies' as any,
    quality_score: Math.min(0.95, (place.rating || 3) / 5 + (place.user_ratings_total ? 0.1 : 0)),
    source: 'google_places',
    tags: place.types?.filter((t: string) => !['point_of_interest', 'establishment'].includes(t)),
    organizer_name: place.name,
    phone: details?.result.formatted_phone_number,
    photos: place.photos?.map((p: any) => ({
      url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${p.photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
    }))
  }));
  
  return events;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Places API key not configured' },
        { status: 500 }
      );
    }
    
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check if we've already fetched today (for rate limiting)
    const today = new Date().toISOString().split('T')[0];
    const { data: existingFetch } = await supabase
      .from('fetch_history')
      .select('*')
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`)
      .single();
    
    // Allow manual override or if no fetch today
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get('force') === 'true';
    
    if (existingFetch && !forceRefresh) {
      return NextResponse.json({
        success: false,
        message: 'Events already fetched today. Use force=true to override.',
        lastFetch: existingFetch.created_at
      });
    }
    
    const discoveredEvents: any[] = [];
    const errors: any[] = [];
    
    // Fetch places for each category
    for (const placeType of EVENT_PLACE_TYPES) {
      try {
        console.log(`Fetching ${placeType} venues...`);
        const places = await fetchNearbyPlaces(apiKey, placeType);
        
        // Get details for top venues (limit to prevent rate limiting)
        const topPlaces = places.slice(0, 3);
        
        for (const place of topPlaces) {
          try {
            // Add delay to respect rate limits
            await new Promise(resolve => setTimeout(resolve, 200));
            
            const details = await getPlaceDetails(apiKey, place.place_id);
            const events = createEventFromPlace(place, details);
            discoveredEvents.push(...events);
          } catch (error) {
            console.error(`Error processing place ${place.name}:`, error);
            errors.push({ place: place.name, error });
          }
        }
      } catch (error) {
        console.error(`Error fetching ${placeType}:`, error);
        errors.push({ type: placeType, error });
      }
    }
    
    // Save discovered events to database
    let savedCount = 0;
    for (const event of discoveredEvents) {
      try {
        // Check for duplicates
        const { data: existing } = await supabase
          .from('discovered_events')
          .select('id')
          .eq('external_id', event.external_id)
          .single();
        
        if (!existing) {
          const { error } = await supabase
            .from('discovered_events')
            .insert({
              ...event,
              moderation_status: 'approved', // Auto-approve Google Places
              is_active: true,
              created_at: new Date().toISOString()
            });
          
          if (!error) savedCount++;
        }
      } catch (error) {
        console.error('Error saving event:', error);
      }
    }
    
    // Log fetch history
    await supabase.from('fetch_history').insert({
      source_id: null, // We'll create a Google Places source later
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      status: errors.length === 0 ? 'success' : 'partial',
      events_found: discoveredEvents.length,
      events_processed: discoveredEvents.length,
      events_approved: savedCount,
      error_details: errors.length > 0 ? { errors } : null
    });
    
    return NextResponse.json({
      success: true,
      message: `Discovered ${discoveredEvents.length} events from Google Places`,
      stats: {
        discovered: discoveredEvents.length,
        saved: savedCount,
        errors: errors.length
      }
    });
    
  } catch (error) {
    console.error('Event fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events from Google Places' },
      { status: 500 }
    );
  }
}

// GET endpoint to check fetch status
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: history } = await supabase
      .from('fetch_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    return NextResponse.json({
      success: true,
      history: history || []
    });
    
  } catch (error) {
    console.error('Fetch history error:', error);
    return NextResponse.json(
      { error: 'Failed to get fetch history' },
      { status: 500 }
    );
  }
}