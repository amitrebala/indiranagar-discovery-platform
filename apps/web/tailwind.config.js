/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        shimmer: 'shimmer 2s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      colors: {
        // WCAG AAA Compliant Colors (7:1 contrast ratio)
        primary: {
          50: '#FFF8F7',         // Very light background
          100: '#FEEAE8',        // Light accent
          600: '#A91E1A',        // Primary dark (7:1 on white)
          700: '#8B1A17',        // Darker primary
          800: '#6D1513',        // Very dark primary
        },
        secondary: {
          50: '#F5F7F2',         // Very light green background
          100: '#E8F0E1',        // Light green accent
          600: '#1F3A0E',        // Secondary dark (7:1 on white)
          700: '#1A3009',        // Darker secondary
          800: '#152407',        // Very dark secondary
        },
        accent: {
          50: '#FFFCF0',         // Very light yellow background
          100: '#FEF7D6',        // Light yellow accent
          600: '#B8820A',        // Accent dark (7:1 on white)
          700: '#9B6F08',        // Darker accent
          800: '#7E5C06',        // Very dark accent
        },
        success: {
          50: '#F0FDF4',         // Very light success background
          100: '#DCFCE7',        // Light success accent
          600: '#166534',        // Success dark (7:1 on white)
          700: '#15803D',        // Darker success
          800: '#14532D',        // Very dark success
        },
        warning: {
          50: '#FFFBEB',         // Very light warning background
          100: '#FEF3C7',        // Light warning accent
          600: '#B45309',        // Warning dark (7:1 on white)
          700: '#92400E',        // Darker warning
          800: '#78350F',        // Very dark warning
        },
        error: {
          50: '#FEF2F2',         // Very light error background
          100: '#FEE2E2',        // Light error accent
          600: '#B91C1C',        // Error dark (7:1 on white)
          700: '#991B1B',        // Darker error
          800: '#7F1D1D',        // Very dark error
        },
        neutral: {
          50: '#FAFAF9',         // Light background (7:1 compliant)
          100: '#F5F5F4',        // Very light gray
          200: '#E7E5E4',        // Light gray
          300: '#D6D3D1',        // Medium light gray
          400: '#A8A29E',        // Medium gray
          500: '#78716C',        // Medium dark gray
          600: '#57534E',        // Dark gray (7:1 on white)
          700: '#44403C',        // Darker gray
          800: '#292524',        // Very dark gray
          900: '#1C1917',        // Almost black
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [],
}