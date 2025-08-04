'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, Home, Map, Building2, User, Users } from 'lucide-react'
import { useNavigationStore } from '@/stores/navigationStore'
import { FocusManager } from '@/components/accessibility/FocusManager'

const navigationItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/map', label: 'Map', icon: Map },
  { href: '/places', label: 'Places', icon: Building2 },
  { href: '/community', label: 'Community', icon: Users },
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
    <FocusManager
      isActive={isMobileMenuOpen}
      onEscape={closeMobileMenu}
      restoreFocus={true}
    >
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 md:hidden"
        onClick={closeMobileMenu}
        aria-hidden="true"
      />
      
      {/* Slide-out Menu */}
      <div 
        id="mobile-navigation"
        className="fixed inset-y-0 right-0 w-64 bg-white shadow-xl z-50 md:hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
        aria-describedby="mobile-menu-description"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200">
            <h2 id="mobile-menu-title" className="text-lg font-semibold text-neutral-900">
              Navigation Menu
            </h2>
            <button
              onClick={closeMobileMenu}
              className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
              aria-label="Close navigation menu"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4" role="navigation" aria-label="Mobile navigation">
            <p id="mobile-menu-description" className="sr-only">
              Navigate to different sections of the website
            </p>
            <ul className="space-y-2" role="list">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <li key={item.href} role="listitem">
                    <Link
                      href={item.href}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2
                        ${isActive 
                          ? 'bg-primary-600 text-white shadow-sm focus:ring-primary-300' 
                          : 'text-neutral-700 hover:text-primary-600 hover:bg-primary-50 focus:ring-primary-600'
                        }
                      `}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon size={18} aria-hidden="true" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-200">
            <p className="text-xs text-neutral-500 text-center" role="contentinfo">
              Discover Indiranagar with local expertise
            </p>
          </div>
        </div>
      </div>
    </FocusManager>
  )
}