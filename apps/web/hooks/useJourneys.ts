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
        .from('journey_experiences')
        .select(`
          *,
          journey_stops (
            *,
            place:places (
              id,
              name,
              display_name,
              description,
              coordinates,
              category,
              subcategory,
              price_level,
              opening_hours,
              images:place_images (
                url,
                caption,
                is_primary
              )
            ),
            activities:companion_activities (*)
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
        ...journey,
        journey_stops: journey.journey_stops?.sort((a: any, b: any) => a.order - b.order) || []
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

// Hook for single journey
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
          .from('journey_experiences')
          .select(`
            *,
            journey_stops (
              *,
              place:places (
                id,
                name,
                display_name,
                description,
                coordinates,
                category,
                subcategory,
                price_level,
                opening_hours,
                images:place_images (
                  url,
                  caption,
                  is_primary
                )
              ),
              activities:companion_activities (*),
              walking_directions (*),
              photo_opportunities (*)
            )
          `)
          .eq('slug', slug)
          .single()

        if (fetchError) throw fetchError

        // Sort stops by order
        if (data?.journey_stops) {
          data.journey_stops.sort((a: any, b: any) => a.order - b.order)
        }

        setJourney(data)
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