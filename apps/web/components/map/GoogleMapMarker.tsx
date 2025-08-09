'use client'

import { useEffect, useRef, useState } from 'react'
import { useGoogleMap } from './GoogleMap'

interface GoogleMapMarkerProps {
  position: { lat: number; lng: number }
  title?: string
  onClick?: () => void
  icon?: string | google.maps.Icon | google.maps.Symbol
  zIndex?: number
}

export function GoogleMapMarker({
  position,
  title,
  onClick,
  icon,
  zIndex
}: GoogleMapMarkerProps) {
  const { map, isLoaded } = useGoogleMap()
  const markerRef = useRef<google.maps.Marker | null>(null)

  useEffect(() => {
    if (!map || !isLoaded) return

    // Create marker
    const marker = new google.maps.Marker({
      position,
      map,
      title,
      icon,
      zIndex
    })

    // Add click listener
    if (onClick) {
      marker.addListener('click', onClick)
    }

    markerRef.current = marker

    // Cleanup function
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null)
        markerRef.current = null
      }
    }
  }, [map, isLoaded, position, title, onClick, icon, zIndex])

  // Update marker properties when props change
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setPosition(position)
      if (title) markerRef.current.setTitle(title)
      if (icon) markerRef.current.setIcon(icon)
      if (zIndex !== undefined) markerRef.current.setZIndex(zIndex)
    }
  }, [position, title, icon, zIndex])

  return null // This component doesn't render anything
}

// Helper function to create custom marker icons
export function createMarkerIcon(
  color: string = '#EA4335',
  size: number = 40
): google.maps.Symbol {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 0.8,
    strokeColor: '#FFFFFF',
    strokeWeight: 2,
    scale: size / 2
  }
}

// Helper function to create category-based marker icons
export function getCategoryMarkerIcon(category?: string): google.maps.Symbol {
  const categoryColors: Record<string, string> = {
    restaurant: '#FF6B6B',
    cafe: '#4ECDC4',
    bar: '#45B7D1',
    shop: '#96CEB4',
    attraction: '#FFEAA7',
    hotel: '#DDA0DD',
    default: '#6C5CE7'
  }

  const color = categoryColors[category?.toLowerCase() || 'default'] || categoryColors.default

  return createMarkerIcon(color, 32)
}