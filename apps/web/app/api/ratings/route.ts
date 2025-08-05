import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

// GET: Get rating stats for an entity
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const entity_type = searchParams.get('entity_type');
  const entity_id = searchParams.get('entity_id');
  
  if (!entity_type || !entity_id) {
    return NextResponse.json(
      { error: 'entity_type and entity_id required' },
      { status: 400 }
    );
  }
  
  try {
    const supabase = await createClient();
    
    // Get all ratings
    const { data: ratings, error } = await supabase
      .from('ratings')
      .select('rating')
      .eq('entity_type', entity_type)
      .eq('entity_id', entity_id);
    
    if (error) throw error;
    
    // Calculate stats
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let total = 0;
    
    ratings.forEach(r => {
      distribution[r.rating as keyof typeof distribution]++;
      total += r.rating;
    });
    
    const stats = {
      average_rating: ratings.length > 0 ? total / ratings.length : 0,
      total_ratings: ratings.length,
      distribution
    };
    
    // Check user's rating
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    
    if (ip !== 'unknown') {
      const { data: userRating } = await supabase
        .from('ratings')
        .select('rating')
        .eq('entity_type', entity_type)
        .eq('entity_id', entity_id)
        .eq('ip_address', ip)
        .single();
      
      if (userRating) {
        (stats as any).user_rating = userRating.rating;
      }
    }
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ratings' },
      { status: 500 }
    );
  }
}

// POST: Submit a rating
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entity_type, entity_id, rating } = body;
    
    if (!entity_type || !entity_id || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }
    
    const supabase = await createClient();
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    
    if (ip === 'unknown') {
      return NextResponse.json(
        { error: 'Cannot identify user' },
        { status: 400 }
      );
    }
    
    // Upsert rating (update if exists, insert if not)
    const { data, error } = await supabase
      .from('ratings')
      .upsert(
        {
          entity_type,
          entity_id,
          rating,
          ip_address: ip
        },
        {
          onConflict: 'entity_type,entity_id,ip_address'
        }
      )
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ rating: data });
  } catch (error) {
    console.error('Error submitting rating:', error);
    return NextResponse.json(
      { error: 'Failed to submit rating' },
      { status: 500 }
    );
  }
}