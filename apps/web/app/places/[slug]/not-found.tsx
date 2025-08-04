import Link from 'next/link'
import { MapPin } from 'lucide-react'

export default function PlaceNotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Place Not Found</h1>
          <p className="text-gray-600">
            The place you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>
        </div>
        
        <div className="space-y-3">
          <Link
            href="/map"
            className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Browse All Places
          </Link>
          <Link
            href="/"
            className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}