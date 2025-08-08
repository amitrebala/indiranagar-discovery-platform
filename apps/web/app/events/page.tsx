'use client';

import { EventCalendar } from '@/components/events/EventCalendar';
import { EventsGrid } from '@/components/events/EventsGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Discover Live Events
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real-time events happening around Indiranagar. From dining experiences to cultural gatherings,
            discover what's happening right now in your neighborhood.
          </p>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="dining">Dining</TabsTrigger>
            <TabsTrigger value="nightlife">Nightlife</TabsTrigger>
            <TabsTrigger value="cultural">Cultural</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <EventsGrid />
          </TabsContent>
          
          <TabsContent value="dining">
            <EventsGrid category="dining" />
          </TabsContent>
          
          <TabsContent value="nightlife">
            <EventsGrid category="nightlife" />
          </TabsContent>
          
          <TabsContent value="cultural">
            <EventsGrid category="cultural" />
          </TabsContent>
        </Tabs>
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Calendar</h2>
          <EventCalendar events={[]} />
        </div>
        
        <div className="text-center mt-8">
          <a 
            href="/events/submit"
            className="inline-flex items-center px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
          >
            Submit Your Event
          </a>
        </div>
      </div>
    </div>
  );
}