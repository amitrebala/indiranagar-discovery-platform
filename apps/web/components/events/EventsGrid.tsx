'use client';

import { useState, useEffect } from 'react';
import { EventCard } from './EventCard';
import { DiscoveredEvent } from '@/lib/types/events';
import { Skeleton } from '@/components/ui/Skeleton';

interface EventsGridProps {
  category?: string;
  limit?: number;
}

export function EventsGrid({ category, limit = 20 }: EventsGridProps) {
  const [events, setEvents] = useState<DiscoveredEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchEvents();
  }, [category]);
  
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      params.append('limit', limit.toString());
      
      // Use the same endpoint as the working discovery page
      const response = await fetch(`/api/events?${params}`);
      if (!response.ok) throw new Error('Failed to fetch events');
      
      const data = await response.json();
      
      // Filter events based on category if needed
      let eventsData = data.events || [];
      if (category && category !== 'all') {
        eventsData = eventsData.filter((event: DiscoveredEvent) => 
          event.category === category && 
          event.moderation_status === 'approved' && 
          event.is_active
        );
      } else {
        // Only show approved and active events
        eventsData = eventsData.filter((event: DiscoveredEvent) => 
          event.moderation_status === 'approved' && 
          event.is_active
        );
      }
      
      setEvents(eventsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-4">
            <Skeleton className="h-48 w-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchEvents}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No events found</p>
        <p className="text-sm text-gray-500">Check back later for upcoming events!</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onClick={() => {
            // TODO: Navigate to event detail page
            console.log('Event clicked:', event.id);
          }}
        />
      ))}
    </div>
  );
}