# 🚀 SESSION 2: Community Features Implementation
## Complete Backend & Public UI (No Admin Dependencies)

---

## 📋 OVERVIEW

This package implements all community features that can run independently of admin authentication. Build the entire comment and rating system with public UI.

**Total Components:** 8 major features  
**Estimated Time:** 15-20 hours  
**Can Start:** IMMEDIATELY (no dependencies)

---

## 🎯 PREREQUISITES

```bash
# 1. Database Setup (CRITICAL - Do First!)
# Run in Supabase SQL Editor
```

```sql
-- Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  parent_id UUID REFERENCES comments(id),
  author_name VARCHAR(100) DEFAULT 'Anonymous',
  author_ip INET,
  content TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  is_flagged BOOLEAN DEFAULT FALSE,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ratings Table  
CREATE TABLE IF NOT EXISTS ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(entity_type, entity_id, ip_address)
);

-- Comment Likes Table
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(comment_id, ip_address)
);

-- Indexes for Performance
CREATE INDEX idx_comments_entity ON comments(entity_type, entity_id);
CREATE INDEX idx_comments_created ON comments(created_at DESC);
CREATE INDEX idx_ratings_entity ON ratings(entity_type, entity_id);
CREATE INDEX idx_comment_likes_comment ON comment_likes(comment_id);

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Public read/write policies
CREATE POLICY "Comments are viewable by everyone" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create comments" ON comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Ratings are viewable by everyone" ON ratings
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create ratings" ON ratings
  FOR INSERT WITH CHECK (true);
```

---

## 💻 IMPLEMENTATION STEPS

### STEP 1: Comment System Backend

#### 1.1 Create Comment Types
Create `/lib/types/comments.ts`:
```typescript
export interface Comment {
  id: string;
  entity_type: 'place' | 'journey' | 'blog';
  entity_id: string;
  parent_id?: string;
  author_name: string;
  author_ip?: string;
  content: string;
  is_admin: boolean;
  is_flagged: boolean;
  likes: number;
  created_at: string;
  updated_at: string;
  replies?: Comment[];
  user_has_liked?: boolean;
}

export interface CommentInput {
  entity_type: string;
  entity_id: string;
  content: string;
  author_name?: string;
  parent_id?: string;
}

export interface CommentStats {
  total_comments: number;
  average_sentiment?: number;
  top_commenters: Array<{
    name: string;
    count: number;
  }>;
}
```

#### 1.2 Create Comment API Routes
Create `/app/api/comments/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
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
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    
    if (ip !== 'unknown') {
      const { data: likes } = await supabase
        .from('comment_likes')
        .select('comment_id')
        .eq('ip_address', ip);
      
      const likedIds = new Set(likes?.map(l => l.comment_id));
      
      const addLikeStatus = (comment) => {
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
    
    // Get IP for rate limiting
    const headersList = headers();
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
```

#### 1.3 Create Comment Like API
Create `/app/api/comments/[id]/like/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { headers } from 'next/headers';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    
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
      
      await supabase
        .from('comments')
        .update({ likes: supabase.raw('likes - 1') })
        .eq('id', params.id);
      
      return NextResponse.json({ liked: false });
    } else {
      // Like
      await supabase
        .from('comment_likes')
        .insert({
          comment_id: params.id,
          ip_address: ip
        });
      
      await supabase
        .from('comments')
        .update({ likes: supabase.raw('likes + 1') })
        .eq('id', params.id);
      
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
```

### STEP 2: Rating System Backend

#### 2.1 Create Rating Types
Create `/lib/types/ratings.ts`:
```typescript
export interface Rating {
  id: string;
  entity_type: string;
  entity_id: string;
  rating: number;
  ip_address?: string;
  created_at: string;
}

export interface RatingStats {
  average_rating: number;
  total_ratings: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  user_rating?: number;
}
```

