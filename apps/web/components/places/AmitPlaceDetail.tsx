'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Phone, Star, Clock, MessageCircle, ThumbsUp, Navigation, Heart } from 'lucide-react'
import { Place, PlaceImage, CompanionActivity } from '@/lib/validations'
import { amitRealVisitedPlaces, type AmitRealPlace } from '@/data/amit-real-visited-places'
import SocialShare from './SocialShare'
import ContactModal from './ContactModal'

interface AmitPlaceDetailProps {
  place: Place
  images: PlaceImage[]
  activities: CompanionActivity[]
}

interface UserComment {
  id: string
  username: string
  comment: string
  type: 'question' | 'suggestion'
  timestamp: Date
  userRating?: number
  replies?: {
    id: string
    username: string
    comment: string
    timestamp: Date
  }[]
}

// Mock data for comments - in real app this would come from database
const mockComments: UserComment[] = [
  {
    id: '1',
    username: 'FoodieExplorer',
    comment: 'Is this place good for vegetarians? Planning to visit next week!',
    type: 'question',
    timestamp: new Date('2024-01-15'),
    userRating: 4,
    replies: [
      {
        id: '1-1',
        username: 'LocalGuide',
        comment: 'Yes! They have great veggie options. Try their paneer dishes.',
        timestamp: new Date('2024-01-15')
      }
    ]
  },
  {
    id: '2',
    username: 'IndiragnagarNative',
    comment: 'You should also check out the rooftop seating during sunset - amazing views!',
    type: 'suggestion',
    timestamp: new Date('2024-01-10'),
    userRating: 5
  }
]

function findAmitPlace(placeName: string): AmitRealPlace | null {
  return amitRealVisitedPlaces.find(p => 
    p.name.toLowerCase().includes(placeName.toLowerCase()) ||
    placeName.toLowerCase().includes(p.name.toLowerCase())
  ) || null
}

function getNearbyPlaces(currentPlace: Place, limit: number = 4): AmitRealPlace[] {
  // For now, return random places from Amit's list
  // In a real app, this would use coordinate distance
  const shuffled = [...amitRealVisitedPlaces].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, limit)
}

