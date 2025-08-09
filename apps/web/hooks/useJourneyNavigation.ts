'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { JourneyStop, WalkingDirection } from '@/lib/types/journey'

interface NavigationState {
  currentStop: JourneyStop | null
  nextStop: JourneyStop | null
  previousStop: JourneyStop | null
  currentStopIndex: number
  directions: WalkingDirection | null
  estimatedTimeToNext: number
  totalRemainingTime: number
  isFirstStop: boolean
  isLastStop: boolean
}

interface UseJourneyNavigationProps {
  stops: JourneyStop[]
  currentStopIndex: number
  onStopComplete?: (stopIndex: number) => void
  onNavigationStart?: (stopIndex: number) => void
}

interface UseJourneyNavigationReturn {
  navigationState: NavigationState
  goToNextStop: () => void
  goToPreviousStop: () => void
  goToStop: (index: number) => void
  startNavigation: () => void
  getDirectionsToNext: () => WalkingDirection | null
  getEstimatedTime: (fromIndex: number, toIndex: number) => number
  loading: boolean
  error: Error | null
}

export function useJourneyNavigation({
  stops,
  currentStopIndex: initialIndex = 0,
  onStopComplete,
  onNavigationStart
}: UseJourneyNavigationProps): UseJourneyNavigationReturn {
  const [currentStopIndex, setCurrentStopIndex] = useState(initialIndex)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [directions, setDirections] = useState<WalkingDirection | null>(null)

  // Calculate navigation state
  const navigationState = useMemo((): NavigationState => {
    const currentStop = stops[currentStopIndex] || null
    const nextStop = stops[currentStopIndex + 1] || null
    const previousStop = stops[currentStopIndex - 1] || null

    // Calculate estimated times
    let estimatedTimeToNext = 0
    let totalRemainingTime = 0

    if (currentStop && nextStop) {
      estimatedTimeToNext = nextStop.walking_directions?.estimated_minutes || 5
    }

    // Calculate total remaining time
    for (let i = currentStopIndex; i < stops.length; i++) {
      const stop = stops[i]
      totalRemainingTime += stop.duration_minutes || 0
      
      if (i < stops.length - 1) {
        const nextStopData = stops[i + 1]
        totalRemainingTime += nextStopData.walking_directions?.estimated_minutes || 5
      }
    }

    return {
      currentStop,
      nextStop,
      previousStop,
      currentStopIndex,
      directions,
      estimatedTimeToNext,
      totalRemainingTime,
      isFirstStop: currentStopIndex === 0,
      isLastStop: currentStopIndex === stops.length - 1
    }
  }, [currentStopIndex, stops, directions])

  // Fetch walking directions for current to next stop
  const fetchDirections = useCallback(async (fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || toIndex >= stops.length) return

    const fromStop = stops[fromIndex]
    const toStop = stops[toIndex]

    if (!fromStop?.place || !toStop?.place) return

    try {
      setLoading(true)
      setError(null)

      // Check if directions are already available in the stop data
      if (toStop.walking_directions) {
        setDirections(toStop.walking_directions)
        return
      }

      // Otherwise, fetch from API
      const params = new URLSearchParams({
        from_lat: fromStop.place.coordinates[0].toString(),
        from_lng: fromStop.place.coordinates[1].toString(),
        to_lat: toStop.place.coordinates[0].toString(),
        to_lng: toStop.place.coordinates[1].toString()
      })

      const response = await fetch(`/api/journeys/directions?${params}`)
      if (!response.ok) throw new Error('Failed to fetch directions')

      const directionsData = await response.json()
      setDirections(directionsData)
    } catch (err) {
      console.error('Error fetching directions:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch directions'))
    } finally {
      setLoading(false)
    }
  }, [stops])

  // Navigation actions
  const goToNextStop = useCallback(() => {
    if (currentStopIndex < stops.length - 1) {
      if (onStopComplete) {
        onStopComplete(currentStopIndex)
      }
      setCurrentStopIndex(currentStopIndex + 1)
    }
  }, [currentStopIndex, stops.length, onStopComplete])

  const goToPreviousStop = useCallback(() => {
    if (currentStopIndex > 0) {
      setCurrentStopIndex(currentStopIndex - 1)
    }
  }, [currentStopIndex])

  const goToStop = useCallback((index: number) => {
    if (index >= 0 && index < stops.length) {
      setCurrentStopIndex(index)
    }
  }, [stops.length])

  const startNavigation = useCallback(() => {
    if (onNavigationStart) {
      onNavigationStart(currentStopIndex)
    }
    
    // Fetch directions to next stop
    if (currentStopIndex < stops.length - 1) {
      fetchDirections(currentStopIndex, currentStopIndex + 1)
    }
  }, [currentStopIndex, stops.length, onNavigationStart, fetchDirections])

  const getDirectionsToNext = useCallback((): WalkingDirection | null => {
    if (currentStopIndex < stops.length - 1) {
      return stops[currentStopIndex + 1]?.walking_directions || null
    }
    return null
  }, [currentStopIndex, stops])

  const getEstimatedTime = useCallback((fromIndex: number, toIndex: number): number => {
    if (fromIndex < 0 || toIndex >= stops.length || fromIndex >= toIndex) return 0

    let totalTime = 0
    for (let i = fromIndex; i < toIndex; i++) {
      const stop = stops[i]
      totalTime += stop.duration_minutes || 0
      
      if (i < toIndex - 1) {
        const nextStop = stops[i + 1]
        totalTime += nextStop.walking_directions?.estimated_minutes || 5
      }
    }
    return totalTime
  }, [stops])

  // Update directions when stop changes
  useEffect(() => {
    if (currentStopIndex < stops.length - 1) {
      fetchDirections(currentStopIndex, currentStopIndex + 1)
    }
  }, [currentStopIndex, stops.length, fetchDirections])

  // Update external index when it changes
  useEffect(() => {
    setCurrentStopIndex(initialIndex)
  }, [initialIndex])

  return {
    navigationState,
    goToNextStop,
    goToPreviousStop,
    goToStop,
    startNavigation,
    getDirectionsToNext,
    getEstimatedTime,
    loading,
    error
  }
}