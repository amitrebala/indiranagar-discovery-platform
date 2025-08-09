'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useWeather } from '@/hooks/useWeather'
import { useTimeOfDay } from '@/hooks/useTimeOfDay'
import { useLiveActivity } from '@/hooks/useLiveActivity'
import { GradientMesh } from '@/components/ui/GradientMesh'
import { FloatingOrbs } from '@/components/ui/FloatingOrbs'
import { WeatherWidget } from '@/components/weather/WeatherWidget'
import { LiveActivity } from '@/components/ui/LiveActivity'

export function DynamicHeroSection() {
  const router = useRouter()
  const { weather, isLoading: weatherLoading } = useWeather()
  const { timeOfDay, greeting } = useTimeOfDay()
  const liveData = useLiveActivity()
  
  // Map weather conditions to supported ones
  const mappedWeather = weather?.condition === 'partly-cloudy' ? 'cloudy' : weather?.condition
  
  // Magnetic button effect handler
  const magneticButton = {
    onMouseMove: (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      
      e.currentTarget.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`
    },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.transform = 'translate(0, 0)'
    }
  }
  
  return (
    <section className="relative min-h-[100vh] overflow-hidden">
      {/* Multi-layer gradient background */}
      <GradientMesh timeOfDay={timeOfDay} weather={mappedWeather} enableParallax />
      
      {/* Floating orbs layer */}
      <FloatingOrbs />
      
      {/* Noise texture overlay */}
      <div className="noise-overlay" />
      
      {/* Subtle contrast overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/40 z-[5]" />
      
      {/* Enhanced Content Layout */}
      <div className="relative z-10 container mx-auto px-4 py-24">
        <div className="max-w-7xl mx-auto">
          {/* Main content grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-center min-h-[60vh]">
            
            {/* Left side - Main content */}
            <motion.div 
              className="lg:col-span-7"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Enhanced title with multi-layer gradient */}
              <h1 className="text-[clamp(3.5rem,9vw,7rem)] font-black leading-[0.85] mb-6">
                <span className="relative inline-block">
                  <span className="bg-gradient-to-br from-white via-white to-white/80 bg-clip-text text-transparent">
                    Indiranagar
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent opacity-60 blur-sm">
                    Indiranagar
                  </span>
                </span>
                <br />
                <span className="bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
                  Discovery
                </span>
              </h1>
              
              {/* Enhanced subtitle with glass effect */}
              <div className="relative mb-10">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-2xl" />
                <div className="relative p-6">
                  <p className="text-2xl text-white/90 font-medium">
                    {greeting}
                    <span className="block text-lg text-white/70 mt-2">
                      Your personalized guide to Bangalore&apos;s most vibrant neighborhood
                    </span>
                  </p>
                </div>
              </div>
              
              {/* CTA Buttons with glassmorphism */}
              <div className="flex flex-wrap gap-4">
                <button 
                  className="group relative px-8 py-4 rounded-2xl overflow-hidden transition-all duration-300"
                  onClick={() => router.push('/map')}
                  {...magneticButton}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
                  <span className="relative text-white font-semibold text-lg">Start Exploring</span>
                </button>
                
                <button 
                  className="relative px-8 py-4 rounded-2xl border-2 border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300"
                  onClick={() => router.push('/places')}
                  {...magneticButton}
                >
                  <span className="text-white font-semibold text-lg">View Places</span>
                </button>
                
                <button 
                  className="relative px-8 py-4 rounded-2xl border-2 border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300"
                  onClick={() => router.push('/search')}
                  {...magneticButton}
                >
                  <span className="text-white font-semibold text-lg">🔍 Search</span>
                </button>
              </div>
            </motion.div>
            
            {/* Right side - Widgets */}
            <motion.div 
              className="lg:col-span-5 space-y-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Weather Widget with enhanced glass effect */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl" />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                <div className="relative p-6">
                  <WeatherWidget weather={weather} loading={weatherLoading} />
                </div>
              </div>
              
              {/* Live Activity with enhanced glass effect */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                <div className="relative p-6">
                  <LiveActivity data={liveData} />
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Bottom stats bar with glass effect */}
          <motion.div 
            className="mt-16 relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl rounded-3xl" />
            <div className="relative flex flex-wrap justify-around p-8">
              {[
                { value: liveData.openPlaces, label: 'Places Open Now', icon: '📍' },
                { value: '166', label: 'Curated Experiences', icon: '✨' },
                { value: '5+', label: 'Years Local Expertise', icon: '🏆' },
                { value: '24/7', label: 'Live Updates', icon: '🔴' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center px-6 py-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold text-white mb-1" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/70" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}