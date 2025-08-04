# Source Tree Structure

## Project Root Structure

```
indiranagar-discovery-platform/
|-- .github/                          # CI/CD workflows
|   +-- workflows/
|       |-- ci.yaml                   # Automated testing pipeline
|       +-- deploy.yaml               # Vercel deployment workflow
|-- .next/                            # Next.js build output (gitignored)
|-- .vercel/                          # Vercel deployment configuration
|-- apps/
|   +-- web/                          # Next.js application (frontend + API)
|       |-- app/                      # Next.js 14+ App Router
|       |   |-- globals.css           # Global Tailwind styles
|       |   |-- layout.tsx            # Root layout with navigation
|       |   |-- page.tsx              # Homepage with weather context
|       |   |-- map/
|       |   |   +-- page.tsx          # Interactive map + journey overlay
|       |   |-- places/
|       |   |   |-- page.tsx          # Place database listing
|       |   |   +-- [slug]/
|       |   |       +-- page.tsx      # Individual place detail pages
|       |   |-- journeys/
|       |   |   |-- page.tsx          # Journey experiences listing
|       |   |   +-- [slug]/
|       |   |       +-- page.tsx      # Individual journey pages
|       |   |-- events/
|       |   |   +-- page.tsx          # Notice board and events
|       |   |-- news/
|       |   |   |-- page.tsx          # News blog listing
|       |   |   +-- [slug]/
|       |   |       +-- page.tsx      # Individual blog posts
|       |   |-- about/
|       |   |   +-- page.tsx          # About Amit and contact
|       |   +-- api/                  # API Routes (serverless functions)
|       |       |-- places/
|       |       |   |-- route.ts      # GET/POST places
|       |       |   +-- [id]/
|       |       |       +-- route.ts  # Individual place operations
|       |       |-- weather/
|       |       |   +-- route.ts      # Weather API integration
|       |       |-- suggestions/
|       |       |   +-- route.ts      # "Has Amit Been Here?" submissions
|       |       +-- auth/
|       |           +-- route.ts      # Authentication endpoints
|       |-- components/               # Reusable UI components
|       |   |-- ui/                   # Base Tailwind/Headless UI components
|       |   |   |-- button.tsx
|       |   |   |-- card.tsx
|       |   |   |-- modal.tsx
|       |   |   +-- input.tsx
|       |   |-- weather/
|       |   |   |-- WeatherContextBar.tsx      # Persistent weather intelligence
|       |   |   +-- WeatherOverlay.tsx         # Map weather integration
|       |   |-- map/
|       |   |   |-- InteractiveMap.tsx         # Main map component
|       |   |   |-- PlaceMarker.tsx            # Custom photography markers
|       |   |   +-- JourneyRouteVisualization.tsx
|       |   |-- places/
|       |   |   |-- PlaceCard.tsx              # Place listing cards
|       |   |   |-- PlaceDetail.tsx            # Rich place content
|       |   |   |-- CompanionActivityCard.tsx  # Before/after activities
|       |   |   +-- MemoryPalaceStory.tsx      # Personal narratives
|       |   |-- community/
|       |   |   |-- HasAmitBeenHereButton.tsx  # Floating community feature
|       |   |   |-- SuggestionForm.tsx         # User suggestions
|       |   |   +-- NoticeBoard.tsx            # Events and announcements
|       |   |-- navigation/
|       |   |   |-- Header.tsx                 # Main navigation
|       |   |   |-- MobileNav.tsx              # Mobile hamburger menu
|       |   |   +-- Breadcrumbs.tsx            # Contextual navigation
|       |   +-- layout/
|       |       |-- Container.tsx              # Content wrapper
|       |       |-- Grid.tsx                   # Responsive grid
|       |       +-- Section.tsx                # Page sections
|       |-- lib/                      # Utilities and configuration
|       |   |-- supabase/
|       |   |   |-- client.ts                  # Supabase client configuration
|       |   |   |-- server.ts                  # Server-side Supabase
|       |   |   +-- types.ts                   # Database type definitions
|       |   |-- weather/
|       |   |   |-- client.ts                  # Weather API integration
|       |   |   +-- cache.ts                   # Weather data caching
|       |   |-- utils.ts              # Shared utility functions
|       |   |-- constants.ts          # App-wide constants
|       |   +-- validations.ts        # Form validation schemas
|       |-- hooks/                    # Custom React hooks
|       |   |-- useWeather.ts         # Weather context management
|       |   |-- useGeolocation.ts     # User location detection
|       |   |-- usePlaces.ts          # Place data fetching
|       |   +-- useJourneys.ts        # Journey data management
|       |-- stores/                   # Zustand state management
|       |   |-- weatherStore.ts       # Weather context state
|       |   |-- userStore.ts          # User preferences
|       |   +-- navigationStore.ts    # Navigation state
|       |-- styles/                   # Styling and design system
|       |   |-- globals.css           # Global styles and Tailwind imports
|       |   +-- components.css        # Component-specific styles
|       |-- public/                   # Static assets
|       |   |-- images/
|       |   |   |-- places/           # Place photography
|       |   |   |-- icons/            # Custom icons
|       |   |   +-- branding/         # Logos and brand assets
|       |   |-- favicon.ico
|       |   +-- manifest.json
|       |-- tests/                    # Testing files
|       |   |-- __mocks__/            # Mock implementations
|       |   |-- components/           # Component tests
|       |   |-- pages/                # Page tests
|       |   |-- api/                  # API route tests
|       |   +-- e2e/                  # Playwright end-to-end tests
|       |-- .env.local.example        # Environment variables template
|       |-- next.config.js            # Next.js configuration
|       |-- tailwind.config.js        # Tailwind CSS configuration
|       |-- tsconfig.json             # TypeScript configuration
|       |-- package.json              # Dependencies and scripts
|       +-- README.md                 # Development setup instructions
|-- packages/                         # Shared packages
|   |-- shared/                       # Shared types and utilities
|   |   |-- src/
|   |   |   |-- types/
|   |   |   |   |-- place.ts          # Place data models
|   |   |   |   |-- journey.ts        # Journey data models
|   |   |   |   |-- weather.ts        # Weather data types
|   |   |   |   |-- user.ts           # User data models
|   |   |   |   +-- index.ts          # Type exports
|   |   |   |-- constants/
|   |   |   |   |-- weather.ts        # Weather-related constants
|   |   |   |   |-- places.ts         # Place categories and constants
|   |   |   |   +-- index.ts          # Constant exports
|   |   |   +-- utils/
|   |   |       |-- date.ts           # Date utility functions
|   |   |       |-- geo.ts            # Geographic calculations
|   |   |       |-- weather.ts        # Weather utility functions
|   |   |       +-- index.ts          # Utility exports
|   |   +-- package.json
|   +-- ui/                           # Shared UI components (future expansion)
|       |-- src/
|       |   |-- components/           # Reusable UI components
|       |   +-- styles/               # Shared styles
|       +-- package.json
|-- docs/                             # Documentation
|   |-- prd.md                        # Product Requirements Document
|   |-- front-end-spec.md             # UI/UX Specification
|   |-- architecture.md               # This document
|   |-- api-reference.md              # API documentation
|   +-- deployment.md                 # Deployment guide
|-- scripts/                          # Build and deployment scripts
|   |-- setup.sh                      # Initial project setup
|   |-- build.sh                      # Production build script
|   +-- deploy.sh                     # Deployment script
|-- .env.example                      # Environment variables template
|-- .gitignore                        # Git ignore rules
|-- package.json                      # Root package.json with workspaces
|-- pnpm-workspace.yaml              # PNPM workspace configuration
|-- turbo.json                        # Turborepo configuration (if added later)
+-- README.md                         # Project overview and setup
```

