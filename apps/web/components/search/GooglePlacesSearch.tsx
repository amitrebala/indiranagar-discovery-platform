'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Search, MapPin, Clock, Star } from 'lucide-react'
import { googlePlacesService } from '@/lib/services/google-places'
import { useDebounce } from '@/hooks/useDebounce'
import { AutocompleteResult } from '@/lib/services/google-places'

interface GooglePlacesSearchProps {
  onPlaceSelect?: (placeId: string, placeName: string) => void
  placeholder?: string
  className?: string
  autoFocus?: boolean
}

export function GooglePlacesSearch({
  onPlaceSelect,
  placeholder = 'Search places in Indiranagar...',
  className = '',
  autoFocus = false
}: GooglePlacesSearchProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [sessionToken, setSessionToken] = useState<string>('')
  
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debouncedQuery = useDebounce(query, 300)

  // Generate session token for billing optimization
  useEffect(() => {
    setSessionToken(Math.random().toString(36).substring(7))
  }, [])

  // Fetch suggestions when query changes
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([])
      return
    }

    const fetchSuggestions = async () => {
      setIsLoading(true)
      try {
        // Center around Indiranagar
        const indiranagarCenter = { lat: 12.9783, lng: 77.6408 }
        const results = await googlePlacesService.getAutocompleteSuggestions(
          debouncedQuery,
          sessionToken,
          indiranagarCenter,
          3000 // 3km radius
        )
        setSuggestions(results)
        setShowSuggestions(true)
      } catch (error) {
        console.error('Error fetching suggestions:', error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSuggestions()
  }, [debouncedQuery, sessionToken])

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectPlace = useCallback(async (suggestion: AutocompleteResult) => {
    setQuery(suggestion.structured_formatting.main_text)
    setShowSuggestions(false)
    setSuggestions([])
    
    // Generate new session token after selection
    setSessionToken(Math.random().toString(36).substring(7))
    
    if (onPlaceSelect) {
      onPlaceSelect(suggestion.place_id, suggestion.structured_formatting.main_text)
    }

    // Get detailed place information
    const details = await googlePlacesService.getPlaceDetails(suggestion.place_id)
    if (details) {
      console.log('Place details:', details)
      // You can use these details to update your UI or store
    }
  }, [onPlaceSelect])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelectPlace(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  const getPlaceIcon = (types: string[]) => {
    if (types.includes('restaurant')) return '🍽️'
    if (types.includes('cafe')) return '☕'
    if (types.includes('bar')) return '🍺'
    if (types.includes('store')) return '🛍️'
    if (types.includes('park')) return '🌳'
    if (types.includes('gym')) return '💪'
    return '📍'
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.place_id}
              onClick={() => handleSelectPlace(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-start space-x-3 border-b border-gray-100 last:border-b-0 transition-colors ${
                selectedIndex === index ? 'bg-gray-50' : ''
              }`}
            >
              <span className="text-2xl mt-0.5">
                {getPlaceIcon(suggestion.types)}
              </span>
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {suggestion.structured_formatting.main_text}
                </div>
                <div className="text-sm text-gray-500 mt-0.5">
                  {suggestion.structured_formatting.secondary_text}
                </div>
                {suggestion.types && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {suggestion.types.slice(0, 3).map(type => (
                      <span
                        key={type}
                        className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
                      >
                        {type.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && query.length >= 2 && suggestions.length === 0 && !isLoading && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <p className="text-gray-500 text-center">No places found</p>
        </div>
      )}
    </div>
  )
}