#!/bin/bash

# Script to set up environment variables in Vercel
# Run this script to add all required environment variables to your Vercel project

echo "Setting up environment variables for Vercel deployment..."

# Required environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "https://kcpontmkmfsxbdmnybpb.supabase.co"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<< "REDACTED_SUPABASE_JWT.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjcG9udG1rbWZzeGJkbW55YnBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNDQyNTYsImV4cCI6MjA2OTgyMDI1Nn0.Kda2Bx9a1ZpL6LhqAkW5qJgi29cl_PNYtA_zewAxZIA"
vercel env add SUPABASE_SERVICE_ROLE_KEY production <<< "REDACTED_SUPABASE_JWT.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjcG9udG1rbWZzeGJkbW55YnBiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDI0NDI1NiwiZXhwIjoyMDY5ODIwMjU2fQ.M7fVL4PjmkngWPRw1bSYQReMaVIY51zTH8XFGgv80rc"

# Weather API
vercel env add NEXT_PUBLIC_WEATHER_API_KEY production <<< "8c0c59ffbf216b4da79a4b4977d27aba"
vercel env add OPENWEATHERMAP_API_KEY production <<< "8c0c59ffbf216b4da79a4b4977d27aba"

# App configuration
vercel env add NEXT_PUBLIC_APP_URL production <<< "https://simple-todo-amit-rebalas-projects.vercel.app"
vercel env add NEXT_PUBLIC_APP_NAME production <<< "Indiranagar Discovery Platform"

# Feature flags
vercel env add NEXT_PUBLIC_ENABLE_FOUNDATION_FEATURES production <<< "true"
vercel env add NEXT_PUBLIC_ENABLE_PLACE_DISCOVERY production <<< "true"
vercel env add NEXT_PUBLIC_ENABLE_SOCIAL_COMMUNITY production <<< "true"
vercel env add NEXT_PUBLIC_ENABLE_WEATHER_RECOMMENDATIONS production <<< "true"
vercel env add NEXT_PUBLIC_ENABLE_NATURAL_LANGUAGE_SEARCH production <<< "true"
vercel env add NEXT_PUBLIC_ENABLE_PHOTO_MARKERS production <<< "true"
vercel env add NEXT_PUBLIC_ENABLE_JOURNEY_ROUTES production <<< "true"
vercel env add NEXT_PUBLIC_ENABLE_ACCESSIBILITY_FEATURES production <<< "true"
vercel env add NEXT_PUBLIC_ENABLE_PWA_FEATURES production <<< "true"

echo "Environment variables added successfully!"
echo ""
echo "Now redeploy your project with: vercel --prod"