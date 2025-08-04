'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, Home, Map, Building2, User } from 'lucide-react'
import { useNavigationStore } from '@/stores/navigationStore'

const navigationItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/map', label: 'Map', icon: Map },
  { href: '/places', label: 'Places', icon: Building2 },
  { href: '/about', label: 'About', icon: User }
]

export function MobileNav() {
  const pathname = usePathname()
  const { isMobileMenuOpen, closeMobileMenu } = useNavigationStore()

  // Close menu when route changes
  useEffect(() => {
    closeMobileMenu()
  }, [pathname, closeMobileMenu])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  if (!isMobileMenuOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 md:hidden"
        onClick={closeMobileMenu}
        aria-hidden="true"
      />
      
      {/* Slide-out Menu */}
      <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-xl z-50 md:hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={closeMobileMenu}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-500 hover:text-gray-900 hover:bg-neutral-100 transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                        ${isActive 
                          ? 'bg-primary text-white shadow-sm' 
                          : 'text-neutral-700 hover:text-primary hover:bg-primary/5'
                        }
                      `}
                    >
                      <Icon size={18} />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-200">
            <p className="text-xs text-neutral-500 text-center">
              Discover Indiranagar with local expertise
            </p>
          </div>
        </div>
      </div>
    </>
  )
}