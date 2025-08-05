import { JourneySelectorWithRotation } from '@/components/homepage/journey/JourneySelectorWithRotation'
import { features } from '@/lib/features'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Indiranagar with Amit</h1>
          <p className="text-gray-600">Discover 186 personally visited places</p>
        </div>
      </header>

      {/* Journey Selector - NOW WORKING */}
      {features.journeySelector && (
        <section className="py-20">
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

    </div>
  )
}
