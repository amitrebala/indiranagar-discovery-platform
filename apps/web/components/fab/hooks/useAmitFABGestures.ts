import { useRef, useCallback, useEffect } from 'react'
import { useAmitFABStore } from '@/stores/amitFABStore'
import { MOBILE_ENHANCEMENTS } from '../utils/fabConfig'

interface GestureState {
  startX: number
  startY: number
  startTime: number
  lastX: number
  lastY: number
  velocityX: number
  velocityY: number
}

export function useAmitFABGestures(elementRef: React.RefObject<HTMLElement>) {
  const { setState, preferences } = useAmitFABStore()
  const gestureState = useRef<GestureState | null>(null)
  const animationFrame = useRef<number>()
  
  // Detect swipe direction
  const detectSwipe = useCallback((deltaX: number, deltaY: number, duration: number) => {
    const minSwipeDistance = 50
    const maxSwipeTime = 300
    
    if (duration > maxSwipeTime) return null
    
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)
    
    if (absX > absY && absX > minSwipeDistance) {
      return deltaX > 0 ? 'right' : 'left'
    } else if (absY > minSwipeDistance) {
      return deltaY > 0 ? 'down' : 'up'
    }
    
    return null
  }, [])
  
  // Handle touch start
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!preferences.hapticEnabled) return
    
    const touch = e.touches[0]
    gestureState.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      lastX: touch.clientX,
      lastY: touch.clientY,
      velocityX: 0,
      velocityY: 0
    }
  }, [preferences.hapticEnabled])
  
  // Handle touch move
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!gestureState.current) return
    
    const touch = e.touches[0]
    const state = gestureState.current
    
    // Calculate velocity
    state.velocityX = touch.clientX - state.lastX
    state.velocityY = touch.clientY - state.lastY
    
    // Update last position
    state.lastX = touch.clientX
    state.lastY = touch.clientY
    
    // Prevent default scrolling if moving horizontally
    if (Math.abs(state.velocityX) > Math.abs(state.velocityY)) {
      e.preventDefault()
    }
  }, [])
  
  // Handle touch end
  const handleTouchEnd = useCallback(() => {
    if (!gestureState.current) return
    
    const state = gestureState.current
    const duration = Date.now() - state.startTime
    const deltaX = state.lastX - state.startX
    const deltaY = state.lastY - state.startY
    
    // Detect swipe
    const swipeDirection = detectSwipe(deltaX, deltaY, duration)
    
    if (swipeDirection) {
      const gestureMap = MOBILE_ENHANCEMENTS.gestures
      
      switch (swipeDirection) {
        case 'up':
          if (gestureMap.swipeUp === 'quick-search') {
            // This will be handled by the parent component
            setState('expanded')
          }
          break
        case 'down':
          if (gestureMap.swipeDown === 'collapse') {
            setState('collapsed')
          }
          break
        default:
          break
      }
    }
    
    // Reset gesture state
    gestureState.current = null
  }, [detectSwipe, setState])
  
  // Handle pinch gesture
  const handlePinch = useCallback((e: TouchEvent) => {
    if (e.touches.length !== 2) return
    
    const touch1 = e.touches[0]
    const touch2 = e.touches[1]
    
    const distance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    )
    
    // Detect pinch out (expand)
    if (distance > 100) {
      setState('expanded')
    }
  }, [setState])
  
  // Set up event listeners
  useEffect(() => {
    const element = elementRef.current
    if (!element) return
    
    // Touch events
    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })
    
    // Multi-touch for pinch
    element.addEventListener('touchstart', handlePinch, { passive: true })
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
      element.removeEventListener('touchstart', handlePinch)
      
      const frameRef = animationFrame.current
      if (frameRef) {
        cancelAnimationFrame(frameRef)
      }
    }
  }, [elementRef, handleTouchStart, handleTouchMove, handleTouchEnd, handlePinch])
  
  return {
    isGesturing: !!gestureState.current
  }
}