'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Calendar, MapPin, Clock, Utensils, TrendingUp, Coffee, Users } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { EventsDiscoverySection } from '@/components/discovery/EventsDiscoverySection'
import { PlacesDiscoverySection } from '@/components/discovery/PlacesDiscoverySection'

type DiscoveryTab = 'events' | 'places'

export default function DiscoveryPage() {
  const [activeTab, setActiveTab] = useState<DiscoveryTab>('events')

  const tabs = [
    {
      id: 'events' as const,
      label: 'Event Discovery',
      description: 'Find live events and happenings',
      icon: Calendar,
      count: '5+',
      color: 'bg-purple-500',
    },
    {
      id: 'places' as const,
      label: 'Place Discovery',
      description: 'Discover new places to visit',
      icon: MapPin,
      count: '186',
      color: 'bg-primary-500',
    },
  ]

  return (
    <Container>
      <div className="py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
            <Search className="w-4 h-4" />
            Discovery Hub
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            Discover <span className="text-primary-600">Indiranagar</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your gateway to finding the perfect events and places in Bangalore's most vibrant neighborhood
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative flex items-center gap-4 p-6 rounded-xl transition-all duration-300
                  ${isActive 
                    ? 'bg-white shadow-lg ring-2 ring-primary-500 ring-offset-2' 
                    : 'bg-white/50 hover:bg-white/80 hover:shadow-md'
                  }
                `}
              >
                <div className={`p-3 rounded-lg ${tab.color} text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className={`font-semibold text-lg ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                    {tab.label}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {tab.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="text-xs text-gray-500">
                      {tab.count} available
                    </span>
                  </div>
                </div>
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Live Events</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-200" />
            </div>
            <p className="text-purple-100 text-sm mt-2">Updated daily</p>
          </div>
          
          <div className="bg-gradient-to-r from-primary-500 to-blue-500 text-white p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 text-sm">Places Visited</p>
                <p className="text-2xl font-bold">186</p>
              </div>
              <MapPin className="w-8 h-8 text-primary-200" />
            </div>
            <p className="text-primary-100 text-sm mt-2">Personally verified</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Last Updated</p>
                <p className="text-2xl font-bold">2h</p>
              </div>
              <Clock className="w-8 h-8 text-green-200" />
            </div>
            <p className="text-green-100 text-sm mt-2">Auto-refresh enabled</p>
          </div>
        </div>

        {/* Quick Discovery Links */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Discovery</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link 
              href="/foodie-adventure"
              className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <Utensils className="w-5 h-5 text-orange-500" />
              <div>
                <p className="font-medium text-sm">Foodie Adventure</p>
                <p className="text-xs text-gray-500">Culinary journey</p>
              </div>
            </Link>
            <Link 
              href="/journeys"
              className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <Coffee className="w-5 h-5 text-brown-500" />
              <div>
                <p className="font-medium text-sm">Curated Journeys</p>
                <p className="text-xs text-gray-500">Themed walks</p>
              </div>
            </Link>
            <Link 
              href="/analytics"
              className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-sm">Analytics</p>
                <p className="text-xs text-gray-500">Insights & trends</p>
              </div>
            </Link>
            <Link 
              href="/community"
              className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <Users className="w-5 h-5 text-purple-500" />
              <div>
                <p className="font-medium text-sm">Community</p>
                <p className="text-xs text-gray-500">Join discussion</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Content Sections */}
        <div className="min-h-[600px]">
          {activeTab === 'events' && <EventsDiscoverySection />}
          {activeTab === 'places' && <PlacesDiscoverySection />}
        </div>
      </div>
    </Container>
  )
}