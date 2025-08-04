# Enhanced Experience Intelligence Platform - Deployment Guide

## Overview

This guide covers deploying the Enhanced Experience Intelligence Platform to production with all three implemented epics (2.1, 2.4, 4.1):

- **Epic 2.1**: Enhanced Map with Custom Photography Markers and Journey Routes
- **Epic 2.4**: Enhanced Search and Discovery with Natural Language Processing  
- **Epic 4.1**: Weather-Aware Recommendations and Contextual Discovery

## Pre-Deployment Checklist

### ✅ Development Phase Complete
- [x] All acceptance criteria met for Epics 2.1, 2.4, 4.1
- [x] QA testing completed with PASSED status
- [x] Story documentation updated with implementation details
- [x] Build successful with warnings documented
- [x] Core functionality verified

### ✅ Deployment Preparation Ready
- [x] Production environment configuration created
- [x] Docker containerization setup
- [x] Health check endpoint implemented
- [x] Deployment scripts created
- [x] Security headers configured

## Quick Deployment Options

### Option 1: Docker Container (Recommended)
```bash
# Build and run with Docker
./scripts/deploy.sh production docker

# Or manually:
cd apps/web
docker build -t place-discovery-platform .
docker-compose up -d
```

### Option 2: Platform Deployment (Vercel/Netlify)
```bash
# Deploy to Vercel
./scripts/deploy.sh production vercel

# Deploy to Netlify
./scripts/deploy.sh production netlify
```

### Option 3: Standard Build
```bash
# Create production build
./scripts/deploy.sh production

# Then deploy dist to your hosting platform
```

## Environment Configuration

### Required Environment Variables

Create `.env.production` with:

```bash
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Database & Storage (Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# Weather API (OpenWeatherMap)
NEXT_PUBLIC_WEATHER_API_KEY=your_production_weather_api_key

# Maps (Mapbox - Optional)
NEXT_PUBLIC_MAPBOX_TOKEN=your_production_mapbox_token

# Feature Flags
NEXT_PUBLIC_ENABLE_WEATHER_RECOMMENDATIONS=true
NEXT_PUBLIC_ENABLE_NATURAL_LANGUAGE_SEARCH=true
NEXT_PUBLIC_ENABLE_PHOTO_MARKERS=true
NEXT_PUBLIC_ENABLE_JOURNEY_ROUTES=true
```

### Supabase Setup

1. **Create Production Database**
   ```sql
   -- Run the schema from apps/web/supabase/schema.sql
   -- Ensure all tables for places, journeys, weather cache exist
   ```

2. **Configure Storage Bucket**
   ```bash
   # Create public bucket for place images
   # Set appropriate RLS policies
   ```

3. **Set up Authentication**
   ```bash
   # Configure auth providers if needed
   # Set JWT settings
   ```

## Deployment Process

### Step 1: Pre-Deployment Testing
```bash
# Run full test suite (will have known warnings)
cd apps/web
npm run test:run

# Build verification
npm run build

# Lint check (warnings acceptable)
npm run lint
```

### Step 2: Deploy Application
```bash
# Use deployment script
./scripts/deploy.sh production docker

# Or deploy to specific platform
./scripts/deploy.sh production vercel
```

### Step 3: Post-Deployment Verification
```bash
# Health check
curl -f https://your-domain.com/api/health

# Expected response:
{
  \"status\": \"healthy\",
  \"features\": {
    \"weather_recommendations\": true,
    \"natural_language_search\": true,
    \"photo_markers\": true,
    \"journey_routes\": true
  }
}
```

## Feature Verification

### Epic 2.1: Enhanced Map Features
- [ ] Photo markers display correctly
- [ ] Journey routes render with dotted lines
- [ ] Hover/touch interactions work
- [ ] Mobile touch targets are 44px+
- [ ] Category-based styling appears

### Epic 2.4: Enhanced Search
- [ ] Natural language queries work (\"quiet morning coffee\")
- [ ] Advanced filters function
- [ ] Geolocation \"Near me\" works
- [ ] Search results ranked by relevance
- [ ] Recently viewed and favorites work

### Epic 4.1: Weather-Aware Features  
- [ ] Weather recommendations update with conditions
- [ ] Seasonal highlights show appropriate places
- [ ] Weather alerts appear for condition changes
- [ ] Indoor/outdoor categorization works

## Performance Optimization

### Initial Settings
- Image optimization enabled (WebP/AVIF)
- Compression enabled
- Static asset caching (31536000s)
- API response caching (300s)

### Monitoring
- Health endpoint: `/api/health`
- Monitor response times
- Track weather API usage
- Watch image loading performance

## Security Configuration

### Headers Applied
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(self)
```

### Environment Security
- All secrets in environment variables
- No hardcoded API keys
- Supabase RLS policies active
- HTTPS enforced

## Troubleshooting

### Common Issues

**Build Warnings**
- TypeScript `any` type warnings: Documented, not blocking
- ESLint unescaped quotes: Cosmetic, functional
- Missing imports: Resolved in production

**Runtime Issues**
- Weather API failures: Graceful degradation implemented
- Image loading: Fallback to default markers
- Geolocation denied: Manual location input available

**Performance Issues**
- Large photo markers: Lazy loading implemented
- Search debouncing: 300ms delay configured
- Route rendering: Optimized polylines

### Debug Commands
```bash
# Check container logs
docker logs place-discovery-platform

# Test health endpoint
curl -v http://localhost:3000/api/health

# Check environment variables
docker exec place-discovery-platform env | grep NEXT_PUBLIC
```

## Rollback Procedure

```bash
# Stop current deployment
docker-compose down

# Revert to previous image
docker run -d --name place-discovery-rollback previous-image:tag

# Or rebuild from previous commit
git checkout previous-stable-commit
./scripts/deploy.sh production docker
```

## Next Steps After Deployment

1. **User Acceptance Testing**
   - Test with real users
   - Gather feedback on new features
   - Monitor usage patterns

2. **Performance Tuning**
   - Analyze real-world performance data
   - Optimize based on user behavior
   - Scale infrastructure as needed

3. **Analytics & Monitoring**
   - Set up performance monitoring
   - Track feature usage
   - Monitor error rates

4. **Documentation & Training**
   - Create user guides
   - Document API endpoints
   - Train content moderators

## Support & Maintenance

### Regular Tasks
- Monitor health endpoints
- Update weather API keys as needed
- Backup user data and place information
- Update dependencies monthly

### Emergency Contacts
- Database issues: Supabase dashboard
- API limits: Weather service provider
- CDN issues: Hosting platform support

---

## Deployment Checklist Summary

- [ ] Environment variables configured
- [ ] Database schema deployed
- [ ] Storage buckets created
- [ ] Application built successfully
- [ ] Health checks passing
- [ ] Core features verified
- [ ] Performance baselines established
- [ ] Monitoring configured
- [ ] Rollback procedure tested

**Deployment Status**: ✅ Ready for Production

All three epics (2.1, 2.4, 4.1) have been successfully implemented and are ready for production deployment. The platform includes enhanced map features, natural language search, and weather-aware recommendations with comprehensive QA validation completed.