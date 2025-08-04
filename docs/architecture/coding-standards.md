# Coding Standards

## TypeScript & JavaScript Standards

### File and Directory Naming
- **Files**: Use kebab-case for pages and utilities (`place-detail.tsx`, `weather-utils.ts`)
- **Components**: Use PascalCase for React components (`PlaceCard.tsx`, `WeatherOverlay.tsx`)
- **Directories**: Use kebab-case for directories (`place-details/`, `weather-integration/`)
- **API Routes**: Use REST conventions (`/api/places/[id]/route.ts`)

### Code Organization
- **One component per file** - Each React component should be in its own file
- **Index files** - Use `index.ts` files for clean imports from directories
- **Barrel exports** - Export multiple items from a single module entry point
- **Co-location** - Keep related files close (component + test + styles)

### TypeScript Conventions
```typescript
// Use explicit type definitions
interface PlaceData {
  id: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
}

// Use strict typing for props
interface PlaceCardProps {
  place: PlaceData;
  onSelect: (place: PlaceData) => void;
  className?: string;
}

// Prefer named exports over default exports
export const PlaceCard: React.FC<PlaceCardProps> = ({ place, onSelect, className }) => {
  // Component implementation
};
```

### React Standards

#### Component Structure
```typescript
// 1. Imports (libraries first, then local)
import React, { useState, useEffect } from 'react';
import { Map } from 'leaflet';
import { PlaceData } from '@/lib/types';
import { WeatherOverlay } from './WeatherOverlay';

// 2. Type definitions
interface Props {
  // props definition
}

// 3. Component definition
export const ComponentName: React.FC<Props> = ({ ...props }) => {
  // 4. Hooks (state, effects, custom hooks)
  const [state, setState] = useState();
  
  // 5. Event handlers
  const handleEvent = () => {
    // handler logic
  };
  
  // 6. Early returns (loading, error states)
  if (loading) return <div>Loading...</div>;
  
  // 7. Main render
  return (
    <div>
      {/* JSX content */}
    </div>
  );
};
```

#### Hooks Guidelines
- **Custom hooks** - Extract reusable logic into custom hooks (`useWeather`, `usePlaces`)
- **Hook order** - Always call hooks in the same order
- **Dependencies** - Be explicit about useEffect dependencies
- **Cleanup** - Always cleanup subscriptions and timers

### State Management (Zustand)
```typescript
// Store structure
interface WeatherStore {
  currentWeather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchWeather: (location: Coordinates) => Promise<void>;
  clearError: () => void;
}

// Store implementation
export const useWeatherStore = create<WeatherStore>((set, get) => ({
  currentWeather: null,
  isLoading: false,
  error: null,
  
  fetchWeather: async (location) => {
    set({ isLoading: true, error: null });
    try {
      const weather = await weatherAPI.getCurrent(location);
      set({ currentWeather: weather, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  clearError: () => set({ error: null }),
}));
```

## Next.js Specific Standards

### App Router Conventions
- **Page files**: Use `page.tsx` for route pages
- **Layout files**: Use `layout.tsx` for shared layouts
- **Loading files**: Use `loading.tsx` for loading states
- **Error files**: Use `error.tsx` for error boundaries
- **Not found**: Use `not-found.tsx` for 404 pages

### API Routes
```typescript
// API route structure
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Request validation schema
const CreatePlaceSchema = z.object({
  name: z.string().min(1),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  description: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreatePlaceSchema.parse(body);
    
    // Business logic
    const result = await createPlace(validatedData);
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Metadata and SEO
```typescript
// Page metadata
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Place Name | Indiranagar Discovery',
  description: 'Discover hidden gems in Indiranagar with personal recommendations.',
  openGraph: {
    title: 'Place Name',
    description: 'Personal recommendation from local expert',
    images: ['/images/places/place-name.jpg'],
  },
};
```

## Database & API Standards

### Supabase Integration
```typescript
// Database client setup
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';

export const createClient = () => 
  createClientComponentClient<Database>();

// Type-safe database operations
export async function getPlace(id: string): Promise<Place | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('places')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching place:', error);
    return null;
  }
  
  return data;
}
```

### API Design
- **RESTful routes** - Follow REST conventions for API endpoints
- **Consistent responses** - Use consistent response format across all endpoints
- **Error handling** - Proper HTTP status codes and error messages
- **Validation** - Validate all inputs using Zod schemas
- **Rate limiting** - Implement rate limiting for public endpoints

## Styling Standards

### Tailwind CSS
```typescript
// Component styling with Tailwind
export const PlaceCard = ({ place, className = '' }) => {
  return (
    <div className={cn(
      // Base styles
      "bg-white rounded-lg shadow-md overflow-hidden",
      "transition-all duration-200 hover:shadow-lg",
      // Responsive design
      "w-full sm:max-w-sm",
      // Custom className override
      className
    )}>
      {/* Content */}
    </div>
  );
};

