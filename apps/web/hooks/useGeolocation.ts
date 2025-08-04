import { useState, useEffect } from 'react'

interface GeolocationState {
  coordinates: {
    lat: number
    lng: number
  } | null
  error: string | null
  isLoading: boolean
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    isLoading: false,
  })

  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 60000,
  } = options

  const getCurrentPosition = () => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser',
        isLoading: false,
      }))
      return
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          error: null,
          isLoading: false,
        })
      },
      (error) => {
        let errorMessage = 'Failed to get location'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
        }

        setState({
          coordinates: null,
          error: errorMessage,
          isLoading: false,
        })
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    )
  }

  return {
    ...state,
    getCurrentPosition,
  }
}