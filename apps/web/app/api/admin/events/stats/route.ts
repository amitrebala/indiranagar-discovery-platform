import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const [
      { count: totalEvents },
      { count: pendingEvents },
      { count: approvedEvents },
      { count: rejectedEvents },
      { data: recentFetches },
      { data: sourceStats }
    ] = await Promise.all([
      supabase.from('discovered_events').select('*', { count: 'exact', head: true }),
      supabase.from('discovered_events').select('*', { count: 'exact', head: true }).eq('moderation_status', 'pending'),
      supabase.from('discovered_events').select('*', { count: 'exact', head: true }).eq('moderation_status', 'approved'),
      supabase.from('discovered_events').select('*', { count: 'exact', head: true }).eq('moderation_status', 'rejected'),
      supabase.from('fetch_history').select('*').order('created_at', { ascending: false }).limit(10),
      supabase.from('event_sources').select('id, name, type, is_active, last_fetched_at')
    ]);
    
    const stats = {
      totalEvents: totalEvents || 0,
      pendingEvents: pendingEvents || 0,
      approvedEvents: approvedEvents || 0,
      rejectedEvents: rejectedEvents || 0,
      approvalRate: totalEvents ? ((approvedEvents || 0) / (totalEvents || 1) * 100).toFixed(1) : 0,
      recentFetches: recentFetches || [],
      sources: sourceStats || []
    };
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching event stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event statistics' },
      { status: 500 }
    );
  }
}