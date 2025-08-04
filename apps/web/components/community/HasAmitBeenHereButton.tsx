'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Search, X, MapPin, MessageCircle, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { amitRealVisitedPlaces, type AmitRealPlace } from '@/data/amit-real-visited-places'
import { useAmitButtonStore } from '@/stores/amitButtonStore'
import { useMapStore } from '@/stores/mapStore'
import { cn } from '@/lib/utils'
import FloatingEmojis from '@/components/ui/FloatingEmojis'
import CelebrationOverlay from '@/components/ui/CelebrationOverlay'
import { usePathname } from 'next/navigation'
import { useHapticFeedback, HapticPattern } from '@/hooks/useHapticFeedback'

interface AmitSearchModalProps {
  isOpen: boolean
  onClose: () => void
}

function PlaceResult({ place, onClick }: { place: AmitRealPlace; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{place.name}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{place.notes}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">
              {place.category}
            </span>
            {place.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs font-medium text-gray-700">{place.rating}</span>
              </div>
            )}
            {place.priceRange && (
              <span className="text-xs text-gray-500">{place.priceRange}</span>
            )}
          </div>
        </div>
        <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
      </div>
    </button>
  )
}

function SuggestPlaceForm({ onClose }: { onClose: () => void }) {
  const [placeName, setPlaceName] = useState('')
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!placeName.trim()) return

    setIsSubmitting(true)
    
    try {
      // In a real app, this would submit to your API
      console.log('Suggesting place:', { placeName, comment })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show success and close
      alert('Thanks for the suggestion! I\'ll check it out.')
      onClose()
    } catch (error) {
      console.error('Error suggesting place:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-3">Suggest a Place to Amit</h3>
      <div className="space-y-3">
        <div>
          <label htmlFor="place-name" className="block text-sm font-medium text-gray-700 mb-1">
            Place Name *
          </label>
          <input
            id="place-name"
            type="text"
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
            placeholder="e.g., Corner House, Brigade Road"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            required
          />
        </div>
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Why should I visit? (optional)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell me what makes this place special..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !placeName.trim()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Suggesting...' : 'Suggest Place'}
          </button>
        </div>
      </div>
    </form>
  )
}

function AmitSearchModal({ isOpen, onClose }: AmitSearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<AmitRealPlace[]>([])
  const [showSuggestForm, setShowSuggestForm] = useState(false)
  const [noResults, setNoResults] = useState(false)

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    
    if (searchQuery.trim().length < 2) {
      setResults([])
      setNoResults(false)
      setShowSuggestForm(false)
      return
    }

    const searchResults = amitRealVisitedPlaces.filter(place => 
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.notes.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setResults(searchResults)
    setNoResults(searchResults.length === 0)
    setShowSuggestForm(searchResults.length === 0)
  }

  const handlePlaceClick = (place: AmitRealPlace) => {
    // In a real app, this would navigate to the place page
    alert(`Opening ${place.name}:\n\n${place.notes}\n\nRating: ${place.rating || 'Not rated'}\nCategory: ${place.category}`)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Has Amit Been Here?</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search for a place..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="overflow-y-auto max-h-96">
          {results.length > 0 && (
            <div>
              {results.map((place, index) => (
                <PlaceResult
                  key={index}
                  place={place}
                  onClick={() => handlePlaceClick(place)}
                />
              ))}
            </div>
          )}

          {noResults && query.trim().length >= 2 && (
            <div className="p-6 text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Haven&apos;t been there yet!</h3>
              <p className="text-sm text-gray-600 mb-4">
                I haven&apos;t visited &quot;{query}&quot; yet. Want to suggest it?
              </p>
            </div>
          )}

          {query.trim().length === 0 && (
            <div className="p-6 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Search Places</h3>
              <p className="text-sm text-gray-600">
                Type to search through all the places I&apos;ve visited in Indiranagar
              </p>
            </div>
          )}
        </div>

        {/* Suggest Form */}
        {showSuggestForm && <SuggestPlaceForm onClose={onClose} />}
      </div>
    </div>
  )
}

