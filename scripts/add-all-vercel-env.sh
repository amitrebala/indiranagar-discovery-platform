#!/bin/bash

echo "Adding all missing environment variables to Vercel..."
echo "Make sure you're logged in to Vercel CLI (vercel login)"
echo ""

# Database
echo "Adding database variables..."
vercel env add DATABASE_URL production < /dev/null
vercel env add SUPABASE_DB_PASSWORD production < /dev/null

# App URL (you'll need to update this after deployment)
echo "Adding app URL..."
echo "IMPORTANT: Update NEXT_PUBLIC_APP_URL with your actual Vercel URL after deployment!"
vercel env add NEXT_PUBLIC_APP_URL production < /dev/null

# Feature Flags
echo "Adding feature flags..."
echo "true" | vercel env add NEXT_PUBLIC_ENABLE_SOCIAL_COMMUNITY production
echo "true" | vercel env add NEXT_PUBLIC_ENABLE_WEATHER_RECOMMENDATIONS production
echo "true" | vercel env add NEXT_PUBLIC_ENABLE_NATURAL_LANGUAGE_SEARCH production
echo "true" | vercel env add NEXT_PUBLIC_ENABLE_PHOTO_MARKERS production
echo "true" | vercel env add NEXT_PUBLIC_ENABLE_JOURNEY_ROUTES production
echo "true" | vercel env add NEXT_PUBLIC_ENABLE_ACCESSIBILITY_FEATURES production
echo "true" | vercel env add NEXT_PUBLIC_ENABLE_PWA_FEATURES production

# Image Settings
echo "Adding image optimization settings..."
echo "false" | vercel env add NEXT_PUBLIC_AUTO_SAVE_IMAGES production

# Google Places API
echo "Adding Google Places API key..."
vercel env add NEXT_PUBLIC_GOOGLE_PLACES_API_KEY production < /dev/null

echo ""
echo "✅ All environment variables added!"
echo ""
echo "NEXT STEPS:"
echo "1. Go to Vercel Dashboard and update NEXT_PUBLIC_APP_URL with your deployment URL"
echo "2. Deploy with: vercel --prod"