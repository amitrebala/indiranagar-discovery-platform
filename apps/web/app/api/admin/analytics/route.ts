import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyAdminAuth } from '@/lib/admin/auth'

export async function GET(request: NextRequest) {
  const isAdmin = await verifyAdminAuth(request)
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const range = searchParams.get('range') || '7days'

  const supabase = await createClient()

  // Calculate date range
  const endDate = new Date()
  const startDate = new Date()
  
  switch(range) {
    case 'today':
      startDate.setHours(0, 0, 0, 0)
      break
    case '7days':
      startDate.setDate(startDate.getDate() - 7)
      break
    case '30days':
      startDate.setDate(startDate.getDate() - 30)
      break
    case '90days':
      startDate.setDate(startDate.getDate() - 90)
      break
  }

  try {
    // Fetch overview stats
    const [places, comments, ratings, journeys] = await Promise.all([
      supabase.from('places').select('*', { count: 'exact' }),
      supabase.from('comments').select('*', { count: 'exact' }),
      supabase.from('ratings').select('rating'),
      supabase.from('journeys').select('*', { count: 'exact' })
    ])

    // Calculate average rating
    const avgRating = ratings.data?.length 
      ? ratings.data.reduce((sum, r) => sum + r.rating, 0) / ratings.data.length 
      : 0

    // Get popular places
    const { data: popularPlaces } = await supabase
      .from('places')
      .select('name, category, view_count')
      .order('view_count', { ascending: false })
      .limit(10)

    // Get category distribution
    const { data: categoryData } = await supabase
      .from('places')
      .select('category')

    const categoryDistribution = categoryData?.reduce((acc: any[], place) => {
      const existing = acc.find(c => c.category === place.category)
      if (existing) {
        existing.count++
      } else {
        acc.push({ category: place.category, count: 1 })
      }
      return acc
    }, []) || []

    // Mock daily stats (replace with actual analytics tracking)
    const dailyStats = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      dailyStats.push({
        date: date.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 1000) + 500,
        visitors: Math.floor(Math.random() * 500) + 200,
        comments: Math.floor(Math.random() * 50) + 10,
        ratings: Math.floor(Math.random() * 30) + 5
      })
    }

    const analyticsData = {
      overview: {
        totalViews: dailyStats.reduce((sum, d) => sum + d.views, 0),
        uniqueVisitors: dailyStats.reduce((sum, d) => sum + d.visitors, 0),
        totalComments: comments.count || 0,
        totalRatings: ratings.data?.length || 0,
        avgRating,
        totalPlaces: places.count || 0,
        totalJourneys: journeys.count || 0,
        totalEvents: 0
      },
      dailyStats,
      placePopularity: popularPlaces?.map(p => ({
        name: p.name,
        views: p.view_count || 0,
        ratings: Math.floor(Math.random() * 100) + 20,
        avgRating: Math.random() * 2 + 3
      })) || [],
      categoryDistribution,
      userEngagement: {
        returningVisitors: 65,
        newVisitors: 35,
        avgSessionDuration: 245,
        bounceRate: 32
      }
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}