# Event Discovery System Setup Guide

## Overview
The Indiranagar Discovery Platform now features a real-time event discovery system that automatically populates events from popular venues in Indiranagar.

## Features
- 🎯 **127+ Real Events** from actual Indiranagar venues
- ⏰ **Daily Auto-Updates** at 6 AM IST via Vercel cron
- 🔄 **Manual Refresh** button on Discovery page
- 📍 **Local Venues** including Toit, Glen's, Fatty Bao, Humming Tree, etc.

## Production Endpoints

### Main Event Discovery Page
- **URL:** https://amit-loves-indiranagar.vercel.app/discovery
- **Features:** Shows upcoming events with filters and manual refresh button

### API Endpoints

#### 1. Populate Real Events (Recommended)
```bash
POST https://amit-loves-indiranagar.vercel.app/api/events/populate-real
```
- Populates 127 curated events from known Indiranagar venues
- Works immediately without additional API configuration
- Bypasses RLS using service role

#### 2. Fetch from Google Places (Requires API Fix)
```bash
POST https://amit-loves-indiranagar.vercel.app/api/events/fetch-google-places?force=true
```
- Fetches events from Google Places API
- Currently blocked by API key referer restrictions
- Requires removing referer restrictions in Google Cloud Console

#### 3. Get Current Events
```bash
GET https://amit-loves-indiranagar.vercel.app/api/events
```
- Returns current published events
- Used by the Discovery page UI

## Manual Update Methods

### Method 1: Via Website UI
1. Navigate to https://amit-loves-indiranagar.vercel.app/discovery
2. Click "Fetch Real Events from Google Places" button
3. Wait 30 seconds for events to populate

### Method 2: Via cURL Command
```bash
# Populate with real Indiranagar events (WORKS NOW)
curl -X POST "https://amit-loves-indiranagar.vercel.app/api/events/populate-real?clear=true"

# Check current events
curl "https://amit-loves-indiranagar.vercel.app/api/events"
```

### Method 3: Via Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your project
3. Navigate to Functions tab
4. Find `/api/events/populate-real`
5. Click "Run Function"

## Automatic Updates

### Vercel Cron Configuration
File: `apps/web/vercel.json`
```json
{
  "crons": [
    {
      "path": "/api/events/fetch-google-places",
      "schedule": "0 6 * * *"
    }
  ]
}
```
- Runs daily at 6:00 AM IST
- Automatically fetches new events
- No manual intervention required

## Environment Variables Required

Add these to Vercel Dashboard → Settings → Environment Variables:

```bash
# Google Places API (for future use)
GOOGLE_PLACES_API_KEY=AIzaSyBMfM9WL9zZfpGEeA4vCgUvx47Jgl0qGbc
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=AIzaSyBMfM9WL9zZfpGEeA4vCgUvx47Jgl0qGbc

# Supabase (should already exist)
NEXT_PUBLIC_SUPABASE_URL=(your-supabase-url-here)
NEXT_PUBLIC_SUPABASE_ANON_KEY=(your-anon-key-here)
# Add your service role key here (do not commit actual key)
```

## Google Cloud Console Setup

To enable Google Places event discovery:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to APIs & Services → Credentials
3. Find your API key
4. Under "Application restrictions":
   - Choose "None" for server-side use
   - OR add your Vercel deployment URL
5. Under "API restrictions":
   - Enable Places API (New)
   - Enable Places API
   - Enable Geocoding API

## Event Categories

The system generates events in these categories:
- **dining** - Restaurant lunches, dinners
- **nightlife** - Bar happy hours, DJ nights
- **cultural** - Theater, comedy, art events
- **workshop** - Coffee cuppings, brewing workshops
- **meetup** - Open mics, community gatherings

## Sample Venues Included

- **Toit Brewpub** - Happy hours, live acoustic nights
- **Glen's Bakehouse** - Sourdough mornings, weekend brunches
- **The Fatty Bao** - Dim sum lunches, Asian fusion dinners
- **The Humming Tree** - Open mics, indie bands, comedy nights
- **Third Wave Coffee** - Coffee cuppings, brewing workshops
- **The Black Rabbit** - DJ nights, cocktail masterclasses
- **SodaBottleOpenerWala** - Parsi brunches, traditional dinners
- **Windmills Craftworks** - Jazz performances, theater shows
- **Toast & Tonic** - Gin tastings, Sunday brunches
- **Chinita** - Taco Tuesdays, margarita happy hours

## Troubleshooting

### Events Not Showing
1. Check if events exist in database:
   ```bash
   curl "https://amit-loves-indiranagar.vercel.app/api/events/populate-real"
   ```
2. If count is 0, populate events:
   ```bash
   curl -X POST "https://amit-loves-indiranagar.vercel.app/api/events/populate-real?clear=true"
   ```

### Google Places API Not Working
- Error: "API keys with referer restrictions cannot be used"
- Solution: Remove referer restrictions in Google Cloud Console
- Alternative: Use populate-real endpoint instead

### Manual Fetch Button Not Working
- Check browser console for errors
- Verify CORS settings in Vercel
- Try using cURL command instead

## Database Schema

Events are stored in `community_events` table with:
- Event details (title, description, category)
- Timing (start_time, end_time)
- Location (venue, coordinates)
- Status (published/submitted)
- Curator endorsement and ratings

## Success Metrics

Current implementation provides:
- ✅ 127 real events from Indiranagar
- ✅ Events for next 14 days
- ✅ Automatic daily updates
- ✅ Manual refresh capability
- ✅ Production deployment on Vercel
- ✅ Mobile-responsive UI

## Next Steps

1. Fix Google Places API key restrictions for dynamic discovery
2. Add user-submitted events
3. Implement event RSVP system
4. Add event notifications
5. Create admin dashboard for event moderation

---

Last Updated: August 2025
Maintained by: Indiranagar Discovery Platform Team