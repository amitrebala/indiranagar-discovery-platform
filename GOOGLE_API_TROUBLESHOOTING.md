# Google Places API Troubleshooting

## Current Status: REQUEST_DENIED - API key expired

## Steps to Fix:

### 1. Check Google Cloud Console
- Go to https://console.cloud.google.com/
- Navigate to **APIs & Services** → **Credentials**
- Verify the key `AIzaSyDvJkwQo53h3dm607apLC0l75sw6ax01QI` exists and is active

### 2. Enable Required APIs
Go to **APIs & Services** → **Library** and ensure these are enabled:
- **Places API (New)**
- **Maps JavaScript API** (if using maps)
- **Geocoding API** (if needed)

### 3. Check API Restrictions
For your API key, verify:
- **Application restrictions**: Set to "HTTP referrers" with your domains
- **API restrictions**: Enable only the APIs you need

### 4. Billing Account
- Ensure your Google Cloud project has a valid billing account
- Places API requires billing to be enabled

### 5. Test Command
```bash
cd apps/web
npx tsx lib/google-places/test-api.ts
```

## Common Error Messages:
- `REQUEST_DENIED`: API key issues or billing not enabled
- `INVALID_REQUEST`: Missing required parameters
- `OVER_QUERY_LIMIT`: Rate limiting or quotas exceeded
- `ZERO_RESULTS`: No places found (not an error)

## Next Steps:
1. Double-check the key in Google Cloud Console
2. Ensure billing is enabled on your project
3. Enable the Places API (New) specifically
4. Test with a simple request first