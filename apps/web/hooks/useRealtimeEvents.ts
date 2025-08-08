'use client';

import { useEffect, useState, useCallback } from 'react';
import { DiscoveredEvent } from '@/lib/types/events';
import { createClient } from '@/lib/supabase/client';

interface RealtimeEventUpdate {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  event: DiscoveredEvent;
}

export function useRealtimeEvents(category?: string) {
  const [events, setEvents] = useState<DiscoveredEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  
  const fetchInitialEvents = useCallback(async () => {
    try {
      const supabase = createClient();
      
      let query = supabase
        .from('discovered_events')
        .select(`
          *,
          event_images (*)
        `)
        .eq('is_active', true)
        .eq('moderation_status', 'approved')
        .order('start_time', { ascending: true })
        .limit(50);
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }, [category]);
  
  useEffect(() => {
    fetchInitialEvents();
    
    const supabase = createClient();
    
    const channel = supabase
      .channel('discovered-events')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'discovered_events',
          filter: category ? `category=eq.${category}` : undefined
        },
        (payload) => {
          console.log('New event:', payload.new);
          setEvents(prev => [payload.new as DiscoveredEvent, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'discovered_events'
        },
        (payload) => {
          console.log('Updated event:', payload.new);
          setEvents(prev => prev.map(event => 
            event.id === payload.new.id ? payload.new as DiscoveredEvent : event
          ));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'discovered_events'
        },
        (payload) => {
          console.log('Deleted event:', payload.old);
          setEvents(prev => prev.filter(event => event.id !== payload.old.id));
        }
      )
      .subscribe((status) => {
        setConnected(status === 'SUBSCRIBED');
      });
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [category, fetchInitialEvents]);
  
  return {
    events,
    loading,
    connected,
    refetch: fetchInitialEvents
  };
}