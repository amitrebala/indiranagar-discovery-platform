/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Enhanced animations with design system
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        bounce: 'bounce 1s infinite',
        pulse: 'pulse 2s infinite',
      },
      // Enhanced keyframes
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(-10px)' },
          '50%': { transform: 'translateY(10px)' }
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 107, 107, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(255, 107, 107, 0.5)' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        bounce: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
          '40%, 43%': { transform: 'translate3d(0, -30px, 0)' },
          '70%': { transform: 'translate3d(0, -15px, 0)' },
          '90%': { transform: 'translate3d(0, -4px, 0)' }
        }
      },
      // Enhanced colors with brand gradients
      colors: {
        // Enhanced primary colors
        primary: {
          50: '#FFF8F7',         
          100: '#FEEAE8',        
          200: '#FDD1CC',
          300: '#FB9B91',
          400: '#F86B6B',
          500: '#FF6B6B',        // Main brand color
          600: '#A91E1A',        
          700: '#8B1A17',        
          800: '#6D1513',        
          900: '#992626'
        },
        secondary: {
          50: '#F5F7F2',         
          100: '#E8F0E1',        
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ECDC4',        // Accent color
          500: '#22D3EE',
          600: '#1F3A0E',        
          700: '#1A3009',        
          800: '#152407',        
          900: '#164E63'
        },
        accent: {
          50: '#FFFCF0',         
          100: '#FEF7D6',        
          200: '#FEEBC8',
          300: '#FED7AA',
          400: '#FF8E53',        // Hero gradient end
          500: '#F59E0B',
          600: '#B8820A',        
          700: '#9B6F08',        
          800: '#7E5C06',        
          900: '#78350F'
        },
        success: {
          50: '#F0FDF4',         
          100: '#DCFCE7',        
          500: '#22C55E',
          600: '#166534',        
          700: '#15803D',        
          800: '#14532D',        
        },
        warning: {
          50: '#FFFBEB',         
          100: '#FEF3C7',        
          500: '#F59E0B',
          600: '#B45309',        
          700: '#92400E',        
          800: '#78350F',        
        },
        error: {
          50: '#FEF2F2',         
          100: '#FEE2E2',        
          500: '#EF4444',
          600: '#B91C1C',        
          700: '#991B1B',        
          800: '#7F1D1D',        
        },
        neutral: {
          50: '#FAFAF9',         
          100: '#F5F5F4',        
          200: '#E7E5E4',        
          300: '#D6D3D1',        
          400: '#A8A29E',        
          500: '#78716C',        
          600: '#57534E',        
          700: '#44403C',        
          800: '#292524',        
          900: '#1C1917',        
          950: '#0C0A09'
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      // Gradient backgrounds
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
        'gradient-card': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-text': 'linear-gradient(90deg, #FF6B6B 0%, #4ECDC4 100%)',
        'gradient-subtle': 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'gradient-warm': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'gradient-cool': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
        'gradient-ocean': 'linear-gradient(135deg, #667db6 0%, #0052d4 100%)',
        'gradient-forest': 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)',
      },
      // Enhanced shadows
      boxShadow: {
        'glow': '0 0 20px rgba(255, 107, 107, 0.3)',
        'depth': '0 10px 30px rgba(0, 0, 0, 0.1)',
        'hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.35)',
      },
      // Typography enhancements
      fontFamily: {
        'display': ['var(--font-inter)', 'Cal Sans', 'system-ui', 'sans-serif'],
        'body': ['var(--font-inter)', 'system-ui', 'sans-serif'],
        'accent': ['var(--font-space-grotesk)', 'monospace'],
        'mono': ['var(--font-geist-mono)', 'JetBrains Mono', 'Fira Code', 'monospace']
      },
      fontSize: {
        'hero': 'clamp(2.5rem, 5vw, 4rem)',
        'h1': 'clamp(2rem, 4vw, 3rem)',
        'h2': 'clamp(1.5rem, 3vw, 2rem)',
        'h3': 'clamp(1.25rem, 2.5vw, 1.5rem)',
      },
      // Additional design system utilities
      zIndex: {
        'hide': -1,
        'auto': 'auto',
        'base': 0,
        'docked': 10,
        'dropdown': 1000,
        'sticky': 1100,
        'banner': 1200,
        'overlay': 1300,
        'modal': 1400,
        'popover': 1500,
        'skipLink': 1600,
        'toast': 1700,
        'tooltip': 1800
      }
    },
  },
  plugins: [],
}