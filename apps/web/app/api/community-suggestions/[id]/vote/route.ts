import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const suggestionId = params.id;
    
    // Create voter fingerprint from IP + User-Agent
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const fingerprint = crypto
      .createHash('sha256')
      .update(ip + userAgent)
      .digest('hex');
    
    // Check if already voted
    const { data: existingVote } = await supabase
      .from('suggestion_votes')
      .select('id')
      .eq('suggestion_id', suggestionId)
      .eq('voter_fingerprint', fingerprint)
      .single();
    
    if (existingVote) {
      return NextResponse.json(
        { error: 'Already voted for this suggestion' },
        { status: 409 }
      );
    }
    
    // Add vote
    const { error } = await supabase
      .from('suggestion_votes')
      .insert({
        suggestion_id: suggestionId,
        voter_fingerprint: fingerprint,
        ip_address: ip,
        user_agent: userAgent
      });
    
    if (error) throw error;
    
    // Get updated vote count
    const { data: suggestion } = await supabase
      .from('community_place_suggestions')
      .select('votes, submitter_email, place_name')
      .eq('id', suggestionId)
      .single();
    
    return NextResponse.json({ 
      success: true, 
      votes: suggestion?.votes || 0 
    });
    
  } catch (error) {
    console.error('Voting error:', error);
    return NextResponse.json(
      { error: 'Failed to record vote' },
      { status: 500 }
    );
  }
}