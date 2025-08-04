export interface AnalyticsEvent {
  id: string
  event_type: EventType
  event_name: string
  user_id?: string
  session_id: string
  timestamp: string
  properties: Record<string, any>
  metadata: EventMetadata
}

export interface EventMetadata {
  page_url: string
  referrer?: string
  user_agent: string
  device_type: DeviceType
  browser: string
  os: string
  screen_resolution: string
  viewport_size: string
  location?: GeolocationData
  network_type?: string
}

export interface GeolocationData {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: string
}

export interface UserJourney {
  session_id: string
  user_id?: string
  start_time: string
  end_time?: string
  total_duration_ms: number
  page_views: PageView[]
  events: AnalyticsEvent[]
  conversion_events: ConversionEvent[]
  exit_page?: string
  bounce: boolean
}

export interface PageView {
  id: string
  page_url: string
  page_title: string
  timestamp: string
  duration_ms?: number
  scroll_depth: number
  interactions: PageInteraction[]
}

export interface PageInteraction {
  type: InteractionType
  element: string
  timestamp: string
  properties?: Record<string, any>
}

export interface ConversionEvent {
  id: string
  event_name: string
  value?: number
  currency?: string
  funnel_step: number
  timestamp: string
  properties: Record<string, any>
}

// Dashboard Analytics
export interface DashboardMetrics {
  overview: OverviewMetrics
  content_performance: ContentPerformance
  user_engagement: UserEngagement
  place_discovery: PlaceDiscoveryMetrics
  journey_analytics: JourneyAnalytics
  business_impact: BusinessImpact
}

export interface OverviewMetrics {
  total_visitors: number
  unique_visitors: number
  page_views: number
  average_session_duration: number
  bounce_rate: number
  conversion_rate: number
  top_pages: TopPage[]
  traffic_sources: TrafficSource[]
  time_period: TimePeriod
}

export interface ContentPerformance {
  blog_post_views: BlogPostMetrics[]
  place_page_views: PlaceMetrics[]
  journey_completions: JourneyMetrics[]
  search_queries: SearchQuery[]
  content_engagement: ContentEngagementMetrics
}

export interface UserEngagement {
  session_distribution: SessionDistribution
  user_flow: UserFlowData
  feature_usage: FeatureUsage[]
  retention_metrics: RetentionMetrics
  heatmap_data: HeatmapData[]
}

export interface PlaceDiscoveryMetrics {
  most_viewed_places: PlaceViewMetrics[]
  discovery_patterns: DiscoveryPattern[]
  map_interactions: MapInteractionMetrics
  filter_usage: FilterUsageMetrics
  place_engagement: PlaceEngagementMetrics
}

export interface JourneyAnalytics {
  journey_starts: number
  journey_completions: number
  completion_rate: number
  average_journey_time: number
  drop_off_points: JourneyDropOffPoint[]
  popular_journeys: PopularJourney[]
}

export interface BusinessImpact {
  referral_tracking: ReferralMetrics
  business_relationship_value: BusinessValueMetrics
  community_engagement: CommunityMetrics
  newsletter_performance: NewsletterMetrics
}

// Specific metric types
export interface TopPage {
  url: string
  title: string
  views: number
  unique_views: number
  average_time: number
  bounce_rate: number
}

export interface TrafficSource {
  source: string
  visitors: number
  percentage: number
  conversion_rate: number
}

export interface BlogPostMetrics {
  post_id: string
  title: string
  views: number
  unique_views: number
  average_read_time: number
  engagement_rate: number
  shares: number
  comments: number
}

export interface PlaceMetrics {
  place_id: string
  name: string
  views: number
  unique_views: number
  average_time_on_page: number
  interaction_rate: number
  referrals_generated: number
}

export interface JourneyMetrics {
  journey_id: string
  title: string
  starts: number
  completions: number
  completion_rate: number
  average_duration: number
  satisfaction_score?: number
}

export interface SearchQuery {
  query: string
  count: number
  results_clicked: number
  click_through_rate: number
}

export interface ContentEngagementMetrics {
  average_read_time: number
  scroll_depth: number
  social_shares: number
  comments: number
  bookmarks: number
}

export interface SessionDistribution {
  duration_buckets: {
    '0-30s': number
    '30s-2m': number
    '2m-5m': number
    '5m-15m': number
    '15m+': number
  }
  page_views_buckets: {
    '1': number
    '2-5': number
    '6-10': number
    '11+': number
  }
}

