'use client'

import React, { forwardRef, useState, useRef, useEffect } from 'react'
import { useHapticFeedback, HapticPattern } from '@/hooks/useHapticFeedback'

interface TouchFeedbackProps {
  children: React.ReactNode
  className?: string
  hapticPattern?: HapticPattern
  feedbackType?: 'scale' | 'brightness' | 'ripple' | 'glow' | 'lift'
  disabled?: boolean
  onTouch?: () => void
  intensity?: 'subtle' | 'medium' | 'strong'
}

// Touch feedback wrapper that adds visual and haptic feedback
export const TouchFeedback = forwardRef<HTMLDivElement, TouchFeedbackProps>(
  (
    {
      children,
      className = '',
      hapticPattern = HapticPattern.LIGHT,
      feedbackType = 'scale',
      disabled = false,
      onTouch,
      intensity = 'medium'
    },
    ref
  ) => {
    const [isTouched, setIsTouched] = useState(false)
    const { triggerHaptic } = useHapticFeedback({ respectReducedMotion: true })

    const handleTouchStart = () => {
      if (disabled) return
      
      setIsTouched(true)
      triggerHaptic(hapticPattern)
      onTouch?.()
    }

    const handleTouchEnd = () => {
      setIsTouched(false)
    }

    // Feedback intensity styles
    const intensityStyles = {
      subtle: {
        scale: 'active:scale-98',
        brightness: 'active:brightness-95',
        lift: 'active:translate-y-px'
      },
      medium: {
        scale: 'active:scale-95',
        brightness: 'active:brightness-90',
        lift: 'active:translate-y-0.5'
      },
      strong: {
        scale: 'active:scale-90',
        brightness: 'active:brightness-75',
        lift: 'active:translate-y-1'
      }
    }

    // Feedback type styles
    const getFeedbackStyles = () => {
      const baseStyles = 'transition-all duration-150 ease-out'
      
      switch (feedbackType) {
        case 'scale':
          return `${baseStyles} ${intensityStyles[intensity].scale} motion-reduce:transform-none`
        case 'brightness':
          return `${baseStyles} ${intensityStyles[intensity].brightness}`
        case 'lift':
          return `${baseStyles} ${intensityStyles[intensity].lift} motion-reduce:transform-none`
        case 'glow':
          return `${baseStyles} ${isTouched ? 'shadow-lg ring-2 ring-primary-300 ring-opacity-50' : ''}`
        case 'ripple':
          return `${baseStyles} relative overflow-hidden`
        default:
          return baseStyles
      }
    }

    return (
      <div
        ref={ref}
        className={`${getFeedbackStyles()} ${disabled ? 'pointer-events-none opacity-50' : ''} ${className}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        {children}
        
        {/* Ripple effect */}
        {feedbackType === 'ripple' && isTouched && (
          <div className="absolute inset-0 bg-white/20 rounded-inherit animate-ping" />
        )}
      </div>
    )
  }
)

TouchFeedback.displayName = 'TouchFeedback'

// Specialized touch feedback components
interface TouchableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hapticFeedback?: boolean
  intensity?: 'subtle' | 'medium' | 'strong'
}

export const TouchableCard = forwardRef<HTMLDivElement, TouchableCardProps>(
  ({ children, hapticFeedback = true, intensity = 'subtle', className = '', ...props }, ref) => (
    <TouchFeedback
      ref={ref}
      feedbackType="lift"
      intensity={intensity}
      hapticPattern={hapticFeedback ? HapticPattern.SELECTION : undefined}
      className={`cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </TouchFeedback>
  )
)

TouchableCard.displayName = 'TouchableCard'

// Interactive list item with touch feedback
interface TouchableListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  children: React.ReactNode
  onSelect?: () => void
  selected?: boolean
  hapticFeedback?: boolean
}

export const TouchableListItem = forwardRef<HTMLLIElement, TouchableListItemProps>(
  ({ children, onSelect, selected = false, hapticFeedback = true, className = '', ...props }, ref) => {
    const { triggerHaptic } = useHapticFeedback()

    const handleClick = () => {
      if (hapticFeedback) {
        triggerHaptic(HapticPattern.SELECTION)
      }
      onSelect?.()
    }

    return (
      <li
        ref={ref}
        className={`
          cursor-pointer transition-all duration-150 ease-out
          hover:bg-neutral-50 active:bg-neutral-100
          ${selected ? 'bg-primary-50 border-l-4 border-primary-600' : ''}
          ${className}
        `}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
          }
        }}
        {...props}
      >
        {children}
      </li>
    )
  }
)

