import { Metadata } from 'next'
import Link from 'next/link'
import { 
  Settings, 
  BarChart3, 
  Map, 
  Home,
  Users,
  FileText,
  Calendar,
  MapPin,
  Building2,
  MessageSquare
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Configuration | Indiranagar Discovery',
  description: 'Access configuration and administrative tools'
}

const configSections = [
  {
    title: 'Dashboard',
    description: 'Overview of site metrics and activity',
    href: '/admin/dashboard',
    icon: Home,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    title: 'Site Settings',
    description: 'Configure site-wide settings and preferences',
    href: '/admin/settings',
    icon: Settings,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    title: 'Analytics',
    description: 'View detailed analytics and user engagement metrics',
    href: '/admin/analytics',
    icon: BarChart3,
    color: 'bg-green-100 text-green-600'
  },
  {
    title: 'Journey Builder',
    description: 'Create and manage curated journey experiences',
    href: '/admin/journeys',
    icon: Map,
    color: 'bg-orange-100 text-orange-600'
  },
  {
    title: 'Places Management',
    description: 'Add, edit, and manage all places',
    href: '/admin/places',
    icon: MapPin,
    color: 'bg-red-100 text-red-600'
  },
  {
    title: 'Community Suggestions',
    description: 'Review and manage community-submitted places',
    href: '/admin/suggestions',
    icon: Users,
    color: 'bg-indigo-100 text-indigo-600'
  },
  {
    title: 'Events',
    description: 'Manage events and activities',
    href: '/admin/events',
    icon: Calendar,
    color: 'bg-pink-100 text-pink-600'
  },
  {
    title: 'Business Relationships',
    description: 'Manage partnerships and business connections',
    href: '/business/relationships',
    icon: Building2,
    color: 'bg-yellow-100 text-yellow-600'
  },
  {
    title: 'Community Hub',
    description: 'View community activity and engagement',
    href: '/community',
    icon: MessageSquare,
    color: 'bg-teal-100 text-teal-600'
  }
]

export default function ConfigurationPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Configuration Center
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access all administrative and configuration tools for the Indiranagar Discovery Platform
          </p>
        </div>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {configSections.map((section) => {
            const Icon = section.icon
            return (
              <Link
                key={section.href}
                href={section.href}
                className="block group"
              >
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-primary-300 transition-all duration-200 h-full">
                  <div className="flex items-start space-x-4">
                    <div className={`rounded-lg p-3 ${section.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 mb-2">
                        {section.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Access Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              href="/admin/places/new" 
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              + Add New Place
            </Link>
            <Link 
              href="/admin/journeys" 
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              Manage Journeys
            </Link>
            <Link 
              href="/admin/suggestions" 
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              Review Suggestions
            </Link>
            <Link 
              href="/admin/analytics" 
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              View Analytics
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            This configuration center provides direct access to all administrative features.
          </p>
          <p className="mt-2">
            Authentication has been temporarily disabled for easier access.
          </p>
        </div>
      </div>
    </div>
  )
}