import { useCallback, useRef } from 'react'
import { useAmitFABStore } from '@/stores/amitFABStore'
import { useAnimation } from 'framer-motion'
import { fabAnimationVariants } from '../utils/fabAnimations'

export function useAmitFABAnimations() {
  const { currentState, preferences } = useAmitFABStore()
  const controls = useAnimation()
  const optionControls = useAnimation()
  const celebrationControls = useAnimation()
  const danceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Check if animations should be reduced
  const shouldReduceMotion = preferences.reducedMotion || 
    (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  
  // Animate container based on state
  const animateContainer = useCallback(async () => {
    if (shouldReduceMotion) {
      await controls.start({ scale: 1 })
      return
    }
    
    await controls.start(fabAnimationVariants.container[currentState])
  }, [controls, currentState, shouldReduceMotion])
  
  // Animate options visibility
  const animateOptions = useCallback(async (show: boolean) => {
    if (shouldReduceMotion) {
      await optionControls.start({ opacity: show ? 1 : 0 })
      return
    }
    
    await optionControls.start(show ? 'visible' : 'hidden')
  }, [optionControls, shouldReduceMotion])
  
  // Trigger celebration animation
  const triggerCelebration = useCallback(async () => {
    if (shouldReduceMotion) return
    
    await celebrationControls.start(fabAnimationVariants.celebration.animate)
    celebrationControls.set(fabAnimationVariants.celebration.initial)
  }, [celebrationControls, shouldReduceMotion])
  
  // Trigger dance animation
  const triggerDance = useCallback(async (duration = 3000) => {
    if (shouldReduceMotion) return
    
    if (danceTimeoutRef.current) {
      clearTimeout(danceTimeoutRef.current)
    }
    
    await controls.start(fabAnimationVariants.dance.animate)
    
    danceTimeoutRef.current = setTimeout(() => {
      controls.start(fabAnimationVariants.container[currentState])
    }, duration)
  }, [controls, currentState, shouldReduceMotion])
  
  // Trigger pulse animation
  const triggerPulse = useCallback(async () => {
    if (shouldReduceMotion) return
    
    await controls.start(fabAnimationVariants.pulse.animate)
  }, [controls, shouldReduceMotion])
  
  // Trigger glow animation
  const triggerGlow = useCallback(async () => {
    if (shouldReduceMotion) return
    
    await controls.start(fabAnimationVariants.glow.animate)
  }, [controls, shouldReduceMotion])
  
  return {
    controls,
    optionControls,
    celebrationControls,
    animateContainer,
    animateOptions,
    triggerCelebration,
    triggerDance,
    triggerPulse,
    triggerGlow,
    shouldReduceMotion
  }
}