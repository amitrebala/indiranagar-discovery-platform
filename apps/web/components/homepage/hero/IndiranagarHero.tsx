'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function IndiranagarHero() {
  const router = useRouter()
  const [timeOfDay, setTimeOfDay] = useState('day')
  const [rickshawFare, setRickshawFare] = useState(30)
  
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 6) setTimeOfDay('late-night')
    else if (hour < 11) setTimeOfDay('morning')
    else if (hour < 16) setTimeOfDay('afternoon')
    else if (hour < 20) setTimeOfDay('evening')
    else setTimeOfDay('night')
    
    // Rickshaw fare changes with time (night charges!)
    setRickshawFare(hour >= 22 || hour < 6 ? 45 : 30)
    
    // Random small fare changes
    const interval = setInterval(() => {
      setRickshawFare(prev => prev + Math.floor(Math.random() * 3) - 1)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <section className={`chaos-container chaos-spacing time-${timeOfDay}`}>
      {/* Tree shadow overlay */}
      <div className="tree-shadow-overlay" />
      
      {/* The hero content */}
      <div className="chaos-grid street-depth">
        
        {/* Main Title - Mixed Typography */}
        <motion.div 
          className="col-span-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="hero-indiranagar">
            <span className="word-break">Indi</span>
            <span className="word-break">rana</span>
            <span className="word-break">gar</span>
          </h1>
          
          {/* Subtitle with hand-written feel */}
          <p className="text-hand text-2xl mt-4 ml-8">
            with Amit
            <span className="text-govt ml-4 text-sm">
              EST. 2024
            </span>
          </p>
        </motion.div>
        
        {/* The Stats Cards - All Different */}
        <motion.div 
          className="overlap-card"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="new-sticker">HOT</span>
          <h3 className="text-heritage text-xl mb-2">Places Visited</h3>
          <p className="text-startup text-4xl font-bold">186</p>
          <p className="text-hand text-sm mt-1">and counting...</p>
        </motion.div>
        
        <motion.div 
          className="overlap-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="price-tag">{rickshawFare}</span>
          <h3 className="text-trendy text-lg mb-2">From Metro</h3>
          <p className="distance-auto" data-fare={rickshawFare}>
            0.8 km
          </p>
          <p className="text-govt text-xs mt-2">
            METER DOWN
          </p>
        </motion.div>
        
        <motion.div 
          className="overlap-card texture-wall"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-heritage text-xl mb-2">Open Now</h3>
          <p className="text-startup text-3xl font-bold">
            <span className="meter-counter">
              <span className="digit">4</span>
              <span className="digit">2</span>
            </span>
          </p>
          <p className="time-ish text-sm mt-1 text-hand">
            Closes at 11pm
          </p>
        </motion.div>
        
        {/* The CTA Section - Deliberately Misaligned */}
        <motion.div 
          className="col-span-full chaos-spacing mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-wrap gap-4 items-center">
            {/* Primary CTA - Auto rickshaw inspired */}
            <button
              onClick={() => router.push('/map')}
              className="relative px-8 py-4 bg-auto-yellow text-tempo-black font-bold text-lg transform rotate-1 hover:rotate-0 transition-transform"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 100%, 10px 100%)'
              }}
            >
              START EXPLORING
              <span className="text-xs block text-govt">
                METER DOWN
              </span>
            </button>
            
            {/* Secondary CTA - Cafe menu style */}
            <button
              onClick={() => router.push('/places')}
              className="text-heritage text-lg underline decoration-wavy underline-offset-4 hover:text-craft-beer transition-colors transform -rotate-1"
            >
              Browse All Places →
            </button>
            
            {/* Tertiary - Hand written note */}
            <span className="text-hand text-filter-coffee ml-4">
              or just wander...
            </span>
          </div>
        </motion.div>
        
        {/* Random floating elements */}
        <motion.div
          className="absolute top-20 right-10 text-hand text-sm text-filter-coffee transform rotate-12"
          animate={{ 
            y: [0, -10, 0],
            rotate: [12, 15, 12]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          Since 1975 ↗
        </motion.div>
        
        <motion.div
          className="absolute bottom-20 left-20 text-govt text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1 }}
        >
          BDA APPROVED
        </motion.div>
        
        {/* Time-based message */}
        <motion.div
          className="absolute top-40 left-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-sm">
            {timeOfDay === 'morning' && (
              <span className="text-heritage">Morning walkers at Ulsoor Lake →</span>
            )}
            {timeOfDay === 'afternoon' && (
              <span className="text-hand text-filter-coffee">Lunch crowd at CTR 🍛</span>
            )}
            {timeOfDay === 'evening' && (
              <span className="text-startup">Happy hours starting soon! 🍺</span>
            )}
            {timeOfDay === 'night' && (
              <span className="text-trendy text-craft-beer">Toit is buzzing tonight 🍻</span>
            )}
            {timeOfDay === 'late-night' && (
              <span className="text-hand">Late night biryani? 🌙</span>
            )}
          </p>
        </motion.div>
      </div>
    </section>
  )
}