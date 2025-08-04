# Tech Stack

This is the **DEFINITIVE technology selection** for the entire project. This table serves as the single source of truth - all development must use these exact versions.

## Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| Frontend Language | TypeScript | 5.0+ | Type-safe development across frontend and backend | Essential for weather-aware components and shared data models |
| Frontend Framework | Next.js | 14+ | App Router with SSG/SSR hybrid approach | Optimal for photography-rich content with dynamic features |
| UI Component Library | Tailwind CSS + Headless UI | 3.0+ / 1.7+ | Utility-first styling with accessible components | Matches UX specification design system approach |
| State Management | Zustand | 4.4+ | Lightweight state for weather context and user preferences | Simpler than Redux for weather-aware UI state |
| Backend Language | TypeScript | 5.0+ | Shared types between frontend and API routes | Type safety for place data and weather integration |
| Backend Framework | Next.js API Routes | 14+ | Serverless functions on Vercel | Seamless integration with frontend, optimal for free hosting |
| API Style | REST + tRPC | tRPC 10+ | Type-safe API calls with REST fallbacks | tRPC for internal APIs, REST for weather service integration |
| Database | Supabase PostgreSQL | 15+ | Relational database with real-time capabilities | Complex place relationships and real-time community features |
| Cache | Supabase Edge Cache + SWR | Built-in / 2.2+ | Database-level and client-side caching | Essential for weather data and place information performance |
| File Storage | Supabase Storage | Built-in | Photography storage with CDN optimization | Custom map markers and place image galleries |
| Authentication | Supabase Auth | Built-in | Email/social authentication with RLS | Community features with secure user management |
| Frontend Testing | Vitest + Testing Library | 1.0+ / 14+ | Fast unit and component testing | Modern Jest alternative with better ESM support |
| Backend Testing | Vitest | 1.0+ | API route and utility testing | Consistent testing across frontend and backend |
| E2E Testing | Playwright | 1.40+ | End-to-end journey testing | Critical for weather-aware user flows and mobile discovery |
| Build Tool | Next.js | 14+ | Integrated build system with optimizations | Built-in TypeScript, image optimization, and API routes |
| Bundler | Turbopack | Built-in | Fast development builds | Next.js 14+ default for improved dev experience |
| IaC Tool | N/A | - | Manual Vercel/Supabase configuration | Infrastructure as code not needed for managed services |
| CI/CD | Vercel | Built-in | Automatic deployments from Git | Seamless integration with Next.js and GitHub |
| Monitoring | Vercel Analytics + Sentry | Built-in / 7+ | Performance monitoring and error tracking | Essential for mobile discovery performance insights |
| Logging | Vercel Functions Logs | Built-in | Serverless function logging | Adequate for API route debugging and monitoring |
| CSS Framework | Tailwind CSS | 3.0+ | Utility-first responsive design | Matches UX specification component library approach |
