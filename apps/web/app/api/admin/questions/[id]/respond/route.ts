import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AdminAuth } from '@/lib/admin/auth';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  // Verify admin
  const token = request.cookies.get('admin-token');
  if (!token || !AdminAuth.verifyToken(token.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { response } = await request.json();
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('community_questions')
      .update({
        response,
        resolved: true,
        response_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Question response error:', error);
    return NextResponse.json(
      { error: 'Failed to respond to question' },
      { status: 500 }
    );
  }
}