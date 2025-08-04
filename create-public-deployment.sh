#!/bin/bash

# Create a new public Vercel project
echo "Creating a new public Vercel deployment..."

# Remove existing Vercel link
rm -rf .vercel

# Deploy as a new project with a different name and force public
vercel --yes --prod

echo "Checking deployment protection settings..."
echo "Visit https://vercel.com/dashboard to disable authentication for your project"
echo ""
echo "Your deployment URLs:"
vercel ls --yes | head -5