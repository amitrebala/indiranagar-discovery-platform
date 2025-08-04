import Link from 'next/link'
import { MapPin, Mail, ExternalLink } from 'lucide-react'
import { Container } from './Container'

export function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <Container>
        <div className="py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-full">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Indiranagar Discovery</h3>
                  <p className="text-sm text-white/80">Personal place recommendations</p>
                </div>
              </div>
              <p className="text-white/80 mb-4 max-w-md">
                Discover the authentic Indiranagar through the eyes of a local explorer. 
                Each recommendation comes from personal experience and genuine appreciation 
                for what makes this neighborhood special.
              </p>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Mail size={16} />
                <span>Curated with ❤️ by a local resident</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Explore</h4>
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/map" 
                    className="text-white/80 hover:text-white transition-colors flex items-center gap-1"
                  >
                    Interactive Map
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/places" 
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    All Places
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/about" 
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    About the Curator
                  </Link>
                </li>
              </ul>
            </div>

            {/* Platform Info */}
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li className="text-white/80 text-sm">
                  100+ Personal Explorations
                </li>
                <li className="text-white/80 text-sm">
                  Weather-Aware Recommendations
                </li>
                <li className="text-white/80 text-sm">
                  Local Expertise & Insights
                </li>
                <li className="text-white/80 text-sm">
                  Authentic Neighborhood Guide
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/80 text-sm text-center md:text-left">
              © 2024 Indiranagar Discovery Platform. Built for local exploration and authentic discovery.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-white/60">
                Made with Next.js & Local Knowledge
              </span>
              <a 
                href="https://nextjs.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors flex items-center gap-1"
              >
                <ExternalLink size={12} />
                Next.js
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}