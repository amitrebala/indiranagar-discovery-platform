'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronUp, Navigation, Clock, MapPin, Camera } from 'lucide-react'
import { JourneyExperience, JourneyStop } from '@/lib/types/journey'
import Image from 'next/image'

interface MobileJourneyInterfaceProps {
  journey: JourneyExperience
  onStopComplete?: (stopId: string) => void
  onJourneyComplete?: () => void
}

interface MobileStoryCardProps {
  stop: JourneyStop
  isActive: boolean
  isCompleted: boolean
  onComplete: () => void
}

function MobileStoryCard({ stop, isActive, isCompleted, onComplete }: MobileStoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentActivity, setCurrentActivity] = useState(0)

  return (
    <div className={`mobile-story-card transition-all duration-300 ${
      isActive ? 'ring-2 ring-blue-500' : ''
    } ${isCompleted ? 'opacity-60' : ''}`}>
      <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
        {/* Card Header */}
        <div 
          className="relative p-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                isCompleted 
                  ? 'bg-green-500 text-white' 
                  : isActive 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
              }`}>
                {isCompleted ? '✓' : stop.order + 1}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Stop {stop.order + 1}</h3>
                <p className="text-sm text-gray-600">{stop.timing_notes}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {stop.duration_minutes}min
              </span>
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </div>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="px-4 pb-4">
            {/* Story Context */}
            {stop.story_context && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800 text-sm leading-relaxed italic">
                  "{stop.story_context}"
                </p>
              </div>
            )}

            {/* Photo Opportunity */}
            {stop.photo_opportunities.length > 0 && (
              <div className="mb-4">
                <div className="relative h-32 rounded-lg overflow-hidden">
                  <Image
                    src={stop.photo_opportunities[0]?.image || '/images/placeholder-place.jpg'}
                    alt="Photo opportunity"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-sm font-medium">
                      📸 {stop.photo_opportunities[0]?.name}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Activities */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                What to Do Here
              </h4>
              
              {stop.activities.length > 1 && (
                <div className="flex mb-3 bg-gray-100 rounded-lg p-1">
                  {stop.activities.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentActivity(index)}
                      className={`flex-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                        currentActivity === index
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600'
                      }`}
                    >
                      {stop.activities[index].name.slice(0, 15)}...
                    </button>
                  ))}
                </div>
              )}
              
              {stop.activities[currentActivity] && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <h5 className="font-medium text-gray-900 mb-2 text-sm">
                    {stop.activities[currentActivity].name}
                  </h5>
                  <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                    {stop.activities[currentActivity].description}
                  </p>
                  
                  {/* Insider Tips */}
                  {stop.activities[currentActivity].insider_tips.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-900 mb-2">💡 Insider Tips:</p>
                      <div className="space-y-1">
                        {stop.activities[currentActivity].insider_tips.slice(0, 2).map((tip, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-xs text-gray-700">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Walking Directions */}
            {stop.walking_directions && stop.order < 2 && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start gap-2">
                  <Navigation className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium text-green-900 text-sm mb-1">
                      Next: {stop.walking_directions.estimated_minutes}min walk
                    </h4>
                    <p className="text-green-800 text-xs leading-relaxed">
                      {stop.walking_directions.route_description}
                    </p>
                    {stop.walking_directions.landmarks.length > 0 && (
                      <p className="text-green-700 text-xs mt-1">
                        <strong>Look for:</strong> {stop.walking_directions.landmarks.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Complete Button */}
            {!isCompleted && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onComplete()
                }}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
              >
                ✓ Complete This Stop
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function MobileJourneyInterface({ 
  journey, 
  onStopComplete,
  onJourneyComplete 
}: MobileJourneyInterfaceProps) {
  const [currentStop, setCurrentStop] = useState(0)
  const [completedStops, setCompletedStops] = useState<Set<string>>(new Set())
  const [autoScroll, setAutoScroll] = useState(true)
  const activeStopRef = useRef<HTMLDivElement>(null)

  const handleStopComplete = (stopId: string, stopIndex: number) => {
    setCompletedStops(prev => new Set([...prev, stopId]))
    onStopComplete?.(stopId)
    
    // Auto-advance to next stop
    if (stopIndex < journey.journey_stops.length - 1) {
      setTimeout(() => {
        setCurrentStop(stopIndex + 1)
      }, 1000)
    } else {
      // Journey complete
      setTimeout(() => {
        onJourneyComplete?.()
      }, 1000)
    }
  }

  // Auto-scroll to active stop
  useEffect(() => {
    if (autoScroll && activeStopRef.current) {
      activeStopRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }, [currentStop, autoScroll])

  const progressPercentage = (completedStops.size / journey.journey_stops.length) * 100

  return (
    <div className="mobile-journey-interface bg-gray-50 min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="mb-3">
          <h2 className="font-bold text-lg text-gray-900 line-clamp-1">{journey.name}</h2>
          <p className="text-sm text-gray-600">
            Step {currentStop + 1} of {journey.journey_stops.length}
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {/* Journey Stats */}
        <div className="flex justify-between mt-3 text-xs text-gray-600">
          <span>⏱️ {Math.floor(journey.duration_minutes / 60)}h {journey.duration_minutes % 60}m total</span>
          <span>📍 {completedStops.size}/{journey.journey_stops.length} completed</span>
        </div>
      </div>

      {/* Journey Steps */}
      <div className="p-4 pb-20">
        {journey.journey_stops.map((stop, index) => {
          const isActive = index === currentStop
          const isCompleted = completedStops.has(stop.id)
          
          return (
            <div
              key={stop.id}
              ref={isActive ? activeStopRef : null}
              className={isActive ? 'scroll-mt-20' : ''}
            >
              <MobileStoryCard
                stop={stop}
                isActive={isActive}
                isCompleted={isCompleted}
                onComplete={() => handleStopComplete(stop.id, index)}
              />
            </div>
          )
        })}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentStop(Math.max(0, currentStop - 1))}
            disabled={currentStop === 0}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            ← Previous
          </button>
          <button
            onClick={() => setCurrentStop(Math.min(journey.journey_stops.length - 1, currentStop + 1))}
            disabled={currentStop === journey.journey_stops.length - 1}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Next →
          </button>
        </div>
        
        <button
          onClick={() => setAutoScroll(!autoScroll)}
          className="w-full mt-2 text-xs text-gray-500 py-2"
        >
          Auto-scroll: {autoScroll ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Completion Celebration */}
      {completedStops.size === journey.journey_stops.length && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Journey Complete!</h3>
            <p className="text-gray-700 mb-4">
              You've successfully completed the {journey.name} experience. 
              Well done on exploring Indiranagar like a local!
            </p>
            <button
              onClick={() => window.history.back()}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium"
            >
              Back to Journeys
            </button>
          </div>
        </div>
      )}
    </div>
  )
}