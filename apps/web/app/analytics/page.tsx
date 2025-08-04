import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft, Shield, Lock } from 'lucide-react'
import AnalyticsDashboardWrapper from '@/components/analytics/AnalyticsDashboardWrapper'
import { DashboardMetrics } from '@/lib/types/analytics'

// Mock analytics data - in real app this would come from analytics service
const mockMetrics: DashboardMetrics = {
  overview: {
    total_visitors: 12547,
    unique_visitors: 8932,
    page_views: 45621,
    average_session_duration: 342, // seconds
    bounce_rate: 0.34,
    conversion_rate: 0.087,
    top_pages: [
      {
        url: '/map',
        title: 'Interactive Map - Indiranagar Discovery',
        views: 15420,
        unique_views: 11250,
        average_time: 420,
        bounce_rate: 0.25
      },
      {
        url: '/blog',
        title: 'Blog - Indiranagar Insights',
        views: 8930,
        unique_views: 6140,
        average_time: 680,
        bounce_rate: 0.31
      },
      {
        url: '/journeys',
        title: 'Curated Journey Experiences',
        views: 5680,
        unique_views: 4120,
        average_time: 520,
        bounce_rate: 0.28
      },
      {
        url: '/places/blue-tokai-coffee',
        title: 'Blue Tokai Coffee Roasters',
        views: 4250,
        unique_views: 3890,
        average_time: 280,
        bounce_rate: 0.42
      },
      {
        url: '/blog/evolution-100-feet-road',
        title: 'The Evolution of 100 Feet Road',
        views: 3820,
        unique_views: 3420,
        average_time: 850,
        bounce_rate: 0.18
      }
    ],
    traffic_sources: [
      { source: 'organic_search', visitors: 5240, percentage: 41.7, conversion_rate: 0.095 },
      { source: 'direct', visitors: 3180, percentage: 25.3, conversion_rate: 0.125 },
      { source: 'social_media', visitors: 2890, percentage: 23.0, conversion_rate: 0.067 },
      { source: 'referral', visitors: 1237, percentage: 9.9, conversion_rate: 0.078 }
    ],
    time_period: {
      start_date: '2024-01-01T00:00:00Z',
      end_date: '2024-01-31T23:59:59Z',
      period_type: 'month'
    }
  },
  content_performance: {
    blog_post_views: [
      {
        post_id: '1',
        title: 'The Evolution of 100 Feet Road: A Decade of Change',
        views: 3820,
        unique_views: 3420,
        average_read_time: 850,
        engagement_rate: 0.72,
        shares: 124,
        comments: 23
      },
      {
        post_id: '2',
        title: 'Hidden Gems: 5 Cafes You\'ve Probably Never Noticed',
        views: 2940,
        unique_views: 2650,
        average_read_time: 420,
        engagement_rate: 0.68,
        shares: 89,
        comments: 15
      },
      {
        post_id: '3',
        title: 'Community Spotlight: The Vegetable Vendor Who Knows Everyone',
        views: 2150,
        unique_views: 1980,
        average_read_time: 380,
        engagement_rate: 0.85,
        shares: 156,
        comments: 31
      }
    ],
    place_page_views: [
      {
        place_id: 'place-1',
        name: 'Blue Tokai',
        views: 4250,
        unique_views: 3890,
        average_time_on_page: 280,
        interaction_rate: 0.45,
        referrals_generated: 28
      },
      {
        place_id: 'place-2',
        name: 'Koshy\'s Restaurant',
        views: 3680,
        unique_views: 3200,
        average_time_on_page: 350,
        interaction_rate: 0.52,
        referrals_generated: 35
      }
    ],
    journey_completions: [
      {
        journey_id: '1',
        title: 'Coffee Culture Crawl',
        starts: 420,
        completions: 312,
        completion_rate: 0.74,
        average_duration: 10800, // 3 hours
        satisfaction_score: 4.6
      },
      {
        journey_id: '2',
        title: 'Contemplative Evening Walk',
        starts: 280,
        completions: 185,
        completion_rate: 0.66,
        average_duration: 7200, // 2 hours
        satisfaction_score: 4.8
      }
    ],
    search_queries: [
      { query: 'coffee shops indiranagar', count: 342, results_clicked: 298, click_through_rate: 0.87 },
      { query: 'best restaurants 100 feet road', count: 287, results_clicked: 231, click_through_rate: 0.80 },
      { query: 'indiranagar map', count: 198, results_clicked: 165, click_through_rate: 0.83 },
      { query: 'places to visit indiranagar', count: 156, results_clicked: 128, click_through_rate: 0.82 },
      { query: 'hidden gems bangalore', count: 134, results_clicked: 98, click_through_rate: 0.73 }
    ],
    content_engagement: {
      average_read_time: 520,
      scroll_depth: 0.68,
      social_shares: 489,
      comments: 127,
      bookmarks: 93
    }
  },
  user_engagement: {
    session_distribution: {
      duration_buckets: {
        '0-30s': 2840,
        '30s-2m': 3250,
        '2m-5m': 2890,
        '5m-15m': 2120,
        '15m+': 1447
      },
      page_views_buckets: {
        '1': 4250,
        '2-5': 5680,
        '6-10': 2120,
        '11+': 497
      }
    },
    user_flow: {
      nodes: [],
      edges: [],
      conversion_paths: []
    },
    feature_usage: [
      { feature: 'Interactive Map', usage_count: 15420, unique_users: 8932, engagement_rate: 0.78 },
      { feature: 'Place Search', usage_count: 9870, unique_users: 6420, engagement_rate: 0.65 },
      { feature: 'Journey Planning', usage_count: 3240, unique_users: 2890, engagement_rate: 0.89 },
      { feature: 'Blog Reading', usage_count: 12450, unique_users: 7650, engagement_rate: 0.61 }
    ],
    retention_metrics: {
      day_1: 0.45,
      day_7: 0.28,
      day_30: 0.15,
      cohort_analysis: []
    },
    heatmap_data: []
  },
  place_discovery: {
    most_viewed_places: [
      {
        place_id: 'place-1',
        name: 'Blue Tokai',
        category: 'Coffee Shop',
        views: 4250,
        unique_views: 3890,
        conversion_rate: 0.12
      },
      {
        place_id: 'place-2',
        name: 'Koshy\'s Restaurant',
        category: 'Restaurant',
        views: 3680,
        unique_views: 3200,
        conversion_rate: 0.15
      },
      {
        place_id: 'place-3',
        name: 'Forum Mall',
        category: 'Shopping',
        views: 2890,
        unique_views: 2450,
        conversion_rate: 0.08
      },
      {
        place_id: 'place-4',
        name: 'Indiranagar Social',
        category: 'Bar & Restaurant',
        views: 2340,
        unique_views: 2100,
        conversion_rate: 0.18
      }
    ],
    discovery_patterns: [
      {
        pattern_name: 'Coffee Enthusiast Explorer',
        frequency: 1240,
        typical_user_profile: 'Weekend visitors seeking specialty coffee experiences',
        conversion_likelihood: 0.85
      },
      {
        pattern_name: 'Heritage Seeker',
        frequency: 890,
        typical_user_profile: 'Tourists interested in old Bangalore charm',
        conversion_likelihood: 0.72
      },
      {
        pattern_name: 'Local Discovery',
        frequency: 650,
        typical_user_profile: 'New residents exploring their neighborhood',
        conversion_likelihood: 0.91
      }
    ],
    map_interactions: {
      zoom_events: 28450,
      pan_events: 15680,
      marker_clicks: 12340,
      filter_applications: 8970,
      search_usage: 6540
    },
    filter_usage: {
      filter_type: 'category',
      usage_count: 8970,
      refinement_rate: 0.67,
      results_satisfaction: 0.78
    },
    place_engagement: {
      average_time_on_place_page: 315,
      gallery_views: 5640,
      directions_requests: 2890,
      phone_clicks: 1240,
      social_shares: 450
    }
  },
  journey_analytics: {
    journey_starts: 1420,
    journey_completions: 980,
    completion_rate: 0.69,
    average_journey_time: 9600, // 2.67 hours
    drop_off_points: [
      {
        step: 2,
        step_name: 'Second location visit',
        drop_off_rate: 0.18,
        typical_duration_before_drop_off: 2400
      },
      {
        step: 3,
        step_name: 'Final destination',
        drop_off_rate: 0.13,
        typical_duration_before_drop_off: 5400
      }
    ],
    popular_journeys: [
      {
        journey_id: '1',
        name: 'Coffee Culture Crawl',
        starts: 620,
        completions: 458,
        satisfaction_score: 4.6
      },
      {
        journey_id: '2',
        name: 'Contemplative Evening Walk',
        starts: 420,
        completions: 285,
        satisfaction_score: 4.8
      },
      {
        journey_id: '3',
        name: 'Foodie Adventure Trail',
        starts: 380,
        completions: 237,
        satisfaction_score: 4.4
      }
    ]
  },
  business_impact: {
    referral_tracking: {
      total_referrals: 147,
      successful_referrals: 89,
      referral_value: 25600,
      top_referring_users: []
    },
    business_relationship_value: {
      relationships_tracked: 15,
      arrangements_activated: 8,
      estimated_value_generated: 25600,
      network_growth_rate: 0.23
    },
    community_engagement: {
      active_contributors: 45,
      user_generated_content: 23,
      community_interactions: 189,
      satisfaction_score: 4.3
    },
    newsletter_performance: {
      subscribers: 1240,
      growth_rate: 0.15,
      open_rate: 0.42,
      click_through_rate: 0.18,
      unsubscribe_rate: 0.02
    }
  }
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg" />
              <div className="w-16 h-4 bg-gray-200 rounded" />
            </div>
            <div className="w-20 h-8 bg-gray-200 rounded mb-2" />
            <div className="w-32 h-4 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
      
      <div className="grid gap-8 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-40 h-6 bg-gray-200 rounded mb-6" />
            <div className="space-y-4">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="flex items-center justify-between">
                  <div className="w-48 h-4 bg-gray-200 rounded" />
                  <div className="w-16 h-4 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link 
              href="/map"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Map</span>
            </Link>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Admin Only</span>
              <Lock className="w-4 h-4" />
            </div>
          </div>
          
          <div className="mb-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">Admin Analytics Dashboard</h3>
                  <p className="text-blue-800 text-sm">
                    This dashboard provides comprehensive insights into user behavior, content performance, 
                    and business impact. Data is collected with full privacy compliance and user consent.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Suspense fallback={<DashboardSkeleton />}>
          <AnalyticsDashboardWrapper metrics={mockMetrics} />
        </Suspense>

        {/* Privacy and Compliance Notice */}
        <div className="mt-12 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy & Data Compliance</h3>
          <div className="prose prose-gray max-w-none text-sm">
            <p className="text-gray-700 mb-3">
              All analytics data is collected in compliance with privacy regulations and with explicit user consent. 
              Personal information is anonymized and aggregated to protect user privacy while providing valuable insights.
            </p>
            
            <div className="grid gap-4 md:grid-cols-3 mt-4">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-1">GDPR Compliant</h4>
                <p className="text-green-800 text-xs">Data collection with consent and right to deletion</p>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-1">Privacy First</h4>
                <p className="text-blue-800 text-xs">No personal data stored without explicit consent</p>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-medium text-purple-900 mb-1">Transparent</h4>
                <p className="text-purple-800 text-xs">Users can view and control their data anytime</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}