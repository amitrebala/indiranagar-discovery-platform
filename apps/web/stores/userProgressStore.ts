import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { UserProgress, UserPreferences } from '@/lib/types/about'

interface UserProgressStore extends UserProgress {
  // Actions
  completeScenario: (scenarioId: string) => void
  exploreFeature: (featureId: string) => void
  unlockChallenge: (challengeId: string) => void
  setCurrentGuide: (guideId: string | null) => void
  updatePreferences: (preferences: Partial<UserPreferences>) => void
  resetProgress: () => void
  
  // Computed values
  getCompletionPercentage: () => number
  getNextSuggestedAction: () => string | null
}

const initialPreferences: UserPreferences = {
  reducedMotion: false,
  theme: 'light',
  tooltipsEnabled: true
}

const initialState: UserProgress = {
  scenariosCompleted: [],
  featuresExplored: [],
  challengesUnlocked: [],
  currentGuide: null,
  preferences: initialPreferences
}

export const useUserProgressStore = create<UserProgressStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        completeScenario: (scenarioId) => 
          set((state) => ({
            scenariosCompleted: [...new Set([...state.scenariosCompleted, scenarioId])]
          })),
        
        exploreFeature: (featureId) =>
          set((state) => ({
            featuresExplored: [...new Set([...state.featuresExplored, featureId])]
          })),
        
        unlockChallenge: (challengeId) =>
          set((state) => ({
            challengesUnlocked: [...new Set([...state.challengesUnlocked, challengeId])]
          })),
        
        setCurrentGuide: (guideId) =>
          set({ currentGuide: guideId }),
        
        updatePreferences: (preferences) =>
          set((state) => ({
            preferences: { ...state.preferences, ...preferences }
          })),
        
        resetProgress: () =>
          set({ ...initialState }),
        
        getCompletionPercentage: () => {
          const state = get()
          const totalItems = 6 + 6 + 3 // scenarios + features + challenges
          const completedItems = 
            state.scenariosCompleted.length + 
            state.featuresExplored.length + 
            state.challengesUnlocked.length
          return Math.round((completedItems / totalItems) * 100)
        },
        
        getNextSuggestedAction: () => {
          const state = get()
          
          // Suggest exploring a scenario first
          if (state.scenariosCompleted.length === 0) {
            return 'Try your first usage scenario above'
          }
          
          // Then suggest exploring features
          if (state.featuresExplored.length < 3) {
            return 'Explore more features in the playground'
          }
          
          // Finally suggest challenges
          if (state.challengesUnlocked.length === 0) {
            return 'Take on a discovery challenge'
          }
          
          // If well progressed, suggest completing everything
          if (state.getCompletionPercentage() < 100) {
            return 'Complete more scenarios to unlock all features'
          }
          
          return null
        }
      }),
      {
        name: 'user-progress-store',
        partialize: (state) => ({
          scenariosCompleted: state.scenariosCompleted,
          featuresExplored: state.featuresExplored,
          challengesUnlocked: state.challengesUnlocked,
          preferences: state.preferences
        })
      }
    )
  )
)