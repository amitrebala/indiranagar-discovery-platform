'use client';

import React, { useState, useRef } from 'react';
import { 
  usePreferences, 
  useTheme, 
  useAccessibility, 
  useInterfaceDensity, 
  useBehavior 
} from '@/hooks/usePreferences';

interface PreferencesPanelProps {
  onClose?: () => void;
  isOpen?: boolean;
}

export default function PreferencesPanel({ onClose, isOpen = true }: PreferencesPanelProps) {
  const [activeTab, setActiveTab] = useState<'theme' | 'accessibility' | 'interface' | 'behavior' | 'data'>('theme');
  const [showImportExport, setShowImportExport] = useState(false);
  const [importText, setImportText] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { exportPreferences, importPreferences, resetPreferences } = usePreferences();
  const { 
    currentTheme, 
    effectiveTheme, 
    setTheme, 
    enableSystemSync
  } = useTheme();
  const { 
    accessibility, 
    toggleReducedMotion, 
    toggleHighContrast, 
    setFontSize, 
    toggleScreenReaderOptimization, 
    toggleKeyboardNavigation 
  } = useAccessibility();
  const { 
    density, 
    setDensity, 
    toggleTooltips, 
    toggleAnimations 
  } = useInterfaceDensity();
  const { 
    behavior, 
    toggleAutoSave, 
    toggleConfirmActions, 
    toggleTutorials, 
    toggleAnalytics 
  } = useBehavior();

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleExport = () => {
    try {
      const exported = exportPreferences();
      navigator.clipboard.writeText(exported);
      showMessage('success', 'Preferences copied to clipboard!');
    } catch (error) {
      console.error('Export failed:', error);
      showMessage('error', 'Failed to export preferences');
    }
  };

  const handleImport = () => {
    if (!importText.trim()) {
      showMessage('error', 'Please enter preferences data to import');
      return;
    }

    try {
      const success = importPreferences(importText);
      if (success) {
        showMessage('success', 'Preferences imported successfully!');
        setImportText('');
        setShowImportExport(false);
      } else {
        showMessage('error', 'Invalid preferences data');
      }
    } catch (error) {
      console.error('Import failed:', error);
      showMessage('error', 'Failed to import preferences');
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setImportText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all preferences to default? This action cannot be undone.')) {
      resetPreferences();
      showMessage('success', 'Preferences reset to default');
    }
  };

  const tabs = [
    { id: 'theme', label: 'Theme', icon: '🎨' },
    { id: 'accessibility', label: 'Accessibility', icon: '♿' },
    { id: 'interface', label: 'Interface', icon: '⚡' },
    { id: 'behavior', label: 'Behavior', icon: '⚙️' },
    { id: 'data', label: 'Data', icon: '💾' },
  ] as const;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Preferences
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
              aria-label="Close preferences"
            >
              ×
            </button>
          )}
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar Navigation */}
          <div className="w-48 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <nav className="p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Message Display */}
            {message && (
              <div className={`mb-4 p-3 rounded-md ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {message.text}
              </div>
            )}

            {/* Theme Tab */}
            {activeTab === 'theme' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Theme Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Theme Mode</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['light', 'dark', 'auto', 'high-contrast'] as const).map((mode) => (
                          <button
                            key={mode}
                            onClick={() => setTheme(mode)}
                            className={`p-3 rounded-md border text-sm font-medium transition-colors ${
                              currentTheme.mode === mode
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            {mode === 'auto' ? 'System Auto' : mode.charAt(0).toUpperCase() + mode.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">System Sync</label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Automatically follow system theme changes
                        </p>
                      </div>
                      <button
                        onClick={() => enableSystemSync(!currentTheme.systemSync)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          currentTheme.systemSync ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            currentTheme.systemSync ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <p className="text-sm">
                        <strong>Current Theme:</strong> {effectiveTheme}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        This is the theme currently being applied based on your settings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Accessibility Tab */}
            {activeTab === 'accessibility' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Accessibility Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Reduced Motion</label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Disable animations and smooth scrolling
                        </p>
                      </div>
                      <button
                        onClick={toggleReducedMotion}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          accessibility.reducedMotion ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            accessibility.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">High Contrast</label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Increase contrast for better visibility
                        </p>
                      </div>
                      <button
                        onClick={toggleHighContrast}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          accessibility.highContrast ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            accessibility.highContrast ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Font Size</label>
                      <div className="grid grid-cols-4 gap-2">
                        {(['small', 'medium', 'large', 'extra-large'] as const).map((size) => (
                          <button
                            key={size}
                            onClick={() => setFontSize(size)}
                            className={`p-3 rounded-md border text-sm font-medium transition-colors ${
                              accessibility.fontSize === size
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            {size.charAt(0).toUpperCase() + size.slice(1).replace('-', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Screen Reader Optimization</label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Optimize interface for screen readers
                        </p>
                      </div>
                      <button
                        onClick={toggleScreenReaderOptimization}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          accessibility.screenReaderOptimized ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            accessibility.screenReaderOptimized ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Enhanced Keyboard Navigation</label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Improve keyboard navigation with enhanced focus indicators
                        </p>
                      </div>
                      <button
                        onClick={toggleKeyboardNavigation}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          accessibility.keyboardNavigationEnhanced ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            accessibility.keyboardNavigationEnhanced ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Interface Tab */}
            {activeTab === 'interface' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Interface Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Interface Density</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['compact', 'comfortable', 'spacious'] as const).map((densityOption) => (
                          <button
                            key={densityOption}
                            onClick={() => setDensity(densityOption)}
                            className={`p-3 rounded-md border text-sm font-medium transition-colors ${
                              density === densityOption
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            {densityOption.charAt(0).toUpperCase() + densityOption.slice(1)}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Adjust spacing and sizing throughout the interface
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Show Tooltips</label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Display helpful tooltips on hover
                        </p>
                      </div>
                      <button
                        onClick={toggleTooltips}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          showImportExport ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            showImportExport ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Enable Animations</label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Enable interface animations and transitions
                        </p>
                      </div>
                      <button
                        onClick={toggleAnimations}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          accessibility.reducedMotion ? 'bg-gray-400 cursor-not-allowed' : 
                          'bg-blue-600'
                        }`}
                        disabled={accessibility.reducedMotion}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            accessibility.reducedMotion ? 'translate-x-1' : 'translate-x-6'
                          }`}
                        />
                      </button>
                    </div>
                    
                    {accessibility.reducedMotion && (
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900 rounded-md">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          Animations are disabled due to reduced motion preference.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Behavior Tab */}
            {activeTab === 'behavior' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Behavior Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Auto Save</label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Automatically save changes as you work
                        </p>
                      </div>
                      <button
                        onClick={toggleAutoSave}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          behavior.autoSave ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            behavior.autoSave ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Confirm Destructive Actions</label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Show confirmation for delete and reset actions
                        </p>
                      </div>
                      <button
                        onClick={toggleConfirmActions}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          behavior.confirmDestructiveActions ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            behavior.confirmDestructiveActions ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Show Tutorials</label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Display helpful tutorials and onboarding
                        </p>
                      </div>
                      <button
                        onClick={toggleTutorials}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          behavior.showTutorials ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            behavior.showTutorials ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Analytics</label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Help improve the app by sharing usage analytics
                        </p>
                      </div>
                      <button
                        onClick={toggleAnalytics}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          behavior.analyticsEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            behavior.analyticsEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Data Tab */}
            {activeTab === 'data' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Data Management</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <h4 className="font-medium mb-2">Export Preferences</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Export your preferences to back them up or transfer to another device.
                      </p>
                      <button
                        onClick={handleExport}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Export to Clipboard
                      </button>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <h4 className="font-medium mb-2">Import Preferences</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Import preferences from a backup or another device.
                      </p>
                      
                      {!showImportExport ? (
                        <div className="space-x-2">
                          <button
                            onClick={() => setShowImportExport(true)}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                          >
                            Import from Text
                          </button>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                          >
                            Import from File
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json,.txt"
                            onChange={handleFileImport}
                            className="hidden"
                          />
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <textarea
                            value={importText}
                            onChange={(e) => setImportText(e.target.value)}
                            placeholder="Paste your preferences JSON here..."
                            className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-md resize-none bg-white dark:bg-gray-900"
                          />
                          <div className="space-x-2">
                            <button
                              onClick={handleImport}
                              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                            >
                              Import
                            </button>
                            <button
                              onClick={() => {
                                setShowImportExport(false);
                                setImportText('');
                              }}
                              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-red-50 dark:bg-red-900 rounded-md">
                      <h4 className="font-medium mb-2 text-red-800 dark:text-red-200">Reset All Preferences</h4>
                      <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                        This will reset all preferences to their default values. This action cannot be undone.
                      </p>
                      <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        Reset to Defaults
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}