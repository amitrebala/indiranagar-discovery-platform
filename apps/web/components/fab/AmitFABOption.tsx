'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { fabAnimationVariants, calculateOptionPosition } from './utils/fabAnimations'
import type { RadialMenuOption } from './utils/fabConfig'

interface AmitFABOptionProps {
  option: RadialMenuOption
  index: number
  isVisible: boolean
  onClick: () => void
  containerSize?: number
}

export const AmitFABOption = React.memo<AmitFABOptionProps>(({ 
  option, 
  index, 
  isVisible, 
  onClick
}) => {
  const Icon = option.icon
  const position = calculateOptionPosition(
    option.position.angle,
    option.position.distance
  )
  
  return (
    <motion.button
      className={cn(
        "absolute w-12 h-12 rounded-full shadow-lg",
        "bg-gradient-to-r text-white",
        "flex items-center justify-center",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
        "z-10",
        option.color
      )}
      style={{
        left: `calc(50% + ${position.x}px - 24px)`,
        top: `calc(50% - ${position.y}px - 24px)`,
      }}
      custom={index}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      whileHover="hover"
      whileTap="tap"
      variants={fabAnimationVariants.options}
      onClick={onClick}
      aria-label={option.label}
    >
      <Icon className="w-5 h-5" />
      
      {/* Tooltip */}
      <motion.span
        className="absolute bottom-full mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap pointer-events-none"
        initial={{ opacity: 0, y: 5 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {option.label}
      </motion.span>
    </motion.button>
  )
})

AmitFABOption.displayName = 'AmitFABOption'