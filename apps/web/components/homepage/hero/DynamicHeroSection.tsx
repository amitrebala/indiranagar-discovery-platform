'use client'

import { motion } from 'framer-motion'
import { useWeather } from '@/hooks/useWeather'
import { useTimeOfDay } from '@/hooks/useTimeOfDay'
import { useLiveActivity } from '@/hooks/useLiveActivity'
import { GradientMesh } from '@/components/ui/GradientMesh'
import { WeatherWidget } from '@/components/weather/WeatherWidget'
import { LiveActivity } from '@/components/ui/LiveActivity'

export function DynamicHeroSection() {
  const { weather, isLoading: weatherLoading } = useWeather()
  const { timeOfDay, greeting } = useTimeOfDay()
  const liveData = useLiveActivity()
  
  return (
    <section className="relative min-h-[80vh] overflow-hidden">
      {/* Animated gradient background */}
      <GradientMesh timeOfDay={timeOfDay} weather={weather?.condition} />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Main title with gradient text */}
          <h1 className="text-[clamp(3rem,8vw,6rem)] font-extrabold leading-[0.9] mb-6">
            <span className="bg-gradient-aurora bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
              Indiranagar Discovery
            </span>
          </h1>
          
          {/* Dynamic greeting */}
          <motion.p 
            className="text-2xl text-white/90 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {greeting}
          </motion.p>
          
          {/* Live data widgets */}
          <motion.div 
            className="grid md:grid-cols-2 gap-6 max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <WeatherWidget weather={weather} loading={weatherLoading} />
            <LiveActivity data={liveData} />
          </motion.div>
          
          {/* Dynamic stats */}
          <motion.div
            className="mt-12 flex flex-wrap gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="text-white/80">
              <span className="text-3xl font-bold text-white">{liveData.openPlaces}</span>
              <p className="text-sm">places to explore right now</p>
            </div>
            <div className="text-white/80">
              <span className="text-3xl font-bold text-white">166</span>
              <p className="text-sm">curated experiences</p>
            </div>
            <div className="text-white/80">
              <span className="text-3xl font-bold text-white">5+</span>
              <p className="text-sm">years of local expertise</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}