function CommentSection({ placeName }: { placeName: string }) {
  const [comments, setComments] = useState<UserComment[]>(mockComments)
  const [newComment, setNewComment] = useState('')
  const [newCommentType, setNewCommentType] = useState<'question' | 'suggestion'>('question')
  const [newUsername, setNewUsername] = useState('')
  const [newRating, setNewRating] = useState<number>(0)
  const [showCommentForm, setShowCommentForm] = useState(false)

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !newUsername.trim()) return

    const comment: UserComment = {
      id: Date.now().toString(),
      username: newUsername,
      comment: newComment,
      type: newCommentType,
      timestamp: new Date(),
      userRating: newRating > 0 ? newRating : undefined
    }

    setComments([comment, ...comments])
    setNewComment('')
    setNewUsername('')
    setNewRating(0)
    setShowCommentForm(false)
  }

  const renderStars = (rating: number, interactive: boolean = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive && onRate ? () => onRate(star) : undefined}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-primary" />
          Community
        </h2>
        <button
          onClick={() => setShowCommentForm(!showCommentForm)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Add Comment
        </button>
      </div>

      {/* Comment Form */}
      {showCommentForm && (
        <div className="bg-gray-50 p-6 rounded-xl mb-6">
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                id="username"
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter your name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="question"
                    checked={newCommentType === 'question'}
                    onChange={(e) => setNewCommentType(e.target.value as 'question')}
                    className="mr-2"
                  />
                  I have a question
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="suggestion"
                    checked={newCommentType === 'suggestion'}
                    onChange={(e) => setNewCommentType(e.target.value as 'suggestion')}
                    className="mr-2"
                  />
                  I have a suggestion
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating (optional)
              </label>
              {renderStars(newRating, true, setNewRating)}
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                Comment
              </label>
              <textarea
                id="comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                placeholder="Share your thoughts, questions, or suggestions..."
                required
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowCommentForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Post Comment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {comment.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{comment.username}</p>
                  <p className="text-xs text-gray-500">
                    {comment.timestamp.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  comment.type === 'question' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {comment.type}
                </span>
                {comment.userRating && renderStars(comment.userRating)}
              </div>
            </div>
            
            <p className="text-gray-700 mb-3">{comment.comment}</p>
            
            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-6 border-l border-gray-200 pl-4 space-y-2">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {reply.username}
                      </span>
                      <span className="text-xs text-gray-500">
                        {reply.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{reply.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function NearbyPlaces({ currentPlace }: { currentPlace: Place }) {
  const nearbyPlaces = getNearbyPlaces(currentPlace, 4)

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Navigation className="w-6 h-6 text-primary" />
        Other Places Nearby
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        {nearbyPlaces.map((place, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{place.name}</h3>
              <div className="flex items-center gap-1">
                {place.rating && (
                  <>
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-gray-600">{place.rating}</span>
                  </>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{place.notes}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                {place.category}
              </span>
              {place.priceRange && (
                <span className="text-xs text-gray-500">{place.priceRange}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AmitPlaceDetail({ place, images, activities }: AmitPlaceDetailProps) {
  const [showContactModal, setShowContactModal] = useState(false)
  const amitPlace = findAmitPlace(place.name)

  // Separate activities by type
  const beforeActivities = activities.filter(a => a.activity_type === 'before')
  const afterActivities = activities.filter(a => a.activity_type === 'after')

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    const emptyStars = 5 - Math.ceil(rating)

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-5 h-5 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-gray-300" />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header with back navigation */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            href="/map"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Map</span>
          </Link>
          <SocialShare place={place} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden mb-6">
            {place.primary_image ? (
              <Image
                src={place.primary_image}
                alt={place.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <MapPin className="w-16 h-16 text-gray-400" />
              </div>
            )}
            
            {/* Image count overlay */}
            {images.length > 0 && (
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                +{images.length} photos
              </div>
            )}
          </div>

          {/* Place Title and Ratings */}
          <div className="mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {place.name}
            </h1>
            
            {/* Dual Rating System */}
            <div className="grid md:grid-cols-2 gap-6 mb-4">
              {/* Amit's Rating */}
              {amitPlace?.rating && (
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-5 h-5 text-primary fill-current" />
                    <span className="font-semibold text-primary">Amit's Rating</span>
                  </div>
                  {renderStars(amitPlace.rating)}
                </div>
              )}
              
              {/* Community Rating */}
              <div className="bg-secondary/5 p-4 rounded-xl border border-secondary/20">
                <div className="flex items-center gap-2 mb-2">
                  <ThumbsUp className="w-5 h-5 text-secondary" />
                  <span className="font-semibold text-secondary">Community Rating</span>
                </div>
                {renderStars(place.rating)}
                <span className="text-sm text-gray-600 mt-1 block">
                  Based on {mockComments.filter(c => c.userRating).length} reviews
                </span>
              </div>
            </div>

            {place.category && (
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {place.category}
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setShowContactModal(true)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <Phone className="w-4 h-4" />
              Ask Amit
            </button>
            <Link
              href={`/map?highlight=${place.id}`}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <MapPin className="w-4 h-4" />
              View on Map
            </Link>
          </div>
        </div>

        {/* Amit's Personal Notes */}
        {amitPlace && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-xl border border-primary/20">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary fill-current" />
                Amit's Personal Notes
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {amitPlace.notes}
              </p>
              
              {amitPlace.mustTry && amitPlace.mustTry.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Must Try:</h3>
                  <div className="flex flex-wrap gap-2">
                    {amitPlace.mustTry.map((item, index) => (
                      <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {amitPlace.vibe && (
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">
                    Vibe: {amitPlace.vibe}
                  </span>
                )}
                {amitPlace.priceRange && (
                  <span className="px-2 py-1 bg-green-50 text-green-700 rounded">
                    {amitPlace.priceRange}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Place</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {place.description}
            </p>
          </div>
        </div>

        {/* Before Activities */}
        {beforeActivities.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-600" />
              Before You Go
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {beforeActivities.map((activity) => (
                <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{activity.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                  {activity.timing_minutes && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {activity.timing_minutes} min
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* After Activities */}
        {afterActivities.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-green-600" />
              After Your Visit
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {afterActivities.map((activity) => (
                <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{activity.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                  {activity.timing_minutes && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      {activity.timing_minutes} min
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nearby Places */}
        <NearbyPlaces currentPlace={place} />

        {/* Community Comments */}
        <CommentSection placeName={place.name} />
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal
          place={place}
          onClose={() => setShowContactModal(false)}
        />
      )}
    </div>
  )
}