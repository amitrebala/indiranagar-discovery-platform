'use client'

import { motion } from 'framer-motion'

interface FloatingOrbsProps {
  className?: string
}

export function FloatingOrbs({ className = '' }: FloatingOrbsProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Large primary orb */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          x: ['-20%', '120%'],
          y: ['-10%', '110%'],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
      />
      
      {/* Medium secondary orb */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
          filter: 'blur(30px)',
          left: '60%',
          top: '20%',
        }}
        animate={{
          x: ['0%', '-120%'],
          y: ['0%', '60%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
      />
      
      {/* Small accent orbs */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[200px] h-[200px] rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(${100 + i * 50}, ${150 - i * 30}, 246, 0.3) 0%, transparent 70%)`,
            filter: 'blur(25px)',
            left: `${20 + i * 25}%`,
            top: `${30 + i * 20}%`,
          }}
          animate={{
            x: [`0%`, `${(i % 2 === 0 ? 100 : -100) - i * 20}%`],
            y: [`0%`, `${(i % 2 === 0 ? -50 : 50) + i * 15}%`],
          }}
          transition={{
            duration: 15 + i * 5,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: i * 2
          }}
        />
      ))}
      
      {/* Additional floating elements for depth */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)',
          filter: 'blur(35px)',
          right: '10%',
          bottom: '10%',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      
      {/* Micro orbs for subtle detail */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`micro-${i}`}
          className="absolute w-[80px] h-[80px] rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(${200 - i * 20}, ${100 + i * 20}, ${200 + i * 10}, 0.4) 0%, transparent 60%)`,
            filter: 'blur(20px)',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 200 - 100],
            y: [0, Math.random() * 200 - 100],
            scale: [1, Math.random() * 0.5 + 0.75, 1],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  )
}