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

async function sendNewEventNotification(event: any) {
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
        { error: 'Invalid input data', details: error.errors },
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
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status') || 'published';
    const curatorEndorsed = searchParams.get('curatorEndorsed');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    let query = supabase
      .from('community_events')
      .select(`
        *,
        event_images(*),
        event_categories(display_name, color_code, icon_name),
        rsvp_count
      `)
      .eq('status', status)
      .order('start_time', { ascending: true })
      .range(offset, offset + limit - 1);
    
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    if (startDate) {
      query = query.gte('start_time', startDate);
    }
    
    if (endDate) {
      query = query.lte('start_time', endDate);
    }
    
    if (curatorEndorsed === 'true') {
      query = query.eq('curator_endorsed', true);
    }
    
    const { data: events, error } = await query;
    
    if (error) throw error;
    
    return NextResponse.json({ events });
    
  } catch (error) {
    console.error('Get events error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}