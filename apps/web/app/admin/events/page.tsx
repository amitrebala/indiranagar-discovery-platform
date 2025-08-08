'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { DiscoveredEvent } from '@/lib/types/events';
import { Check, X, Eye, Clock, AlertTriangle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<DiscoveredEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  
  useEffect(() => {
    fetchEvents();
  }, [filter]);
  
  const fetchEvents = async () => {
    try {
      const supabase = createClient();
      
      let query = supabase
        .from('discovered_events')
        .select(`
          *,
          event_images (*)
        `)
        .order('created_at', { ascending: false });
      
      if (filter !== 'all') {
        query = query.eq('moderation_status', filter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const moderateEvent = async (eventId: string, status: 'approved' | 'rejected', notes?: string) => {
    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('discovered_events')
        .update({
          moderation_status: status,
          moderation_notes: notes,
          moderated_at: new Date().toISOString(),
          published_at: status === 'approved' ? new Date().toISOString() : null
        })
        .eq('id', eventId);
      
      if (error) throw error;
      
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, moderation_status: status, moderation_notes: notes }
          : event
      ));
    } catch (error) {
      console.error('Error moderating event:', error);
    }
  };
  
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Rejected</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pending</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Unknown</span>;
    }
  };
  
  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Moderation</h1>
        
        <div className="flex space-x-2">
          {(['pending', 'approved', 'rejected', 'all'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status === 'pending' && events.filter(e => e.moderation_status === 'pending').length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {events.filter(e => e.moderation_status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date/Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quality Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {event.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {event.venue_name || 'No venue'}
                    </div>
                    {event.description && (
                      <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {event.description}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {format(parseISO(event.start_time), 'MMM d, yyyy')}
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(parseISO(event.start_time), 'h:mm a')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {event.source_id || 'Manual'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(event.moderation_status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-900">
                      {event.quality_score ? `${(event.quality_score * 100).toFixed(0)}%` : 'N/A'}
                    </span>
                    {event.quality_score && event.quality_score < 0.5 && (
                      <AlertTriangle className="w-4 h-4 ml-1 text-yellow-500" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    {event.moderation_status === 'pending' && (
                      <>
                        <button
                          onClick={() => moderateEvent(event.id, 'approved')}
                          className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                          title="Approve"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moderateEvent(event.id, 'rejected', 'Does not meet quality standards')}
                          className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                          title="Reject"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        // TODO: Open event preview modal
                        console.log('Preview event:', event.id);
                      }}
                      className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {events.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No events to moderate</p>
          </div>
        )}
      </div>
    </div>
  );
}