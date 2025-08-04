'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Sparkles, X } from 'lucide-react'
import Link from 'next/link'
import { useUserProgressStore } from '@/stores/userProgressStore'
import { cn } from '@/lib/utils'

export function StickyCTABar() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const { getCompletionPercentage } = useUserProgressStore()
  
  const completionPercentage = getCompletionPercentage()
  
  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 50% of the page
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      setIsVisible(scrollPercentage > 50 && !isDismissed)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isDismissed])
  
  const handleDismiss = () => {
    setIsDismissed(true)
    setIsVisible(false)
  }
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Progress Indicator */}
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {completionPercentage}% Explored
                  </span>
                </div>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-600"
                  />
                </div>
              </div>
              
              {/* CTA Text */}
              <div className="flex-1 text-center">
                <p className="text-sm md:text-base font-medium text-gray-900">
                  Ready to explore Indiranagar like a local?
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex items-center gap-3">
                <Link
                  href="/map"
                  className={cn(
                    'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
                    'bg-orange-500 text-white hover:bg-orange-600',
                    'shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                  )}
                >
                  <MapPin size={18} />
                  <span className="hidden sm:inline">Start Exploring</span>
                  <span className="sm:hidden">Explore</span>
                </Link>
                
                <button
                  onClick={handleDismiss}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Dismiss"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}