# Testing Infrastructure Architecture

## Testing Framework Stack

**Unit & Integration Testing:**
- **Vitest** - Modern test runner with ESM support
- **Testing Library** - Component testing utilities
- **MSW** - API mocking for consistent test environments
- **Supertest** - API endpoint testing

**End-to-End Testing:**
- **Playwright** - Cross-browser automation
- **Mobile Testing** - iPhone/Android viewport testing
- **Visual Regression** - Screenshot comparison testing

## Test Environment Configuration

**Test Categories & Coverage:**
1. **Unit Tests (60%)** - Components, utilities, business logic
2. **Integration Tests (25%)** - API routes, database operations, external service integration
3. **E2E Tests (15%)** - Critical user journeys, weather-aware discovery flows

**Mock Strategy:**
```typescript
// Weather API Mocking
rest.get('/api/weather', (req, res, ctx) => {
  return res(ctx.json({
    condition: 'clear',
    temperature: 25,
    fallback: false,
    recommendations: ['Perfect weather for exploration']
  }));
});

// Supabase Mocking  
rest.get('*/rest/v1/places*', (req, res, ctx) => {
  return res(ctx.json([mockPlaceData]));
});
```

**CI/CD Integration:**
```yaml
# GitHub Actions Workflow
- Unit tests run on every commit
- Integration tests with test database
- E2E tests on staging environment
- Coverage reporting and quality gates
- Automatic deployment on test pass
```

## Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.{js,ts}',
        '**/*.d.ts',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/components': path.resolve(__dirname, './components'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/hooks': path.resolve(__dirname, './hooks'),
      '@/stores': path.resolve(__dirname, './stores'),
    },
  },
});

// tests/setup.ts
import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './mocks/server';

// Start MSW server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Clean up after each test
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

// Close server after all tests
afterAll(() => server.close());

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock environment variables
process.env.OPENWEATHER_API_KEY = 'test-key';
process.env.WEATHERAPI_KEY = 'test-backup-key';
process.env.UPSTASH_REDIS_REST_URL = 'https://test-redis.upstash.io';
process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
```

## Mock Service Worker Setup

```typescript
// tests/mocks/server.ts
import { setupServer } from 'msw/node';
import { weatherHandlers } from './weather';
import { supabaseHandlers } from './supabase';
import { mapHandlers } from './map';

export const server = setupServer(
  ...weatherHandlers,
  ...supabaseHandlers,
  ...mapHandlers
);

// tests/mocks/weather.ts
import { rest } from 'msw';

export const weatherHandlers = [
  // Internal weather API
  rest.get('/api/weather', (req, res, ctx) => {
    const lat = req.url.searchParams.get('lat');
    const lon = req.url.searchParams.get('lon');
    
    if (!lat || !lon) {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Latitude and longitude coordinates required' })
      );
    }
    
    return res(
      ctx.json({
        condition: 'clear',
        temperature: 25,
        humidity: 60,
        fallback: false,
        source: 'api',
        recommendations: ['Perfect weather for exploration'],
        timestamp: new Date().toISOString()
      })
    );
  }),
  
  // OpenWeatherMap API
  rest.get('https://api.openweathermap.org/data/2.5/weather', (req, res, ctx) => {
    return res(
      ctx.json({
        weather: [{ main: 'Clear', description: 'clear sky' }],
        main: { temp: 25, humidity: 60 },
        wind: { speed: 3.5 },
        coord: { lat: 12.9716, lon: 77.5946 }
      })
    );
  }),
  
  // WeatherAPI.com backup
  rest.get('https://api.weatherapi.com/v1/current.json', (req, res, ctx) => {
    return res(
      ctx.json({
        current: {
          temp_c: 25,
          condition: { text: 'Sunny', code: 1000 },
          humidity: 60,
          wind_kph: 12.6
        },
        location: {
          name: 'Bangalore',
          region: 'Karnataka',
          country: 'India'
        }
      })
    );
  }),
  
  // API failure simulation
  rest.get('/api/weather-fail', (req, res, ctx) => {
    return res(ctx.status(500), ctx.text('Internal Server Error'));
  }),
];

