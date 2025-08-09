import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    // Use service role key to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // First, try to add columns if they don't exist
    const { error: addColumnsError } = await supabase
      .from('community_events')
      .select('external_url, ticket_url')
      .limit(1);
    
    if (addColumnsError?.message?.includes('column "external_url" does not exist')) {
      // Try to add columns using raw SQL if possible
      console.log('external_url column does not exist, manual database migration required');
    }
    
    // Get all events without external URLs
    const { data: events, error } = await supabase
      .from('community_events')
      .select('id, title, location_name')
      .eq('status', 'published')
      .is('external_url', null);
    
    if (error) {
      console.error('Error fetching events:', error);
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }
    
    let updatedCount = 0;
    
    // Update each event with a Google Maps URL
    for (const event of events || []) {
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location_name)}`;
      
      try {
        const { error: updateError } = await supabase
          .from('community_events')
          .update({ 
            external_url: googleMapsUrl,
            ticket_url: googleMapsUrl
          })
          .eq('id', event.id);
        
        if (!updateError) {
          updatedCount++;
        } else if (updateError.message.includes('column "external_url" does not exist')) {
          console.log('Database schema needs to be updated with external_url columns');
          break;
        }
      } catch (updateError) {
        console.error(`Error updating event ${event.id}:`, updateError);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Updated ${updatedCount} events with external URLs`,
      updated: updatedCount,
      total: events?.length || 0
    });
    
  } catch (error) {
    console.error('Add external URLs error:', error);
    return NextResponse.json(
      { error: 'Failed to add external URLs to events' },
      { status: 500 }
    );
  }
}