import { GradientText } from '@/components/ui/GradientText'

export default function ComponentTestPage() {
  return (
    <div className="min-h-screen p-8 bg-neutral-50">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <h1 className="text-4xl font-bold text-center mb-8 text-neutral-900">
          Design System Components Test
        </h1>

        {/* GradientText Tests */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-4">GradientText Component</h2>
          
          <div className="space-y-4">
            <div className="p-6 bg-white rounded-lg shadow-depth">
              <p className="text-sm text-neutral-600 mb-3">Hero gradient:</p>
              <GradientText gradient="hero" className="text-4xl font-bold">
                Hero Gradient Text
              </GradientText>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-depth">
              <p className="text-sm text-neutral-600 mb-3">Card gradient:</p>
              <GradientText gradient="card" className="text-3xl font-semibold">
                Card Gradient Text
              </GradientText>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-depth">
              <p className="text-sm text-neutral-600 mb-3">Text accent gradient (default):</p>
              <GradientText className="text-2xl font-medium">
                Default Text Accent Gradient
              </GradientText>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-depth">
              <p className="text-sm text-neutral-600 mb-3">Warm gradient:</p>
              <GradientText gradient="warm" className="text-2xl font-medium">
                Warm Gradient Text
              </GradientText>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-depth">
              <p className="text-sm text-neutral-600 mb-3">Cool gradient:</p>
              <GradientText gradient="cool" className="text-2xl font-medium">
                Cool Gradient Text
              </GradientText>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-depth">
              <p className="text-sm text-neutral-600 mb-3">Ocean gradient:</p>
              <GradientText gradient="ocean" className="text-2xl font-medium">
                Ocean Gradient Text
              </GradientText>
            </div>
          </div>
        </section>

        {/* Enhanced Button Examples */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Enhanced Buttons</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="px-6 py-3 bg-gradient-hero text-white rounded-xl font-semibold shadow-depth hover:shadow-hover transform hover:scale-105 transition-all duration-200">
              <GradientText gradient="hero" className="text-white">
                Hero Button
              </GradientText>
            </button>
            
            <button className="px-6 py-3 bg-gradient-card text-white rounded-xl font-semibold shadow-depth hover:shadow-hover transform hover:scale-105 transition-all duration-200">
              Card Gradient Button
            </button>
            
            <button className="px-6 py-3 bg-white text-transparent rounded-xl font-semibold shadow-depth hover:shadow-hover border-2 border-primary-200 hover:border-primary-400 transition-all duration-200">
              <GradientText gradient="hero">
                Gradient Text Button
              </GradientText>
            </button>
          </div>
        </section>

        {/* Card Examples with Hover Effects */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Interactive Cards</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-depth hover:shadow-hover transform hover:scale-105 transition-all duration-300 border border-neutral-200">
              <h3 className="font-display text-xl font-semibold text-neutral-900 mb-2">
                <GradientText gradient="hero">
                  Enhanced Card
                </GradientText>
              </h3>
              <p className="text-neutral-600 mb-4">
                A card with gradient text, enhanced shadows, and smooth hover animations.
              </p>
              <button className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                Learn More →
              </button>
            </div>
            
            <div className="bg-gradient-card rounded-2xl p-6 shadow-depth hover:shadow-hover transform hover:scale-105 transition-all duration-300 text-white">
              <h3 className="font-display text-xl font-semibold mb-2">
                Gradient Background Card
              </h3>
              <p className="text-white/90 mb-4">
                A vibrant card with gradient background and enhanced visual appeal.
              </p>
              <button className="text-white font-semibold hover:underline transition-all">
                Explore →
              </button>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-depth hover:shadow-hover transform hover:scale-105 transition-all duration-300 border border-white/30">
              <h3 className="font-display text-xl font-semibold text-neutral-900 mb-2">
                Glass Morphism Card
              </h3>
              <p className="text-neutral-700 mb-4">
                Modern glassmorphism effect with backdrop blur and transparency.
              </p>
              <button>
                <GradientText gradient="hero" className="font-semibold">
                  Discover →
                </GradientText>
              </button>
            </div>
          </div>
        </section>

        {/* Typography Showcase */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Typography Showcase</h2>
          
          <div className="bg-white rounded-2xl p-8 shadow-depth">
            <div className="space-y-4">
              <h1 className="font-display text-hero font-bold">
                <GradientText gradient="hero">
                  Hero Typography
                </GradientText>
              </h1>
              
              <h2 className="font-display text-h1 font-bold text-neutral-900">
                H1 Typography with Display Font
              </h2>
              
              <h3 className="font-accent text-h2 font-semibold">
                <GradientText gradient="cool">
                  H2 with Accent Font
                </GradientText>
              </h3>
              
              <p className="font-body text-lg text-neutral-700 leading-relaxed">
                This is body text using the Inter font family. It demonstrates optimal readability 
                with proper line height and letter spacing for extended reading.
              </p>
              
              <code className="font-mono text-sm bg-neutral-100 px-2 py-1 rounded">
                Monospace text for code examples
              </code>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}