'use client'

import { Star, Award, ThumbsUp, Clock } from 'lucide-react'
import { PersonalReview as PersonalReviewType } from '@/lib/types/memory-palace'

interface PersonalReviewProps {
  review: PersonalReviewType;
  placeName: string;
}

export default function PersonalReview({ review, placeName }: PersonalReviewProps) {
  const renderRatingBar = (label: string, rating: number, maxRating: number = 5) => {
    const percentage = (rating / maxRating) * 100
    
    return (
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm text-gray-600">{rating}/{maxRating}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }

  const getFrequencyBadge = (frequency: string) => {
    const frequencyColors = {
      'weekly': 'bg-green-100 text-green-800',
      'monthly': 'bg-blue-100 text-blue-800',
      'occasionally': 'bg-yellow-100 text-yellow-800',
      'rarely': 'bg-gray-100 text-gray-800',
      'first-time': 'bg-purple-100 text-purple-800'
    }
    
    return frequencyColors[frequency as keyof typeof frequencyColors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <section className="personal-review bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Curator's Personal Review</h2>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getFrequencyBadge(review.visit_frequency)}`}>
              <Clock className="w-4 h-4 inline mr-1" />
              {review.visit_frequency.replace('-', ' ')} visitor
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-5 h-5 ${
                  i < Math.floor(review.rating_breakdown.ambiance) 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-gray-300'
                }`} 
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">Overall experience</span>
        </div>
      </div>

      {/* Main Review Content */}
      <div className="mb-6">
        <div 
          className="text-gray-800 leading-relaxed text-lg italic border-l-4 border-green-400 pl-6 py-2 bg-green-50 rounded-r-lg"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {review.content}
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Why this rating:</strong> {review.personal_rating_explanation}</p>
        </div>
      </div>

      {/* Detailed Rating Breakdown */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-600" />
          Detailed Assessment
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          {renderRatingBar('Ambiance & Atmosphere', review.rating_breakdown.ambiance)}
          {review.rating_breakdown.food_quality && 
            renderRatingBar('Food Quality', review.rating_breakdown.food_quality)}
          {review.rating_breakdown.service && 
            renderRatingBar('Service Experience', review.rating_breakdown.service)}
          {renderRatingBar('Value for Money', review.rating_breakdown.value)}
          {renderRatingBar('Uniqueness Factor', review.rating_breakdown.uniqueness)}
        </div>
      </div>

      {/* Key Highlights */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <ThumbsUp className="w-5 h-5 text-green-600" />
          What Makes It Special
        </h3>
        <div className="grid gap-2 md:grid-cols-2">
          {review.highlights.map((highlight, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">{highlight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Curator Signature */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <strong>Personal insight:</strong> {review.curator_signature}
          </div>
          <div className="text-xs text-gray-500">
            — Amit, Indiranagar Curator
          </div>
        </div>
      </div>
    </section>
  )
}