'use client'

import { Container } from '@/components/layout/Container'
import { SearchInterface } from '@/components/search/SearchInterface'

export default function SearchPage() {
  const handleResultSelect = (placeId: string) => {
    // Navigate to place details
    window.location.href = `/places/${placeId}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Discover Amazing Places
            </h1>
            <p className="text-gray-600">
              Search for places using natural language or browse by category and filters
            </p>
          </div>

          <SearchInterface
            onResultSelect={handleResultSelect}
            className="bg-white rounded-lg shadow-sm p-6"
          />
        </div>
      </Container>
    </div>
  )
}