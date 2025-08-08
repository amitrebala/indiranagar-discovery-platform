import { create } from 'zustand'
import type { EnhancedPlaceData } from '@/lib/types/enhanced-place'

interface FeaturedDiscoveriesStore {
  places: EnhancedPlaceData[]
  filteredPlaces: EnhancedPlaceData[]
  currentFilter: string | null
  viewMode: 'grid' | 'carousel'
  carouselIndex: number
  isAutoRotating: boolean
  quickViewPlace: EnhancedPlaceData | null
  
  // Actions
  setPlaces: (places: EnhancedPlaceData[]) => void
  setFilter: (filter: string | null) => void
  setViewMode: (mode: 'grid' | 'carousel') => void
  nextCarouselItem: () => void
  prevCarouselItem: () => void
  toggleAutoRotate: () => void
  openQuickView: (place: EnhancedPlaceData) => void
  closeQuickView: () => void
}

export const useFeaturedDiscoveriesStore = create<FeaturedDiscoveriesStore>((set, get) => ({
  places: [],
  filteredPlaces: [],
  currentFilter: null,
  viewMode: 'grid',
  carouselIndex: 0,
  isAutoRotating: true,
  quickViewPlace: null,
  
  setPlaces: (places) => {
    set({ 
      places,
      filteredPlaces: places // Initialize with all places
    })
  },
  
  setFilter: (filter) => {
    const { places } = get()
    const filtered = filter 
      ? places.filter(place => place.category === filter)
      : places
    
    set({ 
      currentFilter: filter,
      filteredPlaces: filtered,
      carouselIndex: 0 // Reset carousel when filter changes
    })
  },
  
  setViewMode: (mode) => {
    set({ viewMode: mode })
  },
  
  nextCarouselItem: () => {
    const { carouselIndex, filteredPlaces } = get()
    set({ 
      carouselIndex: (carouselIndex + 1) % filteredPlaces.length 
    })
  },
  
  prevCarouselItem: () => {
    const { carouselIndex, filteredPlaces } = get()
    set({ 
      carouselIndex: (carouselIndex - 1 + filteredPlaces.length) % filteredPlaces.length 
    })
  },
  
  toggleAutoRotate: () => {
    const { isAutoRotating } = get()
    set({ isAutoRotating: !isAutoRotating })
  },
  
  openQuickView: (place) => {
    set({ quickViewPlace: place })
  },
  
  closeQuickView: () => {
    set({ quickViewPlace: null })
  }
}))