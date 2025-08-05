'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface GradientMeshProps {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  weather?: 'sunny' | 'rainy' | 'cloudy'
}

export function GradientMesh({ timeOfDay, weather }: GradientMeshProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const gradientConfigs = {
    morning: {
      colors: ['#FF6B6B', '#FFE66D', '#FF8CC8'],
      positions: [[0.2, 0.3], [0.8, 0.2], [0.5, 0.8]]
    },
    afternoon: {
      colors: ['#4ECDC4', '#44A6C6', '#87E0E0'],
      positions: [[0.1, 0.4], [0.9, 0.6], [0.4, 0.1]]
    },
    evening: {
      colors: ['#9B59B6', '#FF6B6B', '#FFB347'],
      positions: [[0.3, 0.7], [0.7, 0.3], [0.5, 0.5]]
    },
    night: {
      colors: ['#2C3E50', '#34495E', '#1A252F'],
      positions: [[0.2, 0.2], [0.8, 0.8], [0.5, 0.5]]
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
      const config = gradientConfigs[timeOfDay]
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Create animated gradient meshes
      config.colors.forEach((color, index) => {
        const [baseX, baseY] = config.positions[index]
        
        // Add subtle animation
        const offsetX = Math.sin(time * 0.0005 + index) * 0.05
        const offsetY = Math.cos(time * 0.0005 + index) * 0.05
        
        const x = (baseX + offsetX) * canvas.width
        const y = (baseY + offsetY) * canvas.height
        
        // Create radial gradient
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, canvas.width * 0.6)
        gradient.addColorStop(0, color + '40') // 25% opacity
        gradient.addColorStop(0.5, color + '20') // 12.5% opacity
        gradient.addColorStop(1, color + '00') // 0% opacity
        
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })
      
      // Add weather effects
      if (weather === 'rainy') {
        ctx.fillStyle = 'rgba(100, 100, 120, 0.1)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      } else if (weather === 'cloudy') {
        ctx.fillStyle = 'rgba(200, 200, 200, 0.05)'
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
  }, [timeOfDay, weather])
  
  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ 
        filter: weather === 'rainy' ? 'blur(2px)' : 'none',
        pointerEvents: 'none'
      }}
    />
  )
}