import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface AmitButtonStore {
  isVisible: boolean
  isExpanded: boolean
  filterActive: boolean
  visitedPlaces: string[]
  currentInteraction: string | null
  
  // Actions
  toggleFilter: () => void
  setExpanded: (expanded: boolean) => void
  celebrate: (placeId: string) => void
  setVisibility: (visible: boolean) => void
  setCurrentInteraction: (interaction: string | null) => void
}

export const useAmitButtonStore = create<AmitButtonStore>()(
  devtools(
    (set) => ({
      isVisible: true,
      isExpanded: false,
      filterActive: false,
      visitedPlaces: [],
      currentInteraction: null,
      
      toggleFilter: () => set((state) => ({ 
        filterActive: !state.filterActive,
        isExpanded: false 
      })),
      
      setExpanded: (expanded) => set({ isExpanded: expanded }),
      
      celebrate: (placeId) => set((state) => ({
        visitedPlaces: [...state.visitedPlaces, placeId],
        currentInteraction: 'celebrate'
      })),
      
      setVisibility: (visible) => set({ isVisible: visible }),
      
      setCurrentInteraction: (interaction) => set({ currentInteraction: interaction }),
    }),
    {
      name: 'amit-button-store',
    }
  )
)