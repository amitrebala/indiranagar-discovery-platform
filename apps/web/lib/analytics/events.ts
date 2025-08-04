// Analytics event tracking for Enhanced Experience Intelligence Platform

export interface AnalyticsEvent {
  name: string
  properties: Record<string, any>
  timestamp: number
  userId?: string
  sessionId: string
}

// Event Categories
export enum EventCategory {
  MAP_INTERACTION = 'map_interaction',
  SEARCH = 'search',
  WEATHER = 'weather',
  JOURNEY = 'journey',
  PLACE = 'place',
  USER_ENGAGEMENT = 'user_engagement'
}

// Map Events (Epic 2.1)
export const mapEvents = {
  photoMarkerClick: (placeId: string, category: string) => ({
    name: 'photo_marker_clicked',
    category: EventCategory.MAP_INTERACTION,
    properties: {
      place_id: placeId,
      place_category: category,
      marker_type: 'photo'
    }
  }),

  journeyRouteHover: (journeyId: string, routeName: string) => ({
    name: 'journey_route_hovered',
    category: EventCategory.MAP_INTERACTION,
    properties: {
      journey_id: journeyId,
      route_name: routeName,
      interaction_type: 'hover'
    }
  }),

  mapZoomChanged: (zoomLevel: number, markerCount: number) => ({
    name: 'map_zoom_changed',
    category: EventCategory.MAP_INTERACTION,
    properties: {
      zoom_level: zoomLevel,
      visible_markers: markerCount,
      marker_size: zoomLevel > 15 ? 'large' : zoomLevel > 12 ? 'medium' : 'small'
    }
  }),

  clusterExpanded: (clusterSize: number, zoomLevel: number) => ({
    name: 'marker_cluster_expanded',
    category: EventCategory.MAP_INTERACTION,
    properties: {
      cluster_size: clusterSize,
      zoom_level: zoomLevel
    }
  })
}

// Search Events (Epic 2.4)
export const searchEvents = {
  naturalLanguageQuery: (query: string, resultsCount: number, mood?: string) => ({
    name: 'natural_language_search',
    category: EventCategory.SEARCH,
    properties: {
      query,
      results_count: resultsCount,
      detected_mood: mood,
      query_length: query.length,
      query_type: 'natural_language'
    }
  }),

  filterApplied: (filterType: string, filterValue: any, resultsCount: number) => ({
    name: 'search_filter_applied',
    category: EventCategory.SEARCH,
    properties: {
      filter_type: filterType,
      filter_value: filterValue,
      results_count: resultsCount
    }
  }),

  nearMeUsed: (latitude: number, longitude: number, radius: number) => ({
    name: 'near_me_search',
    category: EventCategory.SEARCH,
    properties: {
      latitude,
      longitude,
      search_radius_km: radius,
      location_type: 'gps'
    }
  }),

  placeAddedToFavorites: (placeId: string, source: string) => ({
    name: 'place_favorited',
    category: EventCategory.SEARCH,
    properties: {
      place_id: placeId,
      source, // 'search_results', 'map_marker', 'journey'
      action: 'add'
    }
  }),

  searchResultClicked: (placeId: string, resultPosition: number, query: string) => ({
    name: 'search_result_clicked',
    category: EventCategory.SEARCH,
    properties: {
      place_id: placeId,
      result_position: resultPosition,
      query,
      relevance_score: 'tracked_separately'
    }
  })
}

// Weather Events (Epic 4.1)
export const weatherEvents = {
  weatherRecommendationAccepted: (weatherCondition: string, recommendationType: string, placeId: string) => ({
    name: 'weather_recommendation_accepted',
    category: EventCategory.WEATHER,
    properties: {
      weather_condition: weatherCondition,
      recommendation_type: recommendationType, // 'indoor', 'outdoor', 'covered'
      place_id: placeId,
      temperature: 'tracked_separately'
    }
  }),

  seasonalHighlightViewed: (season: string, placeId: string) => ({
    name: 'seasonal_highlight_viewed',
    category: EventCategory.WEATHER,
    properties: {
      season,
      place_id: placeId,
      month: new Date().getMonth() + 1
    }
  }),

  weatherAlertInteraction: (alertType: string, action: string) => ({
    name: 'weather_alert_interaction',
    category: EventCategory.WEATHER,
    properties: {
      alert_type: alertType, // 'rain_started', 'extreme_heat', 'perfect_weather'
      action, // 'viewed', 'dismissed', 'action_taken'
      alert_severity: 'info' // or 'warning', 'severe'
    }
  }),

  weatherBasedJourneyCreated: (weatherCondition: string, journeyTheme: string, placeCount: number) => ({
    name: 'weather_journey_created',
    category: EventCategory.WEATHER,
    properties: {
      weather_condition: weatherCondition,
      journey_theme: journeyTheme,
      place_count: placeCount,
      estimated_duration: 'tracked_separately'
    }
  })
}

