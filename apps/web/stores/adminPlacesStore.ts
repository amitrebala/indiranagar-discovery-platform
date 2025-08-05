import { create } from 'zustand';
import { Place } from '@/lib/supabase/types';

interface AdminPlacesState {
  places: Place[];
  selectedPlaces: string[];
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    category: string;
    status: string;
  };
  
  // Actions
  fetchPlaces: () => Promise<void>;
  deletePlace: (id: string) => Promise<void>;
  bulkDelete: () => Promise<void>;
  toggleSelection: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  setFilter: (key: string, value: string) => void;
}

export const useAdminPlaces = create<AdminPlacesState>((set, get) => ({
  places: [],
  selectedPlaces: [],
  isLoading: false,
  error: null,
  filters: {
    search: '',
    category: '',
    status: 'all'
  },
  
  fetchPlaces: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/admin/places');
      if (!response.ok) throw new Error('Failed to fetch places');
      const data = await response.json();
      set({ places: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  deletePlace: async (id: string) => {
    try {
      const response = await fetch(`/api/admin/places/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete place');
      
      set(state => ({
        places: state.places.filter(p => p.id !== id),
        selectedPlaces: state.selectedPlaces.filter(sid => sid !== id)
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },
  
  bulkDelete: async () => {
    const { selectedPlaces } = get();
    try {
      const response = await fetch('/api/admin/places/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedPlaces })
      });
      if (!response.ok) throw new Error('Failed to delete places');
      
      set(state => ({
        places: state.places.filter(p => !selectedPlaces.includes(p.id)),
        selectedPlaces: []
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },
  
  toggleSelection: (id: string) => {
    set(state => ({
      selectedPlaces: state.selectedPlaces.includes(id)
        ? state.selectedPlaces.filter(sid => sid !== id)
        : [...state.selectedPlaces, id]
    }));
  },
  
  selectAll: () => {
    set(state => ({
      selectedPlaces: state.places.map(p => p.id)
    }));
  },
  
  clearSelection: () => {
    set({ selectedPlaces: [] });
  },
  
  setFilter: (key: string, value: string) => {
    set(state => ({
      filters: { ...state.filters, [key]: value }
    }));
  }
}));