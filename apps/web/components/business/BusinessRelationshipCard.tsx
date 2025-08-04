'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Building, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  TrendingUp, 
  Star, 
  Gift,
  ArrowRight,
  MoreVertical,
  MapPin,
  Clock,
  Shield,
  Heart
} from 'lucide-react'
import { BusinessRelationship } from '@/lib/types/business-relationships'

interface BusinessRelationshipCardProps {
  relationship: BusinessRelationship
  variant?: 'detailed' | 'compact' | 'network'
  onEdit?: (relationship: BusinessRelationship) => void
  onViewDetails?: (relationshipId: string) => void
  onAddInteraction?: (relationshipId: string) => void
  showActions?: boolean
}

export default function BusinessRelationshipCard({
  relationship,
  variant = 'detailed',
  onEdit,
  onViewDetails,
  onAddInteraction,
  showActions = true
}: BusinessRelationshipCardProps) {
  const [showSpecialArrangements, setShowSpecialArrangements] = useState(false)

  const getRelationshipTypeIcon = (type: string) => {
    switch (type) {
      case 'mention_my_name':
        return '🤝'
      case 'personal_friend':
        return '👥'
      case 'regular_customer':
        return '⭐'
      case 'business_partner':
        return '🤝'
      case 'supplier':
        return '📦'
      case 'referral_source':
        return '🔄'
      case 'collaborator':
        return '🚀'
      case 'community_connection':
        return '🏘️'
      default:
        return '🔗'
    }
  }

  const getRelationshipTypeColor = (type: string) => {
    switch (type) {
      case 'mention_my_name':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'personal_friend':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'regular_customer':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'business_partner':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'supplier':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'referral_source':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'collaborator':
        return 'bg-pink-100 text-pink-800 border-pink-200'
      case 'community_connection':
        return 'bg-teal-100 text-teal-800 border-teal-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTrustLevelIcon = (level: string) => {
    switch (level) {
      case 'high':
        return <Shield className="w-4 h-4 text-green-600" />
      case 'verified':
        return <Star className="w-4 h-4 text-blue-600" />
      case 'medium':
        return <Heart className="w-4 h-4 text-yellow-600" />
      default:
        return <User className="w-4 h-4 text-gray-600" />
    }
  }

  const getConnectionStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong':
        return 'bg-green-500'
      case 'moderate':
        return 'bg-yellow-500'
      case 'weak':
        return 'bg-orange-500'
      case 'dormant':
        return 'bg-gray-400'
      default:
        return 'bg-gray-300'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getTimeSinceLastInteraction = () => {
    const lastInteraction = new Date(relationship.last_interaction)
    const now = new Date()
    const diffMs = now.getTime() - lastInteraction.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return 'Today'
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 30) {
      return `${diffDays} days ago`
    } else if (diffDays < 365) {
      const diffMonths = Math.floor(diffDays / 30)
      return `${diffMonths} month${diffMonths === 1 ? '' : 's'} ago`
    } else {
      const diffYears = Math.floor(diffDays / 365)
      return `${diffYears} year${diffYears === 1 ? '' : 's'} ago`
    }
  }

  if (variant === 'compact') {
    return (
      <div className="business-relationship-compact bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{relationship.business_name}</h3>
              <p className="text-sm text-gray-600">{relationship.contact_person}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRelationshipTypeColor(relationship.relationship_type)}`}>
              {getRelationshipTypeIcon(relationship.relationship_type)} {relationship.relationship_type.replace('_', ' ')}
            </span>
            <div className="flex items-center gap-1">
              {getTrustLevelIcon(relationship.trust_level)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'network') {
    return (
      <div className="business-relationship-network bg-white rounded-xl border-2 border-gray-200 p-4 hover:border-blue-300 transition-colors">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">{getRelationshipTypeIcon(relationship.relationship_type)}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{relationship.business_name}</h3>
          <p className="text-sm text-gray-600 mb-2">{relationship.contact_person}</p>
          
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className={`w-3 h-3 rounded-full ${getConnectionStrengthColor(relationship.connection_strength)}`} />
            <span className="text-xs text-gray-500 capitalize">{relationship.connection_strength}</span>
          </div>
          
          <div className="text-xs text-gray-500">
            {relationship.special_arrangements.length} arrangement{relationship.special_arrangements.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    )
  }

  // Default detailed variant
  return (
    <div className="business-relationship-detailed bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-gray-900">{relationship.business_name}</h3>
                <Link 
                  href={`/places/${relationship.place_id}`}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <MapPin className="w-4 h-4" />
                </Link>
              </div>
              <p className="text-gray-600 flex items-center gap-2">
                <User className="w-4 h-4" />
                {relationship.contact_person}
              </p>
              {relationship.contact_phone && (
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4" />
                  {relationship.contact_phone}
                </p>
              )}
              {relationship.contact_email && (
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {relationship.contact_email}
                </p>
              )}
            </div>
          </div>
          
          {showActions && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onAddInteraction?.(relationship.id)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Add interaction"
              >
                <TrendingUp className="w-5 h-5" />
              </button>
              <button
                onClick={() => onEdit?.(relationship)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Relationship Type and Status */}
        <div className="flex items-center gap-4 mb-4">
          <span className={`px-3 py-1 rounded-full font-medium border ${getRelationshipTypeColor(relationship.relationship_type)}`}>
            {getRelationshipTypeIcon(relationship.relationship_type)} {relationship.relationship_type.replace('_', ' ')}
          </span>
          <div className="flex items-center gap-2">
            {getTrustLevelIcon(relationship.trust_level)}
            <span className="text-sm text-gray-600 capitalize">{relationship.trust_level} trust</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getConnectionStrengthColor(relationship.connection_strength)}`} />
            <span className="text-sm text-gray-600 capitalize">{relationship.connection_strength} connection</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 leading-relaxed">{relationship.description}</p>
      </div>

      {/* Metrics and Timeline */}
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-900 font-semibold mb-1">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>{formatDate(relationship.established_date)}</span>
            </div>
            <p className="text-xs text-gray-600">Established</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-900 font-semibold mb-1">
              <Clock className="w-4 h-4 text-green-600" />
              <span>{getTimeSinceLastInteraction()}</span>
            </div>
            <p className="text-xs text-gray-600">Last Contact</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-900 font-semibold mb-1">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span>{relationship.interaction_history.length}</span>
            </div>
            <p className="text-xs text-gray-600">Interactions</p>
          </div>
        </div>
      </div>

      {/* Special Arrangements */}
      {relationship.special_arrangements.length > 0 && (
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={() => setShowSpecialArrangements(!showSpecialArrangements)}
            className="flex items-center justify-between w-full text-left mb-4"
          >
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Gift className="w-5 h-5 text-green-600" />
              Special Arrangements ({relationship.special_arrangements.length})
            </h4>
            <ArrowRight className={`w-4 h-4 text-gray-400 transition-transform ${showSpecialArrangements ? 'rotate-90' : ''}`} />
          </button>
          
          {showSpecialArrangements && (
            <div className="space-y-3">
              {relationship.special_arrangements.filter(arr => arr.is_active).map((arrangement) => (
                <div key={arrangement.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-medium text-green-900 capitalize">
                        {arrangement.type.replace('_', ' ')}
                      </h5>
                      <p className="text-green-800 text-sm mt-1">{arrangement.description}</p>
                      {arrangement.terms && (
                        <p className="text-green-700 text-xs mt-2">
                          <strong>Terms:</strong> {arrangement.terms}
                        </p>
                      )}
                    </div>
                    {arrangement.max_usage && (
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        {arrangement.usage_count}/{arrangement.max_usage}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Referral Benefits */}
      {relationship.referral_benefits.length > 0 && (
        <div className="p-6 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-600" />
            Referral Benefits
          </h4>
          
          <div className="grid gap-3 md:grid-cols-2">
            {relationship.referral_benefits.filter(benefit => benefit.is_active).map((benefit) => (
              <div key={benefit.id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <h5 className="font-medium text-yellow-900 capitalize">
                  {benefit.type.replace('_', ' ')}
                </h5>
                <p className="text-yellow-800 text-sm mt-1">{benefit.description}</p>
                {benefit.conditions.length > 0 && (
                  <div className="mt-2">
                    <p className="text-yellow-700 text-xs font-medium">Conditions:</p>
                    <ul className="text-yellow-700 text-xs mt-1 list-disc list-inside">
                      {benefit.conditions.map((condition, index) => (
                        <li key={index}>{condition}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {relationship.tags.length > 0 && (
        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            {relationship.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex gap-3">
            <button
              onClick={() => onViewDetails?.(relationship.id)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              View Details
            </button>
            <button
              onClick={() => onAddInteraction?.(relationship.id)}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Add Interaction
            </button>
          </div>
        </div>
      )}
    </div>
  )
}