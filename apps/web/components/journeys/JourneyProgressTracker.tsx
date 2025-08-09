'use client'

import React, { useEffect } from 'react'
import { CheckCircle2, Circle, MapPin, Clock, Trophy } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useJourneyProgress, JourneyProgress } from '@/hooks/useJourneyProgress'
import { JourneyStop } from '@/lib/types/journey'
import { cn } from '@/lib/utils'

interface JourneyProgressTrackerProps {
  journeyId: string
  journeyName: string
  stops: JourneyStop[]
  onStopClick?: (index: number) => void
  className?: string
}

export function JourneyProgressTracker({
  journeyId,
  journeyName,
  stops,
  onStopClick,
  className
}: JourneyProgressTrackerProps) {
  const {
    progress,
    progressPercentage,
    loadProgress,
    completeStop,
    resetProgress
  } = useJourneyProgress()

  useEffect(() => {
    loadProgress(journeyId)
  }, [journeyId, loadProgress])

  const getStopStatus = (index: number) => {
    if (!progress) return 'pending'
    if (progress.completedStops.includes(index)) return 'completed'
    if (progress.currentStopIndex === index) return 'current'
    return 'pending'
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const calculateTimeSpent = () => {
    if (!progress) return 0
    const startTime = new Date(progress.startedAt)
    const now = new Date()
    return Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60))
  }

  if (!progress) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle>{journeyName}</CardTitle>
          <CardDescription>Start your journey to track progress</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const timeSpent = calculateTimeSpent()
  const estimatedTotalTime = stops.reduce((acc, stop) => acc + (stop.duration_minutes || 0), 0)

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {journeyName}
              {progress.isCompleted && (
                <Trophy className="h-5 w-5 text-yellow-500" />
              )}
            </CardTitle>
            <CardDescription>
              {progress.completedStops.length} of {stops.length} stops completed
            </CardDescription>
          </div>
          {progress.isCompleted && (
            <Badge variant="success">Completed!</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span className="font-medium">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>

        {/* Time Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-xs">Time Spent</span>
            </div>
            <p className="text-lg font-semibold">{formatTime(timeSpent)}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-xs">Est. Total</span>
            </div>
            <p className="text-lg font-semibold">{formatTime(estimatedTotalTime)}</p>
          </div>
        </div>

        {/* Stop List */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Journey Stops</h4>
          <div className="space-y-2">
            {stops.map((stop, index) => {
              const status = getStopStatus(index)
              return (
                <button
                  key={index}
                  onClick={() => onStopClick?.(index)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left",
                    status === 'completed' && "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
                    status === 'current' && "bg-primary/10 border-primary",
                    status === 'pending' && "bg-background hover:bg-muted/50"
                  )}
                >
                  <div className="flex-shrink-0">
                    {status === 'completed' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : status === 'current' ? (
                      <MapPin className="h-5 w-5 text-primary animate-pulse" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium truncate",
                      status === 'pending' && "text-muted-foreground"
                    )}>
                      {stop.place?.display_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(stop.duration_minutes || 0)}
                    </p>
                  </div>
                  {status === 'current' && (
                    <Badge variant="default" className="ml-auto">
                      Current
                    </Badge>
                  )}
                  {progress.notes[index] && (
                    <Badge variant="outline" className="ml-2">
                      Note
                    </Badge>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        {progress.isCompleted ? (
          <div className="space-y-2">
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg text-center">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="font-medium">Journey Completed!</p>
              <p className="text-sm text-muted-foreground">
                You visited all {stops.length} stops in {formatTime(timeSpent)}
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => resetProgress()}
            >
              Start Journey Again
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              if (confirm('Are you sure you want to reset your progress?')) {
                resetProgress()
              }
            }}
          >
            Reset Progress
          </Button>
        )}
      </CardContent>
    </Card>
  )
}