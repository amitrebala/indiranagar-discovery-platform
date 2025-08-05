'use client'

import { features } from '@/lib/features'
import { JourneySelector } from '@/components/homepage/journey/JourneySelector'

export default function TestHomepage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Homepage Component Test</h1>
      
      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Feature Flags Status:</h2>
        <ul className="space-y-2">
          <li>Dynamic Hero: <span className={features.dynamicHero ? 'text-green-600' : 'text-red-600'}>{features.dynamicHero ? 'Enabled' : 'Disabled'}</span></li>
          <li>Journey Selector: <span className={features.journeySelector ? 'text-green-600' : 'text-red-600'}>{features.journeySelector ? 'Enabled' : 'Disabled'}</span></li>
          <li>Amit Dashboard: <span className={features.amitDashboard ? 'text-green-600' : 'text-red-600'}>{features.amitDashboard ? 'Enabled' : 'Disabled'}</span></li>
          <li>Live Activity: <span className={features.liveActivity ? 'text-green-600' : 'text-red-600'}>{features.liveActivity ? 'Enabled' : 'Disabled'}</span></li>
        </ul>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Journey Selector Component:</h2>
        {features.journeySelector ? (
          <JourneySelector onSelect={(journey) => console.log('Selected journey:', journey)} />
        ) : (
          <p className="text-gray-600">Journey Selector is disabled via feature flag</p>
        )}
      </div>
    </div>
  )
}