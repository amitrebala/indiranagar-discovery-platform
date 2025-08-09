# Vercel Environment Variables Setup

## Google Places API Configuration

For the Google Places integration to work properly in production, the following environment variables must be set in Vercel Dashboard:

### Required Environment Variables:

1. **Server-side API Key** (for backend API routes):
   ```
   GOOGLE_PLACES_API_KEY=[YOUR_SERVER_API_KEY]
   ```
   - **Restrictions**: None (unrestricted for server-side use)
   - **Usage**: API routes (`/api/places/nearby`, `/api/places/search`, etc.)

2. **Client-side API Key** (for frontend use):
   ```
   NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=[YOUR_CLIENT_API_KEY]
   ```
   - **Restrictions**: Domain-restricted to your Vercel domains
   - **Usage**: Client-side Google Places integration (if any)

### How to set these in Vercel:

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your project
3. Go to Settings → Environment Variables
4. Add the variables above for all environments (Production, Preview, Development)

### Testing the configuration:

After deployment, you can test the API by visiting:
```
https://your-domain.vercel.app/api/debug/google-api
```

This will show the API key status and any configuration issues.

### Expected Response when working:
```json
{
  "environment": "production",
  "hasPublicKey": true,
  "hasServerKey": true,
  "apiKeyConfigured": true,
  "apiStatus": "OK",
  "apiError": null,
  "recommendation": "API is working correctly"
}
```