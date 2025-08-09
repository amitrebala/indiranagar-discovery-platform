#!/bin/bash

# Vercel Environment Variables Setup Script
# This script helps set up the correct Google Places API keys in Vercel

echo "🔧 Setting up Vercel environment variables..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Please install it first:"
    echo "   npm i -g vercel"
    exit 1
fi

# Set the environment variables
echo "📝 Setting Google Places API keys..."

# Server-side API key (unrestricted)
echo "AIzaSyDwKZQ-GYC-8JFB-0443dWjUEeLsjwqdU8" | vercel env add GOOGLE_PLACES_API_KEY production
echo "AIzaSyDwKZQ-GYC-8JFB-0443dWjUEeLsjwqdU8" | vercel env add GOOGLE_PLACES_API_KEY preview  
echo "AIzaSyDwKZQ-GYC-8JFB-0443dWjUEeLsjwqdU8" | vercel env add GOOGLE_PLACES_API_KEY development

# Client-side API key (domain-restricted)
echo "AIzaSyCrG7u9DCytwhRdNtiHxQADGaTrBVNFEsI" | vercel env add NEXT_PUBLIC_GOOGLE_PLACES_API_KEY production
echo "AIzaSyCrG7u9DCytwhRdNtiHxQADGaTrBVNFEsI" | vercel env add NEXT_PUBLIC_GOOGLE_PLACES_API_KEY preview
echo "AIzaSyCrG7u9DCytwhRdNtiHxQADGaTrBVNFEsI" | vercel env add NEXT_PUBLIC_GOOGLE_PLACES_API_KEY development

echo "✅ Environment variables set successfully!"
echo ""
echo "🚀 Now trigger a new deployment:"
echo "   vercel --prod"
echo ""
echo "🧪 Test the configuration after deployment:"
echo "   curl https://your-domain.vercel.app/api/debug/google-api"
echo ""
echo "📊 Check the places page:"
echo "   https://amit-loves-indiranagar.vercel.app/places"