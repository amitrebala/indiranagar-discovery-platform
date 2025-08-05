import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface FABAnalytics {
  totalInteractions: number
  mostUsedAction: string
  lastInteraction: Date | null
  discoveredEasterEggs: string[]
  actionCounts: Record<string, number>
}

export interface FABPreferences {
  reducedMotion: boolean
  soundEnabled: boolean
  hapticEnabled: boolean
  favoriteActions: string[]
}

export interface FABPosition {
  x: number
  y: number
}

export type FABState = 'collapsed' | 'expanded' | 'interacting'

interface AmitFABStore {
  // Current state
  isExpanded: boolean
  currentState: FABState
  activeOption: string | null
  position: FABPosition
  interactionCount: number
  showTooltip: boolean
  tooltipContent: string
  
  // User preferences
  preferences: FABPreferences
  
  // Analytics
  analytics: FABAnalytics
  
  // Actions
  toggleExpanded: () => void
  setState: (state: FABState) => void
  selectOption: (optionId: string | null) => void
  updatePosition: (position: FABPosition) => void
  recordInteraction: (actionType: string) => void
  savePreference: <K extends keyof FABPreferences>(key: K, value: FABPreferences[K]) => void
  showTooltipMessage: (message: string, duration?: number) => void
  hideTooltip: () => void
  discoverEasterEgg: (eggId: string) => void
  reset: () => void
}

const initialState = {
  isExpanded: false,
  currentState: 'collapsed' as FABState,
  activeOption: null,
  position: { x: 24, y: 24 },
  interactionCount: 0,
  showTooltip: false,
  tooltipContent: '',
  preferences: {
    reducedMotion: false,
    soundEnabled: true,
    hapticEnabled: true,
    favoriteActions: []
  },
  analytics: {
    totalInteractions: 0,
    mostUsedAction: '',
    lastInteraction: null,
    discoveredEasterEggs: [],
    actionCounts: {}
  }
}

export const useAmitFABStore = create<AmitFABStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      toggleExpanded: () => set((state) => ({
        isExpanded: !state.isExpanded,
        currentState: !state.isExpanded ? 'expanded' : 'collapsed',
        activeOption: null
      })),

      setState: (newState: FABState) => set({ 
        currentState: newState,
        isExpanded: newState !== 'collapsed'
      }),

      selectOption: (optionId: string | null) => set({ 
        activeOption: optionId,
        currentState: optionId ? 'interacting' : 'expanded'
      }),

      updatePosition: (position: FABPosition) => set({ position }),

      recordInteraction: (actionType: string) => set((state) => {
        const newActionCounts = {
          ...state.analytics.actionCounts,
          [actionType]: (state.analytics.actionCounts[actionType] || 0) + 1
        }
        
        // Find most used action
        const mostUsedAction = Object.entries(newActionCounts)
          .reduce((a, b) => a[1] > b[1] ? a : b, ['', 0])[0]

        return {
          interactionCount: state.interactionCount + 1,
          analytics: {
            ...state.analytics,
            totalInteractions: state.analytics.totalInteractions + 1,
            lastInteraction: new Date(),
            actionCounts: newActionCounts,
            mostUsedAction
          }
        }
      }),

      savePreference: (key, value) => set((state) => ({
        preferences: {
          ...state.preferences,
          [key]: value
        }
      })),

      showTooltipMessage: (message: string, duration = 3000) => {
        set({ showTooltip: true, tooltipContent: message })
        if (duration > 0) {
          setTimeout(() => {
            get().hideTooltip()
          }, duration)
        }
      },

      hideTooltip: () => set({ showTooltip: false, tooltipContent: '' }),

      discoverEasterEgg: (eggId: string) => set((state) => {
        if (state.analytics.discoveredEasterEggs.includes(eggId)) {
          return state
        }
        
        return {
          analytics: {
            ...state.analytics,
            discoveredEasterEggs: [...state.analytics.discoveredEasterEggs, eggId]
          }
        }
      }),

      reset: () => set(initialState)
    }),
    {
      name: 'amit-fab-storage',
      partialize: (state) => ({
        preferences: state.preferences,
        analytics: state.analytics
      })
    }
  )
)