/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#B85450',     // Warm terracotta
        secondary: '#2D5016',   // Deep green  
        accent: '#F4D03F',      // Bright yellow
        success: '#27AE60',     // Positive feedback
        warning: '#F39C12',     // Weather cautions
        error: '#E74C3C',       // Errors
        neutral: {
          50: '#F8F6F0',        // Light background
          600: '#5D5D5D'        // Secondary text
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [],
}