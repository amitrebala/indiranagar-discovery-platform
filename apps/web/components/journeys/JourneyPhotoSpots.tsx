'use client'

import React, { useState } from 'react'
import { Camera, MapPin, Clock, Sun, Info } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PhotoOpportunity, JourneyStop } from '@/lib/types/journey'
import { cn } from '@/lib/utils'

interface JourneyPhotoSpotsProps {
  stops: JourneyStop[]
  currentStopIndex?: number
  className?: string
}

export function JourneyPhotoSpots({ 
  stops, 
  currentStopIndex = 0,
  className 
}: JourneyPhotoSpotsProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoOpportunity | null>(null)
  const [selectedStopName, setSelectedStopName] = useState<string>('')

  // Collect all photo opportunities from all stops
  const allPhotoSpots = stops.flatMap((stop, stopIndex) => 
    (stop.photo_opportunities || []).map(photo => ({
      ...photo,
      stopIndex,
      stopName: stop.place?.display_name || `Stop ${stopIndex + 1}`,
      isCurrent: stopIndex === currentStopIndex,
      isPast: stopIndex < currentStopIndex
    }))
  )

  const upcomingPhotoSpots = allPhotoSpots.filter(spot => !spot.isPast)
  const currentStopPhotoSpots = allPhotoSpots.filter(spot => spot.isCurrent)

  const handlePhotoClick = (photo: PhotoOpportunity, stopName: string) => {
    setSelectedPhoto(photo)
    setSelectedStopName(stopName)
  }

  const getTimeIcon = (time?: string) => {
    if (!time) return null
    if (time.includes('golden') || time.includes('sunset') || time.includes('sunrise')) {
      return <Sun className="h-4 w-4 text-orange-500" />
    }
    return <Clock className="h-4 w-4 text-muted-foreground" />
  }

  if (allPhotoSpots.length === 0) {
    return null
  }

  return (
    <>
      <Card className={cn("", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Photo Opportunities
          </CardTitle>
          <CardDescription>
            {allPhotoSpots.length} Instagram-worthy spots on this journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Stop Photos */}
          {currentStopPhotoSpots.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3 text-primary">
                At Current Stop
              </h4>
              <div className="space-y-2">
                {currentStopPhotoSpots.map((spot, index) => (
                  <button
                    key={`current-${index}`}
                    onClick={() => handlePhotoClick(spot, spot.stopName)}
                    className="w-full p-3 rounded-lg border bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors text-left"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{spot.description}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {spot.stopName}
                          </span>
                          {spot.best_time && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              {getTimeIcon(spot.best_time)}
                              {spot.best_time}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge variant="default" className="ml-2">
                        Now
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Photos */}
          {upcomingPhotoSpots.length > 0 && !currentStopPhotoSpots.length && (
            <div>
              <h4 className="text-sm font-medium mb-3">
                Upcoming Photo Spots
              </h4>
              <div className="space-y-2">
                {upcomingPhotoSpots.slice(0, 5).map((spot, index) => (
                  <button
                    key={`upcoming-${index}`}
                    onClick={() => handlePhotoClick(spot, spot.stopName)}
                    className="w-full p-3 rounded-lg border hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{spot.description}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {spot.stopName}
                          </span>
                          {spot.best_time && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              {getTimeIcon(spot.best_time)}
                              {spot.best_time}
                            </span>
                          )}
                        </div>
                      </div>
                      {spot.tags && spot.tags.includes('must-see') && (
                        <Badge variant="outline" className="ml-2">
                          Must See
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Photo Tips */}
          <div className="pt-3 border-t">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Golden hour (sunrise/sunset) provides the best lighting</p>
                <p>Ask locals for permission before photographing them</p>
                <p>Use journey hashtag #IndiranagarDiscovery to share</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photo Detail Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Photo Opportunity
            </DialogTitle>
            <DialogDescription>
              {selectedStopName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="font-medium">{selectedPhoto?.description}</p>
            </div>
            
            {selectedPhoto?.tips && (
              <div>
                <h4 className="text-sm font-medium mb-2">Photography Tips:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {selectedPhoto.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedPhoto?.best_time && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                {getTimeIcon(selectedPhoto.best_time)}
                <div>
                  <p className="text-sm font-medium">Best Time</p>
                  <p className="text-xs text-muted-foreground">{selectedPhoto.best_time}</p>
                </div>
              </div>
            )}

            {selectedPhoto?.tags && selectedPhoto.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {selectedPhoto.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}