# Google Places API Setup Instructions

## 🚨 IMMEDIATE ACTION REQUIRED

To enable Google Places event fetching, you need to configure the API key properly.

## Step 1: Google Cloud Console Setup

### Option A: Modify Existing Key (Quick Fix)
1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your API key ending in: `...Jgl0qGbc`
3. Click on the key to edit
4. Under **"Application restrictions"**:
   - Change from "HTTP referrers" to **"None"**
5. Click **"SAVE"**
6. Wait 5 minutes for changes to propagate

### Option B: Create New Server Key (Recommended for Production)
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click **"+ CREATE CREDENTIALS"** → **"API key"**
3. Name it: **"Indiranagar Events Server Key"**
4. Configuration:
   - **Application restrictions**: Select **"None"** 
   - **API restrictions**: Select **"Restrict key"** and choose:
     - ✅ Places API (New)
     - ✅ Places API
     - ✅ Geocoding API
     - ✅ Maps JavaScript API
5. Click **"CREATE"**
6. Copy the new API key

## Step 2: Add to Vercel Environment Variables

1. Go to: https://vercel.com/dashboard
2. Select your project: **simple-todo** or **amit-loves-indiranagar**
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   ```
   Name: GOOGLE_PLACES_SERVER_API_KEY
   Value: [Your new API key without restrictions]
   Environment: ✅ Production ✅ Preview ✅ Development
   ```
5. Click **"Save"**

## Step 3: Redeploy

After adding the environment variable:
1. Go to **Deployments** tab in Vercel
2. Click the **"..."** menu on the latest deployment
3. Select **"Redeploy"**
4. Click **"Redeploy"** in the dialog

## Step 4: Test the API

Once deployed, test the Google Places fetch:

```bash
# Test fetching from Google Places
curl -X POST "https://amit-loves-indiranagar.vercel.app/api/events/fetch-google-places?force=true"
```

Expected response:
```json
{
  "success": true,
  "message": "Discovered X events from Google Places",
  "stats": {
    "discovered": X,
    "saved": X,
    "errors": 0
  }
}
```

## Troubleshooting

### Error: "API keys with referer restrictions cannot be used"
- **Cause**: Your API key has HTTP referer restrictions
- **Solution**: Follow Step 1 above to remove restrictions

### Error: "Invalid API key"
- **Cause**: API key is incorrect or disabled
- **Solution**: Verify key in Google Cloud Console

### Error: "Quota exceeded"
- **Cause**: Hit daily API limit
- **Solution**: Wait 24 hours or increase quota in Google Cloud Console

### No events discovered (0 events)
- **Cause**: API key might not have proper permissions
- **Solution**: Ensure Places API (New) and Places API are enabled

## Current API Keys

- **Public Key (with restrictions)**: `AIzaSyBMfM9WL9zZfpGEeA4vCgUvx47Jgl0qGbc`
  - Status: ❌ Has referer restrictions - won't work server-side
  
- **Server Key (no restrictions)**: `[You need to create this]`
  - Status: ⏳ Waiting for you to create in Google Cloud Console

## Quick Test Commands

```bash
# 1. Test if API key works (run locally)
node -e "
fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=12.9716,77.6411&radius=2000&type=restaurant&key=YOUR_API_KEY')
  .then(r => r.json())
  .then(d => console.log('Status:', d.status, 'Results:', d.results?.length || 0))
"

# 2. Test production endpoint
curl "https://amit-loves-indiranagar.vercel.app/api/events/fetch-google-places?force=true"

# 3. Fallback if Google Places doesn't work
curl -X POST "https://amit-loves-indiranagar.vercel.app/api/events/populate-real?clear=true"
```

## Next Steps

1. ✅ Create unrestricted server API key in Google Cloud Console
2. ✅ Add `GOOGLE_PLACES_SERVER_API_KEY` to Vercel
3. ✅ Redeploy the application
4. ✅ Test the fetch-google-places endpoint
5. ✅ Events will auto-fetch daily at 6 AM

---

**Need Help?**
- Google Cloud Console: https://console.cloud.google.com
- Vercel Dashboard: https://vercel.com/dashboard
- API Documentation: https://developers.google.com/maps/documentation/places/web-service

Last Updated: August 2025