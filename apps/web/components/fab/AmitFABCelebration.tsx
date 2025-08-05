'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AmitFABCelebrationProps {
  trigger: boolean
  onComplete?: () => void
}

export const AmitFABCelebration: React.FC<AmitFABCelebrationProps> = ({ 
  trigger, 
  onComplete 
}) => {
  useEffect(() => {
    if (trigger) {
      // Dynamically import confetti to reduce bundle size
      import('canvas-confetti').then((confettiModule) => {
        const confetti = confettiModule.default
        
        // Trigger confetti
        const count = 200
        const defaults = {
          origin: { y: 0.7 },
          zIndex: 9999
        }
        
        function fire(particleRatio: number, opts: confettiModule.Options) {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio)
          })
        }
        
        fire(0.25, {
          spread: 26,
          startVelocity: 55,
        })
        
        fire(0.2, {
          spread: 60,
        })
        
        fire(0.35, {
          spread: 100,
          decay: 0.91,
          scalar: 0.8
        })
        
        fire(0.1, {
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
          scalar: 1.2
        })
        
        fire(0.1, {
          spread: 120,
          startVelocity: 45,
        })
      })
      
      // Call onComplete after animation
      if (onComplete) {
        setTimeout(onComplete, 2000)
      }
    }
  }, [trigger, onComplete])
  
  return (
    <AnimatePresence>
      {trigger && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-[9998]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: [0, 1.5, 1],
              rotate: [0, 360],
            }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl">🎉</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}