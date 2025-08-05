import { create } from 'zustand';

interface Activity {
  id: string;
  type: 'comment' | 'question' | 'rating' | 'suggestion';
  message: string;
  timestamp: Date;
}

interface DashboardStats {
  totalPlaces: number;
  pendingSuggestions: number;
  unresolvedQuestions: number;
  todayViews: number;
  recentActivity: Activity[];
  isLoading: boolean;
  error: string | null;
}

export const useAdminDashboard = create<DashboardStats & {
  fetchStats: () => Promise<void>;
}>((set) => ({
  totalPlaces: 0,
  pendingSuggestions: 0,
  unresolvedQuestions: 0,
  todayViews: 0,
  recentActivity: [],
  isLoading: true,
  error: null,
  
  fetchStats: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/admin/dashboard/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      
      const data = await response.json();
      set({
        ...data,
        isLoading: false
      });
    } catch (error: any) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
    }
  }
}));