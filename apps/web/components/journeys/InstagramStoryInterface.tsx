'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, MapPin, Clock, Camera, Navigation } from 'lucide-react'
import { JourneyExperience, JourneyStop } from '@/lib/types/journey'

interface InstagramStoryInterfaceProps {
  journey: JourneyExperience
  onStopComplete?: (stopId: string) => void
  onJourneyComplete?: () => void
}

interface JourneyStoryCardProps {
  stop: JourneyStop
  isActive: boolean
  journey: JourneyExperience
  onComplete?: () => void
}

function JourneyStoryCard({ stop, isActive, journey, onComplete }: JourneyStoryCardProps) {
  const [currentActivity, setCurrentActivity] = useState(0)

  return (
    <div 
      className={`flex-shrink-0 w-full h-full transition-all duration-300 ${
        isActive ? 'opacity-100 scale-100' : 'opacity-70 scale-95'
      }`}
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full max-h-[600px] flex flex-col">
        {/* Story Header */}
        <div className="relative h-48 flex-shrink-0">
          <Image
            src={stop.photo_opportunities[0]?.image || '/images/placeholder-place.jpg'}
            alt={`Stop ${stop.order}: Place`}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Stop Number Badge */}
          <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-full w-8 h-8 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">{stop.order + 1}</span>
          </div>
          
          {/* Duration Badge */}
          <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
            <Clock className="w-4 h-4 inline mr-1" />
            {stop.duration_minutes}min
          </div>
          
          {/* Place Title */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white font-bold text-lg mb-1">
              Stop {stop.order + 1}
            </h3>
            <p className="text-white/90 text-sm">
              {stop.timing_notes}
            </p>
          </div>
        </div>

        {/* Story Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {/* Story Context */}
          {stop.story_context && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-sm leading-relaxed italic">
                "{stop.story_context}"
              </p>
            </div>
          )}

          {/* Activities */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              Activities Here
            </h4>
            
            {stop.activities.length > 1 && (
              <div className="flex mb-3 bg-gray-100 rounded-lg p-1">
                {stop.activities.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentActivity(index)}
                    className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      currentActivity === index
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {stop.activities[index].name}
                  </button>
                ))}
              </div>
            )}
            
            {stop.activities[currentActivity] && (
              <div className="bg-gray-50 rounded-lg p-3">
                <h5 className="font-medium text-gray-900 mb-2">
                  {stop.activities[currentActivity].name}
                </h5>
                <p className="text-gray-700 text-sm mb-2">
                  {stop.activities[currentActivity].description}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {stop.activities[currentActivity].duration_minutes}min
                  </span>
                  <span className="capitalize">
                    {stop.activities[currentActivity].timing}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Photo Opportunities */}
          {stop.photo_opportunities.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Camera className="w-4 h-4 text-purple-600" />
                Photo Spots
              </h4>
              <div className="space-y-2">
                {stop.photo_opportunities.slice(0, 2).map((photo, index) => (
                  <div key={photo.id} className="text-sm">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">{photo.name}</p>
                        <p className="text-gray-600 text-xs">{photo.best_time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Walking Directions to Next Stop */}
          {stop.walking_directions && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                Next: {stop.walking_directions.estimated_minutes}min walk
              </h4>
              <p className="text-green-800 text-sm">
                {stop.walking_directions.route_description}
              </p>
              {stop.walking_directions.landmarks.length > 0 && (
                <div className="mt-2">
                  <p className="text-green-700 text-xs font-medium">Look for:</p>
                  <p className="text-green-700 text-xs">
                    {stop.walking_directions.landmarks.join(', ')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Complete Stop Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onComplete}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Complete This Stop
          </button>
        </div>
      </div>
    </div>
  )
}

export default function InstagramStoryInterface({ 
  journey, 
  onStopComplete,
  onJourneyComplete 
}: InstagramStoryInterfaceProps) {
  const [currentStop, setCurrentStop] = useState(0)
  const [completedStops, setCompletedStops] = useState<Set<string>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollToStop = (stopIndex: number) => {
    const container = containerRef.current
    if (container) {
      const scrollWidth = container.scrollWidth / journey.journey_stops.length
      container.scrollTo({ 
        left: scrollWidth * stopIndex, 
        behavior: 'smooth' 
      })
    }
    setCurrentStop(stopIndex)
  }

  const handleStopComplete = (stopId: string) => {
    setCompletedStops(prev => new Set([...prev, stopId]))
    onStopComplete?.(stopId)
    
    // Auto-advance to next stop
    if (currentStop < journey.journey_stops.length - 1) {
      setTimeout(() => {
        scrollToStop(currentStop + 1)
      }, 1000)
    } else {
      // Journey complete
      setTimeout(() => {
        onJourneyComplete?.()
      }, 1000)
    }
  }

  const nextStop = useCallback(() => {
    if (currentStop < journey.journey_stops.length - 1) {
      scrollToStop(currentStop + 1)
    }
  }, [currentStop, journey.journey_stops.length, scrollToStop])

  const prevStop = useCallback(() => {
    if (currentStop > 0) {
      scrollToStop(currentStop - 1)
    }
  }, [currentStop, scrollToStop])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevStop()
      } else if (e.key === 'ArrowRight') {
        nextStop()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentStop, nextStop, prevStop])

  return (
    <div className="journey-interface max-w-md mx-auto">
      {/* Journey Header */}
      <div className="mb-4 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{journey.name}</h2>
        <p className="text-gray-600 text-sm">{journey.description}</p>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center mb-6">
        {journey.journey_stops.map((stop, index) => (
          <div
            key={stop.id}
            className={`w-8 h-1 mx-1 rounded-full transition-all duration-300 cursor-pointer ${
              completedStops.has(stop.id)
                ? 'bg-green-400'
                : index === currentStop
                ? 'bg-blue-400'
                : index < currentStop
                ? 'bg-blue-200'
                : 'bg-gray-300'
            }`}
            onClick={() => scrollToStop(index)}
          />
        ))}
      </div>

      {/* Story Container */}
      <div className="relative h-[600px] overflow-hidden rounded-2xl">
        <div
          ref={containerRef}
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ 
            transform: `translateX(-${currentStop * 100}%)`,
            width: `${journey.journey_stops.length * 100}%`
          }}
        >
          {journey.journey_stops.map((stop, index) => (
            <JourneyStoryCard
              key={stop.id}
              stop={stop}
              isActive={index === currentStop}
              journey={journey}
              onComplete={() => handleStopComplete(stop.id)}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevStop}
          disabled={currentStop === 0}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full shadow-lg transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        <button
          onClick={nextStop}
          disabled={currentStop === journey.journey_stops.length - 1}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full shadow-lg transition-all"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Journey Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
        <div>
          <div className="font-semibold text-gray-900">{journey.duration_minutes}min</div>
          <div className="text-gray-500">Total time</div>
        </div>
        <div>
          <div className="font-semibold text-gray-900">{journey.journey_stops.length}</div>
          <div className="text-gray-500">Stops</div>
        </div>
        <div>
          <div className="font-semibold text-gray-900 capitalize">{journey.difficulty_level}</div>
          <div className="text-gray-500">Difficulty</div>
        </div>
      </div>
    </div>
  )
}