// tests/mocks/supabase.ts  
export const supabaseHandlers = [
  rest.get('*/rest/v1/places*', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: 1,
          name: 'Test Place',
          latitude: 12.9716,
          longitude: 77.5946,
          rating: 4.5,
          description: 'Test description',
          weather_suitability: ['clear', 'cloudy'],
          companion_activities: ['nearby-cafe', 'park-walk']
        },
        {
          id: 2,
          name: 'Rainy Day Spot',
          latitude: 12.9720,
          longitude: 77.5950,
          rating: 4.0,
          description: 'Great for monsoon',
          weather_suitability: ['rain'],
          companion_activities: ['indoor-shopping']
        }
      ])
    );
  }),
  
  rest.post('*/rest/v1/suggestions', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({ 
        id: 1, 
        status: 'submitted',
        created_at: new Date().toISOString() 
      })
    );
  }),
];
```

## Component Testing Examples

```typescript
// tests/components/WeatherContextBar.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WeatherContextBar } from '@/components/weather/WeatherContextBar';

// Mock the weather hook
vi.mock('@/hooks/useWeather', () => ({
  useWeather: vi.fn()
}));

const mockUseWeather = vi.mocked(useWeather);

describe('WeatherContextBar', () => {
  beforeEach(() => {
    mockUseWeather.mockReturnValue({
      weatherData: {
        condition: 'clear',
        temperature: 25,
        humidity: 60,
        recommendations: ['Perfect weather for exploration'],
        fallback: false,
        source: 'api'
      },
      isLoading: false,
      error: null,
      refetch: vi.fn()
    });
  });

  it('displays current weather information', async () => {
    render(<WeatherContextBar />);
    
    await waitFor(() => {
      expect(screen.getByText('25°C')).toBeInTheDocument();
      expect(screen.getByText(/perfect weather/i)).toBeInTheDocument();
      expect(screen.getByText(/clear/i)).toBeInTheDocument();
    });
  });

  it('shows loading state when weather data is loading', () => {
    mockUseWeather.mockReturnValue({
      weatherData: null,
      isLoading: true,
      error: null,
      refetch: vi.fn()
    });

    render(<WeatherContextBar />);
    expect(screen.getByTestId('weather-loading')).toBeInTheDocument();
    expect(screen.getByLabelText(/loading weather/i)).toBeInTheDocument();
  });

  it('handles weather API failures gracefully', () => {
    mockUseWeather.mockReturnValue({
      weatherData: {
        condition: 'clear',
        temperature: 22,
        fallback: true,
        source: 'default',
        recommendations: ['Weather data temporarily unavailable']
      },
      isLoading: false,
      error: 'API Error',
      refetch: vi.fn()
    });

    render(<WeatherContextBar />);
    expect(screen.getByText(/weather temporarily unavailable/i)).toBeInTheDocument();
    expect(screen.getByTestId('weather-fallback-indicator')).toBeInTheDocument();
  });

  it('adapts layout for mobile screens', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(<WeatherContextBar variant="mobile" />);
    expect(screen.getByTestId('weather-mobile-banner')).toBeInTheDocument();
  });

  it('provides weather-based recommendations', () => {
    mockUseWeather.mockReturnValue({
      weatherData: {
        condition: 'rain',
        temperature: 20,
        recommendations: [
          'Consider covered routes',
          'Indoor activities recommended'
        ],
        fallback: false,
        source: 'api'
      },
      isLoading: false,
      error: null,
      refetch: vi.fn()
    });

    render(<WeatherContextBar />);
    expect(screen.getByText(/covered routes/i)).toBeInTheDocument();
    expect(screen.getByText(/indoor activities/i)).toBeInTheDocument();
  });
});
```

## API Route Testing

```typescript
// tests/api/weather.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMocks } from 'node-mocks-http';
import { GET } from '@/app/api/weather/route';
import { NextRequest } from 'next/server';

