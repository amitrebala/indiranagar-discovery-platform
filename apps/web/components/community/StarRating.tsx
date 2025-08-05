'use client';

import { useState, useEffect, useCallback } from 'react';

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

  const fetchRatings = useCallback(async () => {
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
  }, [entityType, entityId]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

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