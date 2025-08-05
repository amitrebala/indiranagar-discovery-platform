import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AdminAuth } from '@/lib/admin/auth';

export async function GET(request: NextRequest) {
  // Verify admin
  const token = request.cookies.get('admin-token');
  if (!token || !AdminAuth.verifyToken(token.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('community_questions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transform data to match frontend expectations
    const transformedData = (data || []).map(q => ({
      id: q.id,
      question: q.question,
      category: q.category || 'general',
      priority: q.priority || 'medium',
      status: q.resolved ? 'answered' : 'new',
      resolved: q.resolved,
      created_at: q.created_at,
      response: q.response,
      response_at: q.response_at
    }));
    
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Questions fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}