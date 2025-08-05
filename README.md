# 🌍 Indiranagar Discovery Platform

A comprehensive neighborhood discovery platform featuring interactive mapping, community engagement, weather-aware recommendations, and memory palace storytelling. Built with Next.js 15, TypeScript, and Supabase.

**🚀 Live Demo:** [https://web-44dnfqw3r-amit-rebalas-projects.vercel.app](https://web-44dnfqw3r-amit-rebalas-projects.vercel.app)

## 🎯 Latest Updates (January 2025)

### ✅ **Place Cards QA Testing Complete**
- Comprehensive testing across 8 dimensions: rendering, interactions, responsive design, accessibility, loading states, error handling, filtering, and automation
- WCAG AA accessibility compliance validated
- Production-ready with detailed test documentation

### ✅ **186 Curated Places**
- Complete database of personally visited locations across Bangalore
- Each place includes ratings, descriptions, weather suitability, and accessibility information
- Categories: Cafes, Restaurants, Street Food, Breweries, Shopping, Parks, Culture, and more

### ✅ **Enhanced Navigation**
- Fixed place card navigation with proper dynamic routing
- Individual place detail pages with rich content
- SEO-optimized URLs and metadata generation

## ✨ Features

### 🗺️ Interactive Mapping & Discovery
- Custom photography markers with Leaflet integration
- Journey route visualization and storytelling
- Memory palace visual narratives
- Weather-aware place recommendations
- Mobile-optimized exploration interface

### 👥 Community Features
- Community suggestions and voting system
- Event coordination with RSVP functionality
- Social sharing and discovery amplification
- Community badges and recognition system
- Admin review and moderation tools

### 📱 Modern Web Experience
- Progressive Web App (PWA) capabilities
- WCAG AA accessibility compliance
- Mobile-first responsive design
- Performance-optimized with bundle splitting
- Real-time analytics and monitoring

### 🎨 Content & Storytelling
- Memory palace storytelling system
- Personal news commentary and insights blog
- Business relationship tracking
- Seasonal context and weather integration
- Advanced search with natural language processing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/indiranagar-discovery-platform.git
   cd indiranagar-discovery-platform
   ```

2. **Install dependencies**
   ```bash
   cd apps/web
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.local.example .env.local
   # Add your Supabase and API keys
   ```

4. **Database setup**
   ```bash
   # Run Supabase migrations
   npx supabase db push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Architecture

### Tech Stack
- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL), Next.js API Routes
- **Mapping:** Leaflet, React-Leaflet
- **State Management:** Zustand
- **Authentication:** Supabase Auth
- **Deployment:** Vercel, Docker support

### Project Structure
```
apps/web/
├── app/                     # Next.js App Router
│   ├── api/                 # API routes
│   ├── (pages)/            # Page components
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── map/               # Mapping components
│   ├── community/         # Community features
│   ├── places/            # Place-related components
│   └── ui/                # Reusable UI components
├── lib/                   # Utilities and configurations
│   ├── supabase/         # Database client
│   ├── weather/          # Weather API integration
│   └── types/            # TypeScript definitions
├── public/               # Static assets
└── supabase/            # Database migrations
```

## 🎯 Epic Roadmap

### ✅ Epic 1: Foundation & Core Infrastructure
- [x] Next.js 15 setup with App Router
- [x] Supabase PostgreSQL integration  
- [x] Interactive mapping foundation
- [x] Basic place database schema
- [x] Homepage and navigation structure
- [x] Community question feature
- [x] Weather API integration
- [x] Testing infrastructure

### ✅ Epic 2: Place Discovery & Journey Experiences
- [x] Enhanced mapping with custom markers
- [x] Memory palace storytelling system
- [x] Journey routes and companion activities
- [x] Advanced search and discovery
- [x] Mobile-optimized interface

### ✅ Epic 3: Social Coordination & Community Features
- [x] Community suggestion system
- [x] Event coordination platform
- [x] Enhanced question management
- [x] Social sharing capabilities
- [x] Community badges and recognition

### ✅ Epic 4: Enhanced Discovery & Content Hub
- [x] Weather-aware recommendations
- [x] Personal blog and commentary system
- [x] Business relationship tracking
- [x] Advanced content features
- [x] Analytics and optimization

### ✅ Epic 5: UX Excellence & Accessibility
- [x] WCAG AA accessibility compliance
- [x] Enhanced user experience
- [x] Performance optimization
- [x] Personalization system
- [x] Mobile optimization

