import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    const params = await context.params;
    
    if (ip === 'unknown') {
      return NextResponse.json(
        { error: 'Cannot identify user' },
        { status: 400 }
      );
    }
    
    // Check if already liked
    const { data: existing } = await supabase
      .from('comment_likes')
      .select('id')
      .eq('comment_id', params.id)
      .eq('ip_address', ip)
      .single();
    
    if (existing) {
      // Unlike
      await supabase
        .from('comment_likes')
        .delete()
        .eq('id', existing.id);
      
      // Decrement like count
      const { data: comment } = await supabase
        .from('comments')
        .select('likes')
        .eq('id', params.id)
        .single();
      
      if (comment) {
        await supabase
          .from('comments')
          .update({ likes: Math.max(0, comment.likes - 1) })
          .eq('id', params.id);
      }
      
      return NextResponse.json({ liked: false });
    } else {
      // Like
      await supabase
        .from('comment_likes')
        .insert({
          comment_id: params.id,
          ip_address: ip
        });
      
      // Increment like count
      const { data: comment } = await supabase
        .from('comments')
        .select('likes')
        .eq('id', params.id)
        .single();
      
      if (comment) {
        await supabase
          .from('comments')
          .update({ likes: comment.likes + 1 })
          .eq('id', params.id);
      }
      
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}