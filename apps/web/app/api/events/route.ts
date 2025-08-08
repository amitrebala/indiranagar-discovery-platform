import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

const eventSchema = z.object({
  title: z.string().min(5).max(255),
  description: z.string().min(20).max(5000),
  category: z.enum(['food_festival', 'market', 'cultural_event', 'running_group', 'meetup', 'workshop']),
  start_time: z.string().refine(date => !isNaN(Date.parse(date))),
  end_time: z.string().optional().refine(date => !date || !isNaN(Date.parse(date))),
  location_name: z.string().min(2).max(255),
  location_address: z.string().min(10).max(500),
  location_latitude: z.number().min(12.95).max(13.00),
  location_longitude: z.number().min(77.58).max(77.65),
  venue_type: z.enum(['indoor', 'outdoor', 'hybrid']).default('indoor'),
  organizer_name: z.string().min(2).max(100),
  organizer_email: z.string().email(),
  organizer_phone: z.string().optional(),
  capacity: z.number().positive().optional(),
  cost_type: z.enum(['free', 'paid', 'donation']).default('free'),
  cost_amount: z.number().nonnegative().optional(),
  is_recurring: z.boolean().default(false),
  recurrence_pattern: z.object({
    type: z.enum(['daily', 'weekly', 'monthly']),
    interval: z.number().positive(),
    days: z.array(z.string()).optional(),
    until: z.string().optional()
  }).optional()
});

async function sendNewEventNotification(event: { id: string; title: string }) {
  // Implementation for sending notification to admin
  console.log('New event notification:', event.title);
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();
    
    // Validate input
    const validatedData = eventSchema.parse(body);
    
    // Check rate limiting (max 2 events per day per email)
    const { data: recentEvents } = await supabase
      .from('community_events')
      .select('id')
      .eq('organizer_email', validatedData.organizer_email)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    
    if (recentEvents && recentEvents.length >= 2) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Maximum 2 events per day.' },
        { status: 429 }
      );
    }
    
    // Create event
    const { data: event, error } = await supabase
      .from('community_events')
      .insert([validatedData])
      .select()
      .single();
    
    if (error) throw error;
    
    // Send notification to admin
    await sendNewEventNotification(event);
    
    return NextResponse.json({ 
      success: true, 
      event: {
        id: event.id,
        title: event.title,
        status: event.status
      }
    });
    
  } catch (error) {
    console.error('Event creation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // First try to get discovered events (new event discovery system)
    let query = supabase
      .from('discovered_events')
      .select('*')
      .eq('moderation_status', 'approved')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    const { data: discoveredEvents, error: discoveredError } = await query;
    
    // If discovered events exist, return them
    if (!discoveredError && discoveredEvents && discoveredEvents.length > 0) {
      return NextResponse.json({ 
        success: true,
        events: discoveredEvents,
        source: 'discovered_events',
        count: discoveredEvents.length
      });
    }
    
    // Fallback to community events if no discovered events
    let communityQuery = supabase
      .from('community_events')
      .select(`
        id,
        title,
        description,
        category,
        start_time,
        end_time,
        location_name as venue_name,
        location_address as venue_address,
        location_latitude as latitude,
        location_longitude as longitude,
        cost_type,
        status,
        created_at
      `)
      .eq('status', 'published')
      .order('start_time', { ascending: true })
      .range(offset, offset + limit - 1);
    
    if (category && category !== 'all') {
      communityQuery = communityQuery.eq('category', category);
    }
    
    const { data: communityEvents, error: communityError } = await communityQuery;
    
    if (!communityError && communityEvents && communityEvents.length > 0) {
      // Transform community events to match discovered events format
      const transformedEvents = communityEvents.map(event => ({
        ...event,
        external_id: `community_${event.id}`,
        quality_score: 0.8,
        moderation_status: 'approved',
        is_active: true,
      }));
      
      return NextResponse.json({ 
        success: true,
        events: transformedEvents,
        source: 'community_events',
        count: transformedEvents.length
      });
    }
    
    // If no events found, return mock data
    const mockEvents = [
      {
        id: '1',
        title: 'Visit Toit Brewpub',
        description: 'Experience craft beer and delicious food in this popular microbrewery',
        category: 'dining',
        start_time: new Date(Date.now() + 3600000).toISOString(),
        end_time: new Date(Date.now() + 7200000).toISOString(),
        venue_name: 'Toit Brewpub',
        venue_address: '298, 100 Feet Road, Indiranagar, Bangalore',
        latitude: 12.9716,
        longitude: 77.6411,
        external_url: null,
        cost_type: 'paid',
        quality_score: 0.92,
        moderation_status: 'approved',
        is_active: true,
      },
      {
        id: '2',
        title: 'Coffee at Third Wave Coffee',
        description: 'Artisanal coffee experience with specialty brews and cozy ambiance',
        category: 'venue',
        start_time: new Date(Date.now() + 1800000).toISOString(),
        end_time: new Date(Date.now() + 5400000).toISOString(),
        venue_name: 'Third Wave Coffee',
        venue_address: '102 Feet Road, HAL 2nd Stage, Indiranagar, Bangalore',
        latitude: 12.9719,
        longitude: 77.6404,
        external_url: null,
        cost_type: 'free',
        quality_score: 0.87,
        moderation_status: 'approved',
        is_active: true,
      },
      {
        id: '3',
        title: 'Explore Chinnaswamy Stadium',
        description: 'Visit the iconic cricket stadium and learn about its history',
        category: 'entertainment',
        start_time: new Date(Date.now() + 7200000).toISOString(),
        end_time: new Date(Date.now() + 14400000).toISOString(),
        venue_name: 'M. Chinnaswamy Stadium',
        venue_address: 'Queens Road, Bangalore',
        latitude: 12.9793,
        longitude: 77.5996,
        external_url: null,
        cost_type: 'varies',
        quality_score: 0.94,
        moderation_status: 'approved',
        is_active: true,
      },
      {
        id: '4',
        title: 'Shopping at Phoenix MarketCity',
        description: 'Browse through diverse shops and enjoy dining options',
        category: 'venue',
        start_time: new Date(Date.now() + 3600000).toISOString(),
        end_time: new Date(Date.now() + 10800000).toISOString(),
        venue_name: 'Phoenix MarketCity',
        venue_address: 'Whitefield Main Road, Mahadevapura, Bangalore',
        latitude: 12.9975,
        longitude: 77.6968,
        external_url: 'https://www.phoenixmarketcity.com',
        cost_type: 'free',
        quality_score: 0.89,
        moderation_status: 'approved',
        is_active: true,
      },
      {
        id: '5',
        title: 'Evening at Cubbon Park',
        description: 'Enjoy a peaceful evening walk in the green heart of Bangalore',
        category: 'cultural',
        start_time: new Date(Date.now() + 14400000).toISOString(),
        end_time: new Date(Date.now() + 18000000).toISOString(),
        venue_name: 'Cubbon Park',
        venue_address: 'Kasturba Road, Sampangi Rama Nagar, Bangalore',
        latitude: 12.9762,
        longitude: 77.5993,
        external_url: null,
        cost_type: 'free',
        quality_score: 0.85,
        moderation_status: 'approved',
        is_active: true,
      },
    ];
    
    return NextResponse.json({
      success: true,
      events: mockEvents,
      source: 'mock_data',
      message: 'Using sample data - no events found in database',
      count: mockEvents.length
    });
    
  } catch (error) {
    console.error('Get events error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}