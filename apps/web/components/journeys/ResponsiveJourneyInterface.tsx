'use client'

import { useResponsive } from '@/hooks/useResponsive'
import InstagramStoryInterface from './InstagramStoryInterface'
import MobileJourneyInterface from '../mobile/MobileJourneyInterface'
import { JourneyExperience } from '@/lib/types/journey'

interface ResponsiveJourneyInterfaceProps {
  journey: JourneyExperience
  onStopComplete?: (stopId: string) => void
  onJourneyComplete?: () => void
}

export default function ResponsiveJourneyInterface({
  journey,
  onStopComplete,
  onJourneyComplete
}: ResponsiveJourneyInterfaceProps) {
  const { isMobile, touchDevice } = useResponsive()

  // Use mobile interface for touch devices or small screens
  if (isMobile || touchDevice) {
    return (
      <MobileJourneyInterface
        journey={journey}
        onStopComplete={onStopComplete}
        onJourneyComplete={onJourneyComplete}
      />
    )
  }

  // Use desktop interface for larger screens
  return (
    <InstagramStoryInterface
      journey={journey}
      onStopComplete={onStopComplete}
      onJourneyComplete={onJourneyComplete}
    />
  )
}