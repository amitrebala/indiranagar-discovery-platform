'use client'

import { useState } from 'react'
import JourneyExperienceCard from '@/components/journeys/JourneyExperienceCard'
import { useJourneys } from '@/hooks/useJourneys'
import { JourneyMood, JourneyDifficulty } from '@/lib/types/journey'
import { Search, Filter, Loader2 } from 'lucide-react'

export default function ClientJourneyList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMood, setSelectedMood] = useState<JourneyMood | undefined>()
  const [selectedDifficulty, setSelectedDifficulty] = useState<JourneyDifficulty | undefined>()
  
  const { journeys, loading, error, setFilters } = useJourneys({
    mood: selectedMood,
    difficulty: selectedDifficulty
  })

  const filteredJourneys = journeys.filter(journey => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      return journey.name?.toLowerCase().includes(search) || 
             journey.description?.toLowerCase().includes(search) ||
             journey.tags?.some(tag => tag.toLowerCase().includes(search))
    }
    return true
  })

  const moods: JourneyMood[] = ['contemplative', 'energetic', 'social', 'cultural', 'culinary']
  const difficulties: JourneyDifficulty[] = ['easy', 'moderate', 'challenging']

  return (
    <>
      {/* Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search journeys..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Mood Filter */}
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={selectedMood || ''}
                onChange={(e) => {
                  const mood = e.target.value as JourneyMood | ''
                  setSelectedMood(mood || undefined)
                  setFilters({ mood: mood || undefined })
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Moods</option>
                {moods.map(mood => (
                  <option key={mood} value={mood}>
                    {mood.charAt(0).toUpperCase() + mood.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2">
              <select
                value={selectedDifficulty || ''}
                onChange={(e) => {
                  const difficulty = e.target.value as JourneyDifficulty | ''
                  setSelectedDifficulty(difficulty || undefined)
                  setFilters({ difficulty: difficulty || undefined })
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Levels</option>
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Journey Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Error loading journeys. Please try again.</p>
          </div>
        ) : filteredJourneys.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No journeys found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJourneys.map((journey) => (
              <JourneyExperienceCard
                key={journey.id}
                journey={journey}
                onStart={() => {
                  // Use the journey ID for navigation
                  window.location.href = `/journeys/${journey.id}`
                }}
              />
            ))}
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && (
          <div className="mt-8 text-center text-gray-600">
            Showing {filteredJourneys.length} of {journeys.length} journeys
          </div>
        )}
      </div>
    </>
  )
}