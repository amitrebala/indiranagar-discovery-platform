import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { LatLng, LatLngBounds } from 'leaflet'
import type { Place } from '@/lib/validations'
import { MAP_CONFIG } from '@/lib/constants'

interface MapStore {
  // Map state
  center: LatLng | { lat: number; lng: number }
  zoom: number
  bounds: LatLngBounds | null
  
  // Place state
  selectedPlace: Place | null
  places: Place[]
  isLoading: boolean
  error: string | null
  
  // UI state
  isMapReady: boolean
  showClusters: boolean
  
  // Actions
  setMapView: (center: LatLng | { lat: number; lng: number }, zoom: number) => void
  setBounds: (bounds: LatLngBounds) => void
  selectPlace: (place: Place | null) => void
  setPlaces: (places: Place[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setMapReady: (ready: boolean) => void
  toggleClusters: () => void
  resetMapView: () => void
}

export const useMapStore = create<MapStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      center: MAP_CONFIG.CENTER,
      zoom: MAP_CONFIG.DEFAULT_ZOOM,
      bounds: null,
      selectedPlace: null,
      places: [],
      isLoading: false,
      error: null,
      isMapReady: false,
      showClusters: true,
      
      // Actions
      setMapView: (center, zoom) => set({ center, zoom }),
      
      setBounds: (bounds) => set({ bounds }),
      
      selectPlace: (place) => set({ selectedPlace: place }),
      
      setPlaces: (places) => set({ places, error: null }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error, isLoading: false }),
      
      setMapReady: (isMapReady) => set({ isMapReady }),
      
      toggleClusters: () => set((state) => ({ showClusters: !state.showClusters })),
      
      resetMapView: () => set({
        center: MAP_CONFIG.CENTER,
        zoom: MAP_CONFIG.DEFAULT_ZOOM,
        selectedPlace: null,
        bounds: null
      }),
    }),
    {
      name: 'map-store',
    }
  )
)