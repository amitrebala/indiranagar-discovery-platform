# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## CRITICAL: Commit Workflow for This Project
**WHENEVER you request a commit (commit this, commit these changes, commit all, etc.), Claude MUST:**
```bash
./scripts/terminal-safe-commit.sh "appropriate commit message"
```
This automatically:
- **Isolates terminal-specific changes** - only commits files from current terminal
- Validates Vercel deployment locally
- If errors found, BMAD Development Agent (`/BMad:agents:dev`) activates automatically
- BMAD agent receives full error context via log files:
  - `.vercel-error-report.txt` - Error analysis and statistics
  - `.vercel-build-full.log` - Complete Vercel build output
  - `.vercel-context.txt` - Project structure and recent changes
  - `.recent-changes.txt` - Code intent and modifications
  - `.vercel-intent.txt` - What the feature was trying to achieve
- **GOAL-ORIENTED FIXES**: BMAD agent ensures:
  - Intended functionality is preserved and enabled
  - Errors are fixed while achieving the original goal
  - The feature works correctly, not just compiles
- Only commits if functionality works and build passes
- Eliminates manual Vercel error checking
- NO MANUAL INTERVENTION REQUIRED - BMAD agent handles everything

## Project Overview

This is the **Indiranagar Discovery Platform** - a comprehensive neighborhood discovery application built with Next.js 15, TypeScript, and Supabase. The platform implements 5 major epics across 27 user stories, featuring interactive mapping, community engagement, weather-aware recommendations, and advanced content management.

**Architecture:** Jamstack with Next.js App Router, Supabase PostgreSQL backend, deployed on Vercel with global edge network.

## Development Commands

All commands should be run from the `apps/web` directory:

```bash
# Development
npm run dev                 # Start dev server with Turbopack on 0.0.0.0:3000
npm run build              # Production build
npm run start              # Start production server on 0.0.0.0:3000

# Testing
npm run test               # Run test suite with Vitest
npm run test:watch         # Watch mode for development
npm run test:coverage      # Generate coverage report
npm run test:clean         # Kill any hanging test processes

# Database
npm run seed:database      # Seed database with sample data
npm run backup:content     # Backup content
npm run restore:content    # Restore content from backup

# Quality
npm run lint               # ESLint checks
```

## Deployment

Use the deployment script from project root:

```bash
# Standard build only
./scripts/deploy.sh production

# Deploy to Vercel (recommended for sharing)
./scripts/deploy.sh production vercel

# Build Docker container
./scripts/deploy.sh production docker
```

## Architecture Overview

### Epic-Based Feature Organization

The codebase is organized around 5 completed epics:

1. **Epic 1: Foundation & Core Infrastructure** - Next.js setup, database, basic mapping
2. **Epic 2: Place Discovery & Journey Experiences** - Advanced mapping, memory palace storytelling
3. **Epic 3: Social Coordination & Community Features** - Community suggestions, events, voting
4. **Epic 4: Enhanced Discovery & Content Hub** - Blog system, analytics, business relationships
5. **Epic 5: UX Excellence & Accessibility** - Accessibility compliance, personalization, mobile optimization

### Key Architectural Patterns

- **App Router Structure:** Uses Next.js 15 App Router with co-located components and API routes
- **Database-First Design:** Supabase PostgreSQL with comprehensive migrations in `supabase/migrations/`
- **Component Hierarchy:** Feature-based components in `components/` organized by domain (map, places, community, etc.)
- **Type Safety:** Comprehensive TypeScript types in `lib/types/` with Supabase-generated types
- **State Management:** Zustand stores in `stores/` for client state, Supabase for server state

### Database Schema

Core tables defined in migrations:
- `places` - Main place data with coordinates and metadata
- `companion_activities` - Before/after activities for places
- `place_images` - Image storage references
- `community_suggestions` - User-submitted place suggestions
- `community_events` - Event coordination system

### Component Architecture

**Smart Components:** Page-level components that handle data fetching and state
**UI Components:** Reusable components in `components/ui/` for common patterns
**Feature Components:** Domain-specific components (map, places, community, etc.)

Key component patterns:
- **Memory Palace System:** `components/places/MemoryPalaceStory.tsx` for rich storytelling
- **Interactive Mapping:** `components/map/InteractiveMap.tsx` with Leaflet integration
- **Community Features:** `components/community/` for user engagement
- **Accessibility:** `components/accessibility/FocusManager.tsx` for WCAG compliance

### API Structure