// Journey Events
export const journeyEvents = {
  journeyStarted: (journeyId: string, startMethod: string) => ({
    name: 'journey_started',
    category: EventCategory.JOURNEY,
    properties: {
      journey_id: journeyId,
      start_method: startMethod, // 'map_click', 'search_result', 'recommendation'
      weather_dependent: false
    }
  }),

  journeyCompleted: (journeyId: string, duration: number, placesVisited: number, totalPlaces: number = 1) => ({
    name: 'journey_completed',
    category: EventCategory.JOURNEY,
    properties: {
      journey_id: journeyId,
      actual_duration_minutes: duration,
      places_visited: placesVisited,
      completion_rate: totalPlaces > 0 ? placesVisited / totalPlaces : 0
    }
  }),

  journeyModified: (journeyId: string, modificationType: string) => ({
    name: 'journey_modified',
    category: EventCategory.JOURNEY,
    properties: {
      journey_id: journeyId,
      modification_type: modificationType, // 'place_added', 'place_removed', 'route_changed'
      trigger: 'user_action' // or 'weather_change'
    }
  })
}

// User Engagement Events
export const engagementEvents = {
  sessionStart: (userAgent: string, viewport: string) => ({
    name: 'session_started',
    category: EventCategory.USER_ENGAGEMENT,
    properties: {
      user_agent: userAgent,
      viewport_size: viewport,
      device_type: getDeviceType(userAgent),
      referrer: document.referrer
    }
  }),

  featureFirstUse: (featureName: string) => ({
    name: 'feature_first_use',
    category: EventCategory.USER_ENGAGEMENT,
    properties: {
      feature_name: featureName,
      epic: getEpicFromFeature(featureName),
      discovery_method: 'tracked_separately'
    }
  }),

  errorEncountered: (errorType: string, context: string, errorMessage?: string) => ({
    name: 'error_encountered',
    category: EventCategory.USER_ENGAGEMENT,
    properties: {
      error_type: errorType,
      context,
      error_message: errorMessage,
      user_action: 'tracked_separately'
    }
  })
}

// Analytics Manager
export class AnalyticsManager {
  private sessionId: string
  private userId?: string
  private events: AnalyticsEvent[] = []

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initializeSession()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private initializeSession() {
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent
      const viewport = `${window.innerWidth}x${window.innerHeight}`
      this.track(engagementEvents.sessionStart(userAgent, viewport))
    }
  }

  setUserId(userId: string) {
    this.userId = userId
  }

  track(event: { name: string; category: EventCategory; properties: Record<string, any> }) {
    const analyticsEvent: AnalyticsEvent = {
      name: event.name,
      properties: {
        ...event.properties,
        category: event.category,
        epic_context: this.getEpicContext(event.name)
      },
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId
    }

    this.events.push(analyticsEvent)
    
    // Send to analytics service (implement based on your provider)
    this.sendToAnalytics(analyticsEvent)
  }

  private getEpicContext(eventName: string): string {
    if (eventName.includes('photo_marker') || eventName.includes('journey_route') || eventName.includes('cluster')) {
      return 'epic_2.1_enhanced_map'
    }
    if (eventName.includes('search') || eventName.includes('filter') || eventName.includes('favorite')) {
      return 'epic_2.4_enhanced_search'
    }
    if (eventName.includes('weather') || eventName.includes('seasonal') || eventName.includes('recommendation')) {
      return 'epic_4.1_weather_aware'
    }
    return 'general'
  }

  private sendToAnalytics(event: AnalyticsEvent) {
    // Implement based on your analytics provider
    // Examples: Google Analytics, Mixpanel, Amplitude, etc.
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event)
    }

    // Store locally for batch sending
    this.batchSendEvents()
  }

  private batchSendEvents() {
    // Implement batch sending logic
    // Could send every 10 events or every 30 seconds
    
    if (this.events.length >= 10) {
      this.flushEvents()
    }
  }

  private flushEvents() {
    if (this.events.length === 0) return

    // Send batch to analytics service
    const eventsToSend = [...this.events]
    this.events = []

    // Implement actual sending logic here
    if (typeof window !== 'undefined') {
      // Example: send to your analytics endpoint
      fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: eventsToSend })
      }).catch(error => {
        console.error('Analytics send failed:', error)
        // Re-add events for retry
        this.events.unshift(...eventsToSend)
      })
    }
  }

  // Utility methods
  trackPageView(path: string, title: string) {
    this.track({
      name: 'page_viewed',
      category: EventCategory.USER_ENGAGEMENT,
      properties: {
        path,
        title,
        referrer: document.referrer
      }
    })
  }

  trackPerformance(metric: string, value: number, context?: string) {
    this.track({
      name: 'performance_metric',
      category: EventCategory.USER_ENGAGEMENT,
      properties: {
        metric,
        value,
        context,
        user_agent: navigator.userAgent
      }
    })
  }
}

// Helper functions
function getDeviceType(userAgent: string): string {
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet'
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile'
  return 'desktop'
}

function getEpicFromFeature(featureName: string): string {
  const epicMapping: Record<string, string> = {
    'photo_markers': 'epic_2.1',
    'journey_routes': 'epic_2.1',
    'natural_language_search': 'epic_2.4',
    'advanced_filters': 'epic_2.4',
    'weather_recommendations': 'epic_4.1',
    'seasonal_highlights': 'epic_4.1',
    'weather_alerts': 'epic_4.1'
  }
  
  return epicMapping[featureName] || 'general'
}

// Export singleton instance
export const analytics = new AnalyticsManager()