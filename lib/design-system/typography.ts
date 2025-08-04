/**
 * Design System Typography
 * Font families, sizes, weights, and line heights
 */

export const typography = {
  // Font Families
  fontFamily: {
    display: ['Inter', '-apple-system', 'system-ui', 'sans-serif'],
    body: ['Inter', '-apple-system', 'system-ui', 'sans-serif'],
    accent: ['Space Grotesk', 'Inter', 'sans-serif'],
    mono: ['Geist Mono', 'SF Mono', 'Consolas', 'monospace'],
  },
  
  // Font Sizes - using clamp for responsive sizing
  fontSize: {
    // Hero sizes
    hero: 'clamp(2.5rem, 5vw + 1rem, 4rem)',
    h1: 'clamp(2rem, 4vw + 0.5rem, 3rem)',
    h2: 'clamp(1.5rem, 3vw + 0.5rem, 2rem)',
    h3: 'clamp(1.25rem, 2vw + 0.5rem, 1.5rem)',
    
    // Body sizes
    xl: 'clamp(1.125rem, 1.5vw + 0.5rem, 1.25rem)',
    lg: '1.125rem',
    base: '1rem',
    sm: '0.875rem',
    xs: '0.75rem',
  },
  
  // Font Weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  // Line Heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  
  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  
  // Text Styles (composite styles)
  textStyles: {
    hero: {
      fontSize: 'clamp(2.5rem, 5vw + 1rem, 4rem)',
      fontWeight: '700',
      lineHeight: '1.1',
      letterSpacing: '-0.025em',
    },
    h1: {
      fontSize: 'clamp(2rem, 4vw + 0.5rem, 3rem)',
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: 'clamp(1.5rem, 3vw + 0.5rem, 2rem)',
      fontWeight: '600',
      lineHeight: '1.3',
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: 'clamp(1.25rem, 2vw + 0.5rem, 1.5rem)',
      fontWeight: '600',
      lineHeight: '1.4',
      letterSpacing: '0',
    },
    body: {
      fontSize: '1rem',
      fontWeight: '400',
      lineHeight: '1.625',
      letterSpacing: '0',
    },
    bodySmall: {
      fontSize: '0.875rem',
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0.025em',
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: '500',
      lineHeight: '1.5',
      letterSpacing: '0.025em',
    },
  },
} as const

export type Typography = typeof typography