## 📊 Performance & Analytics

- **Build Size:** Optimized with code splitting (1.34 MiB)
- **Performance Score:** Lighthouse 90+ 
- **Accessibility:** WCAG AA compliant with comprehensive testing
- **Dependencies:** 606 packages, 0 vulnerabilities
- **Mobile Support:** PWA with offline capabilities and haptic feedback
- **Database:** 186+ curated places with comprehensive metadata

## 🌤️ API Integrations

- **Weather:** OpenWeatherMap with WeatherAPI fallback
- **Maps:** Leaflet with custom marker system
- **Database:** Supabase with Row Level Security
- **Analytics:** Built-in performance monitoring
- **Storage:** Supabase Storage for images

## 🔧 Development

### Available Scripts

```bash
npm run dev                 # Start development server with Turbopack
npm run build              # Production build
npm run start              # Start production server
npm run test               # Run test suite with Vitest
npm run test:watch         # Watch mode for development
npm run test:coverage      # Generate coverage report
npm run lint               # ESLint checks
npm run seed:database      # Seed database with 186 curated places
npm run backup:content     # Backup content
npm run restore:content    # Restore content from backup
```

### Environment Variables

Required environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SECRET_KEY=your_supabase_service_key
WEATHER_API_PRIMARY=your_openweather_api_key
WEATHER_API_FALLBACK=your_weather_api_fallback_key
```

## 🚀 Deployment

### Vercel (Recommended)

#### Prerequisites
- Vercel account and CLI installed (`npm i -g vercel`)
- Environment variables configured

#### Environment Variables Setup

1. **Via Vercel Dashboard:**
   - Go to your project settings on Vercel
   - Navigate to "Environment Variables"
   - Add all required variables from `.env.example`

2. **Via Vercel CLI:**
   ```bash
   # Add each environment variable
   vercel env add NEXT_PUBLIC_SUPABASE_URL production
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
   vercel env add SUPABASE_SERVICE_ROLE_KEY production
   vercel env add OPENWEATHERMAP_API_KEY production
   vercel env add WEATHERAPI_KEY production
   # Add all other required variables...
   ```

3. **Required Environment Variables:**
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
   - `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
   - `OPENWEATHERMAP_API_KEY` - OpenWeatherMap API key
   - `WEATHERAPI_KEY` - WeatherAPI key (fallback)
   - See `.env.example` for complete list

#### Deploy Commands

```bash
# Deploy from project root
vercel --prod

# Or use deployment script
./scripts/deploy.sh production vercel
```

### Docker
```bash
docker build -t indiranagar-platform .
docker run -p 3000:3000 indiranagar-platform
```

### Manual Deployment
```bash
npm run build
npm run start
```

## 📖 Documentation

- **Setup Guide:** `docs/SETUP-GUIDE.md`
- **Architecture:** `docs/architecture/`
- **User Stories:** `docs/stories/`
- **API Documentation:** `docs/api-contracts/`
- **Development Guide:** `CLAUDE.md`

## 🤝 Contributing

This project was developed with AI assistance using Claude Code. For contributions:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Claude Code](https://claude.ai/code)
- Mapping powered by [Leaflet](https://leafletjs.com/)
- Backend by [Supabase](https://supabase.com/)
- UI components with [Tailwind CSS](https://tailwindcss.com/)

---

## 🎯 **Production Status: LIVE & READY**

**🌐 Live Application:** [https://web-44dnfqw3r-amit-rebalas-projects.vercel.app](https://web-44dnfqw3r-amit-rebalas-projects.vercel.app)  
**📚 Documentation:** [Complete Documentation](docs/)  
**🐛 Issues:** [Report Issues](https://github.com/amitrebala/indiranagar-discovery-platform/issues)  
**📋 QA Results:** [Place Cards Test Results](apps/web/PLACE_CARDS_TEST_RESULTS.md)

### ✅ **All 5 Epics Complete & Deployed**
- **Epic 1:** Foundation & Core Infrastructure ✅
- **Epic 2:** Place Discovery & Journey Experiences ✅  
- **Epic 3:** Social Coordination & Community Features ✅
- **Epic 4:** Enhanced Discovery & Content Hub ✅
- **Epic 5:** UX Excellence & Accessibility ✅

**Made with ❤️ for the Indiranagar community**  
*Developed with AI assistance using [Claude Code](https://claude.ai/code)*