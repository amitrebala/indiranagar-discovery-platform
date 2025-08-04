'use client'

import { GradientText } from './GradientText'

export function DesignSystemTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Typography Tests */}
        <section className="space-y-4">
          <h2 className="text-h2 font-bold text-neutral-900">Typography & Gradients</h2>
          
          <div className="space-y-2">
            <div className="font-display text-hero font-bold">
              <GradientText gradient="hero">Display Font Hero Size</GradientText>
            </div>
            
            <div className="font-display text-h1 font-bold">
              <GradientText gradient="textAccent">Display Font H1 Size</GradientText>
            </div>
            
            <div className="font-body text-h2 font-semibold text-neutral-800">
              Body Font H2 Size
            </div>
            
            <div className="font-accent text-h3 font-medium text-neutral-700">
              Accent Font H3 Size
            </div>
            
            <p className="font-body text-base text-neutral-600 max-w-2xl">
              This is body text demonstrating the Inter font family with proper line height and spacing. The design system provides consistent typography across all components.
            </p>
          </div>
        </section>

        {/* Color & Gradient Tests */}
        <section className="space-y-4">
          <h2 className="text-h2 font-bold text-neutral-900">Colors & Gradients</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Primary Colors */}
            <div className="space-y-2">
              <h3 className="font-semibold text-neutral-800">Primary Colors</h3>
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-primary-400 rounded"></div>
                <div className="w-8 h-8 bg-primary-500 rounded"></div>
                <div className="w-8 h-8 bg-primary-600 rounded"></div>
              </div>
            </div>
            
            {/* Secondary Colors */}
            <div className="space-y-2">
              <h3 className="font-semibold text-neutral-800">Secondary Colors</h3>
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-secondary-400 rounded"></div>
                <div className="w-8 h-8 bg-secondary-500 rounded"></div>
                <div className="w-8 h-8 bg-secondary-600 rounded"></div>
              </div>
            </div>
            
            {/* Accent Colors */}
            <div className="space-y-2">
              <h3 className="font-semibold text-neutral-800">Accent Colors</h3>
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-accent-400 rounded"></div>
                <div className="w-8 h-8 bg-accent-500 rounded"></div>
                <div className="w-8 h-8 bg-accent-600 rounded"></div>
              </div>
            </div>
          </div>
          
          {/* Gradient Backgrounds */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="h-24 bg-gradient-hero rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">Hero Gradient</span>
            </div>
            <div className="h-24 bg-gradient-card rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">Card Gradient</span>
            </div>
            <div className="h-24 bg-gradient-warm rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">Warm Gradient</span>
            </div>
          </div>
        </section>

        {/* Shadow Tests */}
        <section className="space-y-4">
          <h2 className="text-h2 font-bold text-neutral-900">Shadows & Depth</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="h-24 bg-white rounded-lg shadow-subtle flex items-center justify-center">
              <span className="text-neutral-600 font-medium">Subtle</span>
            </div>
            <div className="h-24 bg-white rounded-lg shadow-depth flex items-center justify-center">
              <span className="text-neutral-600 font-medium">Depth</span>
            </div>
            <div className="h-24 bg-white rounded-lg shadow-hover flex items-center justify-center">
              <span className="text-neutral-600 font-medium">Hover</span>
            </div>
            <div className="h-24 bg-white rounded-lg shadow-3xl flex items-center justify-center">
              <span className="text-neutral-600 font-medium">3XL</span>
            </div>
          </div>
        </section>

        {/* Animation Tests */}
        <section className="space-y-4">
          <h2 className="text-h2 font-bold text-neutral-900">Animations</h2>
          
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

        {/* Interactive Elements */}
        <section className="space-y-4">
          <h2 className="text-h2 font-bold text-neutral-900">Interactive Elements</h2>
          
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-gradient-hero text-white rounded-lg font-semibold shadow-depth hover:shadow-hover transform hover:scale-105 transition-all duration-200">
              Gradient Button
            </button>
            
            <button className="px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold shadow-depth hover:shadow-hover border-2 border-primary-200 hover:border-primary-400 transition-all duration-200">
              Outline Button
            </button>
            
            <button className="px-6 py-3 bg-neutral-900 text-white rounded-lg font-semibold shadow-depth hover:shadow-hover hover:bg-neutral-800 transition-all duration-200">
              Dark Button
            </button>
          </div>
        </section>

        {/* Card Examples */}
        <section className="space-y-4">
          <h2 className="text-h2 font-bold text-neutral-900">Card Components</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Simple Card */}
            <div className="bg-white rounded-2xl p-6 shadow-depth hover:shadow-hover transition-all duration-200 border border-neutral-200">
              <h3 className="font-display text-xl font-semibold text-neutral-900 mb-2">
                Simple Card
              </h3>
              <p className="text-neutral-600 mb-4">
                A clean card design with subtle shadows and smooth hover effects.
              </p>
              <button className="text-primary-600 font-semibold hover:text-primary-700">
                Learn More →
              </button>
            </div>
            
            {/* Gradient Card */}
            <div className="bg-gradient-card rounded-2xl p-6 shadow-depth hover:shadow-hover transition-all duration-200 text-white">
              <h3 className="font-display text-xl font-semibold mb-2">
                Gradient Card
              </h3>
              <p className="text-white/90 mb-4">
                A vibrant card with gradient background and enhanced visual appeal.
              </p>
              <button className="text-white font-semibold hover:underline">
                Explore →
              </button>
            </div>
            
            {/* Glass Card */}
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-depth hover:shadow-hover transition-all duration-200 border border-white/30">
              <h3 className="font-display text-xl font-semibold text-neutral-900 mb-2">
                Glass Card
              </h3>
              <p className="text-neutral-700 mb-4">
                Modern glassmorphism effect with backdrop blur and transparency.
              </p>
              <button className="text-primary-600 font-semibold hover:text-primary-700">
                Discover →
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}