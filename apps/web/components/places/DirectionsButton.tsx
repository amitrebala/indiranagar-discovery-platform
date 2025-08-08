'use client'

import { Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DirectionsButtonProps {
  latitude: number
  longitude: number
  placeName: string
  address?: string
}

export function DirectionsButton({ latitude, longitude, placeName, address }: DirectionsButtonProps) {
  const openInMaps = (provider: 'google' | 'apple' | 'waze') => {
    // Track analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'get_directions', {
        place_name: placeName,
        provider: provider
      })
    }

    const encodedName = encodeURIComponent(placeName)
    const encodedAddress = encodeURIComponent(address || '')
    
    let url = ''
    
    switch (provider) {
      case 'google':
        url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&destination_place_id=${encodedName}`
        break
      case 'apple':
        // Apple Maps URL scheme works on iOS and falls back to Google Maps on other platforms
        const isAppleDevice = /iPhone|iPad|iPod|Mac/i.test(navigator.userAgent)
        if (isAppleDevice) {
          url = `maps://maps.apple.com/?daddr=${latitude},${longitude}&q=${encodedName}`
        } else {
          url = `https://maps.apple.com/?daddr=${latitude},${longitude}&q=${encodedName}`
        }
        break
      case 'waze':
        url = `https://waze.com/ul?ll=${latitude},${longitude}&q=${encodedName}&navigate=yes`
        break
    }
    
    window.open(url, '_blank')
  }

  // Check if on mobile for single-tap experience
  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  if (isMobile) {
    // On mobile, directly open default maps app
    return (
      <Button 
        onClick={() => openInMaps('google')}
        className="flex items-center gap-2"
        variant="outline"
      >
        <Navigation className="w-4 h-4" />
        <span>Directions</span>
      </Button>
    )
  }

  // On desktop, show dropdown with options
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Navigation className="w-4 h-4" />
          <span>Directions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => openInMaps('google')}>
          Open in Google Maps
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openInMaps('apple')}>
          Open in Apple Maps
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openInMaps('waze')}>
          Open in Waze
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}