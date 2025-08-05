'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

interface LiveActivityData {
  openPlaces: number
  recentActivity: Array<{
    id: string
    type: 'visit' | 'photo' | 'review'
    place: string
    timestamp: string
  }>
  trending: string
}

export function useLiveActivity() {
  const [data, setData] = useState<LiveActivityData>({
    openPlaces: 0,
    recentActivity: [],
    trending: ''
  })
  
  useEffect(() => {
    // Calculate open places based on current time
    const calculateOpenPlaces = async () => {
      const now = new Date()
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
      
      try {
        const { data: places, error } = await supabase
          .from('places')
          .select('id, name, opening_hours')
          .neq('opening_hours', null)
        
        if (error) {
          console.error('Error fetching places:', error)
          return
        }
        
        if (places) {
          // For now, simulate open count based on time of day
          // In a real implementation, you'd parse the opening_hours JSON
          const hour = now.getHours()
          let openCount = 0
          
          if (hour >= 6 && hour < 10) {
            openCount = Math.floor(places.length * 0.3) // 30% open in early morning
          } else if (hour >= 10 && hour < 22) {
            openCount = Math.floor(places.length * 0.8) // 80% open during day
          } else {
            openCount = Math.floor(places.length * 0.1) // 10% open late night
          }
          
          // Simulate trending place
          const trendingPlaces = [
            'Third Wave Coffee',
            'Toit Brewpub',
            'Corner House Ice Cream',
            'Glen\'s Bakehouse',
            'Hole in the Wall Cafe'
          ]
          const trending = trendingPlaces[Math.floor(Math.random() * trendingPlaces.length)]
          
          setData(prev => ({ 
            ...prev, 
            openPlaces: openCount,
            trending
          }))
        }
      } catch (err) {
        console.error('Error in calculateOpenPlaces:', err)
      }
    }
    
    calculateOpenPlaces()
    const interval = setInterval(calculateOpenPlaces, 300000) // Update every 5 minutes
    
    return () => clearInterval(interval)
  }, [])
  
  return data
}