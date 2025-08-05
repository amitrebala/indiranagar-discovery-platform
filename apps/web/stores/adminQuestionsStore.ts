import { create } from 'zustand';

interface CommunityQuestion {
  id: string;
  question: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'new' | 'in-progress' | 'answered' | 'published';
  resolved: boolean;
  created_at: string;
  response?: string;
  response_at?: string;
}

interface AdminQuestionsState {
  questions: CommunityQuestion[];
  selectedQuestions: string[];
  isLoading: boolean;
  error: string | null;
  filters: {
    status: string;
    priority: string;
    category: string;
  };
  
  // Actions
  fetchQuestions: () => Promise<void>;
  updateQuestion: (id: string, updates: Partial<CommunityQuestion>) => Promise<void>;
  respondToQuestion: (id: string, response: string) => Promise<void>;
  bulkUpdateStatus: (status: string) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
  toggleSelection: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  setFilter: (key: string, value: string) => void;
}

export const useAdminQuestions = create<AdminQuestionsState>((set, get) => ({
  questions: [],
  selectedQuestions: [],
  isLoading: false,
  error: null,
  filters: {
    status: 'all',
    priority: 'all',
    category: 'all'
  },
  
  fetchQuestions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/admin/questions');
      if (!response.ok) throw new Error('Failed to fetch questions');
      const data = await response.json();
      set({ questions: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  updateQuestion: async (id: string, updates: Partial<CommunityQuestion>) => {
    try {
      const response = await fetch(`/api/admin/questions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update question');
      
      set(state => ({
        questions: state.questions.map(q => 
          q.id === id ? { ...q, ...updates } : q
        )
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },
  
  respondToQuestion: async (id: string, response: string) => {
    try {
      const response_data = await fetch(`/api/admin/questions/${id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response })
      });
      if (!response_data.ok) throw new Error('Failed to respond to question');
      
      set(state => ({
        questions: state.questions.map(q => 
          q.id === id ? { 
            ...q, 
            response, 
            status: 'answered',
            resolved: true,
            response_at: new Date().toISOString()
          } : q
        )
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },
  
  bulkUpdateStatus: async (status: string) => {
    const { selectedQuestions } = get();
    try {
      const response = await fetch('/api/admin/questions/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedQuestions, status })
      });
      if (!response.ok) throw new Error('Failed to update questions');
      
      set(state => ({
        questions: state.questions.map(q => 
          selectedQuestions.includes(q.id) ? { ...q, status: status as any } : q
        ),
        selectedQuestions: []
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },
  
  deleteQuestion: async (id: string) => {
    try {
      const response = await fetch(`/api/admin/questions/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete question');
      
      set(state => ({
        questions: state.questions.filter(q => q.id !== id),
        selectedQuestions: state.selectedQuestions.filter(sid => sid !== id)
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },
  
  toggleSelection: (id: string) => {
    set(state => ({
      selectedQuestions: state.selectedQuestions.includes(id)
        ? state.selectedQuestions.filter(sid => sid !== id)
        : [...state.selectedQuestions, id]
    }));
  },
  
  selectAll: () => {
    set(state => ({
      selectedQuestions: state.questions.map(q => q.id)
    }));
  },
  
  clearSelection: () => {
    set({ selectedQuestions: [] });
  },
  
  setFilter: (key: string, value: string) => {
    set(state => ({
      filters: { ...state.filters, [key]: value }
    }));
  }
}));