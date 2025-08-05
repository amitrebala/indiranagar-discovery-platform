'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAmitFABState } from './hooks/useAmitFABState'
import { useAmitFABPosition } from './hooks/useAmitFABPosition'
import { useAmitFABAnimations } from './hooks/useAmitFABAnimations'
import { useAmitFABGestures } from './hooks/useAmitFABGestures'
import { AmitFABButton } from './AmitFABButton'
import { AmitFABMenu } from './AmitFABMenu'
import { AmitFABTooltip } from './AmitFABTooltip'
import { AmitFABCelebration } from './AmitFABCelebration'
import { useHapticFeedback, HapticPattern } from '@/hooks/useHapticFeedback'
import { FAB_STATES, MICRO_INTERACTIONS } from './utils/fabConfig'
import FloatingEmojis from '@/components/ui/FloatingEmojis'
import type { RadialMenuOption } from './utils/fabConfig'

interface AmitFABProps {
  onSearch?: () => void
  onFilter?: () => void
  onSuggest?: () => void
  onFavorites?: () => void
  onNearby?: () => void
  onPhotos?: () => void
  onSimilar?: () => void
}

export default function AmitFAB({
  onSearch,
  onFilter,
  onSuggest,
  onFavorites,
  onNearby,
  onPhotos,
  onSimilar
}: AmitFABProps) {
  const {
    isExpanded,
    currentState,
    showTooltip,
    tooltipContent,
    hasAmitVisited,
    pageContext,
    toggleExpanded,
    setState,
    handleOptionSelect,
    showTooltipMessage,
    discoverEasterEgg,
    preferences
  } = useAmitFABState()
  
  const { position, fabRef } = useAmitFABPosition()
  const { 
    controls,
    animateContainer,
    animateOptions,
    triggerCelebration,
    triggerDance,
    shouldReduceMotion
  } = useAmitFABAnimations()
  
  const { triggerHaptic } = useHapticFeedback()
  useAmitFABGestures(fabRef)
  
  // Local state
  const [clickCount, setClickCount] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isDancing, setIsDancing] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  const clickTimerRef = useRef<NodeJS.Timeout>()
  const longPressTimerRef = useRef<NodeJS.Timeout>()
  
  // Action handlers map - memoized to prevent recreating on every render
  const actionHandlers = React.useMemo<Record<string, () => void>>(() => ({
    'open-search': onSearch || (() => console.log('Search')),
    'toggle-filter': onFilter || (() => console.log('Filter')),
    'open-suggest': onSuggest || (() => console.log('Suggest')),
    'show-favorites': onFavorites || (() => console.log('Favorites')),
    'show-nearby': onNearby || (() => console.log('Nearby')),
    'view-photos': onPhotos || (() => console.log('Photos')),
    'show-similar': onSimilar || (() => console.log('Similar'))
  }), [onSearch, onFilter, onSuggest, onFavorites, onNearby, onPhotos, onSimilar])
  
  // Handle option click
  const handleOptionClick = useCallback((option: RadialMenuOption) => {
    if (preferences.hapticEnabled) {
      triggerHaptic(HapticPattern.LIGHT)
    }
    
    handleOptionSelect(option.id, option.action)
    
    const handler = actionHandlers[option.action]
    if (handler) {
      handler()
      setState('collapsed')
    }
  }, [handleOptionSelect, actionHandlers, setState, preferences.hapticEnabled, triggerHaptic])
  
  // Handle main button click
  const handleClick = useCallback(() => {
    if (preferences.hapticEnabled) {
      triggerHaptic(HapticPattern.LIGHT)
    }
    
    setClickCount(prev => prev + 1)
    
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current)
    }
    
    clickTimerRef.current = setTimeout(() => {
      setClickCount(0)
    }, 500)
    
    // Triple click easter egg
    if (clickCount === 2) {
      setIsDancing(true)
      discoverEasterEgg('triple-click-dance')
      showTooltipMessage(MICRO_INTERACTIONS.onboarding.discoverEasterEgg, 2000)
      if (preferences.hapticEnabled) {
        triggerHaptic(HapticPattern.IMPACT)
      }
      triggerDance()
      setTimeout(() => setIsDancing(false), 3000)
      return
    }
    
    // Normal click behavior
    if (hasAmitVisited && pageContext === 'place') {
      setShowCelebration(true)
      showTooltipMessage("Yes! Amit loves this place!", 3000)
      if (preferences.hapticEnabled) {
        triggerHaptic(HapticPattern.SUCCESS)
      }
      triggerCelebration()
    }
    
    toggleExpanded()
  }, [
    clickCount, 
    hasAmitVisited, 
    pageContext, 
    toggleExpanded, 
    triggerDance,
    triggerCelebration,
    discoverEasterEgg,
    showTooltipMessage,
    preferences.hapticEnabled,
    triggerHaptic
  ])
  
  // Handle long press
  const handleMouseDown = useCallback(() => {
    longPressTimerRef.current = setTimeout(() => {
      discoverEasterEgg('long-press-favorites')
      showTooltipMessage("Showing Amit's favorites!", 2000)
      if (preferences.hapticEnabled) {
        triggerHaptic(HapticPattern.IMPACT)
      }
      if (onFavorites) {
        onFavorites()
      }
    }, 1000)
  }, [discoverEasterEgg, showTooltipMessage, onFavorites, preferences.hapticEnabled, triggerHaptic])
  
  const handleMouseUp = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
    }
  }, [])
  
  // Update animations when state changes
  useEffect(() => {
    animateContainer()
    animateOptions(isExpanded)
  }, [currentState, isExpanded, animateContainer, animateOptions])
  
  // Cleanup timers
  useEffect(() => {
    return () => {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current)
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current)
    }
  }, [])
  
  const stateConfig = FAB_STATES[currentState]
  
  return (
    <>
      <motion.div
        ref={fabRef}
        className="fixed z-[9999] pointer-events-none"
        initial={{ x: 100, opacity: 0 }}
        animate={{ 
          x: 0, 
          opacity: 1,
          ...controls
        }}
        transition={{ 
          type: "spring", 
          damping: 20,
          duration: shouldReduceMotion ? 0 : undefined
        }}
        style={{
          bottom: position.bottom,
          right: position.right
        }}
      >
        <div className="relative pointer-events-auto">
          {/* Menu Options */}
          <AmitFABMenu
            isVisible={isExpanded}
            pageContext={pageContext}
            onOptionClick={handleOptionClick}
            containerSize={stateConfig.size}
          />
          
          {/* Main Button */}
          <AmitFABButton
            state={currentState}
            hasAmitVisited={hasAmitVisited}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            isDancing={isDancing}
          >
            <AnimatePresence mode="wait">
              {currentState === 'collapsed' ? (
                <motion.div
                  key="avatar"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="relative"
                  onHoverStart={() => {
                    setIsHovered(true)
                    if (preferences.hapticEnabled) {
                      triggerHaptic(HapticPattern.SELECTION)
                    }
                  }}
                  onHoverEnd={() => setIsHovered(false)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="/amit-avatar.svg" 
                    alt="Amit"
                    className="w-10 h-10 rounded-full border-2 border-white shadow-lg"
                  />
                  {hasAmitVisited && (
                    <motion.span 
                      className="absolute -top-1 -right-1 bg-white text-pink-500 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.div>
              ) : (
                <motion.span
                  key="expanded-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-medium px-4"
                >
                  Explore
                </motion.span>
              )}
            </AnimatePresence>
            
            {/* Floating emojis on hover */}
            {isHovered && currentState === 'collapsed' && (
              <FloatingEmojis 
                emojis={['🚶', '📸', '✨', '🗺️']}
                trigger={isHovered}
              />
            )}
          </AmitFABButton>
          
          {/* Tooltip */}
          <AmitFABTooltip
            content={tooltipContent}
            isVisible={showTooltip && currentState === 'collapsed'}
            position="top"
          />
        </div>
      </motion.div>
      
      {/* Celebration overlay */}
      <AmitFABCelebration
        trigger={showCelebration}
        onComplete={() => setShowCelebration(false)}
      />
    </>
  )
}