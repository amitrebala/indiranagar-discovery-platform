'use client';

import { useState, useEffect, useCallback } from 'react';
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

  const fetchComments = useCallback(async () => {
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
  }, [entityType, entityId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

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