// Mock external dependencies
vi.mock('@/lib/weather/cache', () => ({
  getCachedWeather: vi.fn(),
  cacheWeather: vi.fn(),
  checkRateLimit: vi.fn().mockResolvedValue(false)
}));

describe('/api/weather', () => {
  beforeEach(() => {
    process.env.OPENWEATHER_API_KEY = 'test-key';
    process.env.WEATHERAPI_KEY = 'test-backup-key';
    vi.clearAllMocks();
  });

  it('returns weather data for valid coordinates', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/weather?lat=12.9716&lon=77.5946'
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('condition');
    expect(data).toHaveProperty('temperature');
    expect(data.fallback).toBe(false);
    expect(data.source).toBe('api');
  });

  it('handles missing coordinates with proper error', async () => {
    const request = new NextRequest('http://localhost:3000/api/weather');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('coordinates required');
  });

  it('handles rate limiting correctly', async () => {
    vi.mocked(checkRateLimit).mockResolvedValue(true);

    const request = new NextRequest(
      'http://localhost:3000/api/weather?lat=12.9716&lon=77.5946'
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.error).toContain('Rate limit exceeded');
    expect(data.fallback).toBe('manual');
  });

  it('returns cached data when available and fresh', async () => {
    const cachedData = {
      condition: 'clear',
      temperature: 25,
      timestamp: new Date().toISOString(),
      source: 'api'
    };
    
    vi.mocked(getCachedWeather).mockResolvedValue(cachedData);

    const request = new NextRequest(
      'http://localhost:3000/api/weather?lat=12.9716&lon=77.5946'
    );

    const response = await GET(request);
    const data = await response.json();

    expect(data.source).toBe('cache');
    expect(data.temperature).toBe(25);
  });

  it('handles API failures with seasonal fallback', async () => {
    vi.mocked(getCachedWeather).mockResolvedValue(null);
    
    // Mock fetch to fail for both APIs
    global.fetch = vi.fn()
      .mockRejectedValueOnce(new Error('Primary API failure'))
      .mockRejectedValueOnce(new Error('Backup API failure'));

    const request = new NextRequest(
      'http://localhost:3000/api/weather?lat=12.9716&lon=77.5946'
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.fallback).toBe(true);
    expect(data.source).toBe('default');
    expect(data).toHaveProperty('condition');
    expect(data.message).toContain('temporarily unavailable');
  });
});
```

## Playwright E2E Testing

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});

// tests/e2e/weather-aware-discovery.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Weather-Aware Discovery Flow', () => {
  test('displays weather context and updates recommendations', async ({ page }) => {
    await page.goto('/');
    
    // Check weather context bar is visible
    await expect(page.locator('[data-testid="weather-context-bar"]')).toBeVisible();
    
    // Verify weather information is displayed
    await expect(page.locator('[data-testid="current-temperature"]')).toBeVisible();
    await expect(page.locator('[data-testid="weather-condition"]')).toBeVisible();
    
    // Check weather recommendations
    await expect(page.locator('[data-testid="weather-recommendations"]')).toBeVisible();
    
    // Click on map to open place details
    await page.click('[data-testid="place-marker"]');
    
    // Verify weather suitability is shown on place detail
    await expect(page.locator('[data-testid="weather-suitability"]')).toBeVisible();
  });

  test('handles weather API failures gracefully', async ({ page }) => {
    // Mock API failure
    await page.route('/api/weather*', route => {
      route.fulfill({ 
        status: 500, 
        contentType: 'application/json',
        body: JSON.stringify({ error: 'API Error' })
      });
    });

    await page.goto('/');
    
    // Should show fallback weather state
    await expect(page.locator('text=/weather temporarily unavailable/i')).toBeVisible();
    await expect(page.locator('[data-testid="weather-fallback-indicator"]')).toBeVisible();
    
    // Places should still be accessible without weather data
    await page.click('[data-testid="place-marker"]');
    await expect(page.locator('[data-testid="place-detail"]')).toBeVisible();
  });

  test('adapts weather display for mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Mobile weather banner should be visible
    await expect(page.locator('[data-testid="mobile-weather-banner"]')).toBeVisible();
    
    // Tap to expand weather details
    await page.tap('[data-testid="mobile-weather-banner"]');
    await expect(page.locator('[data-testid="expanded-weather-info"]')).toBeVisible();
    
    // Verify touch targets are large enough (minimum 44px)
    const weatherButton = page.locator('[data-testid="weather-expand-button"]');
    const boundingBox = await weatherButton.boundingBox();
    expect(boundingBox?.width).toBeGreaterThanOrEqual(44);
    expect(boundingBox?.height).toBeGreaterThanOrEqual(44);
  });

  test('filters places based on weather conditions', async ({ page }) => {
    // Mock rainy weather
    await page.route('/api/weather*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          condition: 'rain',
          temperature: 22,
          humidity: 85,
          recommendations: ['Consider covered routes', 'Indoor activities recommended'],
          fallback: false,
          source: 'api'
        })
      });
    });

    await page.goto('/');
    
    // Verify rainy weather is detected
    await expect(page.locator('text=/rain/i')).toBeVisible();
    await expect(page.locator('text=/covered routes/i')).toBeVisible();
    
    // Apply weather filter
    await page.click('[data-testid="weather-filter-toggle"]');
    
    // Verify only weather-appropriate places are shown
    const placeMarkers = page.locator('[data-testid="place-marker"]');
    await expect(placeMarkers).toHaveCount(2); // Only rain-suitable places
    
    // Verify rain-suitable badge on places
    await expect(page.locator('[data-testid="rain-suitable-badge"]')).toBeVisible();
  });
});
```

