/**
 * Design System Animations
 * Animation presets, durations, and easing functions
 */

export const animations = {
  // Duration presets
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '250ms',
    slow: '400ms',
    slower: '600ms',
    slowest: '800ms',
  },
  
  // Easing functions
  easing: {
    linear: 'linear',
    // Ease in
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeInQuad: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
    easeInCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    easeInQuart: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
    // Ease out
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeOutQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    easeOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    easeOutQuart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    // Ease in-out
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeInOutQuad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
    easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    easeInOutQuart: 'cubic-bezier(0.77, 0, 0.175, 1)',
    // Spring
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    springSmooth: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  // Spring configurations
  spring: {
    gentle: {
      stiffness: 100,
      damping: 15,
    },
    normal: {
      stiffness: 300,
      damping: 20,
    },
    bouncy: {
      stiffness: 400,
      damping: 10,
    },
    stiff: {
      stiffness: 500,
      damping: 30,
    },
  },
  
  // Animation variants (for Framer Motion)
  variants: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slideUp: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 30 },
    },
    slideDown: {
      initial: { opacity: 0, y: -30 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -30 },
    },
    slideLeft: {
      initial: { opacity: 0, x: 30 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 30 },
    },
    slideRight: {
      initial: { opacity: 0, x: -30 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -30 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
    },
    rotate: {
      initial: { opacity: 0, rotate: -180 },
      animate: { opacity: 1, rotate: 0 },
      exit: { opacity: 0, rotate: 180 },
    },
  },
  
  // Keyframe animations
  keyframes: {
    float: {
      '0%, 100%': { transform: 'translateY(-10px)' },
      '50%': { transform: 'translateY(10px)' },
    },
    glow: {
      '0%, 100%': { boxShadow: '0 0 20px rgba(255, 107, 107, 0.3)' },
      '50%': { boxShadow: '0 0 30px rgba(255, 107, 107, 0.5)' },
    },
    pulse: {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '0.5' },
    },
    shimmer: {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(100%)' },
    },
    bounce: {
      '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
      '40%, 43%': { transform: 'translate3d(0, -30px, 0)' },
      '70%': { transform: 'translate3d(0, -15px, 0)' },
      '90%': { transform: 'translate3d(0, -4px, 0)' },
    },
  },
} as const

export type Animations = typeof animations