#### 2.2 Create Rating API Routes
Create `/app/api/ratings/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { headers } from 'next/headers';

// GET: Get rating stats for an entity
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
    // Get all ratings
    const { data: ratings, error } = await supabase
      .from('ratings')
      .select('rating')
      .eq('entity_type', entity_type)
      .eq('entity_id', entity_id);
    
    if (error) throw error;
    
    // Calculate stats
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let total = 0;
    
    ratings.forEach(r => {
      distribution[r.rating]++;
      total += r.rating;
    });
    
    const stats = {
      average_rating: ratings.length > 0 ? total / ratings.length : 0,
      total_ratings: ratings.length,
      distribution
    };
    
    // Check user's rating
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    
    if (ip !== 'unknown') {
      const { data: userRating } = await supabase
        .from('ratings')
        .select('rating')
        .eq('entity_type', entity_type)
        .eq('entity_id', entity_id)
        .eq('ip_address', ip)
        .single();
      
      if (userRating) {
        stats.user_rating = userRating.rating;
      }
    }
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ratings' },
      { status: 500 }
    );
  }
}

// POST: Submit a rating
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entity_type, entity_id, rating } = body;
    
    if (!entity_type || !entity_id || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }
    
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    
    if (ip === 'unknown') {
      return NextResponse.json(
        { error: 'Cannot identify user' },
        { status: 400 }
      );
    }
    
    // Upsert rating (update if exists, insert if not)
    const { data, error } = await supabase
      .from('ratings')
      .upsert(
        {
          entity_type,
          entity_id,
          rating,
          ip_address: ip
        },
        {
          onConflict: 'entity_type,entity_id,ip_address'
        }
      )
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ rating: data });
  } catch (error) {
    console.error('Error submitting rating:', error);
    return NextResponse.json(
      { error: 'Failed to submit rating' },
      { status: 500 }
    );
  }
}
```

### STEP 3: Public UI Components

#### 3.1 Create Comment Thread Component
Create `/components/community/CommentThread.tsx`:
```typescript
'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  author_name: string;
  content: string;
  likes: number;
  created_at: string;
  is_admin: boolean;
  user_has_liked?: boolean;
  replies?: Comment[];
}

interface CommentThreadProps {
  entityType: string;
  entityId: string;
}

export default function CommentThread({ entityType, entityId }: CommentThreadProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [entityType, entityId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `/api/comments?entity_type=${entityType}&entity_id=${entityId}`
      );
      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity_type: entityType,
          entity_id: entityId,
          content: newComment,
          author_name: authorName || 'Anonymous',
          parent_id: replyingTo
        })
      });

      if (response.ok) {
        setNewComment('');
        setReplyingTo(null);
        await fetchComments();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST'
      });
      await fetchComments();
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => (
    <div className={`${depth > 0 ? 'ml-8 mt-3' : 'mt-4'} relative`}>
      {depth > 0 && (
        <div className="absolute left-[-20px] top-0 bottom-0 w-px bg-gray-200" />
      )}
      
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-sm font-medium text-primary-700">
                {comment.author_name[0].toUpperCase()}
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">
                  {comment.author_name}
                </span>
                {comment.is_admin && (
                  <span className="px-2 py-0.5 text-xs bg-primary-100 text-primary-700 rounded-full">
                    Admin
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
        
        <p className="mt-3 text-gray-700">{comment.content}</p>
        
        <div className="mt-3 flex items-center space-x-4">
          <button
            onClick={() => handleLike(comment.id)}
            className={`flex items-center space-x-1 text-sm ${
              comment.user_has_liked ? 'text-primary-600' : 'text-gray-500'
            } hover:text-primary-600`}
          >
            <span>{comment.user_has_liked ? '❤️' : '🤍'}</span>
            <span>{comment.likes}</span>
          </button>
          
          {depth < 2 && (
            <button
              onClick={() => setReplyingTo(comment.id)}
              className="text-sm text-gray-500 hover:text-primary-600"
            >
              Reply
            </button>
          )}
        </div>
        
        {replyingTo === comment.id && (
          <div className="mt-3 pl-4 border-l-2 border-primary-200">
            <form onSubmit={handleSubmit} className="space-y-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a reply..."
                className="w-full px-3 py-2 border rounded-md text-sm"
                rows={2}
              />
              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-3 py-1 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700 disabled:opacity-50"
                >
                  Reply
                </button>
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="px-3 py-1 text-gray-600 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3">
            {comment.replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-20 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-20 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4">
        <div className="space-y-3">
          <div className="flex space-x-3">
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your name (optional)"
              className="px-3 py-2 border rounded-md text-sm"
            />
          </div>
          
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full px-3 py-2 border rounded-md"
            rows={3}
          />
          
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}
```

