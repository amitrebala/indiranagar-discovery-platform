import { Variants } from 'framer-motion'

export const fabAnimationVariants: Record<string, Variants> = {
  container: {
    collapsed: { 
      scale: 1,
      boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)'
    },
    expanded: { 
      scale: 1.1,
      boxShadow: '0 15px 50px rgba(102, 126, 234, 0.6), 0 0 0 8px rgba(102, 126, 234, 0.1)'
    },
    interacting: { 
      scale: 1.2,
      boxShadow: '0 20px 60px rgba(102, 126, 234, 0.8), 0 0 0 12px rgba(102, 126, 234, 0.15)'
    }
  },
  
  options: {
    hidden: { 
      scale: 0, 
      opacity: 0,
      transition: { duration: 0.2 }
    },
    visible: (custom: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: custom * 0.05,
        type: "spring",
        stiffness: 500,
        damping: 25
      }
    }),
    hover: {
      scale: 1.15,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95
    }
  },
  
  celebration: {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: [0, 1.5, 1],
      rotate: [0, 360],
      transition: { duration: 0.6 }
    }
  },
  
  tooltip: {
    hidden: { 
      opacity: 0, 
      y: 10,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    }
  },
  
  backdrop: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2 }
    }
  },
  
  dance: {
    animate: {
      rotate: [0, -10, 10, -10, 10, 0],
      scale: [1, 1.1, 1, 1.1, 1],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  },
  
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },
  
  glow: {
    animate: {
      boxShadow: [
        '0 0 20px rgba(102, 126, 234, 0.5)',
        '0 0 40px rgba(102, 126, 234, 0.8)',
        '0 0 20px rgba(102, 126, 234, 0.5)'
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }
}

export const calculateOptionPosition = (
  angle: number, 
  distance: number, 
  centerX: number = 0, 
  centerY: number = 0
) => {
  const radian = (angle * Math.PI) / 180
  const x = centerX + distance * Math.cos(radian)
  const y = centerY + distance * Math.sin(radian)
  return { x, y }
}

export const getStaggerDelay = (index: number, total: number, reverse = false) => {
  const baseDelay = 0.05
  return reverse ? (total - index - 1) * baseDelay : index * baseDelay
}

export const springConfig = {
  default: { stiffness: 500, damping: 30 },
  gentle: { stiffness: 200, damping: 20 },
  bouncy: { stiffness: 700, damping: 15 },
  stiff: { stiffness: 1000, damping: 50 }
}