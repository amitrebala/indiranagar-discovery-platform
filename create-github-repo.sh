#!/bin/bash

echo "🚀 Creating GitHub repository and pushing code..."

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "Please install it first:"
    echo "  brew install gh"
    echo "  or visit: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "🔐 Please authenticate with GitHub first:"
    gh auth login
fi

# Create the repository
echo "📦 Creating GitHub repository..."
gh repo create indiranagar-discovery-platform \
    --public \
    --description "Comprehensive neighborhood discovery platform with interactive mapping, community features, and weather-aware recommendations. Built with Next.js 15, TypeScript, and Supabase."

# Push the code
echo "📤 Pushing code to GitHub..."
git push -u origin main

echo "✅ Success! Repository created and code pushed."
echo "🌐 View at: https://github.com/$(gh api user --jq '.login')/indiranagar-discovery-platform"