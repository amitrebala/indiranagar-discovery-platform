import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import ClientJourneyDetail from './ClientJourneyDetail'

interface JourneyPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function JourneyPage({ params }: JourneyPageProps) {
  const { slug } = await params

  return (
    <>
      {/* Back Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link 
            href="/journeys"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">All Journeys</span>
          </Link>
        </div>
      </div>

      {/* Journey Content */}
      <Suspense 
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        }
      >
        <ClientJourneyDetail slug={slug} />
      </Suspense>
    </>
  )
}