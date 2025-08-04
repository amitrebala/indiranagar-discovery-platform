export default function CSSTestPage() {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-neutral-50 to-primary-50">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <h1 className="text-4xl font-bold text-center mb-8 text-neutral-900">
          CSS Variables & Tailwind Utilities Test
        </h1>

        {/* Gradient Background Tests */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Gradient Backgrounds</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-32 bg-gradient-hero rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">Hero Gradient</span>
            </div>
            <div className="h-32 bg-gradient-card rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">Card Gradient</span>
            </div>
            <div className="h-32 bg-gradient-warm rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">Warm Gradient</span>
            </div>
            <div className="h-32 bg-gradient-cool rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">Cool Gradient</span>
            </div>
            <div className="h-32 bg-gradient-sunset rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">Sunset Gradient</span>
            </div>
            <div className="h-32 bg-gradient-ocean rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">Ocean Gradient</span>
            </div>
          </div>
        </section>

        {/* Shadow System Tests */}  
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Shadow System</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-lg shadow-subtle">
              <h3 className="font-semibold mb-2">Subtle Shadow</h3>
              <p className="text-sm text-neutral-600">Default shadow</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-depth">
              <h3 className="font-semibold mb-2">Depth Shadow</h3>
              <p className="text-sm text-neutral-600">Enhanced depth</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-hover">
              <h3 className="font-semibold mb-2">Hover Shadow</h3>
              <p className="text-sm text-neutral-600">Interaction state</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-3xl">
              <h3 className="font-semibold mb-2">3XL Shadow</h3>
              <p className="text-sm text-neutral-600">Maximum depth</p>
            </div>
          </div>
        </section>

        {/* Color System Tests */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Enhanced Color System</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Primary Colors */}
            <div className="space-y-2">
              <h3 className="font-semibold">Primary Colors</h3>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-400 rounded"></div>
                  <span className="text-sm">primary-400</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-500 rounded"></div>
                  <span className="text-sm">primary-500</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-600 rounded"></div>
                  <span className="text-sm">primary-600</span>
                </div>
              </div>
            </div>
            
            {/* Secondary Colors */}
            <div className="space-y-2">
              <h3 className="font-semibold">Secondary Colors</h3>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-secondary-400 rounded"></div>
                  <span className="text-sm">secondary-400</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-secondary-500 rounded"></div>
                  <span className="text-sm">secondary-500</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-secondary-600 rounded"></div>
                  <span className="text-sm">secondary-600</span>
                </div>
              </div>
            </div>
            
            {/* Accent Colors */}
            <div className="space-y-2">
              <h3 className="font-semibold">Accent Colors</h3>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-accent-400 rounded"></div>
                  <span className="text-sm">accent-400</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-accent-500 rounded"></div>
                  <span className="text-sm">accent-500</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-accent-600 rounded"></div>
                  <span className="text-sm">accent-600</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Animation Tests */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Animation System</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="h-24 bg-primary-100 rounded-lg flex items-center justify-center animate-float">
              <span className="text-primary-700 font-medium">Float</span>
            </div>
            <div className="h-24 bg-secondary-100 rounded-lg flex items-center justify-center animate-pulse">
              <span className="text-secondary-700 font-medium">Pulse</span>
            </div>
            <div className="h-24 bg-accent-100 rounded-lg flex items-center justify-center animate-glow">
              <span className="text-accent-700 font-medium">Glow</span>
            </div>
            <div className="h-24 bg-neutral-100 rounded-lg flex items-center justify-center animate-slide-up">
              <span className="text-neutral-700 font-medium">Slide Up</span>
            </div>
          </div>
        </section>

        {/* Button & Interactive Element Tests */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Interactive Elements</h2>
          
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-gradient-hero text-white rounded-lg font-semibold shadow-depth hover:shadow-hover transform hover:scale-105 transition-all duration-200">
              Hero Gradient Button
            </button>
            
            <button className="px-6 py-3 bg-gradient-card text-white rounded-lg font-semibold shadow-depth hover:shadow-hover transform hover:scale-105 transition-all duration-200">
              Card Gradient Button
            </button>
            
            <button className="px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold shadow-depth hover:shadow-hover border-2 border-primary-200 hover:border-primary-400 transition-all duration-200">
              Outline Button
            </button>
          </div>
        </section>

        {/* CSS Variables Test */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-4">CSS Variables Test</h2>
          
          <div className="p-6 bg-white rounded-lg shadow-depth">
            <p className="mb-4">Testing CSS variables with inline styles:</p>
            
            <div className="space-y-2">
              <div 
                className="h-12 rounded flex items-center justify-center text-white font-semibold"
                style={{ background: 'var(--gradient-hero)' }}
              >
                CSS Variable: --gradient-hero
              </div>
              
              <div 
                className="h-12 rounded flex items-center justify-center text-white font-semibold"
                style={{ background: 'var(--gradient-card)' }}
              >
                CSS Variable: --gradient-card
              </div>
              
              <div 
                className="p-4 rounded bg-gray-100"
                style={{ boxShadow: 'var(--shadow-depth)' }}
              >
                CSS Variable: --shadow-depth applied
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}