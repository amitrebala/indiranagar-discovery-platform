'use client'

import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { FAB_STATES } from './utils/fabConfig'
import type { FABState } from '@/stores/amitFABStore'

interface AmitFABButtonProps {
  state: FABState
  hasAmitVisited?: boolean
  onClick: () => void
  onMouseDown?: () => void
  onMouseUp?: () => void
  onTouchStart?: () => void
  onTouchEnd?: () => void
  isDancing?: boolean
  children: React.ReactNode
  className?: string
}

export const AmitFABButton = forwardRef<HTMLButtonElement, AmitFABButtonProps>(
  ({ 
    state, 
    hasAmitVisited, 
    onClick, 
    onMouseDown,
    onMouseUp,
    onTouchStart,
    onTouchEnd,
    isDancing,
    children,
    className 
  }, ref) => {
    const stateConfig = FAB_STATES[state]
    
    return (
      <motion.button
        ref={ref}
        className={cn(
          "relative bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-full shadow-lg transition-all duration-300",
          "focus:outline-none focus:ring-4 focus:ring-primary/50",
          "active:scale-95",
          hasAmitVisited && "from-[#f093fb] to-[#f5576c]",
          isDancing && "animate-pulse",
          className
        )}
        style={{
          width: stateConfig.size,
          height: stateConfig.size,
        }}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Amit's Journey Command Center"
        aria-expanded={state !== 'collapsed'}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {children}
        </div>
        
        {/* Glow effect for interacting state */}
        {state === 'interacting' && 'glow' in stateConfig && stateConfig.glow && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                '0 0 20px rgba(102, 126, 234, 0.5)',
                '0 0 40px rgba(102, 126, 234, 0.8)',
                '0 0 20px rgba(102, 126, 234, 0.5)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.button>
    )
  }
)

AmitFABButton.displayName = 'AmitFABButton'