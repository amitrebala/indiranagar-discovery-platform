'use client'

import { useState, useEffect } from 'react'

export interface BreakpointConfig {
  mobile: number
  tablet: number
  desktop: number
  large: number
}

const defaultBreakpoints: BreakpointConfig = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
  large: 1536
}

export interface ResponsiveState {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isLarge: boolean
  width: number
  height: number
  orientation: 'portrait' | 'landscape'
  touchDevice: boolean
}

export function useResponsive(breakpoints: BreakpointConfig = defaultBreakpoints): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => {
    // SSR-safe initial state
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isLarge: false,
        width: 1024,
        height: 768,
        orientation: 'landscape',
        touchDevice: false
      }
    }

    const width = window.innerWidth
    const height = window.innerHeight
    
    return {
      isMobile: width < breakpoints.mobile,
      isTablet: width >= breakpoints.mobile && width < breakpoints.desktop,
      isDesktop: width >= breakpoints.desktop && width < breakpoints.large,
      isLarge: width >= breakpoints.large,
      width,
      height,
      orientation: width > height ? 'landscape' : 'portrait',
      touchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0
    }
  })

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setState({
        isMobile: width < breakpoints.mobile,
        isTablet: width >= breakpoints.mobile && width < breakpoints.desktop,
        isDesktop: width >= breakpoints.desktop && width < breakpoints.large,
        isLarge: width >= breakpoints.large,
        width,
        height,
        orientation: width > height ? 'landscape' : 'portrait',
        touchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0
      })
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
    
    // Call once to set initial state
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [breakpoints])

  return state
}

// Hook for detecting device capabilities
export function useDeviceCapabilities() {
  const [capabilities, setCapabilities] = useState(() => ({
    hasCamera: false,
    hasGeolocation: false,
    canShare: false,
    canInstall: false,
    isStandalone: false,
    supportsVibration: false,
    networkType: 'unknown' as 'slow-2g' | '2g' | '3g' | '4g' | 'unknown'
  }))

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateCapabilities = () => {
      setCapabilities({
        hasCamera: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        hasGeolocation: !!navigator.geolocation,
        canShare: !!navigator.share,
        canInstall: !!(window as any).beforeinstallprompt,
        isStandalone: window.matchMedia('(display-mode: standalone)').matches ||
                     (window.navigator as any).standalone === true,
        supportsVibration: !!navigator.vibrate,
        networkType: (navigator as any).connection?.effectiveType || 'unknown'
      })
    }

    updateCapabilities()

    // Listen for network changes
    if ((navigator as any).connection) {
      (navigator as any).connection.addEventListener('change', updateCapabilities)
    }

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', updateCapabilities)

    return () => {
      if ((navigator as any).connection) {
        (navigator as any).connection.removeEventListener('change', updateCapabilities)
      }
      window.removeEventListener('beforeinstallprompt', updateCapabilities)
    }
  }, [])

  return capabilities
}

// Hook for safe area insets (iPhone notch, etc.)
export function useSafeAreaInsets() {
  const [insets, setInsets] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateInsets = () => {
      const style = getComputedStyle(document.documentElement)
      
      setInsets({
        top: parseInt(style.getPropertyValue('env(safe-area-inset-top)') || '0', 10),
        right: parseInt(style.getPropertyValue('env(safe-area-inset-right)') || '0', 10),
        bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)') || '0', 10),
        left: parseInt(style.getPropertyValue('env(safe-area-inset-left)') || '0', 10)
      })
    }

    updateInsets()
    window.addEventListener('orientationchange', updateInsets)
    
    return () => {
      window.removeEventListener('orientationchange', updateInsets)
    }
  }, [])

  return insets
}

// Hook for optimizing based on network conditions
export function useNetworkOptimization() {
  const [networkState, setNetworkState] = useState({
    effectiveType: '4g' as '2g' | '3g' | '4g' | 'slow-2g',
    downlink: 10,
    rtt: 100,
    saveData: false,
    shouldOptimizeImages: false,
    shouldPreloadContent: true
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateNetworkState = () => {
      const connection = (navigator as any).connection
      if (!connection) return

      const isSlowNetwork = connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g'
      const isSaveDataEnabled = connection.saveData

      setNetworkState({
        effectiveType: connection.effectiveType || '4g',
        downlink: connection.downlink || 10,
        rtt: connection.rtt || 100,
        saveData: isSaveDataEnabled,
        shouldOptimizeImages: isSlowNetwork || isSaveDataEnabled,
        shouldPreloadContent: !isSlowNetwork && !isSaveDataEnabled
      })
    }

    updateNetworkState()

    if ((navigator as any).connection) {
      (navigator as any).connection.addEventListener('change', updateNetworkState)
      
      return () => {
        (navigator as any).connection.removeEventListener('change', updateNetworkState)
      }
    }
  }, [])

  return networkState
}