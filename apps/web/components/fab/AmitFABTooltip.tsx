'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fabAnimationVariants } from './utils/fabAnimations'

interface AmitFABTooltipProps {
  content: string
  isVisible: boolean
  position?: 'top' | 'left'
}

export const AmitFABTooltip: React.FC<AmitFABTooltipProps> = ({ 
  content, 
  isVisible,
  position = 'top' 
}) => {
  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2'
  }
  
  return (
    <AnimatePresence>
      {isVisible && content && (
        <motion.div
          className={`absolute ${positionClasses[position]} px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap pointer-events-none z-20`}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={fabAnimationVariants.tooltip}
        >
          {content}
          {/* Arrow */}
          <div 
            className={`absolute w-0 h-0 border-4 border-transparent ${
              position === 'top' 
                ? 'top-full left-1/2 -translate-x-1/2 border-t-gray-900' 
                : 'left-full top-1/2 -translate-y-1/2 border-l-gray-900'
            }`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}