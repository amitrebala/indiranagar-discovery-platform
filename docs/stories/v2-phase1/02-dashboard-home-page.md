# Story: Dashboard Home Page
**Story ID:** V2-P1-002  
**Priority:** P1 - HIGH  
**Estimated Hours:** 3-4 hours  
**Dependencies:** V2-P1-001 (Admin Authentication System)

---

## 📋 Context Documents

Load these specific shards:
- **PRD:** `/docs/prd/v2-shards/1-comprehensive-admin-dashboard-new-priority.md` (Section 1.2)
- **UX:** `/docs/ux/v2-shards/2-admin-dashboard-interface.md` (Section 2.2)
- **Architecture:** `/docs/architecture/v2-shards/4-database-schema-extensions.md` (admin_settings table)

---

## 🎯 Acceptance Criteria

- [ ] Dashboard displays 4 main stat cards (Places, Pending, Analytics, Content)
- [ ] Quick action buttons functional (links to other admin pages)
- [ ] Recent activity feed shows last 10 items
- [ ] Real-time stats update without page refresh
- [ ] Mobile responsive layout
- [ ] Loading states for all data fetching
- [ ] Error handling for failed API calls

---

## 💻 Implementation Instructions

### Step 1: Create Dashboard Stats Store
Create `/stores/adminDashboardStore.ts`:
```typescript
import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';

interface DashboardStats {
  totalPlaces: number;
  pendingSuggestions: number;
  todayViews: number;
  draftContent: number;
  recentActivity: Activity[];
  isLoading: boolean;
  error: string | null;
}

interface Activity {
  id: string;
  type: 'comment' | 'question' | 'rating' | 'suggestion';
  message: string;
  timestamp: Date;
}

export const useAdminDashboard = create<DashboardStats & {
  fetchStats: () => Promise<void>;
}>((set) => ({
  totalPlaces: 0,
  pendingSuggestions: 0,
  todayViews: 0,
  draftContent: 0,
  recentActivity: [],
  isLoading: true,
  error: null,
  
  fetchStats: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/admin/dashboard/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      
      const data = await response.json();
      set({
        ...data,
        isLoading: false
      });
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
    }
  }
}));
```

### Step 2: Create Dashboard API Endpoint
Create `/app/api/admin/dashboard/stats/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { AdminAuth } from '@/lib/admin/auth';

export async function GET(request: NextRequest) {
  // Verify admin (middleware already checked)
  const token = request.cookies.get('admin-token');
  if (!token || !AdminAuth.verifyToken(token.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // Fetch all stats in parallel
    const [places, suggestions, questions, analytics] = await Promise.all([
      // Total places count
      supabase.from('places').select('id', { count: 'exact', head: true }),
      
      // Pending suggestions
      supabase.from('community_suggestions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending'),
      
      // Unresolved questions  
      supabase.from('community_questions')
        .select('id', { count: 'exact', head: true })
        .eq('resolved', false),
        
      // Today's page views (mock for now)
      Promise.resolve({ count: Math.floor(Math.random() * 1000) + 500 })
    ]);
    
    // Get recent activity
    const { data: recentComments } = await supabase
      .from('comments')
      .select('id, content, created_at, entity_type')
      .order('created_at', { ascending: false })
      .limit(5);
    
    const { data: recentQuestions } = await supabase
      .from('community_questions')
      .select('id, question, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    
    // Combine and sort activities
    const activities = [
      ...(recentComments || []).map(c => ({
        id: c.id,
        type: 'comment' as const,
        message: `New comment on ${c.entity_type}`,
        timestamp: new Date(c.created_at)
      })),
      ...(recentQuestions || []).map(q => ({
        id: q.id,
        type: 'question' as const,
        message: q.question.substring(0, 50) + '...',
        timestamp: new Date(q.created_at)
      }))
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
     .slice(0, 10);
    
    return NextResponse.json({
      totalPlaces: places.count || 0,
      pendingSuggestions: suggestions.count || 0,
      unresolvedQuestions: questions.count || 0,
      todayViews: analytics.count,
      recentActivity: activities
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
```

