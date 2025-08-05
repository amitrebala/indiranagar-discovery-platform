'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, MessageCircle, TrendingUp, Clock } from 'lucide-react'
import Image from 'next/image'
import { useAmitStatus } from '@/hooks/useAmitStatus'

export function AmitDashboard() {
  const { status, todaysPick, weeklyInsight } = useAmitStatus()
  const [showAskAmit, setShowAskAmit] = useState(false)
  
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-20 bg-white"
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-2xl max-w-4xl mx-auto"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                Amit's Live Dashboard
              </h2>
              <p className="text-gray-600 mt-1">Your neighborhood oracle</p>
            </div>
            
            {/* Status Indicator */}
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-800">
                {status?.location || 'Active'}
              </span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Today's Pick */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="text-primary-500" size={20} />
                Today's Pick
              </h3>
              
              {todaysPick && (
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex gap-4">
                    {todaysPick.place.image && (
                      <Image
                        src={todaysPick.place.image}
                        alt={todaysPick.place.name}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold">{todaysPick.place.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {todaysPick.reason}
                      </p>
                      {todaysPick.alternativeIfClosed && (
                        <p className="text-xs text-gray-500 mt-2">
                          If closed: {todaysPick.alternativeIfClosed.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Weekly Insight */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="text-secondary-500" size={20} />
                This Week
              </h3>
              
              {weeklyInsight && (
                <div className="space-y-3">
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-yellow-900">
                      💡 {weeklyInsight.trend}
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-blue-900">
                      🆕 Discovered: {weeklyInsight.newDiscovery.name}
                    </p>
                  </div>
                  
                  {weeklyInsight.crowdAlert && (
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-red-900">
                        ⚠️ {weeklyInsight.crowdAlert}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Ask Amit Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowAskAmit(!showAskAmit)}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-xl hover:from-primary-500/20 hover:to-secondary-500/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <MessageCircle size={20} className="text-primary-500" />
                <span className="font-medium">Ask Amit Anything</span>
              </div>
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Clock size={14} />
                Response time: {status?.responseTime || '< 2 hours'}
              </span>
            </button>
            
            {showAskAmit && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 grid grid-cols-2 gap-2"
              >
                {[
                  "Best coffee for remote work?",
                  "Quiet spots for reading?",
                  "Late night food options?",
                  "Hidden photography spots?"
                ].map((question) => (
                  <button
                    key={question}
                    className="text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                  >
                    {question}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}