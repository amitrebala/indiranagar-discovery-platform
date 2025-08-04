/**
 * Comprehensive PreferencesManager - Singleton class for managing user preferences
 * Handles theme, accessibility, interface density, and behavior preferences
 * with localStorage persistence and system integration
 */

export interface AccessibilityPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  screenReaderOptimized: boolean;
  keyboardNavigationEnhanced: boolean;
}

export interface ThemePreferences {
  mode: 'light' | 'dark' | 'auto' | 'high-contrast';
  systemSync: boolean;
  customColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
}

export interface InterfacePreferences {
  density: 'compact' | 'comfortable' | 'spacious';
  sidebarCollapsed: boolean;
  showTooltips: boolean;
  animationsEnabled: boolean;
}

export interface BehaviorPreferences {
  autoSave: boolean;
  confirmDestructiveActions: boolean;
  showTutorials: boolean;
  analyticsEnabled: boolean;
}

export interface UserPreferences {
  accessibility: AccessibilityPreferences;
  theme: ThemePreferences;
  interface: InterfacePreferences;
  behavior: BehaviorPreferences;
  version: string;
  lastModified: number;
}

export type PreferenceChangeCallback = (preferences: UserPreferences) => void;

class PreferencesManager {
  private static instance: PreferencesManager;
  private preferences: UserPreferences;
  private observers: Set<PreferenceChangeCallback> = new Set();
  private mediaQueries: Map<string, MediaQueryList> = new Map();
  private storageKey = 'user-preferences';
  private version = '1.0.0';

  private constructor() {
    this.preferences = this.getDefaultPreferences();
    this.initializeFromStorage();
    this.setupSystemListeners();
  }

