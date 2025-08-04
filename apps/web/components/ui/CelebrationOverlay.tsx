'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'

interface CelebrationOverlayProps {
  onComplete: () => void
}

export default function CelebrationOverlay({ onComplete }: CelebrationOverlayProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000)
    return () => clearTimeout(timer)
  }, [onComplete])

  const confettiColors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#ffd700']
  
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[10000]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Centered celebration message */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ 
          scale: [0, 1.5, 1],
          rotate: [0, 360, 360],
        }}
        transition={{
          duration: 0.8,
          ease: [0.68, -0.55, 0.265, 1.55],
        }}
      >
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full shadow-2xl">
          <h2 className="text-2xl font-bold">Amit was here! 🎉</h2>
        </div>
      </motion.div>

      {/* Confetti particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: confettiColors[i % confettiColors.length],
            left: '50%',
            top: '50%',
          }}
          initial={{
            x: 0,
            y: 0,
            scale: 0,
          }}
          animate={{
            x: (Math.random() - 0.5) * window.innerWidth,
            y: (Math.random() - 0.5) * window.innerHeight,
            scale: [0, 1, 0],
            rotate: Math.random() * 720,
          }}
          transition={{
            duration: 2,
            delay: i * 0.02,
            ease: 'easeOut',
          }}
        />
      ))}
    </motion.div>
  )
}