import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = await createClient();
    
    // For legacy data, we'll match by title converted to slug
    // or by actual slug if it exists
    const { data: journeys, error } = await supabase
      .from('journeys')
      .select('*');
    
    if (error) throw error;
    
    // Find journey by slug match
    const journey = journeys?.find((j: any) => {
      const generatedSlug = j.title?.toLowerCase().replace(/\s+/g, '-');
      return generatedSlug === params.slug || j.slug === params.slug;
    });
    
    if (!journey) {
      return NextResponse.json(
        { error: 'Journey not found' },
        { status: 404 }
      );
    }
    
    // Get companion activities if they exist
    const { data: companions } = await supabase
      .from('companion_activities')
      .select(`
        *,
        companion_place:places!companion_place_id(*)
      `)
      .limit(5);
    
    // Transform to enhanced journey format
    const enhancedJourney = {
      ...journey,
      slug: journey.title?.toLowerCase().replace(/\s+/g, '-') || journey.id,
      name: journey.title || 'Untitled Journey',
      mood_tags: journey.vibe_tags || [],
      difficulty: 'moderate' as const,
      duration_minutes: parseInt(journey.estimated_time?.replace(/\D/g, '') || '180') * 60,
      distance_km: 2.5,
      is_published: true,
      view_count: Math.floor(Math.random() * 100), // Mock view count
      save_count: Math.floor(Math.random() * 20),
      created_by: 'amit',
      optimal_times: [
        {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          start_time: '09:00',
          end_time: '12:00',
          reason: 'Perfect morning energy and good lighting',
          crowd_level: 'moderate' as const
        },
        {
          days: ['saturday', 'sunday'],
          start_time: '16:00',
          end_time: '19:00',
          reason: 'Weekend vibes with great atmosphere',
          crowd_level: 'busy' as const
        }
      ],
      weather_suitability: {
        ideal_conditions: ['pleasant', 'sunny'],
        acceptable_conditions: ['cloudy', 'partly_cloudy'],
        avoid_conditions: ['heavy_rain', 'extreme_heat'],
        seasonal_notes: {
          summer: 'Best early morning or evening to avoid heat',
          monsoon: 'Check weather forecast, some stops have good indoor options',
          winter: 'Perfect weather for this journey any time of day'
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
      stops: [], // Could be populated with actual stops if available
      companions: companions || []
    };
    
    // Increment view count (mock update for now)
    await supabase
      .from('journeys')
      .update({ 
        view_count: (journey.view_count || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', journey.id);
    
    return NextResponse.json({ journey: enhancedJourney });
  } catch (error) {
    console.error('Error fetching journey:', error);
    return NextResponse.json(
      { error: 'Failed to fetch journey' },
      { status: 500 }
    );
  }
}