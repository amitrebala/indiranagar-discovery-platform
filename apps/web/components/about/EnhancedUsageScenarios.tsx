'use client'

import { useState, useEffect } from 'react'
import { useUserProgressStore } from '@/stores/userProgressStore'
import { 
  Coffee, 
  Utensils, 
  Camera, 
  Cloud,
  Clock,
  Star,
  ChevronRight,
  Sparkles,
  CheckCircle,
  Trophy,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// Mini preview components for hover interactions
const CoffeePreview = () => (
  <div className="p-4 bg-white rounded-lg shadow-lg">
    <h4 className="font-semibold text-sm mb-2">Blue Tokai Coffee Roasters</h4>
    <div className="flex items-center gap-2 text-xs text-gray-600">
      <Clock size={12} />
      <span>Opens at 8 AM</span>
    </div>
    <div className="mt-2 text-xs text-green-600">Best time: Morning 8-11 AM</div>
  </div>
)

const PermitRoomPreview = () => (
  <div className="p-4 bg-white rounded-lg shadow-lg">
    <h4 className="font-semibold text-sm mb-2">The Permit Room</h4>
    <div className="flex items-center gap-1 text-yellow-500">
      {[...Array(4)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
      <span className="text-xs text-gray-600 ml-1">4.3</span>
    </div>
    <div className="mt-2 text-xs text-orange-600">Try the special toddy!</div>
  </div>
)

const WeatherPreview = () => (
  <div className="p-4 bg-white rounded-lg shadow-lg">
    <div className="flex items-center gap-2 mb-2">
      <Cloud className="text-blue-500" size={20} />
      <span className="text-sm font-medium">Current: Light Rain</span>
    </div>
    <div className="text-xs text-gray-600">Indoor venues highlighted</div>
  </div>
)

interface Scenario {
  id: string
  title: string
  icon: React.ReactNode
  description: string
  difficulty: 'beginner' | 'local' | 'expert'
  estimatedTime: number
  steps: Array<{
    id: string
    content: string
    interaction?: {
      type: 'hover' | 'click'
      preview: React.ComponentType
    }
  }>
  outcome: string
  ctaText: string
  ctaLink: string
  features: string[]
  rewards: string[]
  relatedScenarios: string[]
  liveStats: {
    usersCompleted: number
    successRate: number
  }
}

const scenarios: Scenario[] = [
  {
    id: 'morning-coffee',
    title: 'Perfect Morning Coffee',
    icon: <Coffee className="w-6 h-6" />,
    description: 'Find your ideal coffee spot as a new resident',
    difficulty: 'beginner',
    estimatedTime: 5,
    steps: [
      {
        id: 'step1',
        content: 'Open the interactive map',
      },
      {
        id: 'step2',
        content: 'Filter by "Cafe" category',
      },
      {
        id: 'step3',
        content: 'Check the weather widget - sunny morning perfect for outdoor seating',
        interaction: {
          type: 'hover',
          preview: WeatherPreview
        }
      },
      {
        id: 'step4',
        content: 'Find Blue Tokai with green verified badge',
        interaction: {
          type: 'hover',
          preview: CoffeePreview
        }
      },
      {
        id: 'step5',
        content: 'Click to see opening hours and best visit times',
      }
    ],
    outcome: 'Discover THE coffee shop where baristas know their beans and morning crowd is inspiring',
    ctaText: 'Find Your Coffee Spot',
    ctaLink: '/map?category=Cafe',
    features: ['Weather-aware recommendations', 'Verified places', 'Best visit times'],
    rewards: ['Coffee Connoisseur Badge', '10 Discovery Points'],
    relatedScenarios: ['weekend-brunch', 'work-cafe'],
    liveStats: {
      usersCompleted: 47,
      successRate: 92
    }
  },
  {
    id: 'weekend-exploration',
    title: 'Weekend Food Adventure',
    icon: <Utensils className="w-6 h-6" />,
    description: 'Plan the perfect Saturday evening with friends',
    difficulty: 'local',
    estimatedTime: 8,
    steps: [
      {
        id: 'step1',
        content: 'Browse places sorted by rating',
      },
      {
        id: 'step2',
        content: 'Spot "The Permit Room" with 4.3 stars',
        interaction: {
          type: 'hover',
          preview: PermitRoomPreview
        }
      },
      {
        id: 'step3',
        content: 'Read Amit\'s insider tip about special toddy',
      },
      {
        id: 'step4',
        content: 'Check companion activities for after dinner',
      },
      {
        id: 'step5',
        content: 'Save to your weekend plan',
      }
    ],
    outcome: 'Experience authentic South Indian bar culture with perfect post-dinner walk',
    ctaText: 'Explore Top Rated',
    ctaLink: '/places?sort=rating',
    features: ['Personal ratings', 'Insider tips', 'Companion activities'],
    rewards: ['Weekend Warrior Badge', '15 Discovery Points'],
    relatedScenarios: ['date-night', 'group-dining'],
    liveStats: {
      usersCompleted: 89,
      successRate: 88
    }
  },
  {
    id: 'photo-walk',
    title: 'Instagram Photo Walk',
    icon: <Camera className="w-6 h-6" />,
    description: 'Capture Indiranagar\'s essence for your travel blog',
    difficulty: 'expert',
    estimatedTime: 12,
    steps: [
      {
        id: 'step1',
        content: 'Discover "Journey Routes" on the map',
      },
      {
        id: 'step2',
        content: 'Select "Morning Photography Walk"',
      },
      {
        id: 'step3',
        content: 'Follow curated route with 5 photogenic spots',
      },
      {
        id: 'step4',
        content: 'Read Amit\'s composition tips at each stop',
      },
      {
        id: 'step5',
        content: 'Check golden hour timing for best shots',
      }
    ],
    outcome: 'Capture unique shots of hidden murals and heritage that only locals know',
    ctaText: 'Start Photo Journey',
    ctaLink: '/journeys?type=photography',
    features: ['Curated routes', 'Photography tips', 'Hidden gems'],
    rewards: ['Shutterbug Badge', '20 Discovery Points', 'Featured Photographer'],
    relatedScenarios: ['street-art-hunt', 'heritage-walk'],
    liveStats: {
      usersCompleted: 34,
      successRate: 95
    }
  }
]

const difficultyConfig = {
  beginner: { color: 'text-green-600', bgColor: 'bg-green-50', label: 'Beginner' },
  local: { color: 'text-blue-600', bgColor: 'bg-blue-50', label: 'Local' },
  expert: { color: 'text-purple-600', bgColor: 'bg-purple-50', label: 'Expert' }
}

export function EnhancedUsageScenarios() {
  const [activeScenario, setActiveScenario] = useState<string>('morning-coffee')
  const [hoveredStep, setHoveredStep] = useState<string | null>(null)
  const [completedSteps, setCompletedSteps] = useState<Record<string, string[]>>({})
  
  const { 
    scenariosCompleted, 
    completeScenario
  } = useUserProgressStore()
  
  const active = scenarios.find(s => s.id === activeScenario)!
  const scenarioProgress = completedSteps[activeScenario] || []
  const isScenarioComplete = scenarioProgress.length === active.steps.length
  
  // Auto-mark scenario complete when all steps are done
  useEffect(() => {
    if (isScenarioComplete && !scenariosCompleted.includes(activeScenario)) {
      completeScenario(activeScenario)
    }
  }, [isScenarioComplete, activeScenario, scenariosCompleted, completeScenario])
  
  const handleStepClick = (stepId: string) => {
    if (!scenarioProgress.includes(stepId)) {
      setCompletedSteps(prev => ({
        ...prev,
        [activeScenario]: [...(prev[activeScenario] || []), stepId]
      }))
    }
  }
  
  const getProgressPercentage = () => {
    return Math.round((scenarioProgress.length / active.steps.length) * 100)
  }

  return (
    <div className="py-16 bg-gradient-to-br from-orange-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            How People Use <span className="text-orange-600">Indiranagar with Amit</span>
          </motion.h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Interactive scenarios showing real ways to discover the neighborhood
          </p>
          
          {/* Overall Progress */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">
              {scenariosCompleted.length} of {scenarios.length} scenarios completed
            </span>
          </div>
        </div>

        {/* Scenario Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {scenarios.map((scenario) => {
            const isCompleted = scenariosCompleted.includes(scenario.id)
            const config = difficultyConfig[scenario.difficulty]
            
            return (
              <motion.button
                key={scenario.id}
                onClick={() => setActiveScenario(scenario.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "relative p-6 rounded-xl border-2 transition-all text-left",
                  activeScenario === scenario.id
                    ? 'border-orange-500 bg-orange-50 shadow-lg'
                    : 'border-gray-200 hover:border-orange-300 hover:shadow-md bg-white'
                )}
              >
                {/* Completed Badge */}
                {isCompleted && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                )}
                
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'p-3 rounded-lg',
                    activeScenario === scenario.id ? 'bg-orange-100' : 'bg-gray-100'
                  )}>
                    <div className={activeScenario === scenario.id ? 'text-orange-600' : 'text-gray-600'}>
                      {scenario.icon}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {scenario.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {scenario.description}
                    </p>
                    
                    <div className="flex items-center gap-3 text-xs">
                      <span className={cn('px-2 py-1 rounded-full', config.bgColor, config.color)}>
                        {config.label}
                      </span>
                      <span className="text-gray-500">
                        {scenario.estimatedTime} min
                      </span>
                      <div className="flex items-center gap-1 text-gray-500">
                        <TrendingUp size={12} />
                        <span>{scenario.liveStats.successRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Active Scenario Detail */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Steps & Progress */}
          <div className="space-y-6">
            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  Scenario Progress
                </h3>
                <span className="text-sm font-medium text-gray-600">
                  {getProgressPercentage()}% Complete
                </span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressPercentage()}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-600"
                />
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Steps to follow:</h4>
              {active.steps.map((step, index) => {
                const isCompleted = scenarioProgress.includes(step.id)
                const StepPreview = step.interaction?.preview
                
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <button
                      onClick={() => handleStepClick(step.id)}
                      onMouseEnter={() => setHoveredStep(step.id)}
                      onMouseLeave={() => setHoveredStep(null)}
                      className={cn(
                        'w-full flex items-start gap-3 p-3 rounded-lg transition-all text-left',
                        isCompleted 
                          ? 'bg-green-50 border border-green-200' 
                          : 'hover:bg-gray-50 border border-transparent'
                      )}
                    >
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium transition-all',
                        isCompleted 
                          ? 'bg-green-500 text-white' 
                          : 'bg-orange-100 text-orange-600'
                      )}>
                        {isCompleted ? <CheckCircle size={16} /> : index + 1}
                      </div>
                      <div className="flex-1">
                        <p className={cn(
                          'transition-all',
                          isCompleted ? 'text-gray-600' : 'text-gray-700'
                        )}>
                          {step.content}
                        </p>
                        {step.interaction && (
                          <span className="text-xs text-orange-600 mt-1 inline-flex items-center gap-1">
                            <Sparkles size={12} />
                            {step.interaction.type === 'hover' ? 'Hover to preview' : 'Click to interact'}
                          </span>
                        )}
                      </div>
                    </button>
                    
                    {/* Hover Preview */}
                    <AnimatePresence>
                      {hoveredStep === step.id && StepPreview && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute left-12 top-full z-10 mt-2"
                        >
                          <StepPreview />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>

            {/* Outcome */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: isScenarioComplete ? 1 : 0.5 }}
              className={cn(
                'bg-gradient-to-r from-green-50 to-emerald-50 border rounded-lg p-4',
                isScenarioComplete ? 'border-green-300' : 'border-gray-200'
              )}
            >
              <div className="flex items-start gap-3">
                <Sparkles className={cn(
                  'w-5 h-5 flex-shrink-0 mt-0.5',
                  isScenarioComplete ? 'text-green-600' : 'text-gray-400'
                )} />
                <div>
                  <h4 className={cn(
                    'font-semibold mb-1',
                    isScenarioComplete ? 'text-green-900' : 'text-gray-600'
                  )}>
                    The Result:
                  </h4>
                  <p className={cn(
                    isScenarioComplete ? 'text-green-800' : 'text-gray-500'
                  )}>
                    {active.outcome}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <Link
              href={active.ctaLink}
              className={cn(
                'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all',
                'bg-orange-500 text-white hover:bg-orange-600',
                'shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              )}
            >
              {active.ctaText}
              <ChevronRight size={20} />
            </Link>
          </div>

          {/* Right Side - Features & Stats */}
          <div className="space-y-6">
            {/* Live Stats */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Real-Time Stats
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {active.liveStats.usersCompleted}
                  </div>
                  <div className="text-sm text-gray-600">
                    People completed today
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {active.liveStats.successRate}%
                  </div>
                  <div className="text-sm text-gray-600">
                    Success rate
                  </div>
                </div>
              </div>
            </div>

            {/* Features Used */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Features You\'ll Use
              </h4>
              <div className="space-y-3">
                {active.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-orange-500" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rewards */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Rewards for Completion
              </h4>
              <div className="space-y-2">
                {active.rewards.map((reward, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700 font-medium">{reward}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Scenarios */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Try Next
              </h4>
              <div className="space-y-2">
                {active.relatedScenarios.map((scenarioId) => {
                  const related = scenarios.find(s => s.id === scenarioId)
                  if (!related) return null
                  
                  return (
                    <button
                      key={scenarioId}
                      onClick={() => setActiveScenario(scenarioId)}
                      className="w-full text-left p-3 rounded-lg hover:bg-white transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {related.icon}
                        <span className="font-medium text-gray-700">
                          {related.title}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}