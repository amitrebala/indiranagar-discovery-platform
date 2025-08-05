import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

// GET: Fetch comments for an entity
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const entity_type = searchParams.get('entity_type');
  const entity_id = searchParams.get('entity_id');
  
  if (!entity_type || !entity_id) {
    return NextResponse.json(
      { error: 'entity_type and entity_id required' },
      { status: 400 }
    );
  }
  
  try {
    const supabase = await createClient();
    
    // Fetch all comments for entity
    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('entity_type', entity_type)
      .eq('entity_id', entity_id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Organize into nested structure
    const commentMap = new Map();
    const rootComments = [];
    
    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });
    
    comments.forEach(comment => {
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.replies.push(commentMap.get(comment.id));
        }
      } else {
        rootComments.push(commentMap.get(comment.id));
      }
    });
    
    // Check if user has liked comments (using IP)
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    
    if (ip !== 'unknown') {
      const { data: likes } = await supabase
        .from('comment_likes')
        .select('comment_id')
        .eq('ip_address', ip);
      
      const likedIds = new Set(likes?.map(l => l.comment_id));
      
      const addLikeStatus = (comment: any) => {
        comment.user_has_liked = likedIds.has(comment.id);
        comment.replies?.forEach(addLikeStatus);
      };
      
      rootComments.forEach(addLikeStatus);
    }
    
    return NextResponse.json({ comments: rootComments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST: Create new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entity_type, entity_id, content, author_name, parent_id } = body;
    
    if (!entity_type || !entity_id || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const supabase = await createClient();
    
    // Get IP for rate limiting
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    
    // Rate limiting check
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from('comments')
      .select('id', { count: 'exact', head: true })
      .eq('author_ip', ip)
      .gte('created_at', oneHourAgo);
    
    if (count && count > 10) {
      return NextResponse.json(
        { error: 'Too many comments. Please wait before posting again.' },
        { status: 429 }
      );
    }
    
    // Sanitize content
    const sanitizedContent = content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .substring(0, 1000);
    
    // Create comment
    const { data, error } = await supabase
      .from('comments')
      .insert({
        entity_type,
        entity_id,
        content: sanitizedContent,
        author_name: author_name || 'Anonymous',
        author_ip: ip,
        parent_id: parent_id || null
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ comment: data });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}