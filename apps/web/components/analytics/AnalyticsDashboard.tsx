'use client'

import { useState } from 'react'
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Clock, 
  MousePointer,
  BarChart3,
  PieChart,
  Activity,
  MapPin,
  BookOpen,
  Zap,
} from 'lucide-react'
import { DashboardMetrics, TimePeriod } from '@/lib/types/analytics'

interface AnalyticsDashboardProps {
  metrics: DashboardMetrics
  onTimeRangeChange?: (period: TimePeriod) => void
  onExport?: () => void
}

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: React.ReactNode
  color?: string
}

function MetricCard({ title, value, change, changeLabel, icon, color = 'blue' }: MetricCardProps) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    purple: 'text-purple-600 bg-purple-100',
    orange: 'text-orange-600 bg-orange-100',
    red: 'text-red-600 bg-red-100'
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className={`w-4 h-4 ${change < 0 ? 'rotate-180' : ''}`} />
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
        <p className="text-gray-600 text-sm">{title}</p>
        {changeLabel && (
          <p className="text-xs text-gray-500 mt-1">{changeLabel}</p>
        )}
      </div>
    </div>
  )
}

interface ChartCardProps {
  title: string
  children: React.ReactNode
  actions?: React.ReactNode
}

function ChartCard({ title, children, actions }: ChartCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {actions}
      </div>
      {children}
    </div>
  )
}

