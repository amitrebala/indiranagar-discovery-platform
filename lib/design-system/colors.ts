/**
 * Design System Color Palette
 * Comprehensive color system with gradients and semantic colors
 */

export const colors = {
  // Brand Colors
  brand: {
    primary: '#FF6B6B',    // Coral Red
    secondary: '#FF8E53',  // Orange
    accent: '#4ECDC4',     // Turquoise
  },
  
  // Gradient Definitions
  gradients: {
    hero: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
    card: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textAccent: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
    warm: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    cool: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    sunset: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    ocean: 'linear-gradient(135deg, #330867 0%, #30cfd0 100%)',
    forest: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  },
  
  // Semantic Colors
  semantic: {
    success: {
      light: '#d1f7c4',
      base: '#50e3c2',
      dark: '#2d9c7f',
    },
    warning: {
      light: '#fee4cb',
      base: '#fdac53',
      dark: '#f57c00',
    },
    error: {
      light: '#ffdce0',
      base: '#ff6b6b',
      dark: '#c44444',
    },
    info: {
      light: '#d1e7ff',
      base: '#3b82f6',
      dark: '#1d4ed8',
    },
  },
  
  // Neutral Colors
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
  
  // Enhanced Primary Scale
  primary: {
    50: '#FFF8F7',
    100: '#FEEAE8',
    200: '#FDD1CC',
    300: '#FCB8B0',
    400: '#FB9F94',
    500: '#FF6B6B',
    600: '#E84C4C',
    700: '#C13E3E',
    800: '#9A3131',
    900: '#732424',
  },
  
  // Enhanced Secondary Scale
  secondary: {
    50: '#FFF9F5',
    100: '#FEEEE2',
    200: '#FDD8BF',
    300: '#FCC29C',
    400: '#FBAC79',
    500: '#FF8E53',
    600: '#E87339',
    700: '#C15E2F',
    800: '#9A4A25',
    900: '#73361B',
  },
  
  // Enhanced Accent Scale
  accent: {
    50: '#F0FCFB',
    100: '#D8F7F5',
    200: '#B1EFEB',
    300: '#8AE7E1',
    400: '#63DFD7',
    500: '#4ECDC4',
    600: '#3BA69F',
    700: '#318882',
    800: '#276A65',
    900: '#1D4C48',
  },
} as const

export type Colors = typeof colors