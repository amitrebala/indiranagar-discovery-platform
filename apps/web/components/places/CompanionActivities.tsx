'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Clock, Star, ArrowRight } from 'lucide-react';

interface CompanionActivitiesProps {
  placeId: string;
  placeName?: string;
}

interface CompanionSuggestion {
  place: {
    id: string;
    name: string;
    category: string;
    description?: string;
  };
  activity_type: 'before' | 'after';
  reason: string;
  time_gap_minutes: number;
  distance_meters: number;
  compatibility_score: number;
}

export default function CompanionActivities({ placeId, placeName }: CompanionActivitiesProps) {
  const [companions, setCompanions] = useState<{
    before: CompanionSuggestion[];
    after: CompanionSuggestion[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchCompanions();
  }, [placeId]);
  
  const fetchCompanions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/places/${placeId}/companions`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch companion activities');
      }
      
      const data = await response.json();
      setCompanions(data);
    } catch (error) {
      console.error('Error fetching companions:', error);
      setError('Failed to load companion activities');
    } finally {
      setLoading(false);
    }
  };
  
  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${Math.round(meters / 50) * 50}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };
  
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };
  
  const getCategoryEmoji = (category: string) => {
    const emojiMap: Record<string, string> = {
      'restaurant': '🍽️',
      'cafe': '☕',
      'bar': '🍺',
      'dessert': '🍰',
      'bakery': '🥖',
      'park': '🌳',
      'activity': '🎯',
      'shopping': '🛍️',
      'gallery': '🎨',
      'bookstore': '📚'
    };
    return emojiMap[category.toLowerCase()] || '📍';
  };
  
  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 rounded-lg p-4">
        <p className="text-red-600 text-sm">{error}</p>
        <button 
          onClick={fetchCompanions}
          className="mt-2 text-red-700 hover:text-red-800 text-sm underline"
        >
          Try again
        </button>
      </div>
    );
  }
  
  if (!companions || (companions.before.length === 0 && companions.after.length === 0)) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          🎯 Perfect Companions
        </h3>
        <p className="text-gray-600 text-sm">
          No companion activities found for this location yet. 
        </p>
        <p className="text-gray-500 text-xs mt-1">
          Our recommendation engine is still learning about this place.
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          🎯 Perfect Companions
        </h3>
        <div className="text-xs text-gray-500">
          AI-powered suggestions
        </div>
      </div>
      
      {companions.before.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
            Before visiting {placeName || 'this place'}:
          </h4>
          <div className="space-y-2">
            {companions.before.slice(0, 2).map((item) => (
              <CompanionCard key={`before-${item.place.id}`} item={item} />
            ))}
          </div>
        </div>
      )}
      
      {companions.after.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
            After visiting {placeName || 'this place'}:
          </h4>
          <div className="space-y-2">
            {companions.after.slice(0, 2).map((item) => (
              <CompanionCard key={`after-${item.place.id}`} item={item} />
            ))}
          </div>
        </div>
      )}
      
      {/* Create Journey CTA */}
      <div className="mt-4 pt-4 border-t border-blue-200">
        <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition-all text-sm font-medium flex items-center justify-center">
          <span>Create Journey with These</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
        <p className="text-xs text-gray-500 text-center mt-1">
          Build a custom journey including these recommendations
        </p>
      </div>
    </div>
  );
}

function CompanionCard({ item }: { item: CompanionSuggestion }) {
  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${Math.round(meters / 50) * 50}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };
  
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };
  
  const getCategoryEmoji = (category: string) => {
    const emojiMap: Record<string, string> = {
      'restaurant': '🍽️',
      'cafe': '☕',
      'bar': '🍺',
      'dessert': '🍰',
      'bakery': '🥖',
      'park': '🌳',
      'activity': '🎯',
      'shopping': '🛍️',
      'gallery': '🎨',
      'bookstore': '📚'
    };
    return emojiMap[category.toLowerCase()] || '📍';
  };
  
  return (
    <Link
      href={`/places/${item.place.id}`}
      className="block bg-white rounded-md p-3 hover:shadow-md transition-shadow border border-gray-100"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <span className="text-lg mr-2">{getCategoryEmoji(item.place.category)}</span>
            <h5 className="font-medium text-gray-900 text-sm">{item.place.name}</h5>
            <div className="ml-2 flex items-center">
              {[...Array(Math.ceil(item.compatibility_score * 5))].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-2">{item.reason}</p>
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <span className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {formatDistance(item.distance_meters)} away
            </span>
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {formatTime(item.time_gap_minutes)}
            </span>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
      </div>
    </Link>
  );
}