export default function HasAmitBeenHereButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isDancing, setIsDancing] = useState(false)
  const [, setSecretMode] = useState<'none' | 'dance' | 'favorites'>('none')
  
  const pathname = usePathname()
  const { triggerHaptic } = useHapticFeedback()
  const { isExpanded, filterActive, toggleFilter } = useAmitButtonStore()
  useMapStore()
  
  const buttonRef = useRef<HTMLButtonElement>(null)
  const clickTimerRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const longPressTimerRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Check if Amit visited current place
  const currentPlaceId = pathname.includes('/places/') ? pathname.split('/').pop() : null
  const hasAmitVisited = currentPlaceId && amitRealVisitedPlaces.some(
    place => place.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === currentPlaceId
  )

  // Handle click interactions
  const handleClick = useCallback(() => {
    triggerHaptic(HapticPattern.LIGHT)
    setClickCount(prev => prev + 1)
    
    // Clear previous timer
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current)
    }
    
    // Set new timer to reset count
    clickTimerRef.current = setTimeout(() => {
      setClickCount(0)
    }, 500)
    
    // Check for triple click
    if (clickCount === 2) {
      setIsDancing(true)
      setSecretMode('dance')
      triggerHaptic(HapticPattern.IMPACT)
      setTimeout(() => {
        setIsDancing(false)
        setSecretMode('none')
      }, 3000)
      return
    }
    
    // Normal click behavior
    if (pathname.includes('/places/') && hasAmitVisited) {
      setShowCelebration(true)
      triggerHaptic(HapticPattern.SUCCESS)
    } else if (pathname === '/' || pathname.includes('/map')) {
      toggleFilter()
      setIsModalOpen(true)
    } else {
      setIsModalOpen(true)
    }
  }, [clickCount, pathname, hasAmitVisited, toggleFilter, triggerHaptic])

  // Handle long press
  const handleMouseDown = useCallback(() => {
    longPressTimerRef.current = setTimeout(() => {
      setSecretMode('favorites')
      triggerHaptic(HapticPattern.IMPACT)
      // Show Amit's favorite places
      setIsModalOpen(true)
    }, 1000)
  }, [triggerHaptic])

  const handleMouseUp = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
    }
  }, [])

  // Clean up timers
  useEffect(() => {
    return () => {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current)
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current)
    }
  }, [])

  // Get tooltip text based on state
  const getTooltipText = () => {
    if (hasAmitVisited) return "Yes! Amit loves this place!"
    if (filterActive) return "Showing Amit's places"
    return "Click to see Amit's adventures!"
  }

  return (
    <>
      <motion.div
        className="amit-button-container fixed bottom-6 right-6 z-[9999]"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <motion.button
          ref={buttonRef}
          className={cn(
            "relative bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-full shadow-lg transition-all duration-300",
            hasAmitVisited && "amit-visited from-[#f093fb] to-[#f5576c]",
            isExpanded ? "w-[200px] h-16" : "w-16 h-16",
            isDancing && "amit-dance"
          )}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => {
            setIsHovered(true)
            triggerHaptic(HapticPattern.SELECTION)
          }}
          onHoverEnd={() => setIsHovered(false)}
          onClick={handleClick}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          style={{
            boxShadow: isHovered 
              ? '0 15px 50px rgba(102, 126, 234, 0.6)' 
              : '0 10px 40px rgba(102, 126, 234, 0.4)'
          }}
          aria-label="Check if Amit has visited this place"
        >
          <AnimatePresence mode="wait">
            {!isExpanded ? (
              <motion.div
                key="avatar"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="relative"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/amit-avatar.svg" 
                  alt="Amit"
                  className="amit-avatar w-10 h-10 rounded-full border-3 border-white"
                />
                {hasAmitVisited && (
                  <motion.span 
                    className="absolute -top-1 -right-1 bg-white text-pink-500 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    ✓
                  </motion.span>
                )}
              </motion.div>
            ) : (
              <motion.span
                key="text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium px-4"
              >
                {hasAmitVisited ? "Amit was here! 🎉" : "Show Amit's places"}
              </motion.span>
            )}
          </AnimatePresence>
          
          {/* Floating emojis on hover */}
          {isHovered && (
            <FloatingEmojis 
              emojis={['🚶', '📸', '✨', '🗺️']}
              trigger={isHovered}
            />
          )}
        </motion.button>
        
        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && !isExpanded && (
            <motion.div
              className="amit-tooltip"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              {getTooltipText()}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Celebration overlay */}
      {showCelebration && (
        <CelebrationOverlay 
          onComplete={() => setShowCelebration(false)}
        />
      )}

      {/* Modal */}
      <AmitSearchModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false)
          setSecretMode('none')
        }}
      />
    </>
  )
}