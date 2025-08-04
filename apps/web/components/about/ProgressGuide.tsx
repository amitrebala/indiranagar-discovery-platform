'use client'

import { useState, useEffect } from 'react'
import { useUserProgressStore } from '@/stores/userProgressStore'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  ChevronRight, 
  Sparkles, 
  HelpCircle,
  Trophy,
  Target,
  Zap,
  MinimizeIcon
} from 'lucide-react'

interface GuideStep {
  id: string
  title: string
  description: string
  target: string // CSS selector or element ID
  position: 'top' | 'bottom' | 'left' | 'right'
  action: string
}

const guideSteps: GuideStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Interactive About Page!',
    description: 'Let me show you around the new features',
    target: '',
    position: 'bottom',
    action: 'Start Tour'
  },
  {
    id: 'scenarios',
    title: 'Try Interactive Scenarios',
    description: 'Click on scenarios and complete steps to see how people use the platform',
    target: '#usage-scenarios',
    position: 'top',
    action: 'Explore Scenarios'
  },
  {
    id: 'hover-previews',
    title: 'Hover for Live Previews',
    description: 'Some steps have hover interactions - try hovering over them!',
    target: '.hover-preview',
    position: 'right',
    action: 'Got it'
  },
  {
    id: 'progress-tracking',
    title: 'Track Your Progress',
    description: 'Complete scenarios to unlock badges and rewards',
    target: '#progress-indicator',
    position: 'bottom',
    action: 'Continue'
  },
  {
    id: 'community-feed',
    title: 'Live Community Activity',
    description: 'See what others are discovering in real-time',
    target: '#community-feed',
    position: 'top',
    action: 'Check it out'
  }
]

export function ProgressGuide() {
  const [isMinimized, setIsMinimized] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [hasSeenGuide, setHasSeenGuide] = useState(false)
  
  const { 
    currentGuide, 
    setCurrentGuide,
    getCompletionPercentage,
    getNextSuggestedAction
  } = useUserProgressStore()
  
  const currentStep = guideSteps[currentStepIndex]
  const completionPercentage = getCompletionPercentage()
  const nextAction = getNextSuggestedAction()
  
  // Check if user has seen the guide before
  useEffect(() => {
    const seen = localStorage.getItem('about-guide-seen')
    if (seen) {
      setHasSeenGuide(true)
      setIsVisible(false)
    }
  }, [])
  
  // Auto-show guide for new users
  useEffect(() => {
    if (!hasSeenGuide && !currentGuide) {
      setTimeout(() => {
        setCurrentGuide('about-page-tour')
      }, 2000)
    }
  }, [hasSeenGuide, currentGuide, setCurrentGuide])
  
  const handleNext = () => {
    if (currentStepIndex < guideSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    } else {
      handleComplete()
    }
  }
  
  const handleComplete = () => {
    localStorage.setItem('about-guide-seen', 'true')
    setCurrentGuide(null)
    setIsVisible(false)
  }
  
  const handleReopen = () => {
    setIsVisible(true)
    setIsMinimized(false)
    setCurrentStepIndex(0)
    setCurrentGuide('about-page-tour')
  }
  
  if (!isVisible && completionPercentage < 100) {
    // Show floating help button
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        onClick={handleReopen}
        className="fixed bottom-6 right-6 z-50 p-3 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-all hover:scale-110"
        whileHover={{ rotate: 15 }}
        whileTap={{ scale: 0.9 }}
      >
        <HelpCircle size={24} />
      </motion.button>
    )
  }
  
  if (!currentGuide || !isVisible) return null
  
  return (
    <AnimatePresence>
      {!isMinimized ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-gray-900">Discovery Guide</h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1 hover:bg-orange-100 rounded-lg transition-colors"
                >
                  <MinimizeIcon size={16} className="text-gray-600" />
                </button>
                <button
                  onClick={handleComplete}
                  className="p-1 hover:bg-orange-100 rounded-lg transition-colors"
                >
                  <X size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="px-4 pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">
                Overall Progress
              </span>
              <span className="text-xs font-bold text-orange-600">
                {completionPercentage}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                className="h-full bg-gradient-to-r from-orange-400 to-orange-600"
              />
            </div>
          </div>
          
          {/* Current Step */}
          <div className="p-4">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-orange-600">
                    {currentStepIndex + 1}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900">
                  {currentStep.title}
                </h4>
              </div>
              <p className="text-sm text-gray-600 ml-10">
                {currentStep.description}
              </p>
            </div>
            
            {/* Action Button */}
            <button
              onClick={handleNext}
              className="w-full py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center justify-center gap-2"
            >
              {currentStep.action}
              <ChevronRight size={16} />
            </button>
          </div>
          
          {/* Next Suggestion */}
          {nextAction && (
            <div className="px-4 pb-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-green-900">Next up:</p>
                    <p className="text-xs text-green-700">{nextAction}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Quick Stats */}
          <div className="px-4 pb-4 border-t border-gray-100 pt-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <Trophy className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
                <p className="text-xs font-medium text-gray-900">3</p>
                <p className="text-xs text-gray-500">Badges</p>
              </div>
              <div>
                <Zap className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                <p className="text-xs font-medium text-gray-900">45</p>
                <p className="text-xs text-gray-500">Points</p>
              </div>
              <div>
                <Target className="w-4 h-4 text-green-500 mx-auto mb-1" />
                <p className="text-xs font-medium text-gray-900">2/6</p>
                <p className="text-xs text-gray-500">Scenarios</p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsMinimized(false)}
          className="fixed bottom-6 right-6 z-50 p-4 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-all hover:scale-110"
          whileHover={{ rotate: -15 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="relative">
            <Sparkles size={24} />
            {completionPercentage < 100 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            )}
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  )
}