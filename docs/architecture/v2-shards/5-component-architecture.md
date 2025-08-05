# 5. COMPONENT ARCHITECTURE

## 5.1 New Component Structure
```
components/
├── admin/                    # Admin-only components
│   ├── AdminLayout.tsx
│   ├── AdminNav.tsx
│   ├── DashboardHome.tsx
│   ├── places/
│   │   ├── PlaceManager.tsx
│   │   ├── PlaceForm.tsx
│   │   └── BulkImport.tsx
│   ├── journeys/
│   │   ├── JourneyBuilder.tsx
│   │   ├── RouteMap.tsx
│   │   └── StopEditor.tsx
│   └── analytics/
│       ├── AnalyticsDashboard.tsx
│       ├── Charts.tsx
│       └── HeatMap.tsx
├── community/                # Community features
│   ├── Comments.tsx
│   ├── CommentThread.tsx
│   ├── StarRating.tsx
│   └── RatingDistribution.tsx
├── sharing/                  # Enhanced sharing
│   ├── ShareModal.tsx
│   └── SocialButtons.tsx
└── actions/                  # Action buttons
    ├── CallButton.tsx
    └── DirectionsButton.tsx
```

## 5.2 State Management Strategy
```typescript
// stores/adminStore.ts
import { create } from 'zustand';

interface AdminStore {
  isAuthenticated: boolean;
  dashboardStats: DashboardStats | null;
  selectedPlaces: string[];
  
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  refreshStats: () => Promise<void>;
  selectPlace: (id: string) => void;
  bulkAction: (action: string) => Promise<void>;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  isAuthenticated: false,
  dashboardStats: null,
  selectedPlaces: [],
  
  login: async (password) => {
    const response = await fetch('/api/admin/auth', {
      method: 'POST',
      body: JSON.stringify({ password })
    });
    
    if (response.ok) {
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },
  
  // ... other methods
}));
```

---
