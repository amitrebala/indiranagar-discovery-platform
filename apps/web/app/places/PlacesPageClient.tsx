'use client'

import { useState } from 'react'
import { PlacesGrid } from '@/components/places/PlacesGrid'
import { PlacesFilter } from '@/components/places/PlacesFilter'
import { PlacesHeader } from '@/components/places/PlacesHeader'

export default function PlacesPageClient() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      <PlacesHeader />
      <div className="container mx-auto px-4 py-8">
        <PlacesFilter 
          onSearchChange={setSearchTerm}
          onCategoryChange={setSelectedCategory}
        />
        <PlacesGrid 
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
        />
      </div>
    </div>
  )
}