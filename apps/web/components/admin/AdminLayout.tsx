'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Settings, 
  BarChart3, 
  Map, 
  Home,
  Users,
  FileText,
  Calendar
} from 'lucide-react'

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Journey Builder', href: '/admin/journeys', icon: Map },
    { name: 'Places', href: '/admin/places', icon: FileText },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Community', href: '/admin/community', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            <Link 
              href="/" 
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to Site
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-[calc(100vh-4rem)]">
          <div className="px-3 py-4">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`
                        flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md
                        ${isActive 
                          ? 'bg-gray-100 text-gray-900' 
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                        }
                      `}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}