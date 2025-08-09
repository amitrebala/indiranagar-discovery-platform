'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/supabase/types'

export interface JourneyProgress {
  journeyId: string
  currentStopIndex: number
  completedStops: number[]
  startedAt: string
  lastUpdatedAt: string
  totalStops: number
  isCompleted: boolean
  notes: Record<number, string>
}

interface UseJourneyProgressReturn {
  progress: JourneyProgress | null
  loading: boolean
  error: Error | null
  startJourney: (journeyId: string, totalStops: number) => Promise<void>
  completeStop: (stopIndex: number, notes?: string) => Promise<void>
  skipStop: (stopIndex: number) => Promise<void>
  resetProgress: () => Promise<void>
  saveProgress: () => Promise<void>
  loadProgress: (journeyId: string) => Promise<void>
  progressPercentage: number
}

const STORAGE_KEY_PREFIX = 'journey_progress_'

export function useJourneyProgress(journeyId?: string): UseJourneyProgressReturn {
  const [progress, setProgress] = useState<JourneyProgress | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  const supabase = createClientComponentClient<Database>()

  // Load progress from localStorage
  const loadProgressFromStorage = useCallback((id: string): JourneyProgress | null => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${id}`)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (err) {
      console.error('Error loading progress from storage:', err)
    }
    return null
  }, [])

  // Save progress to localStorage
  const saveProgressToStorage = useCallback((progressData: JourneyProgress) => {
    try {
      localStorage.setItem(
        `${STORAGE_KEY_PREFIX}${progressData.journeyId}`,
        JSON.stringify(progressData)
      )
    } catch (err) {
      console.error('Error saving progress to storage:', err)
    }
  }, [])

  // Load progress for a specific journey
  const loadProgress = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      // First try to load from localStorage
      const localProgress = loadProgressFromStorage(id)
      if (localProgress) {
        setProgress(localProgress)
      } else {
        // If not in localStorage, check database for saved journey
        const { data: userData } = await supabase.auth.getUser()
        if (userData?.user) {
          const { data, error: fetchError } = await supabase
            .from('saved_journeys')
            .select('*')
            .eq('user_id', userData.user.id)
            .eq('journey_id', id)
            .single()

          if (data && !fetchError) {
            const progressData: JourneyProgress = {
              journeyId: id,
              currentStopIndex: data.current_stop_index || 0,
              completedStops: data.completed_stops || [],
              startedAt: data.started_at || new Date().toISOString(),
              lastUpdatedAt: data.last_updated_at || new Date().toISOString(),
              totalStops: data.total_stops || 0,
              isCompleted: data.is_completed || false,
              notes: data.notes || {}
            }
            setProgress(progressData)
            saveProgressToStorage(progressData)
          }
        }
      }
    } catch (err) {
      console.error('Error loading journey progress:', err)
      setError(err instanceof Error ? err : new Error('Failed to load progress'))
    } finally {
      setLoading(false)
    }
  }, [supabase, loadProgressFromStorage, saveProgressToStorage])

  // Start a new journey
  const startJourney = useCallback(async (id: string, totalStops: number) => {
    const newProgress: JourneyProgress = {
      journeyId: id,
      currentStopIndex: 0,
      completedStops: [],
      startedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      totalStops,
      isCompleted: false,
      notes: {}
    }
    
    setProgress(newProgress)
    saveProgressToStorage(newProgress)
    
    // Also save to database if user is authenticated
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (userData?.user) {
        await supabase.from('saved_journeys').upsert({
          user_id: userData.user.id,
          journey_id: id,
          current_stop_index: 0,
          completed_stops: [],
          started_at: newProgress.startedAt,
          last_updated_at: newProgress.lastUpdatedAt,
          total_stops: totalStops,
          is_completed: false,
          notes: {}
        })
      }
    } catch (err) {
      console.error('Error saving journey to database:', err)
    }
  }, [supabase, saveProgressToStorage])

  // Complete a stop
  const completeStop = useCallback(async (stopIndex: number, notes?: string) => {
    if (!progress) return

    const updatedProgress: JourneyProgress = {
      ...progress,
      completedStops: [...progress.completedStops, stopIndex],
      currentStopIndex: Math.min(stopIndex + 1, progress.totalStops - 1),
      lastUpdatedAt: new Date().toISOString(),
      isCompleted: progress.completedStops.length + 1 >= progress.totalStops,
      notes: notes ? { ...progress.notes, [stopIndex]: notes } : progress.notes
    }

    setProgress(updatedProgress)
    saveProgressToStorage(updatedProgress)

    // Save to database
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (userData?.user) {
        await supabase.from('saved_journeys').upsert({
          user_id: userData.user.id,
          journey_id: progress.journeyId,
          current_stop_index: updatedProgress.currentStopIndex,
          completed_stops: updatedProgress.completedStops,
          last_updated_at: updatedProgress.lastUpdatedAt,
          is_completed: updatedProgress.isCompleted,
          notes: updatedProgress.notes
        })
      }
    } catch (err) {
      console.error('Error updating journey in database:', err)
    }
  }, [progress, supabase, saveProgressToStorage])

  // Skip a stop
  const skipStop = useCallback(async (stopIndex: number) => {
    if (!progress) return

    const updatedProgress: JourneyProgress = {
      ...progress,
      currentStopIndex: Math.min(stopIndex + 1, progress.totalStops - 1),
      lastUpdatedAt: new Date().toISOString()
    }

    setProgress(updatedProgress)
    saveProgressToStorage(updatedProgress)
  }, [progress, saveProgressToStorage])

  // Reset progress
  const resetProgress = useCallback(async () => {
    if (!progress) return

    try {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${progress.journeyId}`)
      
      const { data: userData } = await supabase.auth.getUser()
      if (userData?.user) {
        await supabase
          .from('saved_journeys')
          .delete()
          .eq('user_id', userData.user.id)
          .eq('journey_id', progress.journeyId)
      }
      
      setProgress(null)
    } catch (err) {
      console.error('Error resetting progress:', err)
      setError(err instanceof Error ? err : new Error('Failed to reset progress'))
    }
  }, [progress, supabase])

  // Save current progress
  const saveProgress = useCallback(async () => {
    if (!progress) return
    
    saveProgressToStorage(progress)
    
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (userData?.user) {
        await supabase.from('saved_journeys').upsert({
          user_id: userData.user.id,
          journey_id: progress.journeyId,
          current_stop_index: progress.currentStopIndex,
          completed_stops: progress.completedStops,
          started_at: progress.startedAt,
          last_updated_at: progress.lastUpdatedAt,
          total_stops: progress.totalStops,
          is_completed: progress.isCompleted,
          notes: progress.notes
        })
      }
    } catch (err) {
      console.error('Error saving progress:', err)
    }
  }, [progress, supabase, saveProgressToStorage])

  // Calculate progress percentage
  const progressPercentage = progress 
    ? Math.round((progress.completedStops.length / progress.totalStops) * 100)
    : 0

  // Load progress on mount if journeyId is provided
  useEffect(() => {
    if (journeyId) {
      loadProgress(journeyId)
    }
  }, [journeyId, loadProgress])

  return {
    progress,
    loading,
    error,
    startJourney,
    completeStop,
    skipStop,
    resetProgress,
    saveProgress,
    loadProgress,
    progressPercentage
  }
}