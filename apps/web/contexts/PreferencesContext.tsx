'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import PreferencesManager, { 
  UserPreferences, 
  AccessibilityPreferences,
  ThemePreferences,
  InterfacePreferences,
  BehaviorPreferences 
} from '@/lib/preferences/PreferencesManager';

interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  updateAccessibility: (updates: Partial<AccessibilityPreferences>) => void;
  updateTheme: (updates: Partial<ThemePreferences>) => void;
  updateInterface: (updates: Partial<InterfacePreferences>) => void;
  updateBehavior: (updates: Partial<BehaviorPreferences>) => void;
  resetPreferences: () => void;
  exportPreferences: () => string;
  importPreferences: (json: string) => boolean;
  getEffectiveTheme: () => 'light' | 'dark' | 'high-contrast';
  isLoading: boolean;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

interface PreferencesProviderProps {
  children: ReactNode;
}

export function PreferencesProvider({ children }: PreferencesProviderProps) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [manager] = useState(() => PreferencesManager.getInstance());

  useEffect(() => {
    // Initialize preferences from manager
    const initialPreferences = manager.getPreferences();
    setPreferences(initialPreferences);
    setIsLoading(false);

    // Subscribe to preference changes
    const unsubscribe = manager.subscribe((updatedPreferences) => {
      setPreferences(updatedPreferences);
    });

    return () => {
      unsubscribe();
    };
  }, [manager]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    manager.updatePreferences(updates);
  };

  const updateAccessibility = (updates: Partial<AccessibilityPreferences>) => {
    if (!preferences) return;
    
    manager.updatePreferences({
      accessibility: {
        ...preferences.accessibility,
        ...updates,
      },
    });
  };

  const updateTheme = (updates: Partial<ThemePreferences>) => {
    if (!preferences) return;
    
    manager.updatePreferences({
      theme: {
        ...preferences.theme,
        ...updates,
      },
    });
  };

  const updateInterface = (updates: Partial<InterfacePreferences>) => {
    if (!preferences) return;
    
    manager.updatePreferences({
      interface: {
        ...preferences.interface,
        ...updates,
      },
    });
  };

  const updateBehavior = (updates: Partial<BehaviorPreferences>) => {
    if (!preferences) return;
    
    manager.updatePreferences({
      behavior: {
        ...preferences.behavior,
        ...updates,
      },
    });
  };

  const resetPreferences = () => {
    manager.resetPreferences();
  };

  const exportPreferences = () => {
    return manager.exportPreferences();
  };

  const importPreferences = (json: string) => {
    return manager.importPreferences(json);
  };

  const getEffectiveTheme = () => {
    return manager.getEffectiveTheme();
  };

  // Don't render until preferences are loaded
  if (isLoading || !preferences) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const contextValue: PreferencesContextType = {
    preferences,
    updatePreferences,
    updateAccessibility,
    updateTheme,
    updateInterface,
    updateBehavior,
    resetPreferences,
    exportPreferences,
    importPreferences,
    getEffectiveTheme,
    isLoading: false,
  };

  return (
    <PreferencesContext.Provider value={contextValue}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextType {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}

// Convenience hooks for specific preference sections
export function useAccessibilityPreferences() {
  const { preferences, updateAccessibility } = usePreferences();
  return {
    accessibility: preferences.accessibility,
    updateAccessibility,
  };
}

export function useThemePreferences() {
  const { preferences, updateTheme, getEffectiveTheme } = usePreferences();
  return {
    theme: preferences.theme,
    updateTheme,
    getEffectiveTheme,
  };
}

export function useInterfacePreferences() {
  const { preferences, updateInterface } = usePreferences();
  return {
    interface: preferences.interface,
    updateInterface,
  };
}

export function useBehaviorPreferences() {
  const { preferences, updateBehavior } = usePreferences();
  return {
    behavior: preferences.behavior,
    updateBehavior,
  };
}

export default PreferencesContext;