import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET: Fetch published journeys
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mood = searchParams.get('mood');
  const difficulty = searchParams.get('difficulty');
  const duration = searchParams.get('duration'); // short, medium, long
  
  try {
    const supabase = await createClient();
    
    // Work with existing schema - get legacy journeys 
    let query = supabase
      .from('journeys')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Apply basic filters on existing fields
    if (mood && query) {
      // Filter by vibe_tags (legacy field) if mood is provided
      query = query.contains('vibe_tags', [mood]);
    }
    
    const { data: journeys, error } = await query;
    
    if (error) throw error;
    
    // Transform legacy journeys to include advanced fields with defaults
    const enhancedJourneys = journeys?.map((journey: any) => ({
      ...journey,
      // Map legacy fields to new fields
      slug: journey.title?.toLowerCase().replace(/\s+/g, '-') || journey.id,
      name: journey.title || 'Untitled Journey',
      mood_tags: journey.vibe_tags || [],
      difficulty: 'moderate' as const,
      duration_minutes: parseInt(journey.estimated_time?.replace(/\D/g, '') || '180') * 60,
      distance_km: 2.5, // Default value
      is_published: true,
      view_count: 0,
      save_count: 0,
      created_by: 'amit',
      optimal_times: [],
      weather_suitability: {
        ideal_conditions: ['pleasant', 'sunny'],
        acceptable_conditions: ['cloudy', 'partly_cloudy'],
        avoid_conditions: ['heavy_rain', 'extreme_heat'],
        seasonal_notes: {
          summer: 'Best early morning or evening',
          monsoon: 'Check weather conditions',
          winter: 'Perfect any time of day'
        }
      },
      estimated_cost: {
        min: 500,
        max: 2000,
        breakdown: [
          { category: 'Food & Drinks', amount_range: '300-1000' },
          { category: 'Activities', amount_range: '200-1000' }
        ]
      },
      stops: [] // Will be populated separately
    }));
    
    return NextResponse.json({ journeys: enhancedJourneys });
  } catch (error) {
    console.error('Error fetching journeys:', error);
    return NextResponse.json(
      { error: 'Failed to fetch journeys' },
      { status: 500 }
    );
  }
}