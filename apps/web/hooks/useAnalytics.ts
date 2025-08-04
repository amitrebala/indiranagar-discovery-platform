'use client'

import { useEffect, useCallback } from 'react'
import { analytics, mapEvents, searchEvents, weatherEvents, journeyEvents, engagementEvents } from '@/lib/analytics/events'

// Custom hook for analytics tracking
export function useAnalytics() {
  useEffect(() => {
    // Initialize analytics on mount
    analytics.trackPageView(window.location.pathname, document.title)
  }, [])

  // Track epic-specific events
  const trackMapInteraction = useCallback((eventType: string, data: any) => {
    switch (eventType) {
      case 'photo_marker_click':
        analytics.track(mapEvents.photoMarkerClick(data.placeId, data.category))
        break
      case 'journey_route_hover':
        analytics.track(mapEvents.journeyRouteHover(data.journeyId, data.routeName))
        break
      case 'map_zoom':
        analytics.track(mapEvents.mapZoomChanged(data.zoomLevel, data.markerCount))
        break
      case 'cluster_expand':
        analytics.track(mapEvents.clusterExpanded(data.clusterSize, data.zoomLevel))
        break
    }
  }, [])

  const trackSearchInteraction = useCallback((eventType: string, data: any) => {
    switch (eventType) {
      case 'natural_language_query':
        analytics.track(searchEvents.naturalLanguageQuery(data.query, data.resultsCount, data.mood))
        break
      case 'filter_applied':
        analytics.track(searchEvents.filterApplied(data.filterType, data.filterValue, data.resultsCount))
        break
      case 'near_me_used':
        analytics.track(searchEvents.nearMeUsed(data.latitude, data.longitude, data.radius))
        break
      case 'place_favorited':
        analytics.track(searchEvents.placeAddedToFavorites(data.placeId, data.source))
        break
      case 'search_result_click':
        analytics.track(searchEvents.searchResultClicked(data.placeId, data.resultPosition, data.query))
        break
    }
  }, [])

  const trackWeatherInteraction = useCallback((eventType: string, data: any) => {
    switch (eventType) {
      case 'weather_recommendation_accepted':
        analytics.track(weatherEvents.weatherRecommendationAccepted(
          data.weatherCondition,
          data.recommendationType,
          data.placeId
        ))
        break
      case 'seasonal_highlight_viewed':
        analytics.track(weatherEvents.seasonalHighlightViewed(data.season, data.placeId))
        break
      case 'weather_alert_interaction':
        analytics.track(weatherEvents.weatherAlertInteraction(data.alertType, data.action))
        break
      case 'weather_journey_created':
        analytics.track(weatherEvents.weatherBasedJourneyCreated(
          data.weatherCondition,
          data.journeyTheme,
          data.placeCount
        ))
        break
    }
  }, [])

  const trackJourneyInteraction = useCallback((eventType: string, data: any) => {
    switch (eventType) {
      case 'journey_started':
        analytics.track(journeyEvents.journeyStarted(data.journeyId, data.startMethod))
        break
      case 'journey_completed':
        analytics.track(journeyEvents.journeyCompleted(data.journeyId, data.duration, data.placesVisited))
        break
      case 'journey_modified':
        analytics.track(journeyEvents.journeyModified(data.journeyId, data.modificationType))
        break
    }
  }, [])

  const trackFeatureFirstUse = useCallback((featureName: string) => {
    // Check if this is the first time using this feature
    if (typeof window !== 'undefined') {
      const storageKey = `feature_first_use_${featureName}`
      if (!localStorage.getItem(storageKey)) {
        localStorage.setItem(storageKey, 'true')
        analytics.track(engagementEvents.featureFirstUse(featureName))
      }
    }
  }, [])

  const trackError = useCallback((errorType: string, context: string, errorMessage?: string) => {
    analytics.track(engagementEvents.errorEncountered(errorType, context, errorMessage))
  }, [])

  const trackPerformance = useCallback((metric: string, value: number, context?: string) => {
    analytics.trackPerformance(metric, value, context)
  }, [])

  return {
    trackMapInteraction,
    trackSearchInteraction,
    trackWeatherInteraction,
    trackJourneyInteraction,
    trackFeatureFirstUse,
    trackError,
    trackPerformance,
    setUserId: analytics.setUserId.bind(analytics)
  }
}

// Performance tracking hook
export function usePerformanceTracking() {
  const { trackPerformance } = useAnalytics()

  useEffect(() => {
    // Track Core Web Vitals (disabled - web-vitals package not installed)
    // if (typeof window !== 'undefined') {
    //   import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    //     getCLS((metric) => trackPerformance('CLS', metric.value, 'core_web_vitals'))
    //     getFID((metric) => trackPerformance('FID', metric.value, 'core_web_vitals'))
    //     getFCP((metric) => trackPerformance('FCP', metric.value, 'core_web_vitals'))
    //     getLCP((metric) => trackPerformance('LCP', metric.value, 'core_web_vitals'))
    //     getTTFB((metric) => trackPerformance('TTFB', metric.value, 'core_web_vitals'))
    //   }).catch((error) => {
    //     console.warn('Failed to load web-vitals library:', error)
    //   })
    // }

    // Track custom performance metrics
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming
          trackPerformance('page_load_time', navEntry.loadEventEnd - navEntry.fetchStart, 'navigation')
        }
        
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming
          if (resourceEntry.name.includes('weather') || resourceEntry.name.includes('places')) {
            trackPerformance('api_response_time', resourceEntry.responseEnd - resourceEntry.requestStart, 'api_call')
          }
        }
      })
    })

    try {
      observer.observe({ entryTypes: ['navigation', 'resource'] })
    } catch (error) {
      console.warn('Performance observer not supported')
    }

    return () => observer.disconnect()
  }, [trackPerformance])
}

