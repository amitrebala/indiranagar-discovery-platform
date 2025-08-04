'use client'

import { useState, useCallback, useEffect } from 'react'
import { usePlaces } from './usePlaces'
import { searchEngine } from '@/lib/search/search-engine'
import type { SearchFilters, SearchResult, Coordinates } from '@/lib/search/search-engine'

interface UseSearchReturn {
  searchResults: SearchResult[]
  isLoading: boolean
  error: string | null
  search: (query: string, filters: SearchFilters, userLocation?: Coordinates) => Promise<void>
  clearResults: () => void
  lastQuery: string
}

export function useSearch(): UseSearchReturn {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastQuery, setLastQuery] = useState('')
  
  const { places } = usePlaces()

  // Update search engine when places change
  useEffect(() => {
    searchEngine.setPlaces(places)
  }, [places])

  const search = useCallback(async (
    query: string,
    filters: SearchFilters,
    userLocation?: Coordinates
  ) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([])
      setLastQuery('')
      return
    }

    setIsLoading(true)
    setError(null)
    setLastQuery(query)

    try {
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 150))

      const context = {
        time_of_day: getCurrentTimeOfDay(),
        user_location: userLocation,
        search_history: getSearchHistory()
      }

      const results = searchEngine.search(query, filters, context)
      setSearchResults(results)
      
      // Save search to history
      saveSearchToHistory(query)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed'
      setError(errorMessage)
      setSearchResults([])
      console.error('Search error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearResults = useCallback(() => {
    setSearchResults([])
    setLastQuery('')
    setError(null)
  }, [])

  return {
    searchResults,
    isLoading,
    error,
    search,
    clearResults,
    lastQuery
  }
}

// Helper functions
function getCurrentTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}

function getSearchHistory() {
  try {
    const history = localStorage.getItem('search-history')
    return history ? JSON.parse(history) : []
  } catch {
    return []
  }
}

function saveSearchToHistory(query: string) {
  try {
    const history = getSearchHistory()
    const newEntry = { query, timestamp: Date.now() }
    const updated = [newEntry, ...history.filter((h: any) => h.query !== query)].slice(0, 50)
    localStorage.setItem('search-history', JSON.stringify(updated))
  } catch (error) {
    console.warn('Failed to save search history:', error)
  }
}