## Alternative: Hierarchical List Format

### Core Application (`apps/web/`)
- **App Router Pages**: `/app/` directory with Next.js 14+ routing
  - Homepage with weather context
  - Interactive map with journey overlay
  - Place database and detail pages
  - Journey experiences
  - Events and news sections
  - About and contact pages

- **API Routes**: `/app/api/` serverless functions
  - Places CRUD operations
  - Weather API integration  
  - Community suggestions
  - Authentication endpoints

- **Components**: Feature-organized React components
  - UI primitives (buttons, cards, modals)
  - Weather integration components
  - Map and visualization components
  - Place and journey displays
  - Community features
  - Navigation and layout

- **Libraries**: Utilities and configuration
  - Supabase database client
  - Weather API integration
  - Shared utilities and constants
  - Form validation schemas

- **State Management**: Zustand stores
  - Weather context state
  - User preferences
  - Navigation state

### Shared Packages (`packages/`)
- **Shared Types**: TypeScript definitions for data models
- **Constants**: App-wide constants and enums
- **Utilities**: Reusable helper functions
- **UI Library**: Future shared component library

### Documentation (`docs/`)
- Product Requirements Document
- UI/UX Specifications  
- Architecture documentation
- API reference
- Deployment guides

### Build & Development
- GitHub Actions workflows
- Setup and deployment scripts
- Environment configuration
- Testing infrastructure