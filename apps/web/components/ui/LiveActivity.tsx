'use client'

import { motion } from 'framer-motion'
import { Users, Coffee, TrendingUp } from 'lucide-react'

interface LiveActivityProps {
  data: {
    openPlaces: number
    recentActivity: Array<{
      id: string
      type: 'visit' | 'photo' | 'review'
      place: string
      timestamp: string
    }>
    trending?: string
  }
}

export function LiveActivity({ data }: LiveActivityProps) {
  const isLive = true // In real implementation, this would check connection status
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500' : 'bg-gray-400'} animate-pulse`} />
        <span className="text-sm font-medium text-white/80">
          {isLive ? 'Live' : 'Updating...'}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-white">
            <Coffee size={20} />
            <span className="text-2xl font-bold">{data.openPlaces || 0}</span>
          </div>
          <p className="text-sm text-white/60">Places open now</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-white">
            <Users size={20} />
            <span className="text-2xl font-bold">{data.recentActivity?.length || 0}</span>
          </div>
          <p className="text-sm text-white/60">Recent activities</p>
        </div>
      </div>
      
      {data.trending && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-sm text-white/80">
            <TrendingUp size={16} className="inline mr-1" />
            Trending: {data.trending}
          </p>
        </div>
      )}
    </motion.div>
  )
}