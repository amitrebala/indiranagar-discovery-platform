import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

const suggestionSchema = z.object({
  submitter_name: z.string().min(2).max(100),
  submitter_email: z.string().email(),
  submitter_social: z.object({
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional()
  }).optional(),
  place_name: z.string().min(2).max(255),
  suggested_latitude: z.number().min(12.95).max(13.00),
  suggested_longitude: z.number().min(77.58).max(77.65),
  category: z.enum(['restaurant', 'cafe', 'bar', 'shopping', 'culture', 'activity']),
  personal_notes: z.string().min(10).max(2000)
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();
    
    // Validate input
    const validatedData = suggestionSchema.parse(body);
    
    // Check rate limiting (max 3 suggestions per day per email)
    const { data: recentSuggestions } = await supabase
      .from('community_place_suggestions')
      .select('id')
      .eq('submitter_email', validatedData.submitter_email)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    
    if (recentSuggestions && recentSuggestions.length >= 3) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Maximum 3 suggestions per day.' },
        { status: 429 }
      );
    }
    
    // Create suggestion
    const { data: suggestion, error } = await supabase
      .from('community_place_suggestions')
      .insert([validatedData])
      .select()
      .single();
    
    if (error) throw error;
    
    // Create or update contributor record
    await supabase
      .from('contributors')
      .upsert({
        name: validatedData.submitter_name,
        email: validatedData.submitter_email,
        social_links: validatedData.submitter_social,
        total_suggestions: 1,
        last_activity: new Date().toISOString()
      }, {
        onConflict: 'email',
        ignoreDuplicates: false
      });
    
    return NextResponse.json({ 
      success: true, 
      suggestion: {
        id: suggestion.id,
        place_name: suggestion.place_name,
        status: suggestion.status
      }
    });
    
  } catch (error) {
    console.error('Suggestion submission error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to submit suggestion' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    let query = supabase
      .from('community_place_suggestions')
      .select(`
        *,
        suggestion_images(*),
        contributors(name, recognition_level)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    
    const { data: suggestions, error } = await query;
    
    if (error) throw error;
    
    return NextResponse.json({ suggestions });
    
  } catch (error) {
    console.error('Get suggestions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suggestions' },
      { status: 500 }
    );
  }
}