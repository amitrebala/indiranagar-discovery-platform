/**
 * Design System Tokens
 * Central configuration for all design system values
 */

import { colors } from './colors'
import { typography } from './typography'
import { animations } from './animations'

export const designTokens = {
  colors,
  typography,
  animations,
  shadows: {
    // Glow effects
    glow: '0 0 20px rgba(255, 107, 107, 0.3)',
    glowStrong: '0 0 30px rgba(255, 107, 107, 0.5)',
    
    // Depth shadows
    subtle: '0 2px 4px rgba(0, 0, 0, 0.05)',
    depth: '0 10px 30px rgba(0, 0, 0, 0.1)',
    hover: '0 20px 40px rgba(0, 0, 0, 0.15)',
    
    // Elevation shadows
    sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 20px rgba(0, 0, 0, 0.1), 0 6px 6px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px rgba(0, 0, 0, 0.12)',
    '3xl': '0 35px 60px rgba(0, 0, 0, 0.15)',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
    '5xl': '8rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
  }
} as const

export type DesignTokens = typeof designTokens