'use client';

import React, { useState } from 'react';
import PreferencesPanel from '@/components/settings/PreferencesPanel';
import { usePreferences, useTheme, useAccessibility, useInterfaceDensity } from '@/hooks/usePreferences';

export default function PreferencesDemoPage() {
  const [showPreferences, setShowPreferences] = useState(false);
  const { preferences } = usePreferences();
  const { effectiveTheme, toggleTheme } = useTheme();
  const { accessibility } = useAccessibility();
  const { density } = useInterfaceDensity();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Personalization System Demo</h1>
          <p className="text-gray-600 dark:text-gray-400">
            This page demonstrates the comprehensive personalization system with theme switching, 
            accessibility features, and interface density controls.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowPreferences(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Open Preferences Panel
            </button>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Toggle Theme
            </button>
          </div>
        </div>

        {/* Current Settings Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-semibold mb-2">Theme Settings</h3>
            <div className="text-sm space-y-1">
              <p><strong>Mode:</strong> {preferences.theme.mode}</p>
              <p><strong>Effective:</strong> {effectiveTheme}</p>
              <p><strong>System Sync:</strong> {preferences.theme.systemSync ? 'Yes' : 'No'}</p>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-semibold mb-2">Accessibility</h3>
            <div className="text-sm space-y-1">
              <p><strong>Reduced Motion:</strong> {accessibility.reducedMotion ? 'Yes' : 'No'}</p>
              <p><strong>High Contrast:</strong> {accessibility.highContrast ? 'Yes' : 'No'}</p>
              <p><strong>Font Size:</strong> {accessibility.fontSize}</p>
              <p><strong>Screen Reader:</strong> {accessibility.screenReaderOptimized ? 'Yes' : 'No'}</p>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-semibold mb-2">Interface</h3>
            <div className="text-sm space-y-1">
              <p><strong>Density:</strong> {density}</p>
              <p><strong>Animations:</strong> {preferences.interface.animationsEnabled ? 'Enabled' : 'Disabled'}</p>
              <p><strong>Tooltips:</strong> {preferences.interface.showTooltips ? 'Enabled' : 'Disabled'}</p>
            </div>
          </div>
        </div>

        {/* Demo Content with Different Densities */}
        <div className="space-y-8">
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Sample Interface Elements</h2>
            
            {/* Button Samples */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Button Variations</h3>
              <div className="space-y-2 space-x-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Primary Button
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                  Secondary Button
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  Outline Button
                </button>
              </div>
            </div>

            {/* Form Elements */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Form Elements</h3>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium mb-1">Text Input</label>
                  <input
                    type="text"
                    placeholder="Enter some text..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Select Dropdown</label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Option 1</option>
                    <option>Option 2</option>
                    <option>Option 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Textarea</label>
                  <textarea
                    placeholder="Enter longer text..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Card Layout */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Card Layout</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium mb-2">Card Title {i}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      This is a sample card content that demonstrates how the interface 
                      density affects spacing and layout.
                    </p>
                    <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      Learn More
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Sample */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Navigation Elements</h3>
              <nav className="flex space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Home</a>
                <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">About</a>
                <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Services</a>
                <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Contact</a>
              </nav>
            </div>

            {/* Animated Elements */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Animated Elements</h3>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                These animations will be disabled if "Reduced Motion" is enabled
              </p>
            </div>
          </div>

          {/* Accessibility Features Demo */}
          <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Accessibility Features</h2>
            
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-md">
                <h4 className="font-medium text-blue-800 dark:text-blue-200">Focus Management</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Tab through the elements on this page to see enhanced focus indicators when 
                  keyboard navigation is enabled.
                </p>
              </div>
              
              <div className="p-3 bg-green-50 dark:bg-green-900 rounded-md">
                <h4 className="font-medium text-green-800 dark:text-green-200">Screen Reader Support</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  All elements have proper ARIA labels and semantic markup for screen reader compatibility.
                </p>
              </div>
              
              <div className="p-3 bg-purple-50 dark:bg-purple-900 rounded-md">
                <h4 className="font-medium text-purple-800 dark:text-purple-200">High Contrast Mode</h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Enable high contrast mode to see improved color contrast ratios that meet WCAG AAA standards.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences Panel */}
        {showPreferences && (
          <PreferencesPanel
            isOpen={showPreferences}
            onClose={() => setShowPreferences(false)}
          />
        )}
      </div>
    </div>
  );
}