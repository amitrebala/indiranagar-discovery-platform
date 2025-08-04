'use client'

import React, { useEffect, useRef, useCallback } from 'react'

interface FocusManagerProps {
  children: React.ReactNode
  /** Whether the focus trap is active */
  isActive: boolean
  /** Initial element to focus when trap becomes active */
  initialFocus?: React.RefObject<HTMLElement>
  /** Element to return focus to when trap becomes inactive */
  returnFocus?: React.RefObject<HTMLElement>
  /** Called when escape key is pressed */
  onEscape?: () => void
  /** Whether to restore focus when trap becomes inactive */
  restoreFocus?: boolean
  /** Additional class names */
  className?: string
}

/**
 * FocusManager component provides focus trapping functionality for dialogs, modals, and other interactive elements.
 * Ensures WCAG compliance by managing focus flow and keyboard navigation.
 */
export function FocusManager({
  children,
  isActive,
  initialFocus,
  returnFocus,
  onEscape,
  restoreFocus = true,
  className = ''
}: FocusManagerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Get all focusable elements within the container
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return []

    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
      'summary'
    ].join(', ')

    return Array.from(containerRef.current.querySelectorAll(focusableSelectors))
      .filter((element) => {
        // Check if element is visible and not hidden
        const htmlElement = element as HTMLElement
        const style = window.getComputedStyle(element)
        return (
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          style.opacity !== '0' &&
          htmlElement.offsetWidth > 0 &&
          htmlElement.offsetHeight > 0
        )
      }) as HTMLElement[]
  }, [])

  // Handle tab key navigation within focus trap
  const handleTabKey = useCallback((event: KeyboardEvent) => {
    if (!isActive || event.key !== 'Tab') return

    const focusableElements = getFocusableElements()
    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    const currentElement = document.activeElement as HTMLElement

    if (event.shiftKey) {
      // Shift + Tab: moving backward
      if (currentElement === firstElement || !focusableElements.includes(currentElement)) {
        event.preventDefault()
        lastElement.focus()
      }
    } else {
      // Tab: moving forward
      if (currentElement === lastElement || !focusableElements.includes(currentElement)) {
        event.preventDefault()
        firstElement.focus()
      }
    }
  }, [isActive, getFocusableElements])

  // Handle escape key
  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (!isActive || event.key !== 'Escape') return
    
    event.preventDefault()
    onEscape?.()
  }, [isActive, onEscape])

  // Set up focus trap when active
  useEffect(() => {
    if (!isActive) return

    // Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement

    // Focus initial element or first focusable element
    const focusTarget = initialFocus?.current || getFocusableElements()[0]
    if (focusTarget) {
      // Small delay to ensure element is rendered and focusable
      setTimeout(() => {
        focusTarget.focus()
      }, 0)
    }

    // Add event listeners
    document.addEventListener('keydown', handleTabKey, true)
    document.addEventListener('keydown', handleEscapeKey, true)

    return () => {
      document.removeEventListener('keydown', handleTabKey, true)
      document.removeEventListener('keydown', handleEscapeKey, true)
    }
  }, [isActive, initialFocus, getFocusableElements, handleTabKey, handleEscapeKey])

  // Restore focus when trap becomes inactive
  useEffect(() => {
    if (isActive) return

    if (restoreFocus && previousActiveElement.current) {
      const elementToFocus = returnFocus?.current || previousActiveElement.current
      
      // Small delay to ensure the element is still in the DOM
      setTimeout(() => {
        if (elementToFocus && document.contains(elementToFocus)) {
          elementToFocus.focus()
        }
      }, 0)
    }

    // Clear the reference
    previousActiveElement.current = null
  }, [isActive, returnFocus, restoreFocus])

  // Prevent focus from leaving the container when active
  useEffect(() => {
    if (!isActive) return

    const handleFocusOut = (event: FocusEvent) => {
      const focusableElements = getFocusableElements()
      if (focusableElements.length === 0) return

      const target = event.target as HTMLElement
      if (!containerRef.current?.contains(target)) {
        // Focus has moved outside the container, bring it back
        event.preventDefault()
        focusableElements[0].focus()
      }
    }

    document.addEventListener('focusout', handleFocusOut, true)
    return () => {
      document.removeEventListener('focusout', handleFocusOut, true)
    }
  }, [isActive, getFocusableElements])

  return (
    <div
      ref={containerRef}
      className={className}
      role={isActive ? 'dialog' : undefined}
      aria-modal={isActive ? 'true' : undefined}
    >
      {children}
    </div>
  )
}

// Hook for easier focus management
export function useFocusManager() {
  const initialFocusRef = useRef<HTMLElement>(null)
  const returnFocusRef = useRef<HTMLElement>(null)

  const setInitialFocus = useCallback((element: HTMLElement | null) => {
    if (element) {
      initialFocusRef.current = element
    }
  }, [])

  const setReturnFocus = useCallback((element: HTMLElement | null) => {
    if (element) {
      returnFocusRef.current = element
    }
  }, [])

  return {
    initialFocusRef,
    returnFocusRef,
    setInitialFocus,
    setReturnFocus
  }
}

export default FocusManager