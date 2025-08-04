'use client'

import { useState, useEffect, useCallback } from 'react'

export interface NetworkCondition {
  effectiveType: '2g' | '3g' | '4g' | 'slow-2g' | 'unknown'
  downlink: number
  rtt: number
  saveData: boolean
}

export interface OptimizationSettings {
  imageQuality: number
  enableWebP: boolean
  enableLazyLoading: boolean
  preloadCritical: boolean
  reducedAnimations: boolean
  compactMode: boolean
}

const DEFAULT_NETWORK_CONDITION: NetworkCondition = {
  effectiveType: '4g',
  downlink: 10,
  rtt: 100,
  saveData: false
}

const getOptimizationSettings = (networkCondition: NetworkCondition): OptimizationSettings => {
  const { effectiveType, saveData, downlink } = networkCondition

  // High-performance settings for good connections
  if ((effectiveType === '4g' && downlink > 5) && !saveData) {
    return {
      imageQuality: 90,
      enableWebP: true,
      enableLazyLoading: true,
      preloadCritical: true,
      reducedAnimations: false,
      compactMode: false
    }
  }

  // Medium performance for moderate connections
  if ((effectiveType === '4g' && downlink <= 5) || effectiveType === '3g') {
    return {
      imageQuality: 75,
      enableWebP: true,
      enableLazyLoading: true,
      preloadCritical: true,
      reducedAnimations: saveData,
      compactMode: saveData
    }
  }

  // Low performance for slow connections
  if (effectiveType === '2g' || effectiveType === 'slow-2g' || saveData) {
    return {
      imageQuality: 60,
      enableWebP: true,
      enableLazyLoading: true,
      preloadCritical: false,
      reducedAnimations: true,
      compactMode: true
    }
  }

  // Default fallback
  return {
    imageQuality: 80,
    enableWebP: true,
    enableLazyLoading: true,
    preloadCritical: true,
    reducedAnimations: false,
    compactMode: false
  }
}

export function useNetworkOptimization() {
  const [networkCondition, setNetworkCondition] = useState<NetworkCondition>(DEFAULT_NETWORK_CONDITION)
  const [optimizationSettings, setOptimizationSettings] = useState<OptimizationSettings>(
    getOptimizationSettings(DEFAULT_NETWORK_CONDITION)
  )
  const [isOnline, setIsOnline] = useState(true)

  const updateNetworkCondition = useCallback(() => {
    if (typeof window === 'undefined') return

    const connection = (window.navigator as any)?.connection || 
                      (window.navigator as any)?.mozConnection || 
                      (window.navigator as any)?.webkitConnection

    let condition: NetworkCondition = DEFAULT_NETWORK_CONDITION

    if (connection) {
      condition = {
        effectiveType: connection.effectiveType || '4g',
        downlink: connection.downlink || 10,
        rtt: connection.rtt || 100,
        saveData: connection.saveData || false
      }
    } else {
      // Fallback: estimate based on navigator.onLine and user agent
      const userAgent = window.navigator.userAgent.toLowerCase()
      const isMobile = /mobile|android|iphone|ipad|ipod|blackberry|windows phone/.test(userAgent)
      
      condition = {
        effectiveType: isMobile ? '3g' : '4g',
        downlink: isMobile ? 2 : 10,
        rtt: isMobile ? 300 : 100,
        saveData: false
      }
    }

    setNetworkCondition(condition)
    setOptimizationSettings(getOptimizationSettings(condition))
  }, [])

  const updateOnlineStatus = useCallback(() => {
    setIsOnline(navigator.onLine)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Initial setup
    updateNetworkCondition()
    updateOnlineStatus()

    // Listen for network changes
    const connection = (window.navigator as any)?.connection || 
                      (window.navigator as any)?.mozConnection || 
                      (window.navigator as any)?.webkitConnection

    if (connection) {
      connection.addEventListener('change', updateNetworkCondition)
    }

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // Cleanup
    return () => {
      if (connection) {
        connection.removeEventListener('change', updateNetworkCondition)
      }
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [updateNetworkCondition, updateOnlineStatus])

  // Performance monitoring helpers
  const reportWebVital = useCallback((name: string, value: number) => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      // Send to Google Analytics if available
      (window as any).gtag('event', name, {
        event_category: 'Web Vitals',
        value: Math.round(name === 'CLS' ? value * 1000 : value),
        non_interaction: true,
      })
    }

    // Send to custom analytics endpoint
    if ('navigator' in window && 'sendBeacon' in navigator) {
      const body = JSON.stringify({
        name,
        value,
        url: window.location.href,
        timestamp: Date.now(),
        networkCondition
      })

      navigator.sendBeacon('/api/analytics/web-vitals', body)
    }
  }, [networkCondition])

  const getImageDimensions = useCallback((width: number, height: number) => {
    const { compactMode } = optimizationSettings
    
    if (compactMode) {
      // Reduce image dimensions for slow connections
      return {
        width: Math.floor(width * 0.75),
        height: Math.floor(height * 0.75)
      }
    }

    return { width, height }
  }, [optimizationSettings])

  const shouldPreload = useCallback((priority: 'high' | 'medium' | 'low') => {
    const { preloadCritical } = optimizationSettings
    
    if (!preloadCritical) return false
    if (priority === 'high') return true
    if (priority === 'medium' && networkCondition.effectiveType === '4g') return true
    
    return false
  }, [optimizationSettings, networkCondition])

  const getLoadingStrategy = useCallback((isAboveFold: boolean, priority: 'high' | 'medium' | 'low') => {
    if (isAboveFold && priority === 'high') {
      return 'eager' as const
    }
    
    return optimizationSettings.enableLazyLoading ? 'lazy' as const : 'eager' as const
  }, [optimizationSettings])

  return {
    networkCondition,
    optimizationSettings,
    isOnline,
    reportWebVital,
    getImageDimensions,
    shouldPreload,
    getLoadingStrategy,
    
    // Computed properties for easier access
    isSlowConnection: networkCondition.effectiveType === '2g' || networkCondition.effectiveType === 'slow-2g',
    isFastConnection: networkCondition.effectiveType === '4g' && networkCondition.downlink > 5,
    shouldReduceData: networkCondition.saveData || networkCondition.effectiveType === '2g' || networkCondition.effectiveType === 'slow-2g'
  }
}

