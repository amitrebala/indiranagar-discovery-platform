/**
 * Comprehensive test suite for Personalization System
 * Tests PreferencesManager, theme switching, accessibility features, and density scaling
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import PreferencesManager, { UserPreferences } from '@/lib/preferences/PreferencesManager';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock matchMedia
const matchMediaMock = vi.fn((query: string) => ({
  matches: query.includes('dark') ? false : false, // Default to light mode
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

// Mock DOM elements
const documentElementMock = {
  classList: {
    add: vi.fn(),
    remove: vi.fn(),
    toggle: vi.fn(),
    contains: vi.fn(),
  },
  style: {
    setProperty: vi.fn(),
  },
};

const documentMock = {
  documentElement: documentElementMock,
  querySelector: vi.fn(() => ({
    setAttribute: vi.fn(),
  })),
};

describe('PreferencesManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset singleton instance
    (PreferencesManager as any).instance = undefined;
    
    // Setup global mocks
    global.localStorage = localStorageMock;
    global.matchMedia = matchMediaMock;
    global.document = documentMock as any;
    global.window = {} as any;
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance across multiple calls', () => {
      const instance1 = PreferencesManager.getInstance();
      const instance2 = PreferencesManager.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('should initialize with default preferences when no stored data exists', () => {
      localStorageMock.getItem.mockReturnValue(null);
      const manager = PreferencesManager.getInstance();
      const preferences = manager.getPreferences();
      
      expect(preferences.theme.mode).toBe('auto');
      expect(preferences.accessibility.reducedMotion).toBe(false);
      expect(preferences.interface.density).toBe('comfortable');
      expect(preferences.behavior.autoSave).toBe(true);
    });
  });

  describe('Local Storage Integration', () => {
    it('should load preferences from localStorage', () => {
      const storedPreferences: UserPreferences = {
        accessibility: {
          reducedMotion: true,
          highContrast: false,
          fontSize: 'large',
          screenReaderOptimized: false,
          keyboardNavigationEnhanced: true,
        },
        theme: {
          mode: 'dark',
          systemSync: false,
        },
        interface: {
          density: 'compact',
          sidebarCollapsed: true,
          showTooltips: false,
          animationsEnabled: false,
        },
        behavior: {
          autoSave: false,
          confirmDestructiveActions: true,
          showTutorials: false,
          analyticsEnabled: false,
        },
        version: '1.0.0',
        lastModified: Date.now(),
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedPreferences));
      const manager = PreferencesManager.getInstance();
      const preferences = manager.getPreferences();
      
      expect(preferences.theme.mode).toBe('dark');
      expect(preferences.accessibility.reducedMotion).toBe(true);
      expect(preferences.interface.density).toBe('compact');
    });

    it('should persist preferences to localStorage when updated', () => {
      const manager = PreferencesManager.getInstance();
      manager.updatePreferences({
        theme: { mode: 'high-contrast', systemSync: true },
      });
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'user-preferences',
        expect.stringContaining('"mode":"high-contrast"')
      );
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });
      
      const manager = PreferencesManager.getInstance();
      const preferences = manager.getPreferences();
      
      // Should fall back to defaults
      expect(preferences.theme.mode).toBe('auto');
    });
  });

  describe('Theme System', () => {
    it('should apply light theme correctly', () => {
      const manager = PreferencesManager.getInstance();
      manager.updatePreferences({
        theme: { mode: 'light', systemSync: false },
      });
      
      expect(documentElementMock.classList.remove).toHaveBeenCalledWith('light', 'dark', 'high-contrast');
      expect(documentElementMock.classList.add).toHaveBeenCalledWith('light');
    });

    it('should apply dark theme correctly', () => {
      const manager = PreferencesManager.getInstance();
      manager.updatePreferences({
        theme: { mode: 'dark', systemSync: false },
      });
      
      expect(documentElementMock.classList.add).toHaveBeenCalledWith('dark');
    });

    it('should apply high-contrast theme correctly', () => {
      const manager = PreferencesManager.getInstance();
      manager.updatePreferences({
        theme: { mode: 'high-contrast', systemSync: false },
      });
      
      expect(documentElementMock.classList.add).toHaveBeenCalledWith('high-contrast');
    });

    it('should respect system preference in auto mode', () => {
      matchMediaMock.mockImplementation((query) => ({
        matches: query.includes('dark') ? true : false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const manager = PreferencesManager.getInstance();
      manager.updatePreferences({
        theme: { mode: 'auto', systemSync: true },
      });
      
      expect(documentElementMock.classList.add).toHaveBeenCalledWith('dark');
    });

    it('should update meta theme-color', () => {
      const metaElement = { setAttribute: vi.fn() };
      documentMock.querySelector.mockReturnValue(metaElement);
      
      const manager = PreferencesManager.getInstance();
      manager.updatePreferences({
        theme: { mode: 'dark', systemSync: false },
      });
      
      expect(metaElement.setAttribute).toHaveBeenCalledWith('content', '#0a0a0a');
    });
  });

  describe('Accessibility Preferences', () => {
    it('should apply reduced motion preference', () => {
      const manager = PreferencesManager.getInstance();
      manager.updatePreferences({
        accessibility: {
          reducedMotion: true,
          highContrast: false,
          fontSize: 'medium',
          screenReaderOptimized: false,
          keyboardNavigationEnhanced: false,
        },
      });
      
      expect(documentElementMock.classList.toggle).toHaveBeenCalledWith('reduce-motion', true);
    });

    it('should apply high contrast preference', () => {
      const manager = PreferencesManager.getInstance();
      manager.updatePreferences({
        accessibility: {
          reducedMotion: false,
          highContrast: true,
          fontSize: 'medium',
          screenReaderOptimized: false,
          keyboardNavigationEnhanced: false,
        },
      });
      
      expect(documentElementMock.classList.toggle).toHaveBeenCalledWith('high-contrast', true);
    });

    it('should apply font size preferences', () => {
      const manager = PreferencesManager.getInstance();
      manager.updatePreferences({
        accessibility: {
          reducedMotion: false,
          highContrast: false,
          fontSize: 'large',
          screenReaderOptimized: false,
          keyboardNavigationEnhanced: false,
        },
      });
      
      expect(documentElementMock.classList.remove).toHaveBeenCalledWith(
        'font-small', 'font-medium', 'font-large', 'font-extra-large'
      );
      expect(documentElementMock.classList.add).toHaveBeenCalledWith('font-large');
    });

    it('should apply screen reader optimizations', () => {
      const manager = PreferencesManager.getInstance();
      manager.updatePreferences({
        accessibility: {
          reducedMotion: false,
          highContrast: false,
          fontSize: 'medium',
          screenReaderOptimized: true,
          keyboardNavigationEnhanced: false,
        },
      });
      
      expect(documentElementMock.classList.toggle).toHaveBeenCalledWith('screen-reader-optimized', true);
    });

    it('should apply keyboard navigation enhancements', () => {
      const manager = PreferencesManager.getInstance();
      manager.updatePreferences({
        accessibility: {
          reducedMotion: false,
          highContrast: false,
          fontSize: 'medium',
          screenReaderOptimized: false,
          keyboardNavigationEnhanced: true,
        },
      });
      
      expect(documentElementMock.classList.toggle).toHaveBeenCalledWith('keyboard-navigation-enhanced', true);
    });
  });

  describe('Interface Density', () => {
    it('should apply compact density', () => {
      const manager = PreferencesManager.getInstance();
      manager.updatePreferences({
        interface: {
          density: 'compact',
          sidebarCollapsed: false,
          showTooltips: true,
          animationsEnabled: true,
        },
      });
      
      expect(documentElementMock.classList.remove).toHaveBeenCalledWith(
        'density-compact', 'density-comfortable', 'density-spacious'
      );
      expect(documentElementMock.classList.add).toHaveBeenCalledWith('density-compact');
    });

    it('should apply spacious density', () => {
      const manager = PreferencesManager.getInstance();
      manager.updatePreferences({
        interface: {
          density: 'spacious',
          sidebarCollapsed: false,
          showTooltips: true,
          animationsEnabled: true,
        },
      });
      
      expect(documentElementMock.classList.add).toHaveBeenCalledWith('density-spacious');
    });

    it('should control animations', () => {
      const manager = PreferencesManager.getInstance();
      manager.updatePreferences({
        interface: {
          density: 'comfortable',
          sidebarCollapsed: false,
          showTooltips: true,
          animationsEnabled: false,
        },
      });
      
      expect(documentElementMock.classList.toggle).toHaveBeenCalledWith('animations-disabled', true);
    });
  });

  describe('System Synchronization', () => {
    it('should sync with system dark mode preference', () => {
      const mockQuery = {
        matches: true,
        media: '(prefers-color-scheme: dark)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };
      
      matchMediaMock.mockReturnValue(mockQuery);
      
      const manager = PreferencesManager.getInstance();
      
      // Simulate system change
      const changeHandler = mockQuery.addEventListener.mock.calls.find(
        call => call[0] === 'change'
      )?.[1];
      
      if (changeHandler) {
        changeHandler({ matches: true });
      }
      
      expect(mockQuery.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('should sync with system reduced motion preference', () => {
      const mockQuery = {
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };
      
      matchMediaMock.mockReturnValue(mockQuery);
      
      const manager = PreferencesManager.getInstance();
      
      // Simulate system change
      const changeHandler = mockQuery.addEventListener.mock.calls.find(
        call => call[0] === 'change'
      )?.[1];
      
      if (changeHandler) {
        changeHandler({ matches: true });
      }
      
      expect(mockQuery.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });
  });

  describe('Observer Pattern', () => {
    it('should notify observers when preferences change', () => {
      const observer = vi.fn();
      const manager = PreferencesManager.getInstance();
      
      const unsubscribe = manager.subscribe(observer);
      
      manager.updatePreferences({
        theme: { mode: 'dark', systemSync: false },
      });
      
      expect(observer).toHaveBeenCalledWith(expect.objectContaining({
        theme: expect.objectContaining({ mode: 'dark' }),
      }));
      
      unsubscribe();
    });

    it('should handle observer errors gracefully', () => {
      const faultyObserver = vi.fn().mockImplementation(() => {
        throw new Error('Observer error');
      });
      
      const manager = PreferencesManager.getInstance();
      manager.subscribe(faultyObserver);
      
      // Should not throw
      expect(() => {
        manager.updatePreferences({
          theme: { mode: 'light', systemSync: false },
        });
      }).not.toThrow();
    });
  });

  describe('Import/Export Functionality', () => {
    it('should export preferences as JSON', () => {
      const manager = PreferencesManager.getInstance();
      const exported = manager.exportPreferences();
      
      expect(() => JSON.parse(exported)).not.toThrow();
      const parsed = JSON.parse(exported);
      expect(parsed).toHaveProperty('theme');
      expect(parsed).toHaveProperty('accessibility');
      expect(parsed).toHaveProperty('interface');
      expect(parsed).toHaveProperty('behavior');
    });

    it('should import valid preferences', () => {
      const manager = PreferencesManager.getInstance();
      const testPreferences = {
        accessibility: {
          reducedMotion: true,
          highContrast: false,
          fontSize: 'large',
          screenReaderOptimized: true,
          keyboardNavigationEnhanced: false,
        },
        theme: {
          mode: 'dark',
          systemSync: false,
        },
        interface: {
          density: 'compact',
          sidebarCollapsed: true,
          showTooltips: false,
          animationsEnabled: false,
        },
        behavior: {
          autoSave: true,
          confirmDestructiveActions: false,
          showTutorials: true,
          analyticsEnabled: false,
        },
        version: '1.0.0',
        lastModified: Date.now(),
      };
      
      const success = manager.importPreferences(JSON.stringify(testPreferences));
      expect(success).toBe(true);
      
      const preferences = manager.getPreferences();
      expect(preferences.theme.mode).toBe('dark');
      expect(preferences.accessibility.reducedMotion).toBe(true);
    });

    it('should reject invalid preferences', () => {
      const manager = PreferencesManager.getInstance();
      const success = manager.importPreferences('invalid json');
      expect(success).toBe(false);
    });

    it('should reject incomplete preferences', () => {
      const manager = PreferencesManager.getInstance();
      const incompletePreferences = { theme: { mode: 'dark' } };
      const success = manager.importPreferences(JSON.stringify(incompletePreferences));
      expect(success).toBe(false);
    });
  });

  describe('Preference Reset', () => {
    it('should reset all preferences to defaults', () => {
      const manager = PreferencesManager.getInstance();
      
      // Set some non-default values
      manager.updatePreferences({
        theme: { mode: 'dark', systemSync: false },
        accessibility: { reducedMotion: true, highContrast: true, fontSize: 'large', screenReaderOptimized: true, keyboardNavigationEnhanced: true },
      });
      
      // Reset to defaults
      manager.resetPreferences();
      
      const preferences = manager.getPreferences();
      expect(preferences.theme.mode).toBe('auto');
      expect(preferences.accessibility.reducedMotion).toBe(false);
      expect(preferences.interface.density).toBe('comfortable');
    });
  });

  describe('Effective Theme Calculation', () => {
    it('should return effective theme for different modes', () => {
      const manager = PreferencesManager.getInstance();
      
      manager.updatePreferences({ theme: { mode: 'light', systemSync: false } });
      expect(manager.getEffectiveTheme()).toBe('light');
      
      manager.updatePreferences({ theme: { mode: 'dark', systemSync: false } });
      expect(manager.getEffectiveTheme()).toBe('dark');
      
      manager.updatePreferences({ theme: { mode: 'high-contrast', systemSync: false } });
      expect(manager.getEffectiveTheme()).toBe('high-contrast');
    });

    it('should calculate auto theme based on system preference', () => {
      matchMediaMock.mockImplementation((query) => ({
        matches: query.includes('dark') ? true : false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
      
      const manager = PreferencesManager.getInstance();
      manager.updatePreferences({ theme: { mode: 'auto', systemSync: true } });
      
      expect(manager.getEffectiveTheme()).toBe('dark');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle missing window object in SSR environments', () => {
      global.window = undefined as any;
      global.document = undefined as any;
      
      expect(() => {
        PreferencesManager.getInstance();
      }).not.toThrow();
    });

    it('should handle preferences validation errors', () => {
      localStorageMock.getItem.mockReturnValue('{"invalid": "data"}');
      
      const manager = PreferencesManager.getInstance();
      const preferences = manager.getPreferences();
      
      // Should fall back to defaults
      expect(preferences.theme.mode).toBe('auto');
    });
  });

  describe('Performance', () => {
    it('should not create multiple media query listeners', () => {
      matchMediaMock.mockClear();
      
      PreferencesManager.getInstance();
      const callCount1 = matchMediaMock.mock.calls.length;
      
      PreferencesManager.getInstance();
      const callCount2 = matchMediaMock.mock.calls.length;
      
      expect(callCount1).toBe(callCount2);
    });

    it('should cleanup resources when destroyed', () => {
      const manager = PreferencesManager.getInstance();
      
      expect(() => {
        manager.destroy();
      }).not.toThrow();
    });
  });
});