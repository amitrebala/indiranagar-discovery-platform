'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAdminDashboard } from '@/stores/adminDashboardStore';
import StatsCard from '@/components/admin/StatsCard';
import ActivityFeed from '@/components/admin/ActivityFeed';
import { 
  MapPinIcon, 
  ChatBubbleLeftIcon, 
  ChartBarIcon,
  DocumentTextIcon 
} from '@heroicons/react/24/outline';

export default function AdminDashboardPage() {
  const { 
    totalPlaces,
    pendingSuggestions,
    unresolvedQuestions,
    todayViews,
    recentActivity,
    isLoading,
    error,
    fetchStats
  } = useAdminDashboard();
  
  useEffect(() => {
    fetchStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Error loading dashboard: {error}</p>
          <button
            onClick={fetchStats}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Admin Dashboard
        </h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            title="Total Places"
            value={totalPlaces}
            icon={<MapPinIcon className="h-6 w-6" />}
            actionLabel="Manage"
            actionHref="/admin/places"
            loading={isLoading}
            color="blue"
          />
          
          <StatsCard
            title="Pending Review"
            value={pendingSuggestions + unresolvedQuestions}
            icon={<ChatBubbleLeftIcon className="h-6 w-6" />}
            actionLabel="Review"
            actionHref="/admin/suggestions"
            loading={isLoading}
            color="yellow"
          />
          
          <StatsCard
            title="Today's Views"
            value={todayViews.toLocaleString()}
            icon={<ChartBarIcon className="h-6 w-6" />}
            actionLabel="Analytics"
            actionHref="/admin/analytics"
            loading={isLoading}
            color="green"
          />
          
          <StatsCard
            title="Draft Content"
            value="3"
            icon={<DocumentTextIcon className="h-6 w-6" />}
            actionLabel="Edit"
            actionHref="/admin/content"
            loading={isLoading}
            color="red"
          />
        </div>
        
        {/* Quick Actions and Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/admin/places/new"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                + Add Place
              </Link>
              <a
                href="/admin/journeys/new"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                📝 Create Journey
              </a>
              <a
                href="/admin/settings"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                ⚙️ Settings
              </a>
              <a
                href="/admin/export"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                📥 Export Data
              </a>
            </div>
          </div>
          
          {/* Activity Feed */}
          <ActivityFeed 
            activities={recentActivity}
            loading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}