// Performance monitoring utilities
export function measureWebVitals() {
  if (typeof window === 'undefined') return

  // Measure Core Web Vitals using web-vitals library pattern
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'navigation') {
        const navigationEntry = entry as PerformanceNavigationTiming
        
        // First Contentful Paint
        if (navigationEntry.loadEventStart > 0) {
          const fcp = navigationEntry.loadEventStart - navigationEntry.fetchStart
          if ('gtag' in window) {
            (window as any).gtag('event', 'FCP', {
              event_category: 'Web Vitals',
              value: Math.round(fcp),
              non_interaction: true,
            })
          }
        }
      }

      if (entry.entryType === 'largest-contentful-paint') {
        const lcpEntry = entry as any
        if ('gtag' in window) {
          (window as any).gtag('event', 'LCP', {
            event_category: 'Web Vitals',
            value: Math.round(lcpEntry.startTime),
            non_interaction: true,
          })
        }
      }

      if (entry.entryType === 'first-input') {
        const fidEntry = entry as any
        if ('gtag' in window) {
          (window as any).gtag('event', 'FID', {
            event_category: 'Web Vitals',
            value: Math.round(fidEntry.processingStart - fidEntry.startTime),
            non_interaction: true,
          })
        }
      }
    }
  })

  // Observe performance entries
  try {
    observer.observe({ entryTypes: ['navigation', 'largest-contentful-paint', 'first-input'] })
  } catch (error) {
    console.warn('Performance observer not supported:', error)
  }

  // Measure Cumulative Layout Shift
  let clsValue = 0
  let clsEntries: any[] = []

  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        const firstSessionEntry = clsEntries[0]
        const lastSessionEntry = clsEntries[clsEntries.length - 1]

        if (!firstSessionEntry || entry.startTime - lastSessionEntry.startTime < 1000) {
          clsEntries.push(entry)
          clsValue += (entry as any).value
        } else {
          clsEntries = [entry]
          clsValue = (entry as any).value
        }

        if ('gtag' in window) {
          (window as any).gtag('event', 'CLS', {
            event_category: 'Web Vitals',
            value: Math.round(clsValue * 1000),
            non_interaction: true,
          })
        }
      }
    }
  })

  try {
    clsObserver.observe({ entryTypes: ['layout-shift'] })
  } catch (error) {
    console.warn('Layout shift observer not supported:', error)
  }
}