export interface UserFlowData {
  nodes: FlowNode[]
  edges: FlowEdge[]
  conversion_paths: ConversionPath[]
}

export interface FlowNode {
  id: string
  page: string
  visitors: number
  conversion_rate: number
}

export interface FlowEdge {
  source: string
  target: string
  visitors: number
  drop_off_rate: number
}

export interface ConversionPath {
  path: string[]
  conversions: number
  average_duration: number
}

export interface FeatureUsage {
  feature: string
  usage_count: number
  unique_users: number
  engagement_rate: number
}

export interface RetentionMetrics {
  day_1: number
  day_7: number
  day_30: number
  cohort_analysis: CohortData[]
}

export interface CohortData {
  cohort_date: string
  cohort_size: number
  retention_rates: number[]
}

export interface HeatmapData {
  page_url: string
  element_selector: string
  clicks: number
  attention_time: number
  coordinates: { x: number; y: number }[]
}

export interface PlaceViewMetrics {
  place_id: string
  name: string
  category: string
  views: number
  unique_views: number
  conversion_rate: number
}

export interface DiscoveryPattern {
  pattern_name: string
  frequency: number
  typical_user_profile: string
  conversion_likelihood: number
}

export interface MapInteractionMetrics {
  zoom_events: number
  pan_events: number
  marker_clicks: number
  filter_applications: number
  search_usage: number
}

export interface FilterUsageMetrics {
  filter_type: string
  usage_count: number
  refinement_rate: number
  results_satisfaction: number
}

export interface PlaceEngagementMetrics {
  average_time_on_place_page: number
  gallery_views: number
  directions_requests: number
  phone_clicks: number
  social_shares: number
}

export interface JourneyDropOffPoint {
  step: number
  step_name: string
  drop_off_rate: number
  typical_duration_before_drop_off: number
}

export interface PopularJourney {
  journey_id: string
  name: string
  starts: number
  completions: number
  satisfaction_score: number
}

export interface ReferralMetrics {
  total_referrals: number
  successful_referrals: number
  referral_value: number
  top_referring_users: ReferringUser[]
}

export interface ReferringUser {
  user_id: string
  referrals_made: number
  successful_referrals: number
  total_value: number
}

export interface BusinessValueMetrics {
  relationships_tracked: number
  arrangements_activated: number
  estimated_value_generated: number
  network_growth_rate: number
}

export interface CommunityMetrics {
  active_contributors: number
  user_generated_content: number
  community_interactions: number
  satisfaction_score: number
}

export interface NewsletterMetrics {
  subscribers: number
  growth_rate: number
  open_rate: number
  click_through_rate: number
  unsubscribe_rate: number
}

// Time period and filtering
export interface TimePeriod {
  start_date: string
  end_date: string
  period_type: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom'
}

export interface AnalyticsFilter {
  time_period: TimePeriod
  user_segments?: string[]
  traffic_sources?: string[]
  device_types?: DeviceType[]
  geographic_regions?: string[]
  content_categories?: string[]
}

// Enums
export type EventType = 
  | 'page_view'
  | 'click'
  | 'scroll'
  | 'form_submission'
  | 'search'
  | 'conversion'
  | 'engagement'
  | 'error'
  | 'performance'

export type DeviceType = 'desktop' | 'mobile' | 'tablet'

export type InteractionType = 
  | 'click'
  | 'hover'
  | 'scroll'
  | 'focus'
  | 'form_input'
  | 'video_play'
  | 'download'

// Real-time analytics
export interface RealTimeMetrics {
  active_users: number
  current_page_views: PageViewSnapshot[]
  live_events: LiveEvent[]
  performance_metrics: PerformanceSnapshot
  alerts: AnalyticsAlert[]
}

export interface PageViewSnapshot {
  page_url: string
  active_users: number
  timestamp: string
}

export interface LiveEvent {
  event_type: EventType
  count: number
  timestamp: string
}

export interface PerformanceSnapshot {
  average_load_time: number
  error_rate: number
  api_response_time: number
  timestamp: string
}

export interface AnalyticsAlert {
  id: string
  type: 'spike' | 'drop' | 'error' | 'performance'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  metric: string
  threshold: number
  current_value: number
  timestamp: string
  is_resolved: boolean
}