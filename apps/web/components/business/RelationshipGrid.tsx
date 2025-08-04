'use client'

import BusinessRelationshipCard from './BusinessRelationshipCard'
import { BusinessRelationship } from '@/lib/types/business-relationships'

export function RelationshipGrid({ relationships }: { relationships: BusinessRelationship[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {relationships.map((relationship) => (
        <BusinessRelationshipCard
          key={relationship.id}
          relationship={relationship}
          variant="detailed"
          onEdit={(rel) => console.log('Edit relationship:', rel.id)}
          onViewDetails={(id) => console.log('View details:', id)}
          onAddInteraction={(id) => console.log('Add interaction:', id)}
        />
      ))}
    </div>
  )
}

export function RelationshipGridSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden animate-pulse">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl" />
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
            <div className="flex gap-4 mb-4">
              <div className="h-6 bg-gray-200 rounded w-24" />
              <div className="h-6 bg-gray-200 rounded w-20" />
            </div>
            <div className="h-16 bg-gray-200 rounded" />
          </div>
          <div className="p-6 bg-gray-50">
            <div className="grid grid-cols-3 gap-6">
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}