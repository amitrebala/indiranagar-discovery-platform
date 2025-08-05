'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, Filter, MapPin, Loader2, X, Clock } from 'lucide-react'
import { debounce } from 'lodash'
import { useSearch } from '@/hooks/useSearch'
import { useGeolocation } from '@/hooks/useGeolocation'
import { SearchFilters } from './SearchFilters'
import { SearchResults } from './SearchResults'
import { SearchSuggestions } from './SearchSuggestions'
import { SearchResultsSkeleton } from '@/components/ui/SkeletonLoaders'
import { NaturalLanguageProcessor } from '@/lib/search/natural-language'
import type { SearchFilters as SearchFiltersType } from '@/lib/search/search-engine'

interface SearchInterfaceProps {
  className?: string
  placeholder?: string
  onResultSelect?: (placeId: string) => void
}

export function SearchInterface({ 
  className = '', 
  placeholder = "Search places or try 'quiet morning coffee' or 'good for rainy day'",
  onResultSelect 
}: SearchInterfaceProps) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFiltersType>({
    categories: [],
    price_range: 'any',
    time_requirement: 'any',
    weather_suitability: [],
    crowd_level: 'any',
    accessibility_features: [],
    distance_km: undefined
  })
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  
  const { searchResults, isLoading, search, clearResults } = useSearch()
  const { coordinates: location, getCurrentPosition: requestLocation, isLoading: isLocationLoading } = useGeolocation()

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent-searches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (error) {
        console.warn('Failed to load recent searches:', error)
      }
    }
  }, [])

  // Save recent searches to localStorage
  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) return
    
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 10)
    setRecentSearches(updated)
    localStorage.setItem('recent-searches', JSON.stringify(updated))
  }

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce((searchQuery: string, searchFilters: SearchFiltersType) => {
      if (searchQuery.length > 1) {
        search(searchQuery, searchFilters, location ? { latitude: location.lat, longitude: location.lng } : undefined)
        saveRecentSearch(searchQuery)
      } else {
        clearResults()
      }
    }, 300),
    [search, location, clearResults, saveRecentSearch]
  )

  // Execute search when query or filters change
  useEffect(() => {
    debouncedSearch(query, filters)
    return () => {
      debouncedSearch.cancel()
    }
  }, [query, filters, debouncedSearch])

  // Handle natural language search queries
  const handleNaturalLanguageSearch = (naturalQuery: string) => {
    const parsedQuery = NaturalLanguageProcessor.parseQuery(naturalQuery)
    const contextualFilters = NaturalLanguageProcessor.generateSearchFilters(
      parsedQuery, 
      { 
        current_weather: undefined, // TODO: Get from weather context
        time_of_day: getCurrentTimeOfDay(),
        user_location: location ? { latitude: location.lat, longitude: location.lng } : undefined,
        user_preferences: undefined,
        search_history: recentSearches.map(q => ({ query: q, timestamp: Date.now() }))
      }
    )
    
    setFilters({ ...filters, ...contextualFilters })
    setQuery(naturalQuery)
    setShowSuggestions(false)
  }

  const getCurrentTimeOfDay = (): 'morning' | 'afternoon' | 'evening' => {
    const hour = new Date().getHours()
    if (hour < 12) return 'morning'
    if (hour < 18) return 'afternoon'
    return 'evening'
  }

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setShowSuggestions(value.length > 1)
  }

  const handleClearSearch = () => {
    setQuery('')
    setShowSuggestions(false)
    clearResults()
  }

  const handleRecentSearchClick = (recentQuery: string) => {
    setQuery(recentQuery)
    setShowSuggestions(false)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recent-searches')
  }

  const quickSearchOptions = [
    { label: 'Quiet morning coffee', query: 'quiet morning coffee' },
    { label: 'Rainy day spots', query: 'good for rainy afternoon' },
    { label: 'Romantic dinner', query: 'romantic dinner place' },
    { label: 'Quick lunch', query: 'quick lunch nearby' },
    { label: 'Evening drinks', query: 'evening drinks with friends' },
    { label: 'Weekend brunch', query: 'weekend brunch spot' }
  ]

  return (
    <div className={`search-interface ${className}`} role="search" aria-label="Place search">
      {/* Main Search Input */}
      <div className="relative">
        <div className="search-input-container relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
            
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => setShowSuggestions(query.length > 1 || recentSearches.length > 0)}
              placeholder={placeholder}
              className="w-full pl-10 pr-20 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm focus:outline-none"
              aria-label="Search for places"
              aria-describedby="search-description search-results-status"
              aria-expanded={showSuggestions}
              aria-autocomplete="list"
              aria-controls={showSuggestions ? 'search-suggestions' : undefined}
              role="combobox"
            />
            
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              {query && (
                <button
                  onClick={handleClearSearch}
                  className="p-1 text-gray-400 hover:text-neutral-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600 rounded"
                  aria-label="Clear search"
                  title="Clear search"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
              
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={`p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600 rounded ${
                  isFiltersOpen ? 'text-primary-600' : 'text-gray-400 hover:text-neutral-600'
                }`}
                aria-label={isFiltersOpen ? 'Hide search filters' : 'Show search filters'}
                aria-expanded={isFiltersOpen}
                aria-controls="search-filters"
                title="Search filters"
              >
                <Filter className="w-4 h-4" aria-hidden="true" />
              </button>
              
              <button
                onClick={requestLocation}
                disabled={isLocationLoading}
                className={`p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600 rounded disabled:opacity-50 disabled:cursor-not-allowed ${
                  location ? 'text-success-600' : 'text-gray-400 hover:text-neutral-600'
                }`}
                aria-label={location ? 'Location enabled' : 'Enable location for nearby results'}
                title={location ? 'Location enabled' : 'Enable location for nearby results'}
              >
                {isLocationLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : (
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && (
          <div 
            id="search-suggestions"
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
            role="listbox"
            aria-label="Search suggestions"
          >
            <SearchSuggestions
              query={query}
              onSuggestionClick={handleNaturalLanguageSearch}
              onClose={() => setShowSuggestions(false)}
            />
            
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="border-t border-neutral-100 p-3" role="group" aria-labelledby="recent-searches-heading">
                <div className="flex items-center justify-between mb-2">
                  <h4 id="recent-searches-heading" className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                    Recent Searches
                  </h4>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-400 hover:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-600 rounded px-1"
                    aria-label="Clear recent searches"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-1" role="list">
                  {recentSearches.slice(0, 5).map((recentQuery, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentSearchClick(recentQuery)}
                      className="flex items-center w-full text-left p-2 rounded text-sm text-neutral-600 hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600 min-h-[44px]"
                      role="option"
                      aria-selected="false"
                      aria-label={`Search for ${recentQuery}`}
                    >
                      <Clock className="w-3 h-3 mr-2 text-gray-400" aria-hidden="true" />
                      {recentQuery}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden status for screen readers */}
      <div id="search-description" className="sr-only">
        Search for places using natural language like &apos;quiet morning coffee&apos; or &apos;good for rainy day&apos;
      </div>
      <div id="search-results-status" className="sr-only" aria-live="polite" aria-atomic="true">
        {isLoading ? 'Searching...' : searchResults.length > 0 ? `Found ${searchResults.length} results` : query.length > 1 && searchResults.length === 0 ? 'No results found' : ''}
      </div>

      {/* Advanced Filters */}
      {isFiltersOpen && (
        <div id="search-filters" className="mt-3">
          <SearchFilters 
            filters={filters}
            onFiltersChange={setFilters}
            onClose={() => setIsFiltersOpen(false)}
            userLocation={location ? { latitude: location.lat, longitude: location.lng } : null}
          />
        </div>
      )}

      {/* Quick Search Options */}
      {!query && !isLoading && searchResults.length === 0 && (
        <div className="mt-4" role="region" aria-labelledby="quick-searches-heading">
          <h3 id="quick-searches-heading" className="text-sm font-medium text-neutral-700 mb-3">Quick searches</h3>
          <div className="flex flex-wrap gap-2" role="list">
            {quickSearchOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleNaturalLanguageSearch(option.query)}
                className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-full text-sm text-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600 min-h-[44px] flex items-center"
                role="listitem"
                aria-label={`Quick search for ${option.label}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="mt-4" role="status" aria-live="polite">
          <SearchResultsSkeleton count={6} compact={false} />
        </div>
      )}

      {/* Search Results */}
      {!isLoading && searchResults.length > 0 && (
        <div className="mt-4" role="region" aria-label="Search results">
          <SearchResults 
            results={searchResults}
            query={query}
            onResultSelect={onResultSelect}
            userLocation={location ? { latitude: location.lat, longitude: location.lng } : null}
          />
        </div>
      )}

      {/* No Results */}
      {!isLoading && query.length > 1 && searchResults.length === 0 && (
        <div className="mt-4 text-center py-8" role="status" aria-live="polite">
          <Search className="w-12 h-12 text-neutral-300 mx-auto mb-3" aria-hidden="true" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No places found</h3>
          <p className="text-sm text-neutral-600 mb-4">
            Try adjusting your search terms or filters
          </p>
          <button
            onClick={() => {
              setQuery('')
              setFilters({
                categories: [],
                price_range: 'any',
                time_requirement: 'any',
                weather_suitability: [],
                crowd_level: 'any',
                accessibility_features: [],
                distance_km: undefined
              })
            }}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-600 rounded px-2 py-1 min-h-[44px] flex items-center mx-auto"
            aria-label="Clear search and filters to start over"
          >
            Clear search and filters
          </button>
        </div>
      )}
    </div>
  )
}