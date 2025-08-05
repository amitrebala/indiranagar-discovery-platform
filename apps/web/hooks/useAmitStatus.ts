'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

interface Place {
  id: string
  name: string
  image?: string
}

interface AmitStatus {
  location: 'Exploring' | 'Writing' | 'Available'
  responseTime: '< 2 hours' | '< 24 hours'
}

interface TodaysPick {
  place: Place
  reason: string
  alternativeIfClosed?: Place
}

interface WeeklyInsight {
  trend: string
  newDiscovery: Place
  crowdAlert?: string
}

interface AmitDashboardData {
  status: AmitStatus
  todaysPick?: TodaysPick
  weeklyInsight?: WeeklyInsight
}

export function useAmitStatus() {
  const [data, setData] = useState<AmitDashboardData>({
    status: {
      location: 'Available',
      responseTime: '< 2 hours'
    }
  })
  
  useEffect(() => {
    const fetchAmitData = async () => {
      try {
        // Fetch a random place for today's pick
        const { data: places, error } = await supabase
          .from('places')
          .select('id, name, image')
          .limit(5)
        
        if (error) {
          console.error('Error fetching places:', error)
          return
        }
        
        if (places && places.length > 0) {
          // Simulate Amit's status based on time
          const hour = new Date().getHours()
          let location: AmitStatus['location'] = 'Available'
          
          if (hour >= 9 && hour < 12) {
            location = 'Writing'
          } else if (hour >= 14 && hour < 18) {
            location = 'Exploring'
          }
          
          // Pick a random place for today
          const todaysPlace = places[Math.floor(Math.random() * places.length)]
          const alternativePlace = places.find(p => p.id !== todaysPlace.id) || todaysPlace
          
          // Simulate weekly trends
          const trends = [
            'Matcha is having a moment - 3 new places serving it!',
            'Weekend brunch spots are getting creative with fusion dishes',
            'Craft cocktail bars are experimenting with local ingredients',
            'New bakeries are bringing European techniques to Indiranagar'
          ]
          
          const newDiscoveries = [
            'The Daily Sip',
            'Levitate Brewery',
            'The Fatty Bao',
            'Communiti'
          ]
          
          const crowdAlerts = [
            '100 Ft Road unusually busy today - festival nearby',
            'CMH Road construction causing delays',
            '12th Main packed - weekend market happening',
            null // Sometimes no alert
          ]
          
          setData({
            status: {
              location,
              responseTime: location === 'Available' ? '< 2 hours' : '< 24 hours'
            },
            todaysPick: {
              place: todaysPlace,
              reason: getReasonForPick(todaysPlace.name),
              alternativeIfClosed: alternativePlace
            },
            weeklyInsight: {
              trend: trends[Math.floor(Math.random() * trends.length)],
              newDiscovery: {
                id: 'new-' + Date.now(),
                name: newDiscoveries[Math.floor(Math.random() * newDiscoveries.length)]
              },
              crowdAlert: crowdAlerts[Math.floor(Math.random() * crowdAlerts.length)] || undefined
            }
          })
        }
      } catch (err) {
        console.error('Error in fetchAmitData:', err)
      }
    }
    
    fetchAmitData()
    // Update every hour
    const interval = setInterval(fetchAmitData, 3600000)
    
    return () => clearInterval(interval)
  }, [])
  
  return data
}

function getReasonForPick(placeName: string): string {
  const reasons: Record<string, string> = {
    'Third Wave Coffee': 'Their new seasonal blend is exceptional',
    'Toit Brewpub': 'Perfect weather for their rooftop seating',
    'Corner House Ice Cream': 'They just brought back Death by Chocolate!',
    'Glen\'s Bakehouse': 'Fresh croissants arrive at 3 PM sharp',
    'Hole in the Wall Cafe': 'Quiet corners perfect for afternoon reading'
  }
  
  return reasons[placeName] || 'A hidden gem worth discovering today'
}