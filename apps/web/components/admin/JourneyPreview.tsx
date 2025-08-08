'use client'

import { MapPin, Clock, Camera, Activity } from 'lucide-react'

interface JourneyPreviewProps {
  journey: any
}

export function JourneyPreview({ journey }: JourneyPreviewProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-lg">{journey.name || 'Untitled Journey'}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {journey.description || 'No description provided'}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
          {journey.mood}
        </span>
        <span className="px-2 py-1 bg-secondary/10 text-secondary-foreground rounded-md text-sm">
          {journey.difficulty}
        </span>
        <span className="px-2 py-1 bg-accent/10 text-accent-foreground rounded-md text-sm">
          Best {journey.bestTime}
        </span>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-2">Journey Stops</h4>
        {journey.stops.length === 0 ? (
          <p className="text-sm text-muted-foreground">No stops added yet</p>
        ) : (
          <div className="space-y-2">
            {journey.stops.map((stop: any, index: number) => (
              <div key={stop.id} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{stop.placeName || 'Unnamed Stop'}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {stop.duration} min
                    </span>
                    {stop.photoOp && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Camera className="w-3 h-3" />
                        Photo Op
                      </span>
                    )}
                  </div>
                  {stop.notes && (
                    <p className="text-xs text-muted-foreground mt-1">{stop.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t pt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Total Duration</span>
          <p className="font-medium">
            {Math.floor(journey.duration / 60)}h {journey.duration % 60}m
          </p>
        </div>
        <div>
          <span className="text-muted-foreground">Distance</span>
          <p className="font-medium">{journey.distance} km</p>
        </div>
      </div>
    </div>
  )
}