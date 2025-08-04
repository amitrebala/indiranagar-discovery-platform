'use client';

import { useContext } from 'react';
import PreferencesContext from '@/contexts/PreferencesContext';

/**
 * Hook for accessing user preferences throughout the application
 * This is a re-export of the usePreferences hook from PreferencesContext
 * for easier importing in components
 */
export { 
  usePreferences,
  useAccessibilityPreferences,
  useThemePreferences,
  useInterfacePreferences,
  useBehaviorPreferences,
} from '@/contexts/PreferencesContext';

/**
 * Additional utility hooks for common preference operations
 */

export function useTheme() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('useTheme must be used within a PreferencesProvider');
  }

  const { preferences, updateTheme, getEffectiveTheme } = context;
  
  return {
    currentTheme: preferences.theme,
    effectiveTheme: getEffectiveTheme(),
    setTheme: (mode: 'light' | 'dark' | 'auto' | 'high-contrast') => {
      updateTheme({ mode });
    },
    toggleTheme: () => {
      const current = getEffectiveTheme();
      const newMode = current === 'light' ? 'dark' : 'light';
      updateTheme({ mode: newMode });
    },
    enableSystemSync: (enabled: boolean) => {
      updateTheme({ systemSync: enabled });
    },
    setCustomColors: (colors: { primary?: string; secondary?: string; accent?: string; }) => {
      updateTheme({ customColors: colors });
    },
  };
}

export function useAccessibility() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('useAccessibility must be used within a PreferencesProvider');
  }

  const { preferences, updateAccessibility } = context;
  
  return {
    accessibility: preferences.accessibility,
    toggleReducedMotion: () => {
      updateAccessibility({ reducedMotion: !preferences.accessibility.reducedMotion });
    },
    toggleHighContrast: () => {
      updateAccessibility({ highContrast: !preferences.accessibility.highContrast });
    },
    setFontSize: (size: 'small' | 'medium' | 'large' | 'extra-large') => {
      updateAccessibility({ fontSize: size });
    },
    toggleScreenReaderOptimization: () => {
      updateAccessibility({ screenReaderOptimized: !preferences.accessibility.screenReaderOptimized });
    },
    toggleKeyboardNavigation: () => {
      updateAccessibility({ keyboardNavigationEnhanced: !preferences.accessibility.keyboardNavigationEnhanced });
    },
    updateAccessibility,
  };
}

export function useInterfaceDensity() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('useInterfaceDensity must be used within a PreferencesProvider');
  }

  const { preferences, updateInterface } = context;
  
  return {
    density: preferences.interface.density,
    setDensity: (density: 'compact' | 'comfortable' | 'spacious') => {
      updateInterface({ density });
    },
    toggleSidebar: () => {
      updateInterface({ sidebarCollapsed: !preferences.interface.sidebarCollapsed });
    },
    toggleTooltips: () => {
      updateInterface({ showTooltips: !preferences.interface.showTooltips });
    },
    toggleAnimations: () => {
      updateInterface({ animationsEnabled: !preferences.interface.animationsEnabled });
    },
    updateInterface,
  };
}

export function useBehavior() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('useBehavior must be used within a PreferencesProvider');
  }

  const { preferences, updateBehavior } = context;
  
  return {
    behavior: preferences.behavior,
    toggleAutoSave: () => {
      updateBehavior({ autoSave: !preferences.behavior.autoSave });
    },
    toggleConfirmActions: () => {
      updateBehavior({ confirmDestructiveActions: !preferences.behavior.confirmDestructiveActions });
    },
    toggleTutorials: () => {
      updateBehavior({ showTutorials: !preferences.behavior.showTutorials });
    },
    toggleAnalytics: () => {
      updateBehavior({ analyticsEnabled: !preferences.behavior.analyticsEnabled });
    },
    updateBehavior,
  };
}

/**
 * Hook for checking if specific accessibility features are enabled
 */
export function useAccessibilityChecks() {
  const { accessibility } = useAccessibility();
  
  return {
    shouldReduceMotion: accessibility.reducedMotion,
    shouldUseHighContrast: accessibility.highContrast,
    isScreenReaderOptimized: accessibility.screenReaderOptimized,
    isKeyboardNavigationEnhanced: accessibility.keyboardNavigationEnhanced,
    currentFontSize: accessibility.fontSize,
  };
}

/**
 * Hook for responsive behavior based on interface preferences
 */
export function useResponsiveInterface() {
  const { interface: interfacePrefs } = useInterfacePreferences();
  const { accessibility } = useAccessibilityPreferences();
  
  const getDensitySpacing = () => {
    switch (interfacePrefs.density) {
      case 'compact':
        return { padding: 'p-2', margin: 'm-1', gap: 'gap-1' };
      case 'spacious':
        return { padding: 'p-6', margin: 'm-4', gap: 'gap-4' };
      default: // comfortable
        return { padding: 'p-4', margin: 'm-2', gap: 'gap-2' };
    }
  };

  const getFontSizeClasses = () => {
    switch (accessibility.fontSize) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-lg';
      case 'extra-large':
        return 'text-xl';
      default: // medium
        return 'text-base';
    }
  };

  return {
    density: interfacePrefs.density,
    spacing: getDensitySpacing(),
    fontSize: getFontSizeClasses(),
    showTooltips: interfacePrefs.showTooltips,
    animationsEnabled: interfacePrefs.animationsEnabled && !accessibility.reducedMotion,
    sidebarCollapsed: interfacePrefs.sidebarCollapsed,
  };
}