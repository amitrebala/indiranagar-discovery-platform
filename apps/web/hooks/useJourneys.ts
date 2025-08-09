'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/supabase/types'
import { JourneyExperience, JourneyMood, JourneyDifficulty } from '@/lib/types/journey'

interface UseJourneysOptions {
  mood?: JourneyMood
  difficulty?: JourneyDifficulty
  weatherSuitable?: boolean
  limit?: number
}

interface UseJourneysReturn {
  journeys: JourneyExperience[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
  filters: {
    mood?: JourneyMood
    difficulty?: JourneyDifficulty
    weatherSuitable?: boolean
  }
  setFilters: (filters: UseJourneysOptions) => void
}

export function useJourneys(options: UseJourneysOptions = {}): UseJourneysReturn {
  const [journeys, setJourneys] = useState<JourneyExperience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [filters, setFilters] = useState(options)
  
  const supabase = createClientComponentClient<Database>()

  const fetchJourneys = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('journeys')
        .select(`
          *,
          journey_places (
            *,
            place:places (
              id,
              name,
              description,
              coordinates,
              category,
              subcategory,
              price_level,
              opening_hours
            )
          )
        `)
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.mood) {
        query = query.eq('mood_category', filters.mood)
      }
      
      if (filters.difficulty) {
        query = query.eq('difficulty_level', filters.difficulty)
      }

      if (filters.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      // Transform data to match JourneyExperience interface
      const transformedJourneys = (data || []).map(journey => ({
        id: journey.id,
        name: journey.title,
        slug: journey.title?.toLowerCase().replace(/\s+/g, '-'),
        description: journey.description,
        mood_category: journey.vibe_tags?.[0] || 'social',
        duration_minutes: parseInt(journey.estimated_time?.replace(/[^0-9]/g, '') || '180'),
        difficulty_level: 'easy',
        weather_suitability: ['clear', 'cloudy'],
        journey_stops: (journey.journey_places || [])
          .sort((a: any, b: any) => a.order_index - b.order_index)
          .map((stop: any) => ({
            id: stop.id,
            place_id: stop.place_id,
            place: stop.place,
            order: stop.order_index,
            duration_minutes: 45,
            activities: []
          })),
        tags: journey.vibe_tags || [],
        gradient: journey.gradient,
        icon: journey.icon,
        created_at: journey.created_at,
        updated_at: journey.updated_at
      }))

      // Apply weather filtering if needed
      if (filters.weatherSuitable) {
        const weatherResponse = await fetch('/api/weather')
        if (weatherResponse.ok) {
          const weatherData = await weatherResponse.json()
          const currentCondition = weatherData.condition
          
          const suitableJourneys = transformedJourneys.filter(journey => 
            journey.weather_suitability?.includes(currentCondition) ?? true
          )
          
          setJourneys(suitableJourneys)
        } else {
          setJourneys(transformedJourneys)
        }
      } else {
        setJourneys(transformedJourneys)
      }
    } catch (err) {
      console.error('Error fetching journeys:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch journeys'))
    } finally {
      setLoading(false)
    }
  }, [supabase, filters])

  useEffect(() => {
    fetchJourneys()
  }, [fetchJourneys])

  return {
    journeys,
    loading,
    error,
    refetch: fetchJourneys,
    filters,
    setFilters: (newFilters) => setFilters({ ...filters, ...newFilters })
  }
}

// Hook for single journey - not used anymore but kept for compatibility
export function useJourney(slug: string) {
  const [journey, setJourney] = useState<JourneyExperience | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error: fetchError } = await supabase
          .from('journeys')
          .select(`
            *,
            journey_places (
              *,
              place:places (
                id,
                name,
                description,
                coordinates,
                category,
                subcategory,
                price_level,
                opening_hours
              )
            )
          `)
          .eq('id', slug)
          .single()

        if (fetchError) throw fetchError

        // Transform to match expected format
        const transformedJourney = data ? {
          id: data.id,
          name: data.title,
          slug: data.title?.toLowerCase().replace(/\s+/g, '-'),
          description: data.description,
          mood_category: data.vibe_tags?.[0] || 'social',
          duration_minutes: parseInt(data.estimated_time?.replace(/[^0-9]/g, '') || '180'),
          difficulty_level: 'easy',
          weather_suitability: ['clear', 'cloudy'],
          journey_stops: (data.journey_places || [])
            .sort((a: any, b: any) => a.order_index - b.order_index)
            .map((stop: any) => ({
              id: stop.id,
              place_id: stop.place_id,
              place: stop.place,
              order: stop.order_index,
              duration_minutes: 45,
              activities: []
            })),
          tags: data.vibe_tags || [],
          gradient: data.gradient,
          icon: data.icon,
          created_at: data.created_at,
          updated_at: data.updated_at
        } : null

        setJourney(transformedJourney)
      } catch (err) {
        console.error('Error fetching journey:', err)
        setError(err instanceof Error ? err : new Error('Failed to fetch journey'))
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchJourney()
    }
  }, [slug, supabase])

  return { journey, loading, error }
}