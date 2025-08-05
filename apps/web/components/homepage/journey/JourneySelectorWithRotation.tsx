'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Journey } from '@/lib/supabase/types'
import { JourneyCard } from './JourneyCard'
import { Skeleton } from '@/components/ui/Skeleton'

interface JourneySelectorProps {
  onSelect?: (journey: Journey) => void
  itemsPerPage?: number
  autoRotateInterval?: number // in milliseconds
}

export function JourneySelectorWithRotation({ 
  onSelect, 
  itemsPerPage = 3,
  autoRotateInterval = 15000 // 15 seconds
}: JourneySelectorProps) {
  const [journeys, setJourneys] = useState<Journey[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Calculate total pages
  const totalPages = Math.ceil(journeys.length / itemsPerPage)
  
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
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchJourneys()
  }, [])
  
  // Auto-rotation logic
  useEffect(() => {
    if (!isPaused && journeys.length > itemsPerPage) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalPages)
      }, autoRotateInterval)
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPaused, journeys.length, itemsPerPage, totalPages, autoRotateInterval])
  
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalPages)
    // Reset auto-rotation timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }, [totalPages])
  
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)
    // Reset auto-rotation timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }, [totalPages])
  
  const togglePause = () => {
    setIsPaused(!isPaused)
  }
  
  const handleSelect = (journey: Journey) => {
    if (onSelect) {
      onSelect(journey)
    }
  }
  
  // Get current page of journeys
  const getCurrentJourneys = () => {
    const start = currentIndex * itemsPerPage
    const end = start + itemsPerPage
    return journeys.slice(start, end)
  }
  
  if (isLoading) {
    return (
      <div className="relative">
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }
  
  if (error || journeys.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">{error || 'No journeys available'}</p>
      </div>
    )
  }
  
  return (
    <div className="relative">
      {/* Navigation controls */}
      {journeys.length > itemsPerPage && (
        <div className="absolute -top-16 right-0 flex items-center gap-2 z-20">
          <button
            onClick={togglePause}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-md hover:bg-white transition-colors"
            aria-label={isPaused ? 'Resume rotation' : 'Pause rotation'}
          >
            {isPaused ? <Play size={20} /> : <Pause size={20} />}
          </button>
          <button
            onClick={handlePrev}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-md hover:bg-white transition-colors"
            aria-label="Previous journeys"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-md hover:bg-white transition-colors"
            aria-label="Next journeys"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
      
      {/* Journey cards with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {getCurrentJourneys().map((journey, index) => (
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
      </AnimatePresence>
      
      {/* Page indicators */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-primary-500 w-8' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}