import { EventCalendar } from '@/components/events/EventCalendar';

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Community Events
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover and participate in local events happening around Indiranagar. 
            From food festivals to running groups, find your community here.
          </p>
        </div>
        
        <EventCalendar events={[]} />
        
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