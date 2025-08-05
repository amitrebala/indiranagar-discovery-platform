'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface GradientMeshProps {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  weather?: 'sunny' | 'rainy' | 'cloudy'
  enableParallax?: boolean
}

export function GradientMesh({ timeOfDay, weather, enableParallax = false }: GradientMeshProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scrollY, setScrollY] = useState(0)
  
  const enhancedGradients = {
    morning: {
      colors: [
        '#FF6B9D',  // Vivid pink
        '#FFC75F',  // Golden yellow
        '#C34A36',  // Coral red
        '#845EC2'   // Soft purple accent
      ],
      positions: [[0.1, 0.2], [0.7, 0.1], [0.9, 0.6], [0.3, 0.8]],
      intensity: 0.7,
      blendMode: 'screen' as GlobalCompositeOperation
    },
    afternoon: {
      colors: [
        '#00D2FF',  // Bright cyan
        '#3A86FF',  // Electric blue
        '#8338EC',  // Purple
        '#06FFB4'   // Mint green accent
      ],
      positions: [[0.2, 0.3], [0.8, 0.4], [0.5, 0.7], [0.1, 0.9]],
      intensity: 0.6,
      blendMode: 'multiply' as GlobalCompositeOperation
    },
    evening: {
      colors: [
        '#F72585',  // Magenta
        '#7209B7',  // Deep purple
        '#560BAD',  // Royal purple
        '#B5179E',  // Fuchsia
        '#F72585'   // Pink gradient
      ],
      positions: [[0.3, 0.2], [0.7, 0.5], [0.2, 0.7], [0.8, 0.8], [0.5, 0.4]],
      intensity: 0.8,
      blendMode: 'overlay' as GlobalCompositeOperation
    },
    night: {
      colors: [
        '#03045E',  // Deep navy
        '#0077B6',  // Ocean blue
        '#00B4D8',  // Light blue
        '#90E0EF',  // Pale cyan accent
        '#023E8A'   // Royal blue
      ],
      positions: [[0.1, 0.1], [0.9, 0.2], [0.3, 0.6], [0.7, 0.9], [0.5, 0.5]],
      intensity: 0.5,
      blendMode: 'source-over' as GlobalCompositeOperation
    }
  }
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size
    const setSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setSize()
    window.addEventListener('resize', setSize)
    
    // Animation variables
    let animationId: number
    let time = 0
    
    const animate = () => {
      const config = enhancedGradients[timeOfDay]
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Set blend mode for the entire layer
      ctx.globalCompositeOperation = config.blendMode
      
      // Create animated gradient meshes with enhanced multi-layer approach
      config.colors.forEach((color, index) => {
        const [baseX, baseY] = config.positions[index]
        
        // Add more dynamic animation with varying speeds
        const offsetX = Math.sin(time * 0.0003 + index * 0.5) * 0.08
        const offsetY = Math.cos(time * 0.0004 + index * 0.3) * 0.06
        
        const x = (baseX + offsetX) * canvas.width
        const y = (baseY + offsetY) * canvas.height
        
        // Create larger, more vibrant radial gradients
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, canvas.width * 0.8)
        
        // Apply intensity-based opacity
        const baseOpacity = config.intensity
        gradient.addColorStop(0, color + Math.floor(baseOpacity * 255).toString(16).padStart(2, '0'))
        gradient.addColorStop(0.4, color + Math.floor(baseOpacity * 0.6 * 255).toString(16).padStart(2, '0'))
        gradient.addColorStop(0.7, color + Math.floor(baseOpacity * 0.3 * 255).toString(16).padStart(2, '0'))
        gradient.addColorStop(1, color + '00')
        
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })
      
      // Reset blend mode for weather effects
      ctx.globalCompositeOperation = 'source-over'
      
      // Enhanced weather effects with subtle animations
      if (weather === 'rainy') {
        const rainOpacity = 0.15 + Math.sin(time * 0.002) * 0.05
        ctx.fillStyle = `rgba(100, 100, 120, ${rainOpacity})`
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      } else if (weather === 'cloudy') {
        const cloudOpacity = 0.08 + Math.sin(time * 0.001) * 0.03
        ctx.fillStyle = `rgba(200, 200, 200, ${cloudOpacity})`
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      
      time++
      animationId = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      window.removeEventListener('resize', setSize)
      cancelAnimationFrame(animationId)
    }
  }, [timeOfDay, weather, enhancedGradients])
  
  // Parallax scrolling effect
  useEffect(() => {
    if (!enableParallax) return
    
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [enableParallax])
  
  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full gradient-layer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ 
        filter: weather === 'rainy' ? 'blur(2px)' : 'none',
        pointerEvents: 'none',
        transform: enableParallax ? `translateY(${scrollY * 0.5}px)` : 'none',
        willChange: enableParallax ? 'transform' : 'auto'
      }}
    />
  )
}