#### 3.2 Create Star Rating Component
Create `/components/community/StarRating.tsx`:
```typescript
'use client';

import { useState, useEffect } from 'react';

interface RatingStats {
  average_rating: number;
  total_ratings: number;
  distribution: Record<number, number>;
  user_rating?: number;
}

interface StarRatingProps {
  entityType: string;
  entityId: string;
  size?: 'sm' | 'md' | 'lg';
  showStats?: boolean;
}

export default function StarRating({ 
  entityType, 
  entityId, 
  size = 'md',
  showStats = true 
}: StarRatingProps) {
  const [stats, setStats] = useState<RatingStats | null>(null);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  useEffect(() => {
    fetchRatings();
  }, [entityType, entityId]);

  const fetchRatings = async () => {
    try {
      const response = await fetch(
        `/api/ratings?entity_type=${entityType}&entity_id=${entityId}`
      );
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (rating: number) => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity_type: entityType,
          entity_id: entityId,
          rating
        })
      });

      if (response.ok) {
        await fetchRatings();
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="animate-pulse">
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map(i => (
            <span key={i} className={`${sizeClasses[size]} text-gray-300`}>
              ☆
            </span>
          ))}
        </div>
      </div>
    );
  }

  const displayRating = hoveredRating || stats.user_rating || 0;

  return (
    <div className="space-y-3">
      {/* Interactive Stars */}
      <div className="flex items-center space-x-3">
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              onClick={() => handleRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              disabled={submitting}
              className={`${sizeClasses[size]} transition-colors ${
                submitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              }`}
            >
              <span className={
                star <= displayRating
                  ? 'text-yellow-400'
                  : star <= stats.average_rating
                  ? 'text-yellow-200'
                  : 'text-gray-300'
              }>
                {star <= displayRating || star <= stats.average_rating ? '★' : '☆'}
              </span>
            </button>
          ))}
        </div>
        
        <div className="text-sm text-gray-600">
          <span className="font-medium">{stats.average_rating.toFixed(1)}</span>
          <span className="mx-1">·</span>
          <span>{stats.total_ratings} {stats.total_ratings === 1 ? 'rating' : 'ratings'}</span>
        </div>
      </div>

      {/* Rating Distribution */}
      {showStats && stats.total_ratings > 0 && (
        <div className="space-y-1">
          {[5, 4, 3, 2, 1].map(rating => {
            const count = stats.distribution[rating] || 0;
            const percentage = (count / stats.total_ratings) * 100;
            
            return (
              <div key={rating} className="flex items-center space-x-2">
                <span className="text-xs text-gray-600 w-3">{rating}</span>
                <span className="text-xs text-gray-400">★</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600 w-8 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* User's Rating Indicator */}
      {stats.user_rating && (
        <div className="text-sm text-primary-600">
          You rated this {stats.user_rating} star{stats.user_rating !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
```

### STEP 4: Integration Components

#### 4.1 Create Place Card with Comments & Ratings
Create `/components/places/PlaceCardWithCommunity.tsx`:
```typescript
'use client';

import { useState } from 'react';
import CommentThread from '@/components/community/CommentThread';
import StarRating from '@/components/community/StarRating';

interface PlaceCardWithCommunityProps {
  place: {
    id: string;
    name: string;
    category: string;
    description: string;
    image_url?: string;
  };
}

export default function PlaceCardWithCommunity({ place }: PlaceCardWithCommunityProps) {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Place Image */}
      {place.image_url && (
        <img
          src={place.image_url}
          alt={place.name}
          className="w-full h-48 object-cover"
        />
      )}
      
      {/* Place Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{place.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{place.category}</p>
        <p className="text-gray-700 mb-4">{place.description}</p>
        
        {/* Rating Component */}
        <div className="mb-4">
          <StarRating
            entityType="place"
            entityId={place.id}
            size="md"
            showStats={false}
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2 mb-4">
          <button className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
            📞 Call
          </button>
          <button className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
            🗺️ Directions
          </button>
          <button className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
            🔗 Share
          </button>
        </div>
        
        {/* Comments Toggle */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          {showComments ? 'Hide' : 'Show'} Comments
        </button>
      </div>
      
      {/* Comments Section */}
      {showComments && (
        <div className="p-4 border-t">
          <CommentThread
            entityType="place"
            entityId={place.id}
          />
        </div>
      )}
    </div>
  );
}
```