TouchableListItem.displayName = 'TouchableListItem'

// High-performance touch feedback hook for custom components
export function useTouchFeedback({
  hapticPattern = HapticPattern.LIGHT,
  feedbackType = 'scale',
  intensity = 'medium',
  disabled = false
}: {
  hapticPattern?: HapticPattern
  feedbackType?: 'scale' | 'brightness' | 'lift'
  intensity?: 'subtle' | 'medium' | 'strong'
  disabled?: boolean
} = {}) {
  const [isTouched, setIsTouched] = useState(false)
  const { triggerHaptic } = useHapticFeedback()
  const touchTimeoutRef = useRef<NodeJS.Timeout>()

  const startTouch = () => {
    if (disabled) return
    
    setIsTouched(true)
    triggerHaptic(hapticPattern)
    
    // Clear any existing timeout
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current)
    }
  }

  const endTouch = () => {
    // Add a small delay to prevent flickering
    touchTimeoutRef.current = setTimeout(() => {
      setIsTouched(false)
    }, 50)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current)
      }
    }
  }, [])

  // Generate appropriate CSS classes based on feedback type and intensity
  const getTouchStyles = () => {
    if (disabled) return 'opacity-50 pointer-events-none'
    
    const baseStyles = 'transition-all duration-150 ease-out cursor-pointer select-none'
    
    const intensityMap = {
      subtle: { scale: 'scale-98', lift: 'translate-y-0.5', brightness: 'brightness-95' },
      medium: { scale: 'scale-95', lift: 'translate-y-1', brightness: 'brightness-90' },
      strong: { scale: 'scale-90', lift: 'translate-y-1.5', brightness: 'brightness-75' }
    }
    
    const activeStyle = isTouched ? intensityMap[intensity][feedbackType] : ''
    
    return `${baseStyles} ${activeStyle} motion-reduce:transform-none`
  }

  const touchHandlers = {
    onTouchStart: startTouch,
    onTouchEnd: endTouch,
    onMouseDown: startTouch,
    onMouseUp: endTouch,
    onMouseLeave: endTouch
  }

  return {
    isTouched,
    touchStyles: getTouchStyles(),
    touchHandlers,
    startTouch,
    endTouch
  }
}

// Context for global touch feedback settings
import { createContext, useContext } from 'react'

interface TouchFeedbackContextValue {
  globalIntensity: 'subtle' | 'medium' | 'strong'
  setGlobalIntensity: (intensity: 'subtle' | 'medium' | 'strong') => void
  enableVisualFeedback: boolean
  setEnableVisualFeedback: (enabled: boolean) => void
}

const TouchFeedbackContext = createContext<TouchFeedbackContextValue | null>(null)

interface TouchFeedbackProviderProps {
  children: React.ReactNode
  defaultIntensity?: 'subtle' | 'medium' | 'strong'
  defaultVisualFeedback?: boolean
}

export function TouchFeedbackProvider({ 
  children, 
  defaultIntensity = 'medium',
  defaultVisualFeedback = true 
}: TouchFeedbackProviderProps) {
  const [globalIntensity, setGlobalIntensity] = useState(defaultIntensity)
  const [enableVisualFeedback, setEnableVisualFeedback] = useState(defaultVisualFeedback)

  const contextValue: TouchFeedbackContextValue = {
    globalIntensity,
    setGlobalIntensity,
    enableVisualFeedback,
    setEnableVisualFeedback
  }

  return (
    <TouchFeedbackContext.Provider value={contextValue}>
      {children}
    </TouchFeedbackContext.Provider>
  )
}

export function useTouchFeedbackContext(): TouchFeedbackContextValue {
  const context = useContext(TouchFeedbackContext)
  if (!context) {
    throw new Error('useTouchFeedbackContext must be used within a TouchFeedbackProvider')
  }
  return context
}

// Accessibility-aware touch feedback (respects user preferences)
export function useAccessibleTouchFeedback(options: Parameters<typeof useTouchFeedback>[0] = {}) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(mediaQuery.matches)

      const handleChange = (event: MediaQueryListEvent) => {
        setPrefersReducedMotion(event.matches)
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // Reduce feedback intensity if user prefers reduced motion
  const adjustedOptions = {
    ...options,
    intensity: prefersReducedMotion ? 'subtle' : (options.intensity || 'medium'),
    feedbackType: prefersReducedMotion ? 'brightness' : (options.feedbackType || 'scale')
  } as const

  return useTouchFeedback(adjustedOptions)
}