// Page view tracking hook
export function usePageTracking() {
  useEffect(() => {
    // Track initial page view
    analytics.trackPageView(window.location.pathname, document.title)

    // Track page changes (for SPA navigation)
    const handleLocationChange = () => {
      analytics.trackPageView(window.location.pathname, document.title)
    }

    // Listen for navigation events
    window.addEventListener('popstate', handleLocationChange)
    
    // For Next.js router events (if using next/router)
    if (typeof window !== 'undefined' && 'next' in window) {
      const router = (window as any).next?.router
      if (router) {
        router.events.on('routeChangeComplete', handleLocationChange)
        return () => router.events.off('routeChangeComplete', handleLocationChange)
      }
    }

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
    }
  }, [])
}

// Epic-specific tracking hooks
export function useMapAnalytics() {
  const { trackMapInteraction, trackFeatureFirstUse } = useAnalytics()

  const trackPhotoMarkerClick = useCallback((placeId: string, category: string) => {
    trackFeatureFirstUse('photo_markers')
    trackMapInteraction('photo_marker_click', { placeId, category })
  }, [trackMapInteraction, trackFeatureFirstUse])

  const trackJourneyRouteHover = useCallback((journeyId: string, routeName: string) => {
    trackFeatureFirstUse('journey_routes')
    trackMapInteraction('journey_route_hover', { journeyId, routeName })
  }, [trackMapInteraction, trackFeatureFirstUse])

  const trackMapZoom = useCallback((zoomLevel: number, markerCount: number) => {
    trackMapInteraction('map_zoom', { zoomLevel, markerCount })
  }, [trackMapInteraction])

  const trackClusterExpand = useCallback((clusterSize: number, zoomLevel: number) => {
    trackMapInteraction('cluster_expand', { clusterSize, zoomLevel })
  }, [trackMapInteraction])

  return {
    trackPhotoMarkerClick,
    trackJourneyRouteHover,
    trackMapZoom,
    trackClusterExpand
  }
}

export function useSearchAnalytics() {
  const { trackSearchInteraction, trackFeatureFirstUse } = useAnalytics()

  const trackNaturalLanguageQuery = useCallback((query: string, resultsCount: number, mood?: string) => {
    trackFeatureFirstUse('natural_language_search')
    trackSearchInteraction('natural_language_query', { query, resultsCount, mood })
  }, [trackSearchInteraction, trackFeatureFirstUse])

  const trackFilterApplied = useCallback((filterType: string, filterValue: any, resultsCount: number) => {
    trackFeatureFirstUse('advanced_filters')
    trackSearchInteraction('filter_applied', { filterType, filterValue, resultsCount })
  }, [trackSearchInteraction, trackFeatureFirstUse])

  const trackNearMeUsed = useCallback((latitude: number, longitude: number, radius: number) => {
    trackSearchInteraction('near_me_used', { latitude, longitude, radius })
  }, [trackSearchInteraction])

  const trackPlaceFavorited = useCallback((placeId: string, source: string) => {
    trackSearchInteraction('place_favorited', { placeId, source })
  }, [trackSearchInteraction])

  const trackSearchResultClick = useCallback((placeId: string, resultPosition: number, query: string) => {
    trackSearchInteraction('search_result_click', { placeId, resultPosition, query })
  }, [trackSearchInteraction])

  return {
    trackNaturalLanguageQuery,
    trackFilterApplied,
    trackNearMeUsed,
    trackPlaceFavorited,
    trackSearchResultClick
  }
}

export function useWeatherAnalytics() {
  const { trackWeatherInteraction, trackFeatureFirstUse } = useAnalytics()

  const trackWeatherRecommendationAccepted = useCallback((
    weatherCondition: string,
    recommendationType: string,
    placeId: string
  ) => {
    trackFeatureFirstUse('weather_recommendations')
    trackWeatherInteraction('weather_recommendation_accepted', {
      weatherCondition,
      recommendationType,
      placeId
    })
  }, [trackWeatherInteraction, trackFeatureFirstUse])

  const trackSeasonalHighlightViewed = useCallback((season: string, placeId: string) => {
    trackFeatureFirstUse('seasonal_highlights')
    trackWeatherInteraction('seasonal_highlight_viewed', { season, placeId })
  }, [trackWeatherInteraction, trackFeatureFirstUse])

  const trackWeatherAlertInteraction = useCallback((alertType: string, action: string) => {
    trackFeatureFirstUse('weather_alerts')
    trackWeatherInteraction('weather_alert_interaction', { alertType, action })
  }, [trackWeatherInteraction, trackFeatureFirstUse])

  const trackWeatherJourneyCreated = useCallback((
    weatherCondition: string,
    journeyTheme: string,
    placeCount: number
  ) => {
    trackWeatherInteraction('weather_journey_created', {
      weatherCondition,
      journeyTheme,
      placeCount
    })
  }, [trackWeatherInteraction])

  return {
    trackWeatherRecommendationAccepted,
    trackSeasonalHighlightViewed,
    trackWeatherAlertInteraction,
    trackWeatherJourneyCreated
  }
}