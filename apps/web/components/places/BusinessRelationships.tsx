'use client'

import { Handshake, Users, UserCheck, Shield, Phone } from 'lucide-react'
import { BusinessConnection } from '@/lib/types/memory-palace'

interface BusinessRelationshipsProps {
  connections: BusinessConnection[];
  placeName: string;
}

export default function BusinessRelationships({ connections, placeName }: BusinessRelationshipsProps) {
  if (connections.length === 0) return null

  const getConnectionIcon = (type: string) => {
    switch (type) {
      case 'mention_my_name':
        return <Handshake className="w-5 h-5" />
      case 'personal_friend':
        return <Users className="w-5 h-5" />
      case 'regular_customer':
        return <UserCheck className="w-5 h-5" />
      default:
        return <Shield className="w-5 h-5" />
    }
  }

  const getConnectionStyle = (type: string, trustLevel: string) => {
    const baseStyles = "px-4 py-3 rounded-lg border-2 transition-all hover:shadow-md"
    
    switch (type) {
      case 'mention_my_name':
        return `${baseStyles} bg-yellow-50 border-yellow-200 hover:bg-yellow-100`
      case 'personal_friend':
        return `${baseStyles} bg-green-50 border-green-200 hover:bg-green-100`
      case 'regular_customer':
        return `${baseStyles} bg-blue-50 border-blue-200 hover:bg-blue-100`
      default:
        return `${baseStyles} bg-gray-50 border-gray-200 hover:bg-gray-100`
    }
  }

  const getConnectionText = (type: string) => {
    switch (type) {
      case 'mention_my_name':
        return {
          badge: 'Mention Amit\'s Name',
          color: 'text-yellow-800',
          bgColor: 'bg-yellow-100'
        }
      case 'personal_friend':
        return {
          badge: 'Personal Connection',
          color: 'text-green-800',
          bgColor: 'bg-green-100'
        }
      case 'regular_customer':
        return {
          badge: 'Regular Customer',
          color: 'text-blue-800',
          bgColor: 'bg-blue-100'
        }
      default:
        return {
          badge: 'Business Contact',
          color: 'text-gray-800',
          bgColor: 'bg-gray-100'
        }
    }
  }

  const getTrustBadge = (trustLevel: string) => {
    switch (trustLevel) {
      case 'high':
        return { icon: '🔥', text: 'Highly Recommended', color: 'text-red-600' }
      case 'verified':
        return { icon: '✅', text: 'Verified Connection', color: 'text-green-600' }
      case 'medium':
        return { icon: '👍', text: 'Good Relationship', color: 'text-blue-600' }
      default:
        return { icon: '💙', text: 'Trusted', color: 'text-gray-600' }
    }
  }

  return (
    <section className="business-relationships mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Shield className="w-6 h-6 text-green-600" />
        Personal Connections & Trust Network
      </h2>
      
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200 mb-6">
        <p className="text-green-800 text-sm leading-relaxed">
          <strong>What this means:</strong> These are genuine personal relationships I've built over years of exploring Indiranagar. 
          When I recommend mentioning my name or reference a personal connection, it's because I trust these people and 
          they know the quality of experiences I value.
        </p>
      </div>

      <div className="space-y-4">
        {connections.map((connection, index) => {
          const connectionStyle = getConnectionStyle(connection.type, connection.trust_level)
          const connectionText = getConnectionText(connection.type)
          const trustBadge = getTrustBadge(connection.trust_level)
          
          return (
            <div key={index} className={connectionStyle}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${connectionText.bgColor}`}>
                    {getConnectionIcon(connection.type)}
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${connectionText.bgColor} ${connectionText.color}`}>
                      {connectionText.badge}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{trustBadge.icon}</span>
                  <span className={`text-xs font-medium ${trustBadge.color}`}>
                    {trustBadge.text}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-700 mb-3 leading-relaxed">
                {connection.description}
              </p>
              
              {connection.contact_person && (
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    <strong>Ask for:</strong> {connection.contact_person}
                  </span>
                </div>
              )}
              
              {connection.special_notes && (
                <div className="bg-white bg-opacity-60 p-3 rounded border border-gray-200">
                  <p className="text-sm text-gray-700">
                    <strong>Special note:</strong> {connection.special_notes}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">How to Use These Connections</h4>
            <p className="text-blue-800 text-sm leading-relaxed">
              Simply mention "Amit from the Indiranagar discovery blog sent me" when you visit. 
              These connections are built on mutual respect and shared appreciation for quality experiences. 
              Please be respectful and genuine - it helps maintain these valuable relationships for the community.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}