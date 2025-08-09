import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import ClientJourneyList from './ClientJourneyList'

export default function JourneysPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </Link>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Journey Experiences</h1>
            <p className="mt-2 text-gray-600">
              Curated multi-stop adventures through Indiranagar, designed for every mood and moment.
            </p>
          </div>
        </div>
      </div>

      {/* Journey List with Filters */}
      <Suspense 
        fallback={
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        }
      >
        <ClientJourneyList />
      </Suspense>
    </div>
  )
}