// Utility for conditional classes
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Design System
- **Consistent spacing** - Use Tailwind spacing scale (4, 8, 16, 24, etc.)
- **Color palette** - Stick to defined color palette in tailwind.config.js
- **Typography** - Use consistent font sizes and weights
- **Components** - Build reusable component library in `/components/ui`

## Testing Standards

### Unit Testing (Jest + Testing Library)
```typescript
// Component test
import { render, screen, fireEvent } from '@testing-library/react';
import { PlaceCard } from './PlaceCard';

const mockPlace = {
  id: '1',
  name: 'Test Place',
  coordinates: { lat: 12.9716, lng: 77.5946 },
  rating: 4.5,
};

describe('PlaceCard', () => {
  it('renders place information correctly', () => {
    render(<PlaceCard place={mockPlace} onSelect={jest.fn()} />);
    
    expect(screen.getByText('Test Place')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });
  
  it('calls onSelect when clicked', () => {
    const mockOnSelect = jest.fn();
    render(<PlaceCard place={mockPlace} onSelect={mockOnSelect} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnSelect).toHaveBeenCalledWith(mockPlace);
  });
});
```

### E2E Testing (Playwright)
```typescript
// E2E test
import { test, expect } from '@playwright/test';

test('user can discover places on map', async ({ page }) => {
  await page.goto('/map');
  
  // Wait for map to load
  await page.waitForSelector('[data-testid="interactive-map"]');
  
  // Click on a place marker
  await page.click('[data-testid="place-marker-1"]');
  
  // Verify place details appear
  await expect(page.locator('[data-testid="place-popup"]')).toBeVisible();
  await expect(page.locator('h3')).toContainText('Place Name');
});
```

## Performance Standards

### Core Web Vitals
- **LCP**: Optimize images and lazy load below-fold content
- **FID**: Minimize JavaScript bundle size and optimize event handlers
- **CLS**: Reserve space for dynamic content and avoid layout shifts

### Optimization Techniques
```typescript
// Image optimization
import Image from 'next/image';

export const PlaceImage = ({ src, alt, ...props }) => (
  <Image
    src={src}
    alt={alt}
    fill
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    className="object-cover"
    priority={false} // Only true for above-fold images
    {...props}
  />
);

// Code splitting
import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(() => import('./InteractiveMap'), {
  loading: () => <div>Loading map...</div>,
  ssr: false, // Map components often need client-side rendering
});

// Data fetching optimization
export async function getStaticProps() {
  const places = await getPlaces();
  
  return {
    props: { places },
    revalidate: 3600, // Regenerate page every hour
  };
}
```

## Security Standards

### Data Validation
- **Input validation** - Validate all user inputs on both client and server
- **SQL injection prevention** - Use parameterized queries via Supabase
- **XSS prevention** - Sanitize user-generated content
- **CSRF protection** - Implement CSRF tokens for forms

### Authentication & Authorization
```typescript
// Route protection
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }
  
  return <div>Protected content</div>;
}
```

### Environment Variables
```typescript
// Environment variable validation
import { z } from 'zod';

const EnvSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string(),
  WEATHER_API_KEY: z.string(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export const env = EnvSchema.parse(process.env);
```

## Error Handling

### Client-Side Error Boundaries
```typescript
'use client';

import React from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-96">
      <h2 className="text-xl font-semibold mb-4">Something went wrong!</h2>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
  );
}
```

### Logging and Monitoring
```typescript
// Structured logging
interface LogContext {
  userId?: string;
  placeId?: string;
  action: string;
  timestamp: Date;
}

export const logger = {
  info: (message: string, context?: LogContext) => {
    console.log(JSON.stringify({ level: 'info', message, ...context }));
  },
  error: (message: string, error: Error, context?: LogContext) => {
    console.error(JSON.stringify({ 
      level: 'error', 
      message, 
      error: error.message, 
      stack: error.stack,
      ...context 
    }));
  },
};
```

## Git & Deployment

### Commit Messages
```
feat: add weather-aware place recommendations
fix: resolve map marker clustering performance issue
docs: update API documentation for places endpoint
refactor: extract common map utilities
test: add unit tests for place filtering
```

### Branch Strategy
- **main** - Production-ready code
- **develop** - Integration branch for features
- **feature/** - Feature development branches
- **hotfix/** - Critical production fixes

### Pre-commit Hooks
- **Linting** - ESLint and Prettier
- **Type checking** - TypeScript compiler
- **Testing** - Run affected tests
- **Build verification** - Ensure project builds successfully