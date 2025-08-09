'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MapPin, Menu, Home, Map, Building2, User, Users, Settings, Search } from 'lucide-react'
import { useNavigationStore } from '@/stores/navigationStore'
import { Container } from '@/components/layout/Container'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { ShareButton } from '@/components/ui/ShareButton'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

const navigationItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/map', label: 'Map', icon: Map },
  { href: '/places', label: 'Places', icon: Building2 },
  { href: '/discovery', label: 'Discovery', icon: Search },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/about', label: 'About', icon: User },
  { href: '/configuration', label: 'Config', icon: Settings }
]

export function Header() {
  const pathname = usePathname()
  const { toggleMobileMenu, isMobileMenuOpen } = useNavigationStore()
  const [isScrolled, setIsScrolled] = useState(false)
  useKeyboardShortcuts()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={`sticky top-0 z-50 border-b transition-all duration-200 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-neutral-200 dark:border-gray-700 shadow-sm' 
          : 'bg-white dark:bg-gray-900 border-neutral-100 dark:border-gray-800'
      }`}
    >
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link 
            href="/" 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 rounded-lg p-1"
            aria-label="Indiranagar Discovery - Home"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full">
              <MapPin className="w-5 h-5 text-primary-600" aria-hidden="true" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-neutral-900 dark:text-gray-100">
                Indiranagar <span className="text-primary-600">with Amit</span>
              </h1>
              <p className="text-xs text-neutral-600 dark:text-gray-400 -mt-1">
                186 personally visited places
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus:ring-2 focus:ring-offset-2
                    ${isActive 
                      ? 'bg-primary-700 text-white shadow-sm focus:ring-primary-400 focus-visible:outline-primary-400' 
                      : 'text-neutral-700 hover:text-primary-600 hover:bg-primary-50 focus:ring-primary-600 focus-visible:outline-primary-600'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon size={16} aria-hidden="true" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <ShareButton variant="ghost" />
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex items-center justify-center min-w-[48px] min-h-[48px] rounded-lg text-neutral-700 hover:text-primary-600 hover:bg-primary-50 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
            aria-label={isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-haspopup="true"
          >
            <Menu size={20} aria-hidden="true" />
          </button>
        </div>
      </Container>
    </header>
  )
}