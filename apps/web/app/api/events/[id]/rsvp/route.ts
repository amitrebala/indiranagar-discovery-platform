import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

const rsvpSchema = z.object({
  attendee_name: z.string().min(2).max(100),
  attendee_email: z.string().email(),
  attendee_phone: z.string().optional(),
  status: z.enum(['going', 'maybe', 'not_going']).default('going'),
  guest_count: z.number().min(0).max(10).default(0),
  dietary_requirements: z.string().optional(),
  accessibility_needs: z.string().optional(),
  notes: z.string().optional()
});

async function sendRSVPConfirmation(event: { title: string }, rsvp: { attendee_email: string }) {
  // Implementation for sending RSVP confirmation email
  console.log('RSVP confirmation:', event.title, rsvp.attendee_email);
}

async function notifyOrganizerNewRSVP(event: { organizer_email: string }, _rsvp: { attendee_email: string }) {
  // Implementation for notifying organizer of new RSVP
  console.log('New RSVP notification to organizer:', event.organizer_email);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const eventId = params.id;
    const body = await request.json();
    
    // Validate input
    const validatedData = rsvpSchema.parse(body);
    
    // Check if event exists and is published
    const { data: event, error: eventError } = await supabase
      .from('community_events')
      .select('id, title, capacity, rsvp_count, start_time, organizer_email')
      .eq('id', eventId)
      .eq('status', 'published')
      .single();
    
    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found or not available for RSVP' },
        { status: 404 }
      );
    }
    
    // Check capacity if event has one
    const finalData = { ...validatedData };
    if (event.capacity && validatedData.status === 'going') {
      const totalRequestedSpots = 1 + validatedData.guest_count;
      const availableSpots = event.capacity - event.rsvp_count;
      
      if (totalRequestedSpots > availableSpots) {
        // Add to waitlist if no spots available
        (finalData as { status: string }).status = 'waitlist';
      }
    }
    
    // Create or update RSVP
    const { data: rsvp, error } = await supabase
      .from('event_rsvps')
      .upsert({
        event_id: eventId,
        ...finalData
      }, {
        onConflict: 'event_id,attendee_email'
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Send confirmation email
    await sendRSVPConfirmation(event, rsvp);
    
    // Notify organizer
    await notifyOrganizerNewRSVP(event, rsvp);
    
    return NextResponse.json({ 
      success: true, 
      rsvp: {
        status: rsvp.status,
        guest_count: rsvp.guest_count
      },
      message: rsvp.status === 'waitlist' 
        ? 'Added to waitlist - you\'ll be notified if spots become available'
        : 'RSVP confirmed successfully'
    });
    
  } catch (error) {
    console.error('RSVP error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid RSVP data', details: error.issues },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to process RSVP' },
      { status: 500 }
    );
  }
}