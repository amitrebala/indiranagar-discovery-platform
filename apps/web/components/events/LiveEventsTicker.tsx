'use client';

import { useRealtimeEvents } from '@/hooks/useRealtimeEvents';
import { Clock, MapPin, TrendingUp } from 'lucide-react';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';

export function LiveEventsTicker() {
  const { events, connected } = useRealtimeEvents();
  
  const upcomingEvents = events
    .filter(event => {
      const eventDate = parseISO(event.start_time);
      return isToday(eventDate) || isTomorrow(eventDate);
    })
    .slice(0, 5);
  
  if (upcomingEvents.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 overflow-hidden">
      <div className="flex items-center space-x-8 animate-scroll">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4" />
          <span className="font-semibold text-sm">Live Events</span>
          {connected && (
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          )}
        </div>
        
        {upcomingEvents.map((event, index) => (
          <div key={event.id} className="flex items-center space-x-2 text-sm">
            {index > 0 && <span className="text-white/50">•</span>}
            <Clock className="w-3 h-3" />
            <span className="font-medium">
              {format(parseISO(event.start_time), 'h:mm a')}
            </span>
            <span>{event.title}</span>
            {event.venue_name && (
              <>
                <MapPin className="w-3 h-3 ml-1" />
                <span className="text-white/90">{event.venue_name}</span>
              </>
            )}
          </div>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  );
}