'use client'

import { useState, useEffect } from 'react'
import { Search, X, MapPin, MessageCircle, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { amitRealVisitedPlaces, type AmitRealPlace } from '@/data/amit-real-visited-places'
import { useRouter } from 'next/navigation'

interface PlaceResultProps {
  place: AmitRealPlace
  onClick: () => void
}

function PlaceResult({ place, onClick }: PlaceResultProps) {
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

interface AmitSearchModalProps {
  isOpen: boolean
  onClose: () => void
  showFavoritesOnly?: boolean
}

export default function AmitSearchModal({ isOpen, onClose, showFavoritesOnly = false }: AmitSearchModalProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<AmitRealPlace[]>([])
  const [, setShowSuggestForm] = useState(false)
  const [noResults, setNoResults] = useState(false)
  
  // Filter for favorites if requested
  useEffect(() => {
    if (showFavoritesOnly) {
      const favorites = amitRealVisitedPlaces.filter(place => 
        place.rating && place.rating >= 4.5
      )
      setResults(favorites)
    }
  }, [showFavoritesOnly])

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    
    if (searchQuery.trim().length < 2) {
      setResults(showFavoritesOnly ? amitRealVisitedPlaces.filter(p => p.rating && p.rating >= 4.5) : [])
      setNoResults(false)
      setShowSuggestForm(false)
      return
    }

    const searchResults = amitRealVisitedPlaces.filter(place => 
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.notes.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    // Apply favorites filter if active
    const filteredResults = showFavoritesOnly 
      ? searchResults.filter(place => place.rating && place.rating >= 4.5)
      : searchResults
      
    setResults(filteredResults)
    setNoResults(filteredResults.length === 0)
    setShowSuggestForm(filteredResults.length === 0)
  }

  const handlePlaceClick = (place: AmitRealPlace) => {
    const placeSlug = place.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
    router.push(`/places/${placeSlug}`)
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">
                {showFavoritesOnly ? "Amit's Favorite Places" : "Has Amit Been Here?"}
              </h2>
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
                placeholder={showFavoritesOnly ? "Search favorite places..." : "Search for a place..."}
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
                <button
                  onClick={() => setShowSuggestForm(true)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Suggest This Place
                </button>
              </div>
            )}

            {query.trim().length === 0 && !showFavoritesOnly && (
              <div className="p-6 text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Search Places</h3>
                <p className="text-sm text-gray-600">
                  Type to search through all the places I&apos;ve visited in Indiranagar
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}