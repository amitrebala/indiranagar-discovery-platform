'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MapPin, Menu, Home, Map, Building2, User } from 'lucide-react'
import { useNavigationStore } from '@/stores/navigationStore'
import { Container } from '@/components/layout/Container'

const navigationItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/map', label: 'Map', icon: Map },
  { href: '/places', label: 'Places', icon: Building2 },
  { href: '/about', label: 'About', icon: User }
]

export function Header() {
  const pathname = usePathname()
  const { toggleMobileMenu } = useNavigationStore()
  const [isScrolled, setIsScrolled] = useState(false)

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
          ? 'bg-white/95 backdrop-blur-sm border-neutral-200 shadow-sm' 
          : 'bg-white border-neutral-100'
      }`}
    >
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900">
                Indiranagar Discovery
              </h1>
              <p className="text-xs text-neutral-600 -mt-1">
                Personal place recommendations
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-neutral-700 hover:text-primary hover:bg-primary/5'
                    }
                  `}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-neutral-700 hover:text-primary hover:bg-primary/5 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </Container>
    </header>
  )
}