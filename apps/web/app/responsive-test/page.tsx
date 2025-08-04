import { GradientText } from '@/components/ui/GradientText'

export default function ResponsiveTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50">
      <div className="p-4 sm:p-6 lg:p-8">
        
        {/* Header */}
        <header className="text-center mb-8 lg:mb-12">
          <h1 className="text-hero font-bold text-neutral-900 mb-4">
            <GradientText gradient="hero">
              Responsive Design Test
            </GradientText>
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Testing responsive behavior across mobile, tablet, and desktop breakpoints
          </p>
        </header>

        {/* Responsive Grid System */}
        <section className="mb-12">
          <h2 className="text-h2 font-semibold text-neutral-800 mb-6">Responsive Grid</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 shadow-depth">
                <h3 className="font-semibold mb-2">Card {i + 1}</h3>
                <p className="text-sm text-neutral-600">
                  This card adapts to different screen sizes using responsive grid classes.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Typography Scale */}
        <section className="mb-12">
          <h2 className="text-h2 font-semibold text-neutral-800 mb-6">Responsive Typography</h2>
          
          <div className="bg-white rounded-xl p-6 lg:p-8 shadow-depth space-y-6">
            <div>
              <p className="text-sm text-neutral-600 mb-2">Hero text (clamp 2.5rem to 4rem)</p>
              <h1 className="text-hero font-bold">
                <GradientText gradient="hero">
                  Hero Scale Text
                </GradientText>
              </h1>
            </div>
            
            <div>
              <p className="text-sm text-neutral-600 mb-2">H1 text (clamp 2rem to 3rem)</p>
              <h1 className="text-h1 font-bold text-neutral-900">
                H1 Scale Text
              </h1>
            </div>
            
            <div>
              <p className="text-sm text-neutral-600 mb-2">H2 text (clamp 1.5rem to 2rem)</p>
              <h2 className="text-h2 font-semibold text-neutral-900">
                H2 Scale Text
              </h2>
            </div>
            
            <div>
              <p className="text-sm text-neutral-600 mb-2">H3 text (clamp 1.25rem to 1.5rem)</p>
              <h3 className="text-h3 font-semibold text-neutral-900">
                H3 Scale Text
              </h3>
            </div>
            
            <div>
              <p className="text-sm text-neutral-600 mb-2">Body text (responsive line height)</p>
              <p className="text-base lg:text-lg text-neutral-700 leading-relaxed">
                This paragraph text scales appropriately across devices with optimal line height 
                for readability on all screen sizes. The text maintains proper spacing and 
                readability from mobile to desktop viewports.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Elements */}
        <section className="mb-12">
          <h2 className="text-h2 font-semibold text-neutral-800 mb-6">Touch-Friendly Elements</h2>
          
          <div className="bg-white rounded-xl p-6 lg:p-8 shadow-depth space-y-6">
            {/* Large Touch Targets */}
            <div>
              <h3 className="font-semibold mb-4">Large Touch Targets (44px minimum)</h3>
              <div className="flex flex-wrap gap-3">
                <button className="min-h-[44px] px-6 py-3 bg-gradient-hero text-white rounded-lg font-semibold shadow-depth hover:shadow-hover active:scale-98 transition-all duration-200 touch-manipulation">
                  Primary Action
                </button>
                <button className="min-h-[44px] px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold shadow-depth hover:shadow-hover border-2 border-primary-200 hover:border-primary-400 active:scale-98 transition-all duration-200 touch-manipulation">
                  Secondary Action
                </button>
                <button className="min-h-[44px] w-[44px] bg-accent-500 text-white rounded-lg shadow-depth hover:shadow-hover active:scale-98 transition-all duration-200 touch-manipulation flex items-center justify-center">
                  ❤️
                </button>
              </div>
            </div>
            
            {/* Form Elements */}
            <div>
              <h3 className="font-semibold mb-4">Touch-Optimized Form Elements</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full min-h-[44px] px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base touch-manipulation"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base touch-manipulation resize-y"
                    placeholder="Your message here..."
                  />
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Accessibility Features */}
        <section className="mb-12">
          <h2 className="text-h2 font-semibold text-neutral-800 mb-6">Accessibility Features</h2>
          
          <div className="bg-white rounded-xl p-6 lg:p-8 shadow-depth space-y-6">
            {/* Focus States */}
            <div>
              <h3 className="font-semibold mb-4">Focus Management</h3>
              <div className="space-y-3">
                <button className="px-4 py-2 bg-primary-500 text-white rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                  Focusable Button 1
                </button>
                <button className="px-4 py-2 bg-secondary-500 text-white rounded focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2">
                  Focusable Button 2
                </button>
                <a href="#skip" className="inline-block px-4 py-2 bg-accent-500 text-white rounded focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2">
                  Focusable Link
                </a>
              </div>
            </div>
            
            {/* ARIA Labels and Semantic HTML */}
            <div>
              <h3 className="font-semibold mb-4">ARIA and Semantic HTML</h3>
              <nav aria-label="Test navigation" className="mb-4">
                <ul className="flex space-x-4">
                  <li><a href="#home" className="text-primary-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded px-2 py-1">Home</a></li>
                  <li><a href="#about" className="text-primary-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded px-2 py-1">About</a></li>
                  <li><a href="#contact" className="text-primary-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded px-2 py-1">Contact</a></li>
                </ul>
              </nav>
              
              <div role="alert" aria-live="polite" className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">✓ This is a success message with proper ARIA attributes</p>
              </div>
            </div>
            
            {/* Color Contrast */}
            <div>
              <h3 className="font-semibold mb-4">Color Contrast Testing</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-900 text-white rounded-lg">
                  <p className="font-semibold">High Contrast (AA)</p>
                  <p className="text-sm opacity-90">White text on dark background ensures readability</p>
                </div>
                <div className="p-4 bg-primary-600 text-white rounded-lg">
                  <p className="font-semibold">Brand Primary (AA)</p>
                  <p className="text-sm opacity-90">Brand colors meet accessibility standards</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Breakpoint Indicators */}
        <section className="mb-12">
          <h2 className="text-h2 font-semibold text-neutral-800 mb-6">Breakpoint Indicators</h2>
          
          <div className="bg-white rounded-xl p-6 lg:p-8 shadow-depth">
            <div className="flex items-center justify-center">
              <div className="px-4 py-2 rounded-lg font-semibold text-white sm:hidden bg-red-500">
                📱 Mobile (&lt; 640px)
              </div>
              <div className="px-4 py-2 rounded-lg font-semibold text-white hidden sm:block md:hidden bg-orange-500">
                📱 Small (640px+)
              </div>
              <div className="px-4 py-2 rounded-lg font-semibold text-white hidden md:block lg:hidden bg-yellow-500">
                💻 Medium (768px+)
              </div>
              <div className="px-4 py-2 rounded-lg font-semibold text-white hidden lg:block xl:hidden bg-green-500">
                🖥️ Large (1024px+)
              </div>
              <div className="px-4 py-2 rounded-lg font-semibold text-white hidden xl:block bg-blue-500">
                🖥️ Extra Large (1280px+)
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}