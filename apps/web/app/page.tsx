import { HeroSection } from '@/components/homepage/HeroSection'
import { FeaturedPlaces } from '@/components/homepage/FeaturedPlaces'
import { DynamicHeroSection } from '@/components/homepage/hero/DynamicHeroSection'
import { JourneySelector } from '@/components/homepage/journey/JourneySelector'
import { JourneySelectorWithRotation } from '@/components/homepage/journey/JourneySelectorWithRotation'
import { features } from '@/lib/features'

export default function Home() {
  return (
    <>
      {/* Hero Section with feature flag */}
      {features.dynamicHero ? <DynamicHeroSection /> : <HeroSection />}
      
      {/* Journey Selector with feature flag */}
      {features.journeySelector && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Choose Your Indiranagar Adventure</h2>
              <p className="text-xl text-gray-700">Curated journeys designed by Amit for every type of explorer</p>
            </div>
            <JourneySelectorWithRotation 
              itemsPerPage={3}
              autoRotateInterval={15000}
            />
          </div>
        </section>
      )}
      
      {/* Featured Places - always shown */}
      <FeaturedPlaces />
    </>
  )
}