## CI/CD GitHub Actions

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18, 20]
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Setup Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Lint code
      run: npm run lint
    
    - name: Type check
      run: npm run type-check
    
    - name: Run unit tests
      run: npm run test:unit
      env:
        OPENWEATHER_API_KEY: ${{ secrets.OPENWEATHER_TEST_KEY }}
        WEATHERAPI_KEY: ${{ secrets.WEATHERAPI_TEST_KEY }}
    
    - name: Run integration tests  
      run: npm run test:integration
      env:
        SUPABASE_URL: ${{ secrets.SUPABASE_TEST_URL }}
        SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_TEST_KEY }}
        UPSTASH_REDIS_REST_URL: ${{ secrets.UPSTASH_TEST_URL }}
        UPSTASH_REDIS_REST_TOKEN: ${{ secrets.UPSTASH_TEST_TOKEN }}
    
    - name: Install Playwright browsers
      run: npx playwright install --with-deps
    
    - name: Run E2E tests
      run: npm run test:e2e
      env:
        OPENWEATHER_API_KEY: ${{ secrets.OPENWEATHER_TEST_KEY }}
        WEATHERAPI_KEY: ${{ secrets.WEATHERAPI_TEST_KEY }}
    
    - name: Generate test coverage
      run: npm run test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        token: ${{ secrets.CODECOV_TOKEN }}
        files: ./coverage/lcov.info
    
    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: failure()
      with:
        name: test-results-${{ matrix.node-version }}
        path: |
          test-results/
          coverage/
          playwright-report/
```

## Package.json Test Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run tests/components tests/lib tests/hooks",
    "test:integration": "vitest run tests/api tests/integration", 
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch",
    "test:weather": "vitest run tests/weather --reporter=verbose",
    "test:ci": "npm run test:unit && npm run test:integration && npm run test:e2e"
  }
}
```

This comprehensive testing infrastructure ensures reliable operation of the weather-aware discovery platform with automated quality gates and thorough coverage of critical user journeys.