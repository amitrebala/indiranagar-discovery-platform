#!/bin/bash

# Script to help add GitHub secrets

echo "🔐 GitHub Secrets Setup for BMAD Vercel Auto-Fix"
echo "================================================"
echo ""
echo "Since GitHub CLI is not installed, please add secrets manually:"
echo ""
echo "1. Open this URL in your browser:"
echo "   https://github.com/amitrebala/indiranagar-discovery-platform/settings/secrets/actions"
echo ""
echo "2. Click 'New repository secret' and add each of these:"
echo ""
echo "   SECRET #1:"
echo "   ----------"
echo "   Name:  VERCEL_TOKEN"
echo "   Value: PT2mjz7bPUU3Iot8DP82VJe7"
echo ""
echo "   SECRET #2:"
echo "   ----------"
echo "   Name:  VERCEL_PROJECT_ID"
echo "   Value: prj_z5RaKzjE2JWdKwWTmwigPfAjpw86"
echo ""
echo "   SECRET #3 (Optional):"
echo "   --------------------"
echo "   Name:  VERCEL_TEAM_ID"
echo "   Value: (leave empty)"
echo ""
echo "3. After adding all secrets, the workflow will run automatically!"
echo ""
echo "📋 Quick Copy Commands:"
echo "----------------------"
echo "VERCEL_TOKEN"
echo "PT2mjz7bPUU3Iot8DP82VJe7"
echo ""
echo "VERCEL_PROJECT_ID"
echo "prj_z5RaKzjE2JWdKwWTmwigPfAjpw86"
echo ""
echo "Press Enter to open the GitHub secrets page in your browser..."
read -p ""

# Try to open in browser
if command -v open &> /dev/null; then
    open "https://github.com/amitrebala/indiranagar-discovery-platform/settings/secrets/actions"
elif command -v xdg-open &> /dev/null; then
    xdg-open "https://github.com/amitrebala/indiranagar-discovery-platform/settings/secrets/actions"
else
    echo "Please open this URL manually:"
    echo "https://github.com/amitrebala/indiranagar-discovery-platform/settings/secrets/actions"
fi