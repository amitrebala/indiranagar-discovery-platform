'use client'

import { useState, useEffect } from 'react'

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night'

export function useTimeOfDay() {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('afternoon')
  const [greeting, setGreeting] = useState('')
  
  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours()
      
      if (hour >= 5 && hour < 12) {
        setTimeOfDay('morning')
        setGreeting('Good morning! Perfect time for filter coffee ☕')
      } else if (hour >= 12 && hour < 17) {
        setTimeOfDay('afternoon')
        setGreeting('Good afternoon! Beat the heat with some fresh juice 🥤')
      } else if (hour >= 17 && hour < 21) {
        setTimeOfDay('evening')
        setGreeting('Good evening! Time for some street food? 🍜')
      } else {
        setTimeOfDay('night')
        setGreeting('Good night! Looking for late-night options? 🌙')
      }
    }
    
    updateTimeOfDay()
    const interval = setInterval(updateTimeOfDay, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [])
  
  return { timeOfDay, greeting }
}