import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = searchParams.get('limit') || '20';
    
    const supabase = await createClient();
    
    let query = supabase
      .from('discovered_events')
      .select(`
        *,
        event_images (*)
      `)
      .eq('is_active', true)
      .eq('moderation_status', 'approved')
      .order('start_time', { ascending: true })
      .limit(parseInt(limit));
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (startDate) {
      query = query.gte('start_time', startDate);
    }
    
    if (endDate) {
      query = query.lte('start_time', endDate);
    }
    
    const { data: events, error } = await query;
    
    if (error) {
      console.error('Error fetching discovered events:', error);
      return NextResponse.json(
        { error: 'Failed to fetch events' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ events });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sourceType, params } = body;
    
    const response = await fetch(`${process.env.EVENT_PROCESSOR_URL || 'http://localhost:4000'}/api/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sourceType, params }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to schedule event fetch');
    }
    
    const result = await response.json();
    
    return NextResponse.json({ 
      message: 'Event fetch scheduled successfully',
      jobId: result.jobId 
    });
  } catch (error) {
    console.error('Error scheduling event fetch:', error);
    return NextResponse.json(
      { error: 'Failed to schedule event fetch' },
      { status: 500 }
    );
  }
}