# Feature Flags Configuration
# Edit this file: Change "YES" to "NO" for features you want to remove

## Homepage Progressive Features (Currently Experimental)
These control experimental homepage components that are being progressively rolled out.

### NEXT_PUBLIC_FEATURE_DYNAMIC_HERO = YES
**What it does:** Enables a dynamic, animated hero section on the homepage that changes based on time of day and weather conditions. Includes parallax effects and smooth transitions.
**Currently:** Disabled in production
**Impact if removed:** Homepage will use static hero section

### NEXT_PUBLIC_FEATURE_JOURNEY_SELECTOR = YES
**What it does:** Shows an interactive journey selector component that lets users choose pre-configured discovery routes through Indiranagar (foodie tour, photo walk, nightlife adventure, etc.)
**Currently:** Disabled in production
**Impact if removed:** Users must manually browse places without guided journeys

### NEXT_PUBLIC_FEATURE_AMIT_DASHBOARD = YES
**What it does:** Displays a personalized dashboard showing user's favorite places, recent activities, and tailored recommendations based on their exploration history
**Currently:** Disabled in production
**Impact if removed:** No personalized dashboard, generic content for all users

### NEXT_PUBLIC_FEATURE_LIVE_ACTIVITY = YES
**What it does:** Shows real-time activity feed of what's happening in Indiranagar - live events, trending places, community updates, and social coordination
**Currently:** Disabled in production
**Impact if removed:** No live activity updates, static content only

## Optional Application Features
These are features that can be independently enabled or disabled without breaking core functionality.

### NEXT_PUBLIC_ENABLE_SOCIAL_COMMUNITY = YES
**What it does:** Community features including user suggestions for new places, community events, voting on places, comments, and social engagement
**Currently:** Enabled
**Impact if removed:** No user-generated content or community interaction. App becomes read-only for place discovery.

### NEXT_PUBLIC_ENABLE_WEATHER_RECOMMENDATIONS = YES
**What it does:** Weather-aware recommendations that suggest indoor/outdoor activities based on current conditions, rain alerts, and temperature-based suggestions
**Currently:** Enabled
**Impact if removed:** No weather integration or smart recommendations based on conditions

### NEXT_PUBLIC_ENABLE_NATURAL_LANGUAGE_SEARCH = YES
**What it does:** Advanced search that understands queries like "cozy cafes with wifi near 100 feet road" or "romantic dinner spots open late"
**Currently:** Enabled
**Impact if removed:** Falls back to basic keyword/filter search

### NEXT_PUBLIC_ENABLE_PHOTO_MARKERS = YES
**What it does:** Shows photography hotspot markers on the map with optimal lighting times, best angles, and sample shots from each location
**Currently:** Enabled
**Impact if removed:** Map shows standard place markers only, no photography guidance

### NEXT_PUBLIC_ENABLE_JOURNEY_ROUTES = YES
**What it does:** Visualizes complete journey routes on the map with walking paths, estimated times, and stop-by-stop navigation
**Currently:** Enabled
**Impact if removed:** No route visualization, only individual place markers

### NEXT_PUBLIC_ENABLE_ACCESSIBILITY_FEATURES = YES
**What it does:** Enhanced WCAG AA compliance features including screen reader announcements, focus management, high contrast mode toggle, and reduced motion options
**Currently:** Enabled
**Impact if removed:** Basic accessibility only (native HTML), no enhanced features

### NEXT_PUBLIC_ENABLE_PWA_FEATURES = YES
**What it does:** Progressive Web App capabilities including offline mode, installability, home screen icon, and intelligent caching strategies
**Currently:** Enabled
**Impact if removed:** No offline support, no installability, standard web app only

## Image Processing Features
Controls how the application handles images from various sources.

### NEXT_PUBLIC_AUTO_SAVE_IMAGES = YES
**What it does:** Automatically saves discovered images from external sources (like Unsplash) to your Supabase storage for permanent availability
**Currently:** Disabled
**Impact if removed:** Images remain linked to external sources only (may break if source changes)

### NEXT_PUBLIC_DEBUG_IMAGE_SEARCH = YES
**What it does:** Enables verbose console logging for image search operations showing API calls, response times, and selection logic
**Currently:** Disabled in production
**Impact if removed:** No debug information for image search troubleshooting

## Performance Experiments
Next.js experimental features that can be toggled for performance testing.

### EXPERIMENTAL_OPTIMIZE_CSS = YES
**What it does:** Advanced CSS optimization that removes unused styles, minifies aggressively, and improves critical CSS delivery
**Currently:** Enabled
**Impact if removed:** Slightly larger CSS bundles

### EXPERIMENTAL_OPTIMIZE_SERVER_REACT = YES
**What it does:** Server-side React optimizations including streaming, selective hydration, and improved server component performance
**Currently:** Enabled
**Impact if removed:** Standard server-side rendering performance

### EXPERIMENTAL_WEBPACK_BUILD_WORKER = YES
**What it does:** Uses worker threads for webpack builds, significantly speeding up build times on multi-core systems
**Currently:** Enabled
**Impact if removed:** Slower build times during development

## Instructions for Editing
1. Change "YES" to "NO" for any feature you want to remove
2. Save this file
3. Let me know when you're done editing
4. I'll remove all code associated with features marked "NO"

## What's NOT a Feature Flag (Core Functionality)
These were incorrectly implemented as feature flags but are actually core requirements:
- **Place Discovery System** - The main purpose of the app
- **Map Functionality** - Essential for location-based discovery
- **Database/Supabase Integration** - Required for any data
- **Image Optimization** - Built into Next.js, not optional
- **Image Proxy** - Required for external image security
- **Basic Routing & Navigation** - Core Next.js functionality

These will be refactored to be standard code, not feature flags.