All API routes in `app/api/` following REST conventions:
- Weather integration with fallback providers
- Community suggestion workflow
- Analytics data aggregation
- Health checks for deployment validation

### Testing Strategy

- **Unit Tests:** Component testing with React Testing Library
- **Integration Tests:** API endpoint testing with mocked Supabase
- **E2E Testing:** Critical user journeys (map interaction, place discovery)
- **Accessibility Testing:** WCAG compliance validation

## Key Integration Points

### Supabase Integration
- Client in `lib/supabase/client.ts` for browser
- Server client in `lib/supabase/server.ts` for SSR
- Storage utilities in `lib/supabase/storage.ts`
- Type definitions in `lib/supabase/types.ts`

### Weather API Integration
- Primary: OpenWeatherMap with fallback to WeatherAPI
- Caching layer in `lib/weather/cache.ts`
- Recommendation engine in `lib/weather/recommendations.ts`

### Mapping System
- Leaflet.js with React-Leaflet wrapper
- Custom markers for place photography
- Journey route visualization
- Mobile-optimized touch interactions

## Development Guidelines

### Working with Places
- All place data flows through Supabase with RLS policies
- Images stored in Supabase Storage with optimization
- Coordinates restricted to Indiranagar boundaries (12.95-13.00, 77.58-77.65)

### Community Features
- Suggestion workflow includes admin review process
- Event system supports RSVP and category filtering
- Voting system with user authentication

### Mobile-First Development
- All components must work on mobile (320px+)
- Touch-friendly interactions with haptic feedback
- Progressive Web App features enabled

### Accessibility Requirements
- WCAG AA compliance required for all components
- Focus management with `FocusManager` component
- Screen reader optimization available
- High contrast and reduced motion support

## Environment Configuration

Required environment variables in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Server-side Supabase key
- `OPENWEATHERMAP_API_KEY` - Weather data (primary)
- `WEATHERAPI_KEY` - Weather data (fallback)

## Documentation

Comprehensive documentation in `docs/`:
- `docs/prd/` - Product requirements and user stories
- `docs/architecture/` - Technical architecture decisions
- `docs/stories/` - Individual story implementation details

The platform is production-ready with all 27 user stories implemented across 5 epics, suitable for deployment to Vercel for social sharing and professional demonstration.

## Deployment Validation Process

**MANDATORY: All commits must pass Vercel deployment validation before pushing to GitHub**

### DEFAULT COMMIT BEHAVIOR
**When user requests ANY form of commit (commit this, commit these changes, commit all, etc.), ALWAYS use:**
```bash
./scripts/safe-commit.sh -a "appropriate commit message"
```

This is NOT optional - it's the ONLY way to commit in this project.

### Automated Deployment Workflow

This project implements a comprehensive pre-commit deployment validation system:

1. **Local Vercel Build Validation**
   ```bash
   # Run before any commit
   ./scripts/vercel-pre-deploy.sh
   ```
   - Simulates exact Vercel build environment
   - Catches TypeScript, module, and build errors
   - Automatically fixes common issues

2. **Safe Commit Commands**
   ```bash
   # Recommended: Safe commit with validation
   ./scripts/safe-commit.sh "feat: add new feature"
   
   # For Claude Code integration
   ./scripts/claude-deploy-commit.sh "fix: resolve type errors"
   ```

3. **Git Hooks Installation**
   ```bash
   # One-time setup
   ./scripts/install-deployment-hooks.sh
   ```
   - Installs pre-commit validation hook
   - Prevents commits that would fail deployment
   - Adds deployment metadata to commits

4. **Error Handling**
   - Errors logged to `.vercel-errors.log`
   - Automatic fixes attempted for:
     - TypeScript compilation errors
     - Missing type definitions
     - Module resolution failures
     - Import/export mismatches
     - Missing dependencies
   - Claude Code integration for complex fixes

### Deployment Commands Summary

```bash
# Validate only (no commit)
./scripts/vercel-pre-deploy.sh

# Validate and commit
./scripts/safe-commit.sh -a "feat: complete feature"

# Skip validation (emergency only)
./scripts/safe-commit.sh -f "hotfix: urgent fix"

# Validate, fix with Claude, and commit
./scripts/claude-deploy-commit.sh "fix: deployment issues"
```

### Important Notes
- Never use `git commit` directly - always use the safe commit scripts
- Validation runs automatically if Git hooks are installed
- All deployment errors are fixed BEFORE reaching GitHub
- This eliminates manual Vercel log checking and fix cycles