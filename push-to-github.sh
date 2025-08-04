#!/bin/bash

# GitHub Repository Push Script
echo "🚀 Pushing Indiranagar Discovery Platform to GitHub..."

# Get the GitHub username
echo "Enter your GitHub username:"
read GITHUB_USERNAME

# Add GitHub remote
echo "📡 Adding GitHub remote..."
git remote add origin https://github.com/$GITHUB_USERNAME/indiranagar-discovery-platform.git

# Push to GitHub
echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main

echo "✅ Successfully pushed to GitHub!"
echo "🌐 Repository URL: https://github.com/$GITHUB_USERNAME/indiranagar-discovery-platform"
echo ""
echo "🎉 Your Indiranagar Discovery Platform is now on GitHub!"
echo "📖 Check the README.md for deployment instructions"