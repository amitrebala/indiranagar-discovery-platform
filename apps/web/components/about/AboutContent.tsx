'use client'

import { Container } from '@/components/layout/Container'
import { MapPin, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { EnhancedUsageScenarios } from './EnhancedUsageScenarios'
import { LiveCommunityFeed } from './LiveCommunityFeed'
import { TrustDashboard } from './TrustDashboard'
import { ProgressGuide } from './ProgressGuide'
import { StickyCTABar } from './StickyCTABar'
import { motion } from 'framer-motion'

export function AboutContent() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Interactive Hero Section */}
      <section className="py-16 lg:py-20">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Animated Avatar */}
              <motion.div
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <span className="text-3xl font-bold text-white">A</span>
              </motion.div>
              
              {/* Dynamic Title */}
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Discover Indiranagar with
                <span className="text-orange-600"> Amit</span>
              </h1>
              
              {/* Typewriter subtitle */}
              <motion.p 
                className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Your personal guide who&apos;s explored every corner of Bangalore&apos;s most vibrant neighborhood
              </motion.p>
              
              {/* Interactive Demo CTA */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl p-8 shadow-xl border border-orange-200 max-w-2xl mx-auto"
              >
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="w-6 h-6 text-orange-500" />
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Try it yourself!
                  </h2>
                </div>
                <p className="text-gray-700 mb-6">
                  I&apos;ve personally visited <span className="font-bold text-orange-600">166 places</span> over 
                  <span className="font-bold text-green-600"> 5+ years</span>, turning weekend explorations 
                  into a comprehensive guide just for you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/map"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <MapPin size={20} />
                    Explore Interactive Map
                  </Link>
                  <Link
                    href="#usage-scenarios"
                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-medium"
                  >
                    See How It Works
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Enhanced Usage Scenarios - Moved to top */}
      <div id="usage-scenarios">
        <EnhancedUsageScenarios />
      </div>
      
      {/* Trust Dashboard - Consolidated stats */}
      <TrustDashboard />
      
      {/* Live Community Feed */}
      <LiveCommunityFeed />
      
      {/* Progress Guide - Floating helper */}
      <ProgressGuide />
      
      {/* Sticky CTA Bar */}
      <StickyCTABar />
    </div>
  )
}