  public static getInstance(): PreferencesManager {
    if (!PreferencesManager.instance) {
      PreferencesManager.instance = new PreferencesManager();
    }
    return PreferencesManager.instance;
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      accessibility: {
        reducedMotion: false,
        highContrast: false,
        fontSize: 'medium',
        screenReaderOptimized: false,
        keyboardNavigationEnhanced: false,
      },
      theme: {
        mode: 'auto',
        systemSync: true,
      },
      interface: {
        density: 'comfortable',
        sidebarCollapsed: false,
        showTooltips: true,
        animationsEnabled: true,
      },
      behavior: {
        autoSave: true,
        confirmDestructiveActions: true,
        showTutorials: true,
        analyticsEnabled: true,
      },
      version: this.version,
      lastModified: Date.now(),
    };
  }

  private initializeFromStorage(): void {
    try {
      // Only access localStorage on client-side
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          const parsedPreferences = JSON.parse(stored) as UserPreferences;
          
          // Validate and migrate if necessary
          if (this.validatePreferences(parsedPreferences)) {
            this.preferences = this.migratePreferences(parsedPreferences);
          }
        }
      }
      
      // Sync with system preferences on initialization
      this.syncWithSystemPreferences();
      this.applyPreferences();
    } catch (error) {
      console.warn('Failed to load preferences from storage:', error);
      this.preferences = this.getDefaultPreferences();
    }
  }

  private validatePreferences(preferences: any): boolean {
    return (
      preferences &&
      typeof preferences === 'object' &&
      preferences.accessibility &&
      preferences.theme &&
      preferences.interface &&
      preferences.behavior
    );
  }

  private migratePreferences(stored: UserPreferences): UserPreferences {
    const current = this.getDefaultPreferences();
    
    // If versions don't match, perform migration
    if (stored.version !== this.version) {
      console.log('Migrating preferences from version', stored.version, 'to', this.version);
      
      // Deep merge stored preferences with defaults
      const migrated = {
        ...current,
        accessibility: { ...current.accessibility, ...stored.accessibility },
        theme: { ...current.theme, ...stored.theme },
        interface: { ...current.interface, ...stored.interface },
        behavior: { ...current.behavior, ...stored.behavior },
        version: this.version,
        lastModified: Date.now(),
      };
      
      return migrated;
    }
    
    return stored;
  }

  private setupSystemListeners(): void {
    if (typeof window === 'undefined') return;

    // Dark mode preference
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.mediaQueries.set('dark-mode', darkModeQuery);
    darkModeQuery.addEventListener('change', this.handleSystemDarkModeChange.bind(this));

    // Reduced motion preference
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.mediaQueries.set('reduced-motion', reducedMotionQuery);
    reducedMotionQuery.addEventListener('change', this.handleSystemReducedMotionChange.bind(this));

    // High contrast preference
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    this.mediaQueries.set('high-contrast', highContrastQuery);
    highContrastQuery.addEventListener('change', this.handleSystemHighContrastChange.bind(this));
  }

  private handleSystemDarkModeChange(event: MediaQueryListEvent): void {
    if (this.preferences.theme.systemSync && this.preferences.theme.mode === 'auto') {
      this.applyTheme();
      this.notifyObservers();
    }
  }

  private handleSystemReducedMotionChange(event: MediaQueryListEvent): void {
    this.updatePreferences({
      accessibility: {
        ...this.preferences.accessibility,
        reducedMotion: event.matches,
      },
    });
  }

  private handleSystemHighContrastChange(event: MediaQueryListEvent): void {
    this.updatePreferences({
      accessibility: {
        ...this.preferences.accessibility,
        highContrast: event.matches,
      },
    });
  }

  private syncWithSystemPreferences(): void {
    if (typeof window === 'undefined') return;

    const updates: Partial<UserPreferences> = {};

    // Sync reduced motion
    const reducedMotionQuery = this.mediaQueries.get('reduced-motion');
    if (reducedMotionQuery?.matches) {
      updates.accessibility = {
        ...this.preferences.accessibility,
        reducedMotion: true,
      };
    }

    // Sync high contrast
    const highContrastQuery = this.mediaQueries.get('high-contrast');
    if (highContrastQuery?.matches) {
      updates.accessibility = {
        ...this.preferences.accessibility,
        ...updates.accessibility,
        highContrast: true,
      };
    }

    // Apply updates if any
    if (Object.keys(updates).length > 0) {
      this.preferences = { ...this.preferences, ...updates };
      this.persistPreferences();
    }
  }

  private applyPreferences(): void {
    this.applyTheme();
    this.applyAccessibilityPreferences();
    this.applyInterfacePreferences();
  }

  private applyTheme(): void {
    if (typeof window === 'undefined') return;

    const { theme } = this.preferences;
    const root = document.documentElement;

    // Determine effective theme
    let effectiveTheme = theme.mode;
    if (theme.mode === 'auto') {
      const darkModeQuery = this.mediaQueries.get('dark-mode');
      effectiveTheme = darkModeQuery?.matches ? 'dark' : 'light';
    }

    // Apply theme class
    root.classList.remove('light', 'dark', 'high-contrast');
    root.classList.add(effectiveTheme === 'high-contrast' ? 'high-contrast' : effectiveTheme);

    // Apply custom colors if provided
    if (theme.customColors) {
      const { primary, secondary, accent } = theme.customColors;
      if (primary) root.style.setProperty('--color-primary', primary);
      if (secondary) root.style.setProperty('--color-secondary', secondary);
      if (accent) root.style.setProperty('--color-accent', accent);
    }

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const themeColor = effectiveTheme === 'dark' ? '#0a0a0a' : '#ffffff';
      metaThemeColor.setAttribute('content', themeColor);
    }
  }

  private applyAccessibilityPreferences(): void {
    if (typeof window === 'undefined') return;

    const { accessibility } = this.preferences;
    const root = document.documentElement;

    // Apply reduced motion
    root.classList.toggle('reduce-motion', accessibility.reducedMotion);
    
    // Apply high contrast
    root.classList.toggle('high-contrast', accessibility.highContrast);
    
    // Apply font size
    root.classList.remove('font-small', 'font-medium', 'font-large', 'font-extra-large');
    root.classList.add(`font-${accessibility.fontSize}`);
    
    // Apply screen reader optimizations
    root.classList.toggle('screen-reader-optimized', accessibility.screenReaderOptimized);
    
    // Apply keyboard navigation enhancements
    root.classList.toggle('keyboard-navigation-enhanced', accessibility.keyboardNavigationEnhanced);
  }

  private applyInterfacePreferences(): void {
    if (typeof window === 'undefined') return;

    const { interface: interfacePrefs } = this.preferences;
    const root = document.documentElement;

    // Apply density
    root.classList.remove('density-compact', 'density-comfortable', 'density-spacious');
    root.classList.add(`density-${interfacePrefs.density}`);
    
    // Apply animations
    root.classList.toggle('animations-disabled', !interfacePrefs.animationsEnabled);
  }

  private persistPreferences(): void {
    try {
      // Only access localStorage on client-side
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        this.preferences.lastModified = Date.now();
        localStorage.setItem(this.storageKey, JSON.stringify(this.preferences));
      }
    } catch (error) {
      console.warn('Failed to persist preferences:', error);
    }
  }

  private notifyObservers(): void {
    this.observers.forEach(callback => {
      try {
        callback(this.preferences);
      } catch (error) {
        console.warn('Preference observer error:', error);
      }
    });
  }

  // Public API
  public getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  public updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = {
      ...this.preferences,
      ...updates,
      lastModified: Date.now(),
    };
    
    this.persistPreferences();
    this.applyPreferences();
    this.notifyObservers();
  }

  public resetPreferences(): void {
    this.preferences = this.getDefaultPreferences();
    this.persistPreferences();
    this.applyPreferences();
    this.notifyObservers();
  }

  public subscribe(callback: PreferenceChangeCallback): () => void {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  public exportPreferences(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  public importPreferences(preferencesJson: string): boolean {
    try {
      const imported = JSON.parse(preferencesJson) as UserPreferences;
      if (this.validatePreferences(imported)) {
        this.preferences = this.migratePreferences(imported);
        this.persistPreferences();
        this.applyPreferences();
        this.notifyObservers();
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Failed to import preferences:', error);
      return false;
    }
  }

  public getEffectiveTheme(): 'light' | 'dark' | 'high-contrast' {
    const { theme } = this.preferences;
    
    if (theme.mode === 'high-contrast') return 'high-contrast';
    if (theme.mode === 'auto') {
      const darkModeQuery = this.mediaQueries.get('dark-mode');
      return darkModeQuery?.matches ? 'dark' : 'light';
    }
    return theme.mode as 'light' | 'dark';
  }

  public destroy(): void {
    // Clean up media query listeners
    this.mediaQueries.forEach(query => {
      query.removeEventListener('change', this.handleSystemDarkModeChange);
      query.removeEventListener('change', this.handleSystemReducedMotionChange);
      query.removeEventListener('change', this.handleSystemHighContrastChange);
    });
    
    this.mediaQueries.clear();
    this.observers.clear();
  }
}

export default PreferencesManager;