# 🌍 Indiranagar Discovery Platform

A comprehensive neighborhood discovery platform featuring interactive mapping, community engagement, weather-aware recommendations, and memory palace storytelling. Built with Next.js 15, TypeScript, and Supabase.

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

- **Build Size:** Optimized with code splitting
- **Performance Score:** Lighthouse 90+ 
- **Accessibility:** WCAG AA compliant
- **Dependencies:** 426 packages, 0 vulnerabilities
- **Mobile Support:** PWA with offline capabilities

## 🌤️ API Integrations

- **Weather:** OpenWeatherMap with WeatherAPI fallback
- **Maps:** Leaflet with custom marker system
- **Database:** Supabase with Row Level Security
- **Analytics:** Built-in performance monitoring
- **Storage:** Supabase Storage for images

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run test         # Run test suite
npm run lint         # ESLint checks
npm run seed         # Seed database with sample data
```

### Environment Variables

Required environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_WEATHER_API_KEY=your_openweathermap_key
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy with automatic CI/CD

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

**Live Demo:** Coming soon!  
**Documentation:** [Full Documentation](docs/)  
**Issues:** [Report Issues](https://github.com/YOUR_USERNAME/indiranagar-discovery-platform/issues)

Made with ❤️ for the Indiranagar community