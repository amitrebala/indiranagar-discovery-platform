'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase/client'
import { Journey } from '@/lib/supabase/types'
import { JourneyCard } from './JourneyCard'
import { Skeleton } from '@/components/ui/Skeleton'

interface JourneySelectorProps {
  onSelect?: (journey: Journey) => void
}

export function JourneySelector({ onSelect }: JourneySelectorProps) {
  const [journeys, setJourneys] = useState<Journey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        const { data, error } = await supabase
          .from('journeys')
          .select('*')
          .order('created_at', { ascending: true })
        
        if (error) throw error
        
        setJourneys(data || [])
      } catch (err) {
        console.error('Error fetching journeys:', err)
        setError('Failed to load journeys')
        
        // Fallback to mock data if database is not ready
        setJourneys([
          {
            id: '1',
            title: "First Timer's Perfect Day",
            description: "Amit's curated 6-hour journey through must-visit spots",
            gradient: 'from-amber-500 to-orange-600',
            icon: 'map',
            estimated_time: '6 hours',
            vibe_tags: ['curious', 'explorer', 'foodie'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            title: "Local's Secret Circuit",
            description: 'Hidden gems only 2% of visitors know about',
            gradient: 'from-purple-600 to-pink-600',
            icon: 'compass',
            estimated_time: '4 hours',
            vibe_tags: ['adventurous', 'offbeat', 'insider'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '3',
            title: 'Live Like a Resident',
            description: "Experience Amit's actual weekly routine",
            gradient: 'from-teal-500 to-cyan-600',
            icon: 'home',
            estimated_time: '3 hours',
            vibe_tags: ['authentic', 'slow', 'mindful'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchJourneys()
  }, [])
  
  const handleSelect = (journey: Journey) => {
    if (onSelect) {
      onSelect(journey)
    }
  }
  
  if (isLoading) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64 rounded-2xl" />
        ))}
      </div>
    )
  }
  
  if (error && journeys.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-gray-600">{error}</p>
        <div className="bg-yellow-50 p-4 rounded-lg max-w-2xl mx-auto text-left">
          <p className="text-sm font-semibold text-yellow-800 mb-2">To see the journeys, run this SQL in your Supabase dashboard:</p>
          <pre className="text-xs bg-white p-3 rounded border border-yellow-200 overflow-x-auto">
{`-- Create journeys table
CREATE TABLE IF NOT EXISTS journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  gradient TEXT NOT NULL,
  icon TEXT NOT NULL,
  estimated_time TEXT,
  vibe_tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE journeys ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Journeys are viewable by everyone" ON journeys
  FOR SELECT USING (true);

-- Insert sample journeys
INSERT INTO journeys (title, description, gradient, icon, estimated_time, vibe_tags) VALUES
('First Timer''s Perfect Day', 'Amit''s curated 6-hour journey through must-visit spots', 'from-amber-500 to-orange-600', 'map', '6 hours', ARRAY['curious', 'explorer', 'foodie']),
('Local''s Secret Circuit', 'Hidden gems only 2% of visitors know about', 'from-purple-600 to-pink-600', 'compass', '4 hours', ARRAY['adventurous', 'offbeat', 'insider']),
('Live Like a Resident', 'Experience Amit''s actual weekly routine', 'from-teal-500 to-cyan-600', 'home', '3 hours', ARRAY['authentic', 'slow', 'mindful']);`}
          </pre>
          <p className="text-xs text-yellow-700 mt-2">Go to your Supabase dashboard → SQL Editor → New Query → Paste and Run</p>
        </div>
      </div>
    )
  }
  
  return (
    <motion.div 
      className="grid md:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
    >
      {journeys.map((journey, index) => (
        <motion.div
          key={journey.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <JourneyCard journey={journey} onSelect={handleSelect} />
        </motion.div>
      ))}
    </motion.div>
  )
}