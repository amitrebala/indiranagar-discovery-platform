import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { DistanceCalculator } from '@/lib/services/distance-calculator';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Get all journeys and find by slug
    const { data: journeys, error } = await supabase
      .from('journeys')
      .select('*');

    if (error) throw error;

    // Find journey by slug match
    const journey = journeys?.find(j => {
      const generatedSlug = j.title?.toLowerCase().replace(/\s+/g, '-');
      return generatedSlug === params.slug || j.slug === params.slug;
    });
    
    if (error || !journey) {
      return NextResponse.json(
        { error: 'Journey not found' },
        { status: 404 }
      );
    }
    
    // For demo purposes, create sample coordinates around Indiranagar
    // In production, this would come from actual journey stops
    const sampleCoordinates = [
      { lat: 12.9719, lng: 77.6412, place_id: 'start' }, // 100 Feet Road
      { lat: 12.9725, lng: 77.6401, place_id: 'stop1' }, // Nearby cafe
      { lat: 12.9715, lng: 77.6425, place_id: 'stop2' }, // Local restaurant
      { lat: 12.9730, lng: 77.6390, place_id: 'end' }    // End point
    ];
    
    // Calculate route
    const calculator = new DistanceCalculator();
    const route = await calculator.calculateJourneyDistance(sampleCoordinates);
    
    // Update journey with calculated distance if not set
    const duration_minutes = route.total_walking_time_min + 120; // Add activity time
    
    await supabase
      .from('journeys')
      .update({ 
        updated_at: new Date().toISOString()
      })
      .eq('id', journey.id);
    
    return NextResponse.json({ 
      route: {
        ...route,
        journey_id: journey.id,
        journey_name: journey.title,
        total_duration_with_activities: duration_minutes,
        stops_count: sampleCoordinates.length
      }
    });
  } catch (error) {
    console.error('Error calculating route:', error);
    return NextResponse.json(
      { error: 'Failed to calculate route' },
      { status: 500 }
    );
  }
}