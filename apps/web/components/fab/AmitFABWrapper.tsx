'use client'

import React, { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useAmitButtonStore } from '@/stores/amitButtonStore'
import { useMapStore } from '@/stores/mapStore'

// Dynamically import the FAB to reduce initial bundle size
const AmitFAB = dynamic(() => import('./AmitFAB'), {
  ssr: false,
  loading: () => (
    <div className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full animate-pulse" />
  )
})

// Dynamically import the search modal
const AmitSearchModal = dynamic(() => import('@/components/community/AmitSearchModal'), {
  ssr: false
})

// Dynamically import the suggest form
const SuggestPlaceModal = dynamic(() => import('@/components/community/SuggestPlaceModal'), {
  ssr: false
})

export default function AmitFABWrapper() {
  const router = useRouter()
  const { toggleFilter } = useAmitButtonStore()
  const { setMapView } = useMapStore()
  
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSuggestOpen, setIsSuggestOpen] = useState(false)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  
  // Handle search action
  const handleSearch = useCallback(() => {
    setIsSearchOpen(true)
  }, [])
  
  // Handle filter action
  const handleFilter = useCallback(() => {
    toggleFilter()
    // Navigate to map if not already there
    if (!window.location.pathname.includes('/map')) {
      router.push('/')
    }
  }, [toggleFilter, router])
  
  // Handle suggest action
  const handleSuggest = useCallback(() => {
    setIsSuggestOpen(true)
  }, [])
  
  // Handle favorites action
  const handleFavorites = useCallback(() => {
    setShowFavoritesOnly(true)
    setIsSearchOpen(true)
  }, [])
  
  // Handle nearby action
  const handleNearby = useCallback(() => {
    // Get user location and show nearby places
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setMapView({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }, 16)
        router.push('/')
      })
    }
  }, [setMapView, router])
  
  // Handle photos action
  const handlePhotos = useCallback(() => {
    // Open photo gallery for current place
    const currentPath = window.location.pathname
    if (currentPath.includes('/places/')) {
      // Scroll to photos section
      const photosSection = document.getElementById('place-photos')
      if (photosSection) {
        photosSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [])
  
  // Handle similar places action
  const handleSimilar = useCallback(() => {
    // Show similar places to current one
    const currentPath = window.location.pathname
    if (currentPath.includes('/places/')) {
      // Scroll to similar places section
      const similarSection = document.getElementById('similar-places')
      if (similarSection) {
        similarSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [])
  
  return (
    <>
      <AmitFAB
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSuggest={handleSuggest}
        onFavorites={handleFavorites}
        onNearby={handleNearby}
        onPhotos={handlePhotos}
        onSimilar={handleSimilar}
      />
      
      {/* Search Modal */}
      {isSearchOpen && (
        <AmitSearchModal
          isOpen={isSearchOpen}
          onClose={() => {
            setIsSearchOpen(false)
            setShowFavoritesOnly(false)
          }}
          showFavoritesOnly={showFavoritesOnly}
        />
      )}
      
      {/* Suggest Place Modal */}
      {isSuggestOpen && (
        <SuggestPlaceModal
          isOpen={isSuggestOpen}
          onClose={() => setIsSuggestOpen(false)}
        />
      )}
    </>
  )
}