### Step 3: Create Stats Card Component
Create `/components/admin/StatsCard.tsx`:
```typescript
interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  actionLabel?: string;
  actionHref?: string;
  loading?: boolean;
  color?: 'blue' | 'green' | 'yellow' | 'red';
}

export default function StatsCard({
  title,
  value,
  icon,
  actionLabel,
  actionHref,
  loading = false,
  color = 'blue'
}: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600'
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          {icon && (
            <div className={`flex-shrink-0 rounded-md p-3 ${colorClasses[color]}`}>
              {icon}
            </div>
          )}
          <div className="ml-5 w-0 flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="text-2xl font-semibold text-gray-900">
              {loading ? (
                <div className="h-7 bg-gray-200 rounded animate-pulse w-20" />
              ) : (
                value
              )}
            </dd>
          </div>
        </div>
      </div>
      {actionLabel && actionHref && (
        <div className="bg-gray-50 px-5 py-3">
          <a
            href={actionHref}
            className="text-sm font-medium text-primary-600 hover:text-primary-900"
          >
            {actionLabel} →
          </a>
        </div>
      )}
    </div>
  );
}
```

### Step 4: Create Activity Feed Component
Create `/components/admin/ActivityFeed.tsx`:
```typescript
interface Activity {
  id: string;
  type: 'comment' | 'question' | 'rating' | 'suggestion';
  message: string;
  timestamp: Date;
}

interface ActivityFeedProps {
  activities: Activity[];
  loading?: boolean;
}

export default function ActivityFeed({ activities, loading }: ActivityFeedProps) {
  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'comment': return '💬';
      case 'question': return '❓';
      case 'rating': return '⭐';
      case 'suggestion': return '💡';
    }
  };
  
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };
  
  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Recent Activity
      </h3>
      <div className="space-y-3">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-sm">No recent activity</p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <span className="text-lg">{getIcon(activity.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500">
                  {getTimeAgo(activity.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

### Step 5: Create Dashboard Page
Update `/app/admin/dashboard/page.tsx`:
```typescript
'use client';

import { useEffect } from 'react';
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
              <a
                href="/admin/places/new"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                + Add Place
              </a>
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
```

### Step 6: Update Admin Navigation
Update `/app/admin/layout.tsx` to add navigation:
```typescript
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function AdminNav() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/places', label: 'Places' },
    { href: '/admin/journeys', label: 'Journeys' },
    { href: '/admin/questions', label: 'Questions' },
    { href: '/admin/analytics', label: 'Analytics' },
    { href: '/admin/settings', label: 'Settings' },
  ];
  
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                  pathname === item.href
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
```

---

## 🧪 Testing Instructions

### Manual Testing:
1. Login to admin dashboard
2. Verify all 4 stat cards display data
3. Check recent activity feed updates
4. Test quick action buttons navigate correctly
5. Verify mobile responsive layout
6. Wait 30 seconds to see auto-refresh

### Test Checklist:
- [ ] Stats load without errors
- [ ] Activity feed shows recent items
- [ ] Quick actions navigate to correct pages
- [ ] Mobile layout works correctly
- [ ] Auto-refresh every 30 seconds
- [ ] Error state displays when API fails

---

## ✅ Definition of Done

- [ ] Dashboard displays all required stats
- [ ] Activity feed shows recent items
- [ ] Quick actions functional
- [ ] Mobile responsive
- [ ] Auto-refresh implemented
- [ ] Error handling in place
- [ ] Loading states shown
- [ ] Navigation added to admin layout

---

## 🚀 Next Story

Proceed to: **Story V2-P1-003:** Place Management CRUD

---

*Story Version: 1.0*
*Author: Scrum Master Agent*