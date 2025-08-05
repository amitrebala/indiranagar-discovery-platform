import { useEffect, useState, useRef, useCallback } from 'react'
import { useAmitFABStore } from '@/stores/amitFABStore'
import { SMART_POSITIONING } from '../utils/fabConfig'

interface ViewportSize {
  width: number
  height: number
}

export function useAmitFABPosition() {
  const { position, updatePosition } = useAmitFABStore()
  const [viewport, setViewport] = useState<ViewportSize>({ width: 0, height: 0 })
  const [adjustedPosition, setAdjustedPosition] = useState(position)
  const fabRef = useRef<HTMLDivElement>(null)
  
  // Get responsive position based on viewport
  const getResponsivePosition = useCallback(() => {
    if (viewport.width < 640) {
      return SMART_POSITIONING.responsive.mobile
    } else if (viewport.width < 1024) {
      return SMART_POSITIONING.responsive.tablet
    }
    return SMART_POSITIONING.responsive.desktop
  }, [viewport.width])
  
  // Check for overlapping content
  const checkOverlap = useCallback(() => {
    if (!fabRef.current || !SMART_POSITIONING.contentAware.detectOverlap) return false
    
    const fabRect = fabRef.current.getBoundingClientRect()
    const elements = document.elementsFromPoint(
      fabRect.left + fabRect.width / 2,
      fabRect.top + fabRect.height / 2
    )
    
    // Check if FAB overlaps with important content
    return elements.some(el => 
      el.classList.contains('important-content') ||
      el.tagName === 'BUTTON' ||
      el.tagName === 'A' ||
      el.tagName === 'INPUT'
    )
  }, [])
  
  // Adjust position to avoid overlap
  const adjustForOverlap = useCallback(() => {
    if (!checkOverlap()) return
    
    const currentPos = getResponsivePosition()
    const adjustment = SMART_POSITIONING.contentAware.adjustmentStrategy
    
    if (adjustment === 'slide-up') {
      setAdjustedPosition({
        bottom: currentPos.bottom + 80,
        right: currentPos.right
      })
    } else if (adjustment === 'slide-left') {
      setAdjustedPosition({
        bottom: currentPos.bottom,
        right: currentPos.right + 80
      })
    }
  }, [checkOverlap, getResponsivePosition])
  
  // Handle viewport resize
  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // Update position based on viewport and overlap
  useEffect(() => {
    const basePos = getResponsivePosition()
    setAdjustedPosition(basePos)
    
    // Check for overlap after a delay to ensure DOM is ready
    const timer = setTimeout(() => {
      adjustForOverlap()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [viewport, getResponsivePosition, adjustForOverlap])
  
  // Handle temporary repositioning (e.g., drag gesture)
  const temporaryReposition = useCallback((deltaX: number, deltaY: number) => {
    const newPosition = {
      x: position.x + deltaX,
      y: position.y + deltaY
    }
    updatePosition(newPosition)
    
    // Reset position after delay
    setTimeout(() => {
      updatePosition(SMART_POSITIONING.base)
    }, 3000)
  }, [position, updatePosition])
  
  return {
    position: adjustedPosition,
    fabRef,
    viewport,
    temporaryReposition,
    isAdjusted: adjustedPosition !== getResponsivePosition()
  }
}