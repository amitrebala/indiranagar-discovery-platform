# 🌍 Indiranagar Discovery Platform - Web App

**Live Application:** [https://web-44dnfqw3r-amit-rebalas-projects.vercel.app](https://web-44dnfqw3r-amit-rebalas-projects.vercel.app)

This is the main web application for the Indiranagar Discovery Platform, built with Next.js 15, TypeScript, and Supabase.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account with environment variables configured

### Development Server

```bash
npm run dev
# Starts development server with Turbopack on http://localhost:3000
```

### Available Scripts

```bash
npm run dev                 # Start development server with Turbopack
npm run build              # Production build
npm run start              # Start production server
npm run test               # Run test suite with Vitest
npm run test:watch         # Watch mode for development
npm run test:coverage      # Generate coverage report
npm run test:clean         # Kill any hanging test processes
npm run lint               # ESLint checks
npm run seed:database      # Seed database with 186 places
npm run backup:content     # Backup content
npm run restore:content    # Restore content from backup
```

## 🏗️ Project Structure

```
apps/web/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── places/           # Places pages
│   ├── community/        # Community features
│   ├── blog/             # Blog system
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── places/           # Place-related components
│   ├── community/        # Community features
│   ├── map/              # Interactive mapping
│   ├── mobile/           # Mobile-optimized components
│   └── ui/               # Reusable UI components
├── lib/                  # Utilities and configurations
│   ├── supabase/         # Database client and types
│   ├── weather/          # Weather API integration
│   ├── search/           # Search engine
│   └── analytics/        # Analytics system
├── public/               # Static assets
├── supabase/            # Database migrations
├── tests/               # Test files
└── docs/                # Documentation
```

## 🎯 Key Features

### ✅ **Production Ready**
- **186 curated places** with comprehensive metadata
- **Place Cards QA tested** across 8 dimensions
- **WCAG AA accessibility** compliance
- **Mobile-first responsive** design
- **Performance optimized** with code splitting

### 🗺️ **Interactive Mapping**
- Leaflet integration with custom markers
- Journey route visualization
- Memory palace storytelling
- Weather-aware recommendations

### 👥 **Community Platform**
- Community suggestions and voting
- Event coordination with RSVP
- Social sharing capabilities
- Admin moderation tools

### 📱 **Modern Web Experience**
- Progressive Web App (PWA)
- Haptic feedback on mobile
- Offline capabilities
- Real-time analytics

## 🔧 Environment Setup

Create `.env.local` with required variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SECRET_KEY=your_supabase_service_key
WEATHER_API_PRIMARY=your_openweather_api_key
WEATHER_API_FALLBACK=your_weather_api_key
```

## 🧪 Testing

### Test Coverage
- **Unit Tests:** Component testing with React Testing Library
- **Integration Tests:** API endpoint testing
- **Accessibility Tests:** WCAG compliance validation
- **Place Cards:** Comprehensive QA testing completed

### Run Tests
```bash
npm run test               # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Generate coverage report
```

## 📊 Performance Metrics

- **Build Size:** 1.34 MiB (optimized with code splitting)
- **Lighthouse Score:** 90+
- **Dependencies:** 606 packages, 0 vulnerabilities
- **Database:** 186+ places with comprehensive metadata
- **Accessibility:** WCAG AA compliant

## 🚀 Deployment

### Vercel (Current)
The app is deployed on Vercel with automatic CI/CD from GitHub.

**Production URL:** https://web-44dnfqw3r-amit-rebalas-projects.vercel.app

### Local Production Build
```bash
npm run build
npm run start
```

### Docker
```bash
docker build -t indiranagar-web .
docker run -p 3000:3000 indiranagar-web
```

## 📖 Documentation

- **Main Docs:** `../../docs/`
- **Architecture:** `../../docs/architecture/`
- **User Stories:** `../../docs/stories/`
- **QA Results:** `PLACE_CARDS_TEST_RESULTS.md`
- **Development Guide:** `CLAUDE.md`

## 🎯 Epic Status

All 5 epics are complete and deployed:

- ✅ **Epic 1:** Foundation & Core Infrastructure
- ✅ **Epic 2:** Place Discovery & Journey Experiences  
- ✅ **Epic 3:** Social Coordination & Community Features
- ✅ **Epic 4:** Enhanced Discovery & Content Hub
- ✅ **Epic 5:** UX Excellence & Accessibility

## 🤝 Development

This project uses:
- **Next.js 15** with App Router and Turbopack
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Supabase** for backend and database
- **Vitest** for testing
- **ESLint** for code quality

Built with ❤️ using [Claude Code](https://claude.ai/code)