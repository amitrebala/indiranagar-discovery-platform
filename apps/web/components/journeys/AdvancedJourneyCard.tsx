'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Clock, MapPin, Heart, Eye, Star, Navigation } from 'lucide-react';

interface AdvancedJourneyCardProps {
  journey: {
    id: string;
    slug: string;
    name: string;
    description: string;
    duration_minutes: number;
    distance_km: number;
    difficulty: string;
    mood_tags: string[];
    hero_image_url?: string;
    view_count: number;
    save_count: number;
    stops?: any[];
  };
}

export default function AdvancedJourneyCard({ journey }: AdvancedJourneyCardProps) {
  const [saved, setSaved] = useState(false);
  
  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    
    // Save to localStorage for now (no auth)
    const savedJourneys = JSON.parse(
      localStorage.getItem('saved_journeys') || '[]'
    );
    
    if (saved) {
      const filtered = savedJourneys.filter((id: string) => id !== journey.id);
      localStorage.setItem('saved_journeys', JSON.stringify(filtered));
      setSaved(false);
    } else {
      savedJourneys.push(journey.id);
      localStorage.setItem('saved_journeys', JSON.stringify(savedJourneys));
      setSaved(true);
      
      // Track save analytics
      try {
        await fetch('/api/analytics/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'journey_saved',
            journey_id: journey.id,
            journey_name: journey.name
          })
        });
      } catch (error) {
        console.error('Failed to track save event:', error);
      }
    }
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'challenging': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
      {/* Hero Image */}
      <div className="relative h-48">
        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
          {journey.hero_image_url ? (
            <img
              src={journey.hero_image_url}
              alt={journey.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="text-center text-gray-500">
              <Navigation className="w-12 h-12 mx-auto mb-2 text-blue-400" />
              <p className="text-sm">Journey Preview</p>
            </div>
          )}
        </div>
        
        {/* Overlay & Save Button */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <button
          onClick={handleSave}
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-md hover:shadow-lg transition-all hover:bg-white"
        >
          <Heart 
            className={`w-4 h-4 ${saved ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
          />
        </button>
        
        {/* Difficulty Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(journey.difficulty)}`}>
          {journey.difficulty}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
            {journey.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {journey.description}
          </p>
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {formatDuration(journey.duration_minutes)}
            </span>
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {journey.distance_km}km
            </span>
            <span className="flex items-center">
              <Navigation className="w-4 h-4 mr-1" />
              {journey.stops?.length || 0} stops
            </span>
          </div>
        </div>
        
        {/* Mood Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {journey.mood_tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              {tag}
            </span>
          ))}
          {journey.mood_tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              +{journey.mood_tags.length - 3}
            </span>
          )}
        </div>
        
        {/* Stats Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              {journey.view_count} views
            </span>
            <span className="flex items-center">
              <Heart className="w-3 h-3 mr-1" />
              {journey.save_count} saves
            </span>
          </div>
          <div className="flex items-center">
            <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
            <span>Amit's Pick</span>
          </div>
        </div>
        
        {/* Action Button */}
        <Link
          href={`/journeys/${journey.slug}`}
          className="block w-full text-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
        >
          Start Journey
        </Link>
      </div>
    </div>
  );
}