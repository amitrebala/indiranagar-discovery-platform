# Technical Assumptions

## Repository Structure: Monorepo

Single repository containing the complete Next.js application with clear separation between content (markdown/JSON for places and journeys), React components, and page structures. This approach simplifies deployment to Vercel and enables atomic commits for content and code changes, supporting the single-person maintenance model while providing clear organization for future collaboration.

## Service Architecture

**Static Site Generation with Dynamic Features:** Hybrid approach using Next.js static generation for core content (place database, journey experiences, blog posts) with dynamic features for user interactions (suggestions, contact forms, weather integration). This architecture maximizes performance on free hosting while supporting interactive features through Supabase backend services and external APIs.

**Key Components:**
- **Frontend:** Next.js 13+ with App Router for optimal performance and SEO
- **Database:** Supabase PostgreSQL for user submissions, business relationships, and dynamic content
- **File Storage:** Supabase Storage for images with CDN optimization
- **External APIs:** Weather API for contextual recommendations, mapping services through Leaflet + OpenStreetMap
- **Hosting:** Vercel for automatic deployments with preview environments

## Testing Requirements

**Unit + Integration Testing Strategy:** Focus on critical user flows and data integrity with Jest for component testing and Cypress for end-to-end journey testing. Priority on testing form submissions, map interactions, and weather integration functionality. Manual testing convenience methods for content management workflows to support efficient single-person operations.

**Testing Priorities:**
1. **User Submission Workflows** - Automated testing for suggestion forms and contact features
2. **Content Management** - Manual testing convenience for adding/updating places and journeys  
3. **Map Functionality** - Integration testing for marker placement and journey route display
4. **Weather Integration** - API integration testing with fallback scenarios
5. **Mobile Responsiveness** - Cross-device testing for touch interactions and performance

## Additional Technical Assumptions and Requests

**Performance Optimization:**
- **Image Optimization:** Next.js Image component with automatic WebP conversion and responsive sizing
- **Progressive Loading:** Skeleton screens and lazy loading for images and map components
- **CDN Strategy:** Leveraging Vercel Edge Network for global content delivery
- **Bundle Optimization:** Code splitting and tree shaking to minimize initial load times

**Content Management:**
- **Markdown-based Content:** Place descriptions and journey narratives stored as markdown for easy editing
- **JSON Structured Data:** Place metadata, business relationships, and companion activities in JSON format
- **Version Control Integration:** Git-based content workflow enabling rollback and change tracking
- **Image Pipeline:** Automated image compression and optimization during build process

**Security and Privacy:**
- **Form Protection:** Basic rate limiting and CAPTCHA integration for user submissions
- **Data Privacy:** Minimal data collection with clear privacy policy for contact features
- **Content Moderation:** Manual moderation workflow for user suggestions with notification system
- **Backup Strategy:** Automated database backups through Supabase with content versioning via Git

**Scalability Considerations:**
- **Free Tier Management:** Monitoring usage metrics to stay within Vercel, Supabase, and API limits
- **Caching Strategy:** Static page generation with ISR (Incremental Static Regeneration) for dynamic content
- **Database Design:** Optimized queries and indexing for expected user growth to 1000+ users
- **Migration Path:** Architecture designed to support future scaling to paid tiers without major refactoring

**Development Workflow:**
- **Local Development:** Next.js dev server with Supabase local environment for offline development
- **Deployment Pipeline:** Automatic deployment from main branch with preview deployments for feature branches
- **Content Updates:** Streamlined workflow for adding places and journeys without full deployment cycle
- **Monitoring:** Basic analytics through Vercel Analytics and error tracking for production issues
