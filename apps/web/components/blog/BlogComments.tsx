'use client'

import { useState } from 'react'
import { MessageCircle, Reply, ThumbsUp, Flag, User, MoreVertical } from 'lucide-react'
import { BlogComment } from '@/lib/types/blog'

interface BlogCommentsProps {
  comments: BlogComment[]
  postId: string
  onAddComment?: (content: string, parentId?: string) => void
  onLikeComment?: (commentId: string) => void
  onReportComment?: (commentId: string) => void
  allowComments?: boolean
}

interface CommentFormProps {
  onSubmit: (content: string) => void
  onCancel?: () => void
  placeholder?: string
  submitText?: string
  isReply?: boolean
}

function CommentForm({ 
  onSubmit, 
  onCancel, 
  placeholder = "Share your thoughts...",
  submitText = "Post Comment",
  isReply = false
}: CommentFormProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await onSubmit(content.trim())
      setContent('')
      onCancel?.()
    } catch (error) {
      console.error('Failed to submit comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`comment-form ${isReply ? 'ml-12' : ''}`}>
      <div className="mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          rows={isReply ? 3 : 4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          <span>Comments are moderated and will appear after approval.</span>
        </div>
        <div className="flex gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Posting...' : submitText}
          </button>
        </div>
      </div>
    </form>
  )
}

interface CommentItemProps {
  comment: BlogComment
  onReply?: (commentId: string, content: string) => void
  onLike?: (commentId: string) => void
  onReport?: (commentId: string) => void
  depth?: number
}

function CommentItem({ comment, onReply, onLike, onReport, depth = 0 }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [showReplies, setShowReplies] = useState(true)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60))
        return diffMinutes <= 1 ? 'just now' : `${diffMinutes}m ago`
      }
      return `${diffHours}h ago`
    } else if (diffDays < 7) {
      return `${diffDays}d ago`
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      })
    }
  }

  const handleReplySubmit = (content: string) => {
    onReply?.(comment.id, content)
    setShowReplyForm(false)
  }

  const maxDepth = 3
  const isMaxDepth = depth >= maxDepth

  return (
    <div className={`comment-item ${depth > 0 ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        {/* Comment Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              {comment.author_avatar ? (
                <img
                  src={comment.author_avatar}
                  alt={comment.author_name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-gray-600" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-900">{comment.author_name}</h4>
                {comment.is_author_reply && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    Author
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">{formatDate(comment.created_at)}</p>
            </div>
          </div>
          
          <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Comment Content */}
        <div className="mb-4">
          <p className="text-gray-800 leading-relaxed">{comment.content}</p>
        </div>

        {/* Comment Actions */}
        <div className="flex items-center gap-6 text-sm">
          <button
            onClick={() => onLike?.(comment.id)}
            className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{comment.likes_count > 0 ? comment.likes_count : 'Like'}</span>
          </button>
          
          {!isMaxDepth && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Reply className="w-4 h-4" />
              <span>Reply</span>
            </button>
          )}
          
          {comment.replies && comment.replies.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{showReplies ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}</span>
            </button>
          )}
          
          <button
            onClick={() => onReport?.(comment.id)}
            className="flex items-center gap-1 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Flag className="w-4 h-4" />
            <span>Report</span>
          </button>
        </div>
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <div className="mt-4">
          <CommentForm
            onSubmit={handleReplySubmit}
            onCancel={() => setShowReplyForm(false)}
            placeholder="Write a reply..."
            submitText="Post Reply"
            isReply
          />
        </div>
      )}

      {/* Replies */}
      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onLike={onLike}
              onReport={onReport}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function BlogComments({
  comments,
  postId,
  onAddComment,
  onLikeComment,
  onReportComment,
  allowComments = true
}: BlogCommentsProps) {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'most_liked'>('newest')

  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case 'most_liked':
        return b.likes_count - a.likes_count
      case 'newest':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  const handleAddComment = (content: string) => {
    onAddComment?.(content)
  }

  const handleReply = (parentId: string, content: string) => {
    onAddComment?.(content, parentId)
  }

  return (
    <section className="blog-comments">
      {/* Comments Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-blue-600" />
          Comments ({comments.length})
        </h3>
        
        {comments.length > 0 && (
          <div className="flex items-center gap-2">
            <label htmlFor="sort-comments" className="text-sm text-gray-600">
              Sort by:
            </label>
            <select
              id="sort-comments"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="most_liked">Most liked</option>
            </select>
          </div>
        )}
      </div>

      {/* Add Comment Form */}
      {allowComments && (
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Join the conversation</h4>
          <CommentForm onSubmit={handleAddComment} />
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-6">
          {sortedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onLike={onLikeComment}
              onReport={onReportComment}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h4>
          <p className="text-gray-600 mb-4">
            Be the first to share your thoughts on this post!
          </p>
          {!allowComments && (
            <p className="text-sm text-gray-500">
              Comments are currently disabled for this post.
            </p>
          )}
        </div>
      )}

      {/* Comment Guidelines */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h5 className="font-medium text-blue-900 mb-2">Community Guidelines</h5>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Be respectful and constructive in your comments</li>
          <li>• Stay on topic and relevant to the post</li>
          <li>• No spam, self-promotion, or inappropriate content</li>
          <li>• Comments are manually reviewed before appearing</li>
        </ul>
      </div>
    </section>
  )
}