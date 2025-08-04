#!/bin/bash

# Script to add image API keys to GitHub Secrets
# Run this from the project root

echo "Setting up GitHub Secrets for Image Discovery APIs..."

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed"
    echo "Install it with: brew install gh"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub"
    echo "Run: gh auth login"
    exit 1
fi

# Set the secrets
echo "Adding NEXT_PUBLIC_UNSPLASH_ACCESS_KEY..."
gh secret set NEXT_PUBLIC_UNSPLASH_ACCESS_KEY

echo "Adding PEXELS_API_KEY..."
gh secret set PEXELS_API_KEY

echo "Adding PIXABAY_API_KEY..."
gh secret set PIXABAY_API_KEY

echo "✅ GitHub Secrets added successfully!"
echo ""
echo "These secrets are now available in GitHub Actions workflows."
echo "Use them in workflows like this:"
echo "  env:"
echo "    NEXT_PUBLIC_UNSPLASH_ACCESS_KEY: \${{ secrets.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY }}"