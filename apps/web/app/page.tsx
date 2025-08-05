import { DynamicHeroSection } from '@/components/homepage/hero/DynamicHeroSection'
import { JourneySelectorWithRotation } from '@/components/homepage/journey/JourneySelectorWithRotation'
import { AmitDashboard } from '@/components/homepage/dashboard/AmitDashboard'
import { FeaturedPlaces } from '@/components/homepage/FeaturedPlaces'

export default function Home() {
  return (
    <>
      {/* Dynamic Hero Section with time/weather-aware background */}
      <DynamicHeroSection />
      
      {/* Journey Selector with enhanced UX */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Choose Your Indiranagar Adventure</h2>
            <p className="text-xl text-gray-600">Curated journeys designed by Amit for every type of explorer</p>
          </div>
          <JourneySelectorWithRotation 
            itemsPerPage={3}
            autoRotateInterval={15000}
          />
        </div>
      </section>
      
      {/* Amit's Live Dashboard - Personal touch */}
      <AmitDashboard />
      
      {/* Featured Places - Enhanced showcase */}
      <FeaturedPlaces />
    </>
  )
}