### STEP 5: Call & Directions Implementation

#### 5.1 Create Action Buttons Component
Create `/components/actions/PlaceActions.tsx`:
```typescript
'use client';

interface PlaceActionsProps {
  place: {
    id: string;
    name: string;
    phone?: string;
    coordinates?: { lat: number; lng: number };
    address?: string;
    website?: string;
  };
}

export default function PlaceActions({ place }: PlaceActionsProps) {
  const handleCall = () => {
    if (place.phone) {
      // On mobile, this will open the dialer
      window.location.href = `tel:${place.phone}`;
      
      // Track analytics
      fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'place_call',
          place_id: place.id
        })
      });
    } else {
      alert('Phone number not available');
    }
  };

  const handleDirections = () => {
    if (place.coordinates) {
      const { lat, lng } = place.coordinates;
      // Open in Google Maps
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${place.name}`;
      window.open(url, '_blank');
      
      // Track analytics
      fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'place_directions',
          place_id: place.id
        })
      });
    } else if (place.address) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`;
      window.open(url, '_blank');
    } else {
      alert('Location not available');
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/places/${place.id}`;
    
    if (navigator.share) {
      // Use native share on mobile
      try {
        await navigator.share({
          title: place.name,
          text: `Check out ${place.name} in Indiranagar`,
          url: url
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Copy to clipboard on desktop
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
    
    // Track analytics
    fetch('/api/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'place_share',
        place_id: place.id
      })
    });
  };

  const handleWebsite = () => {
    if (place.website) {
      window.open(place.website, '_blank');
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {place.phone && (
        <button
          onClick={handleCall}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          <span>📞</span>
          <span>Call</span>
        </button>
      )}
      
      <button
        onClick={handleDirections}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        <span>🗺️</span>
        <span>Directions</span>
      </button>
      
      <button
        onClick={handleShare}
        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
      >
        <span>🔗</span>
        <span>Share</span>
      </button>
      
      {place.website && (
        <button
          onClick={handleWebsite}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          <span>🌐</span>
          <span>Website</span>
        </button>
      )}
    </div>
  );
}
```

---

## 🧪 TESTING CHECKLIST

### API Testing
```bash
# Test comments API
curl -X POST http://localhost:3000/api/comments \
  -H "Content-Type: application/json" \
  -d '{"entity_type":"place","entity_id":"test-id","content":"Test comment"}'

# Test ratings API
curl -X POST http://localhost:3000/api/ratings \
  -H "Content-Type: application/json" \
  -d '{"entity_type":"place","entity_id":"test-id","rating":5}'
```

### Component Testing
1. Add components to any existing place page
2. Test comment posting and replies
3. Test star rating interaction
4. Test like functionality
5. Test call/directions/share buttons

---

## ✅ VALIDATION CHECKLIST

- [ ] Database tables created
- [ ] Comment API working (GET/POST)
- [ ] Rating API working (GET/POST)
- [ ] Comment thread displays and updates
- [ ] Star rating interactive and saves
- [ ] Like functionality works
- [ ] Call button opens dialer/shows number
- [ ] Directions opens Google Maps
- [ ] Share works on mobile/desktop
- [ ] Rate limiting prevents spam
- [ ] Anonymous posting works

---

## 🚀 INTEGRATION POINTS

After Session 1 completes admin auth, add:
1. Admin moderation panel for comments
2. Flag/delete functionality
3. Admin badge on comments

---

## 📝 COMMIT MESSAGE

```bash
git add .
git commit -m "feat(community): implement comment and rating systems

- Add comment system with nested replies
- Add 5-star rating system
- Add like functionality for comments
- Add call/directions/share actions
- Implement rate limiting
- Support anonymous participation
- Add public UI components"
```

---

*Package Version: 1.0*
*Estimated Time: 15-20 hours*
*Dependencies: None - Can start immediately*