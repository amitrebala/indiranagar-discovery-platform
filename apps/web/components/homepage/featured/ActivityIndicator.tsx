'use client'

import { motion } from 'framer-motion'
import { Users, TrendingUp, Clock } from 'lucide-react'

interface ActivityIndicatorProps {
  status?: 'quiet' | 'moderate' | 'busy'
  trending?: boolean
  waitTime?: number
}

export function ActivityIndicator({ status = 'moderate', trending = false, waitTime }: ActivityIndicatorProps) {
  const statusConfig = {
    quiet: {
      label: 'Quiet',
      color: 'bg-green-500',
      textColor: 'text-green-700',
      bgColor: 'bg-green-100',
      icon: Users,
      pulseColor: 'bg-green-400'
    },
    moderate: {
      label: 'Moderate',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-700',
      bgColor: 'bg-yellow-100',
      icon: Users,
      pulseColor: 'bg-yellow-400'
    },
    busy: {
      label: 'Busy',
      color: 'bg-red-500',
      textColor: 'text-red-700',
      bgColor: 'bg-red-100',
      icon: Users,
      pulseColor: 'bg-red-400'
    }
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className="flex flex-col gap-2">
      {/* Main Activity Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`
          inline-flex items-center gap-2 px-3 py-1.5 
          ${config.bgColor} backdrop-blur-sm rounded-full
          border border-white/50 shadow-sm
        `}
      >
        <div className="relative">
          <Icon className={`w-4 h-4 ${config.textColor}`} />
          {status === 'busy' && (
            <>
              <span className={`absolute inset-0 ${config.pulseColor} rounded-full animate-ping opacity-75`} />
              <span className={`absolute inset-0 ${config.color} rounded-full animate-pulse`} />
            </>
          )}
        </div>
        <span className={`text-xs font-medium ${config.textColor}`}>
          {config.label}
        </span>
      </motion.div>

      {/* Trending Badge */}
      {trending && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 backdrop-blur-sm rounded-full border border-white/50 shadow-sm"
        >
          <TrendingUp className="w-4 h-4 text-purple-700" />
          <span className="text-xs font-medium text-purple-700">Trending</span>
        </motion.div>
      )}

      {/* Wait Time Badge */}
      {waitTime !== undefined && waitTime > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 backdrop-blur-sm rounded-full border border-white/50 shadow-sm"
        >
          <Clock className="w-4 h-4 text-blue-700" />
          <span className="text-xs font-medium text-blue-700">
            ~{waitTime} min wait
          </span>
        </motion.div>
      )}
    </div>
  )
}