export default function AnalyticsDashboard({ 
  metrics, 
  onTimeRangeChange,
  onExport 
}: AnalyticsDashboardProps) {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('7d')

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range)
    // Convert string to TimePeriod object
    const now = new Date()
    const timePeriod: TimePeriod = {
      end_date: now.toISOString(),
      start_date: new Date(now.getTime() - (parseInt(range) * 24 * 60 * 60 * 1000)).toISOString(),
      period_type: 'custom'
    }
    onTimeRangeChange?.(timePeriod)
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'content', label: 'Content', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'places', label: 'Places', icon: <MapPin className="w-4 h-4" /> },
    { id: 'journeys', label: 'Journeys', icon: <Activity className="w-4 h-4" /> },
    { id: 'engagement', label: 'Engagement', icon: <Zap className="w-4 h-4" /> }
  ]

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Visitors"
          value={metrics.overview.total_visitors}
          change={15.3}
          changeLabel="vs last period"
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <MetricCard
          title="Page Views"
          value={metrics.overview.page_views}
          change={8.7}
          changeLabel="vs last period"
          icon={<Eye className="w-6 h-6" />}
          color="green"
        />
        <MetricCard
          title="Avg Session Duration"
          value={`${Math.floor(metrics.overview.average_session_duration / 60)}m ${metrics.overview.average_session_duration % 60}s`}
          change={-2.1}
          changeLabel="vs last period"
          icon={<Clock className="w-6 h-6" />}
          color="purple"
        />
        <MetricCard
          title="Bounce Rate"
          value={`${(metrics.overview.bounce_rate * 100).toFixed(1)}%`}
          change={-5.2}
          changeLabel="vs last period"
          icon={<MousePointer className="w-6 h-6" />}
          color="orange"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-8 lg:grid-cols-2">
        <ChartCard title="Top Pages">
          <div className="space-y-4">
            {metrics.overview.top_pages.slice(0, 5).map((page) => (
              <div key={page.url} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 truncate">{page.title}</p>
                  <p className="text-sm text-gray-500 truncate">{page.url}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-semibold text-gray-900">{page.views.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{page.unique_views.toLocaleString()} unique</p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Traffic Sources">
          <div className="space-y-4">
            {metrics.overview.traffic_sources.map((source, index) => (
              <div key={source.source} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-purple-500' :
                    'bg-gray-400'
                  }`} />
                  <span className="font-medium text-gray-900 capitalize">{source.source}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{source.visitors.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{source.percentage.toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  )

  const renderContentTab = () => (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <ChartCard title="Blog Post Performance">
          <div className="space-y-4">
            {metrics.content_performance.blog_post_views.slice(0, 5).map((post) => (
              <div key={post.post_id} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 line-clamp-1">{post.title}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span>{post.views} views</span>
                    <span>{post.engagement_rate.toFixed(1)}% engagement</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{post.shares} shares</span>
                  <span className="text-sm text-gray-500">{post.comments} comments</span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Search Queries">
          <div className="space-y-4">
            {metrics.content_performance.search_queries.slice(0, 8).map((query, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-900">{query.query}</span>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{query.count}</p>
                  <p className="text-sm text-gray-500">{(query.click_through_rate * 100).toFixed(1)}% CTR</p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Content Engagement Metrics">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {Math.floor(metrics.content_performance.content_engagement.average_read_time / 60)}m
            </p>
            <p className="text-sm text-gray-600">Avg Read Time</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {(metrics.content_performance.content_engagement.scroll_depth * 100).toFixed(0)}%
            </p>
            <p className="text-sm text-gray-600">Scroll Depth</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {metrics.content_performance.content_engagement.social_shares}
            </p>
            <p className="text-sm text-gray-600">Social Shares</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {metrics.content_performance.content_engagement.comments}
            </p>
            <p className="text-sm text-gray-600">Comments</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {metrics.content_performance.content_engagement.bookmarks}
            </p>
            <p className="text-sm text-gray-600">Bookmarks</p>
          </div>
        </div>
      </ChartCard>
    </div>
  )

  const renderPlacesTab = () => (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <ChartCard title="Most Viewed Places">
          <div className="space-y-4">
            {metrics.place_discovery.most_viewed_places.slice(0, 6).map((place) => (
              <div key={place.place_id} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{place.name}</p>
                  <p className="text-sm text-gray-500">{place.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{place.views.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{(place.conversion_rate * 100).toFixed(1)}% conversion</p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Discovery Patterns">
          <div className="space-y-4">
            {metrics.place_discovery.discovery_patterns.map((pattern) => (
              <div key={pattern.pattern_name} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{pattern.pattern_name}</h4>
                  <span className="text-sm text-gray-500">{pattern.frequency} users</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{pattern.typical_user_profile}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Conversion likelihood</span>
                  <span className="text-sm font-medium text-green-600">
                    {(pattern.conversion_likelihood * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Map Interactions">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {metrics.place_discovery.map_interactions.zoom_events.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Zoom Events</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {metrics.place_discovery.map_interactions.pan_events.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Pan Events</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {metrics.place_discovery.map_interactions.marker_clicks.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Marker Clicks</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {metrics.place_discovery.map_interactions.filter_applications.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Filter Uses</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {metrics.place_discovery.map_interactions.search_usage.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Searches</p>
          </div>
        </div>
      </ChartCard>
    </div>
  )

  const renderJourneysTab = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <MetricCard
          title="Journey Starts"
          value={metrics.journey_analytics.journey_starts}
          change={12.5}
          icon={<Activity className="w-6 h-6" />}
          color="blue"
        />
        <MetricCard
          title="Completions"
          value={metrics.journey_analytics.journey_completions}
          change={18.2}
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
        />
        <MetricCard
          title="Completion Rate"
          value={`${(metrics.journey_analytics.completion_rate * 100).toFixed(1)}%`}
          change={3.7}
          icon={<PieChart className="w-6 h-6" />}
          color="purple"
        />
        <MetricCard
          title="Avg Journey Time"
          value={`${Math.floor(metrics.journey_analytics.average_journey_time / 60)}h ${Math.floor((metrics.journey_analytics.average_journey_time % 60))}m`}
          change={-8.1}
          icon={<Clock className="w-6 h-6" />}
          color="orange"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <ChartCard title="Popular Journeys">
          <div className="space-y-4">
            {metrics.journey_analytics.popular_journeys.map((journey) => (
              <div key={journey.journey_id} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{journey.name}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span>{journey.starts} starts</span>
                    <span>{journey.completions} completions</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {((journey.completions / journey.starts) * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-500">completion rate</p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Drop-off Points">
          <div className="space-y-4">
            {metrics.journey_analytics.drop_off_points.map((point) => (
              <div key={point.step} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Step {point.step}: {point.step_name}</p>
                  <p className="text-sm text-gray-500">
                    Avg time before drop-off: {Math.floor(point.typical_duration_before_drop_off / 60)}m
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">
                    {(point.drop_off_rate * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-500">drop-off rate</p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  )

  return (
    <div className="analytics-dashboard">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Insights into content performance and user engagement</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1">Last 24 hours</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
          </select>
          
          <button
            onClick={onExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Export Data
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {selectedTab === 'overview' && renderOverviewTab()}
        {selectedTab === 'content' && renderContentTab()}
        {selectedTab === 'places' && renderPlacesTab()}
        {selectedTab === 'journeys' && renderJourneysTab()}
        {selectedTab === 'engagement' && (
          <div className="text-center py-12">
            <p className="text-gray-500">Engagement analytics coming soon...</p>
          </div>
        )}
      </div>
    </div>
  )
}