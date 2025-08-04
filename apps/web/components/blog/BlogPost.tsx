'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, Eye, MessageCircle, Share2, Heart, MapPin, Tag } from 'lucide-react'
import { BlogPost as BlogPostType } from '@/lib/types/blog'

interface BlogPostProps {
  post: BlogPostType
  variant?: 'full' | 'card' | 'compact'
  showLinkedPlaces?: boolean
  onShare?: (post: BlogPostType) => void
  onLike?: (postId: string) => void
  isLiked?: boolean
}

export default function BlogPost({ 
  post, 
  variant = 'card',
  showLinkedPlaces = true,
  onShare,
  onLike,
  isLiked = false
}: BlogPostProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  const getCategoryColor = (color: string) => {
    const colorMap: Record<string, string> = {
      'neighborhood': 'bg-blue-100 text-blue-800 border-blue-200',
      'business': 'bg-green-100 text-green-800 border-green-200',
      'cultural': 'bg-purple-100 text-purple-800 border-purple-200',
      'food': 'bg-red-100 text-red-800 border-red-200',
      'events': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'personal': 'bg-pink-100 text-pink-800 border-pink-200'
    }
    return colorMap[color] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onShare?.(post)
  }

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onLike?.(post.id)
  }

  if (variant === 'compact') {
    return (
      <Link href={`/blog/${post.slug}`}>
        <article className="blog-post-compact bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex gap-4">
            {post.featured_image && (
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover rounded-lg"
                  sizes="80px"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(post.category.color)}`}>
                  {post.category.icon} {post.category.name}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(post.published_at || post.created_at)}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                {post.title}
              </h3>
              <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.reading_time_minutes}min read
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {post.view_count}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {post.comment_count}
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  if (variant === 'full') {
    return (
      <article className="blog-post-full bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Featured Image */}
        {post.featured_image && (
          <div className="relative h-64 md:h-80">
            <div className={`w-full h-full bg-gray-200 ${!imageLoaded ? 'animate-pulse' : ''}`}>
              <Image
                src={post.featured_image}
                alt={post.title}
                fill
                className={`object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                priority
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border backdrop-blur-sm ${getCategoryColor(post.category.color)}`}>
                {post.category.icon} {post.category.name}
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Header */}
          <header className="mb-6">
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(post.published_at || post.created_at)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.reading_time_minutes} min read
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.view_count} views
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              {post.excerpt}
            </p>
          </header>

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Linked Places */}
          {showLinkedPlaces && post.linked_places.length > 0 && (
            <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Places Mentioned in This Post
              </h3>
              <div className="grid gap-3 md:grid-cols-2">
                {post.linked_places.map((place) => (
                  <Link
                    key={place.place_id}
                    href={`/places/${place.place_id}`}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200 hover:shadow-md transition-shadow"
                  >
                    <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{place.place_name}</h4>
                      {place.place_category && (
                        <p className="text-sm text-gray-600">{place.place_category}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isLiked 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                Like
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MessageCircle className="w-4 h-4" />
              <span>{post.comment_count} comments</span>
            </div>
          </div>
        </div>
      </article>
    )
  }

  // Default card variant
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="blog-post-card bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
        {/* Featured Image */}
        {post.featured_image && (
          <div className="relative h-48">
            <div className={`w-full h-full bg-gray-200 ${!imageLoaded ? 'animate-pulse' : ''}`}>
              <Image
                src={post.featured_image}
                alt={post.title}
                fill
                className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border backdrop-blur-sm ${getCategoryColor(post.category.color)}`}>
                {post.category.icon} {post.category.name}
              </span>
            </div>
            
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={handleShare}
                className="p-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-full hover:bg-white transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Meta */}
          <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(post.published_at || post.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.reading_time_minutes}min
            </span>
          </div>
          
          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h2>
          
          {/* Excerpt */}
          <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
            {post.excerpt}
          </p>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}
          
          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.view_count}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {post.comment_count}
              </span>
            </div>
            
            {post.linked_places.length > 0 && (
              <span className="flex items-center gap-1 text-blue-600">
                <MapPin className="w-4 h-4" />
                {post.linked_places.length} place{post.linked_places.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}