'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { MapPin, Users, MessageSquare, Star, Calendar, TrendingUp } from 'lucide-react'

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPlaces: 0,
    totalComments: 0,
    totalRatings: 0,
    avgRating: 0,
    totalSuggestions: 0,
    pendingSuggestions: 0
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    fetchDashboardData()
    
    // Set up real-time subscriptions
    const channel = supabase
      .channel('admin-dashboard')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'comments' },
        () => fetchDashboardData()
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'ratings' },
        () => fetchDashboardData()
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'community_suggestions' },
        () => fetchDashboardData()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchDashboardData = async () => {
    // Fetch all stats in parallel
    const [places, comments, ratings, suggestions] = await Promise.all([
      supabase.from('places').select('*', { count: 'exact' }),
      supabase.from('comments').select('*', { count: 'exact' }),
      supabase.from('ratings').select('rating'),
      supabase.from('community_suggestions').select('*')
    ])

    // Calculate stats
    const avgRating = ratings.data?.length 
      ? ratings.data.reduce((sum, r) => sum + r.rating, 0) / ratings.data.length 
      : 0

    const pendingSuggestions = suggestions.data?.filter(s => s.status === 'pending').length || 0

    setStats({
      totalPlaces: places.count || 0,
      totalComments: comments.count || 0,
      totalRatings: ratings.data?.length || 0,
      avgRating,
      totalSuggestions: suggestions.data?.length || 0,
      pendingSuggestions
    })

    // Fetch recent activity
    const { data: recentComments } = await supabase
      .from('comments')
      .select('*, places(name)')
      .order('created_at', { ascending: false })
      .limit(5)

    const { data: recentRatings } = await supabase
      .from('ratings')
      .select('*, places(name)')
      .order('created_at', { ascending: false })
      .limit(5)

    // Combine and sort activity
    const activity = [
      ...(recentComments || []).map(c => ({
        type: 'comment',
        message: `New comment on ${c.places?.name}`,
        time: c.created_at,
        icon: MessageSquare
      })),
      ...(recentRatings || []).map(r => ({
        type: 'rating',
        message: `New ${r.rating}⭐ rating on ${r.places?.name}`,
        time: r.created_at,
        icon: Star
      }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10)

    setRecentActivity(activity)
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Places</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPlaces}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalComments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgRating.toFixed(1)} ⭐</div>
            <p className="text-xs text-muted-foreground">{stats.totalRatings} total ratings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Community Suggestions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSuggestions}</div>
            {stats.pendingSuggestions > 0 && (
              <p className="text-xs text-orange-600">{stats.pendingSuggestions} pending review</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="flex items-center gap-4">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm">{item.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.time).toLocaleString()}
                    </p>
                  </div>
                </div>
              )
            })}
            {recentActivity.length === 0 && (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}