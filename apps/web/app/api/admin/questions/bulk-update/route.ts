import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AdminAuth } from '@/lib/admin/auth';

export async function POST(request: NextRequest) {
  // Verify admin
  const token = request.cookies.get('admin-token');
  if (!token || !AdminAuth.verifyToken(token.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { ids, status } = await request.json();
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    const supabase = await createClient();
    const updates: any = {};
    
    if (status === 'answered') {
      updates.resolved = true;
    } else if (status === 'new') {
      updates.resolved = false;
    }
    
    const { error } = await supabase
      .from('community_questions')
      .update(updates)
      .in('id', ids);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true, updated: ids.length });
  } catch (error) {
    console.error('Bulk update error:', error);
    return NextResponse.json(
      { error: 'Failed to update questions' },
      { status: 500 }
    );
  }
}