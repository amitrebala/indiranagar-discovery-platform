import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AdminAuth } from '@/lib/admin/auth';

export async function GET(request: NextRequest) {
  // Verify admin (middleware already checked)
  const token = request.cookies.get('admin-token');
  if (!token || !AdminAuth.verifyToken(token.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const supabase = await createClient();
    
    // Fetch all stats in parallel
    const [places, suggestions, questions, analytics] = await Promise.all([
      // Total places count
      supabase.from('places').select('id', { count: 'exact', head: true }),
      
      // Pending suggestions
      supabase.from('community_suggestions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending'),
      
      // Unresolved questions  
      supabase.from('community_questions')
        .select('id', { count: 'exact', head: true })
        .eq('resolved', false),
        
      // Today's page views (mock for now)
      Promise.resolve({ count: Math.floor(Math.random() * 1000) + 500 })
    ]);
    
    // Get recent activity
    const { data: recentComments } = await supabase
      .from('comments')
      .select('id, content, created_at, entity_type')
      .order('created_at', { ascending: false })
      .limit(5);
    
    const { data: recentQuestions } = await supabase
      .from('community_questions')
      .select('id, question, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    
    // Combine and sort activities
    const activities = [
      ...(recentComments || []).map(c => ({
        id: c.id,
        type: 'comment' as const,
        message: `New comment on ${c.entity_type}`,
        timestamp: new Date(c.created_at)
      })),
      ...(recentQuestions || []).map(q => ({
        id: q.id,
        type: 'question' as const,
        message: q.question.substring(0, 50) + '...',
        timestamp: new Date(q.created_at)
      }))
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
     .slice(0, 10);
    
    return NextResponse.json({
      totalPlaces: places.count || 0,
      pendingSuggestions: suggestions.count || 0,
      unresolvedQuestions: questions.count || 0,
      todayViews: analytics.count,
      recentActivity: activities
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}