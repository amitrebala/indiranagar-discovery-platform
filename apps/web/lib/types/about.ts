export interface InteractiveStep {
  id: string
  content: string
  interaction?: {
    type: 'hover' | 'click' | 'swipe'
    preview: React.ComponentType
  }
  validation?: () => boolean
}

export interface EnhancedScenario {
  id: string
  title: string
  difficulty: 'beginner' | 'local' | 'expert'
  estimatedTime: number
  steps: InteractiveStep[]
  rewards: string[]
  relatedScenarios: string[]
  liveStats?: {
    usersCompleted: number
    successRate: number
  }
}

export interface UserProgress {
  scenariosCompleted: string[]
  featuresExplored: string[]
  challengesUnlocked: string[]
  currentGuide: string | null
  preferences: UserPreferences
}

export interface UserPreferences {
  reducedMotion: boolean
  theme: 'light' | 'dark'
  tooltipsEnabled: boolean
}

export interface CommunityActivity {
  id: string
  type: 'place_visited' | 'suggestion_made' | 'event_created' | 'review_added'
  user: {
    name: string
    avatar?: string
    type: 'new_resident' | 'foodie' | 'explorer' | 'local'
  }
  content: string
  timestamp: Date
  relatedPlace?: {
    id: string
    name: string
  }
}

export interface TrustMetric {
  label: string
  value: number | string
  trend?: 'up' | 'down' | 'stable'
  color: string
  icon: React.ReactNode
  clickable?: boolean
  onClick?: () => void
  detail?: string
}