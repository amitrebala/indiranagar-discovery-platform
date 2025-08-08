'use client';

import { DiscoveredEvent } from '@/lib/types/events';
import { Calendar, MapPin, Clock, Tag, Users, DollarSign } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface EventCardProps {
  event: DiscoveredEvent;
  onClick?: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  const formatEventTime = (startTime: string, endTime?: string) => {
    const start = parseISO(startTime);
    const formattedStart = format(start, 'MMM d, h:mm a');
    
    if (endTime) {
      const end = parseISO(endTime);
      const formattedEnd = format(end, 'h:mm a');
      return `${formattedStart} - ${formattedEnd}`;
    }
    
    return formattedStart;
  };
  
  const getCostDisplay = () => {
    switch (event.cost_type) {
      case 'free':
        return 'Free';
      case 'paid':
        if (event.price_range) {
          const { min, max, currency = '₹' } = event.price_range;
          if (min && max) {
            return `${currency}${min} - ${currency}${max}`;
          }
          if (min) {
            return `From ${currency}${min}`;
          }
        }
        return 'Paid';
      case 'donation':
        return 'Donation Based';
      case 'variable':
        return 'Variable Pricing';
      default:
        return 'Free';
    }
  };
  
  const primaryImage = event.images?.find(img => img.is_primary) || event.images?.[0];
  
  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {primaryImage && (
        <div className="relative h-48 w-full">
          <OptimizedImage
            src={primaryImage.url}
            alt={primaryImage.alt_text || event.title}
            fill
            className="object-cover"
          />
          {event.verification_status === 'verified' && (
            <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs">
              Verified
            </div>
          )}
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold line-clamp-2 flex-1">
            {event.title}
          </h3>
          {event.category && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {event.category}
            </span>
          )}
        </div>
        
        {event.description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {event.description}
          </p>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>{formatEventTime(event.start_time, event.end_time)}</span>
          </div>
          
          {event.venue_name && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="line-clamp-1">{event.venue_name}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
              <DollarSign className="w-4 h-4 mr-1 text-gray-600" />
              <span className={event.cost_type === 'free' ? 'text-green-600 font-medium' : 'text-gray-700'}>
                {getCostDisplay()}
              </span>
            </div>
            
            {event.capacity && (
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-1" />
                <span>{event.capacity} spots</span>
              </div>
            )}
          </div>
          
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {event.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {event.rsvp_count && event.rsvp_count > 0 && (
          <div className="mt-3 pt-3 border-t text-sm text-gray-600">
            {event.rsvp_count} people interested
          </div>
        )}
      </div>
    </div>
  );
}