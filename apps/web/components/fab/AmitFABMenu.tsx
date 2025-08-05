'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AmitFABOption } from './AmitFABOption'
import { fabOptions, contextualOptions } from './utils/fabConfig'
import { fabAnimationVariants } from './utils/fabAnimations'
import type { RadialMenuOption } from './utils/fabConfig'

interface AmitFABMenuProps {
  isVisible: boolean
  pageContext: string
  onOptionClick: (option: RadialMenuOption) => void
  containerSize: number
}

export const AmitFABMenu: React.FC<AmitFABMenuProps> = ({ 
  isVisible, 
  pageContext, 
  onOptionClick,
  containerSize 
}) => {
  // Get options based on page context
  const options = contextualOptions[pageContext] || fabOptions
  
  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-0"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fabAnimationVariants.backdrop}
            style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
          />
        )}
      </AnimatePresence>
      
      {/* Options */}
      <div className="absolute inset-0 pointer-events-none">
        {options.map((option, index) => (
          <AmitFABOption
            key={option.id}
            option={option}
            index={index}
            isVisible={isVisible}
            onClick={() => onOptionClick(option)}
            containerSize={containerSize}
          />
        ))}
      </div>
    </>
  )
}