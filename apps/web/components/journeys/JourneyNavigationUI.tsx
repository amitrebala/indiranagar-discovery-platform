'use client'

import React from 'react'
import { ChevronLeft, ChevronRight, Navigation, Clock, MapPin, Camera, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useJourneyNavigation } from '@/hooks/useJourneyNavigation'
import { useJourneyProgress } from '@/hooks/useJourneyProgress'
import { JourneyStop } from '@/lib/types/journey'

interface JourneyNavigationUIProps {
  journeyId: string
  journeyName: string
  stops: JourneyStop[]
  onComplete?: () => void
}

export function JourneyNavigationUI({ 
  journeyId, 
  journeyName, 
  stops,
  onComplete 
}: JourneyNavigationUIProps) {
  const {
    progress,
    startJourney,
    completeStop,
    skipStop,
    resetProgress,
    progressPercentage
  } = useJourneyProgress(journeyId)

  const {
    navigationState,
    goToNextStop,
    goToPreviousStop,
    goToStop,
    startNavigation,
    getEstimatedTime
  } = useJourneyNavigation({
    stops,
    currentStopIndex: progress?.currentStopIndex || 0,
    onStopComplete: (index) => completeStop(index)
  })

  const handleStart = async () => {
    await startJourney(journeyId, stops.length)
    startNavigation()
  }

  const handleCompleteStop = async () => {
    await completeStop(navigationState.currentStopIndex)
    if (navigationState.isLastStop) {
      onComplete?.()
    } else {
      goToNextStop()
    }
  }

  const handleSkipStop = async () => {
    await skipStop(navigationState.currentStopIndex)
    goToNextStop()
  }

  if (!progress) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{journeyName}</CardTitle>
          <CardDescription>
            {stops.length} stops • Estimated time: {getEstimatedTime(0, stops.length)} minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleStart} className="w-full" size="lg">
            <Navigation className="mr-2 h-5 w-5" />
            Start Journey
          </Button>
        </CardContent>
      </Card>
    )
  }

  const { currentStop, nextStop, previousStop } = navigationState

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{progress.completedStops.length} of {stops.length} stops completed</span>
              <span>{navigationState.totalRemainingTime} min remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Stop */}
      {currentStop && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Stop {navigationState.currentStopIndex + 1}: {currentStop.place?.display_name}
                </CardTitle>
                <CardDescription>{currentStop.place?.description}</CardDescription>
              </div>
              <Badge variant={progress.completedStops.includes(navigationState.currentStopIndex) ? 'success' : 'default'}>
                {progress.completedStops.includes(navigationState.currentStopIndex) ? 'Completed' : 'Current'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Activities at this stop */}
            {currentStop.activities && currentStop.activities.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Activities here:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {currentStop.activities.map((activity, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {activity.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Photo opportunities */}
            {currentStop.photo_opportunities && currentStop.photo_opportunities.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Photo Opportunities:
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {currentStop.photo_opportunities.map((photo, idx) => (
                    <li key={idx}>{photo.description}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Duration */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Suggested time: {currentStop.duration_minutes} minutes</span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button 
                onClick={handleCompleteStop}
                className="flex-1"
                variant="default"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete Stop
              </Button>
              {!navigationState.isLastStop && (
                <Button 
                  onClick={handleSkipStop}
                  variant="outline"
                >
                  Skip
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Stop Preview */}
      {nextStop && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base">
              Next: {nextStop.place?.display_name}
            </CardTitle>
            <CardDescription>
              {navigationState.estimatedTimeToNext} min walk • {nextStop.duration_minutes} min visit
            </CardDescription>
          </CardHeader>
          {navigationState.directions && (
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>Distance: {(navigationState.directions.distance_meters / 1000).toFixed(1)} km</p>
                {navigationState.directions.landmarks && navigationState.directions.landmarks.length > 0 && (
                  <p>Via: {navigationState.directions.landmarks.join(', ')}</p>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Navigation Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousStop}
              disabled={navigationState.isFirstStop}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex gap-1">
              {stops.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToStop(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === navigationState.currentStopIndex
                      ? 'bg-primary'
                      : progress?.completedStops.includes(index)
                      ? 'bg-green-500'
                      : 'bg-muted-foreground/30'
                  }`}
                  aria-label={`Go to stop ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNextStop}
              disabled={navigationState.isLastStop}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reset Journey */}
      <div className="text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={resetProgress}
          className="text-muted-foreground"
        >
          Reset Journey
        </Button>
      </div>
    </div>
  )
}