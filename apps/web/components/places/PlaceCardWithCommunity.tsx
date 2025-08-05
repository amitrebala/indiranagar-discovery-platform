'use client';

import { useState } from 'react';
import CommentThread from '@/components/community/CommentThread';
import StarRating from '@/components/community/StarRating';
import PlaceActions from '@/components/actions/PlaceActions';

interface PlaceCardWithCommunityProps {
  place: {
    id: string;
    name: string;
    category: string;
    description: string;
    image_url?: string;
    phone?: string;
    coordinates?: { lat: number; lng: number };
    address?: string;
    website?: string;
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
        <div className="mb-4">
          <PlaceActions place={place} />
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