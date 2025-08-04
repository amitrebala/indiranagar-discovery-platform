'use client'

import { useEffect, useState } from 'react'
import { Polyline, Popup } from 'react-leaflet'
import { LatLng } from 'leaflet'
import type { Place } from '@/lib/validations'
import { useMapStore } from '@/stores/mapStore'

export interface JourneyRoute {
  id: string
  name: string
  description: string
  places: PlaceConnection[]
  estimated_duration: number
  difficulty_level: 'easy' | 'moderate' | 'challenging'
  weather_dependency: boolean
  color?: string
}

export interface PlaceConnection {
  place_id: string
  place: Place
  order: number
  walking_time_minutes: number
  path_coordinates: LatLng[]
  notes?: string
}

interface JourneyRouteVisualizationProps {
  journey: JourneyRoute
  isHighlighted?: boolean
  onRouteClick?: (journey: JourneyRoute) => void
  onRouteHover?: (journey: JourneyRoute | null) => void
}

export function JourneyRouteVisualization({ 
  journey, 
  isHighlighted = false,
  onRouteClick,
  onRouteHover 
}: JourneyRouteVisualizationProps) {
  const [routeSegments, setRouteSegments] = useState<LatLng[][]>([])

  useEffect(() => {
    // Build route segments from place connections
    const segments: LatLng[][] = []
    
    journey.places
      .sort((a, b) => a.order - b.order)
      .forEach((connection, index) => {
        if (connection.path_coordinates.length > 0) {
          segments.push(connection.path_coordinates)
        } else if (index < journey.places.length - 1) {
          // Create direct line if no path coordinates provided
          const currentPlace = connection.place
          const nextConnection = journey.places.find(p => p.order === connection.order + 1)
          if (nextConnection) {
            const nextPlace = nextConnection.place
            segments.push([
              new LatLng(currentPlace.latitude, currentPlace.longitude),
              new LatLng(nextPlace.latitude, nextPlace.longitude)
            ])
          }
        }
      })
    
    setRouteSegments(segments)
  }, [journey])

  const getRouteStyle = () => {
    const baseStyle = {
      color: journey.color || '#2D5016',
      weight: isHighlighted ? 4 : 3,
      opacity: isHighlighted ? 0.9 : 0.7,
      dashArray: isHighlighted ? '15, 5' : '10, 10',
      lineCap: 'round' as const,
      lineJoin: 'round' as const,
    }

    if (isHighlighted) {
      return {
        ...baseStyle,
        color: '#F4D03F',
        weight: 4,
        opacity: 0.9,
        dashArray: '15, 5'
      }
    }

    return baseStyle
  }

  const getDifficultyColor = () => {
    switch (journey.difficulty_level) {
      case 'easy': return 'text-green-600'
      case 'moderate': return 'text-yellow-600'  
      case 'challenging': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const handleRouteClick = () => {
    onRouteClick?.(journey)
  }

  const handleRouteMouseOver = () => {
    onRouteHover?.(journey)
  }

  const handleRouteMouseOut = () => {
    onRouteHover?.(null)
  }

  if (routeSegments.length === 0) return null

  return (
    <>
      {routeSegments.map((segment, index) => (
        <Polyline
          key={`${journey.id}-segment-${index}`}
          positions={segment}
          pathOptions={getRouteStyle()}
          eventHandlers={{
            click: handleRouteClick,
            mouseover: handleRouteMouseOver,
            mouseout: handleRouteMouseOut,
          }}
        >
          {/* Show popup only on the first segment to avoid duplicates */}
          {index === 0 && (
            <Popup>
              <div className="min-w-[250px] p-3">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-primary text-sm pr-2">
                    {journey.name}
                  </h3>
                  <div className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor()} bg-gray-100`}>
                    {journey.difficulty_level}
                  </div>
                </div>
                
                <p className="text-neutral-600 text-xs leading-relaxed mb-3">
                  {journey.description}
                </p>
                
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <span className="text-neutral-500">Duration:</span>
                    <br />
                    <span className="font-medium">{journey.estimated_duration} min</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Places:</span>
                    <br />
                    <span className="font-medium">{journey.places.length} stops</span>
                  </div>
                </div>
                
                {journey.weather_dependency && (
                  <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded mb-2">
                    ⛅ Weather dependent
                  </div>
                )}
                
                <div className="border-t pt-2 mt-2">
                  <h4 className="text-xs font-medium text-neutral-700 mb-1">Route stops:</h4>
                  <div className="space-y-1">
                    {journey.places
                      .sort((a, b) => a.order - b.order)
                      .map((connection, idx) => (
                        <div key={connection.place_id} className="flex items-center text-xs">
                          <span className="w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center text-[10px] mr-2">
                            {idx + 1}
                          </span>
                          <span className="text-neutral-600">{connection.place.name}</span>
                          {connection.walking_time_minutes > 0 && idx < journey.places.length - 1 && (
                            <span className="text-neutral-400 ml-2">
                              ({connection.walking_time_minutes}min walk)
                            </span>
                          )}
                        </div>
                      ))
                    }
                  </div>
                </div>
                
                <button 
                  className="w-full mt-3 text-primary hover:text-primary/80 font-medium text-xs border border-primary/20 rounded px-2 py-1 hover:bg-primary/5 transition-colors"
                  onClick={() => {
                    // Future: Navigate to journey detail or start journey
                    console.log('Start journey:', journey.id)
                  }}
                >
                  Start Journey →
                </button>
              </div>
            </Popup>
          )}
        </Polyline>
      ))}
    </>
  )
}

// Journey collection component for managing multiple routes
interface JourneyCollectionProps {
  journeys: JourneyRoute[]
  highlightedJourneyId?: string | null
  onJourneySelect?: (journey: JourneyRoute) => void
}

export function JourneyCollection({ 
  journeys, 
  highlightedJourneyId,
  onJourneySelect 
}: JourneyCollectionProps) {
  const [hoveredJourney, setHoveredJourney] = useState<string | null>(null)

  const handleJourneyClick = (journey: JourneyRoute) => {
    onJourneySelect?.(journey)
  }

  const handleJourneyHover = (journey: JourneyRoute | null) => {
    setHoveredJourney(journey?.id || null)
  }

  return (
    <>
      {journeys.map((journey) => (
        <JourneyRouteVisualization
          key={journey.id}
          journey={journey}
          isHighlighted={
            highlightedJourneyId === journey.id || hoveredJourney === journey.id
          }
          onRouteClick={handleJourneyClick}
          onRouteHover={handleJourneyHover}
        />
      ))}
    </>
  )
}