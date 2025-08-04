import { create } from 'zustand'

interface NavigationStore {
  isMobileMenuOpen: boolean
  activeSection: string
  
  // Actions
  toggleMobileMenu: () => void
  closeMobileMenu: () => void
  setActiveSection: (section: string) => void
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  isMobileMenuOpen: false,
  activeSection: 'home',
  
  toggleMobileMenu: () => set((state) => ({ 
    isMobileMenuOpen: !state.isMobileMenuOpen 
  })),
  
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  
  setActiveSection: (section: string) => set({ activeSection: section }),
}))