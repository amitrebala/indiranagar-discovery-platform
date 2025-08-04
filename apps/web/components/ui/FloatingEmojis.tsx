'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FloatingEmojisProps {
  emojis: string[]
  trigger: boolean
}

interface FloatingEmoji {
  id: string
  emoji: string
  x: number
  y: number
}

export default function FloatingEmojis({ emojis, trigger }: FloatingEmojisProps) {
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([])

  useEffect(() => {
    if (trigger) {
      const newEmojis = emojis.map((emoji, index) => ({
        id: `${Date.now()}-${index}`,
        emoji,
        x: Math.random() * 60 - 30,
        y: Math.random() * 60 - 30,
      }))
      setFloatingEmojis(newEmojis)

      const timer = setTimeout(() => {
        setFloatingEmojis([])
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [trigger, emojis])

  return (
    <AnimatePresence>
      {floatingEmojis.map((item) => (
        <motion.div
          key={item.id}
          className="absolute pointer-events-none text-xl"
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0.8],
            x: item.x,
            y: item.y - 40,
          }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{
            duration: 1.5,
            ease: 'easeOut',
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </AnimatePresence>
  )
}