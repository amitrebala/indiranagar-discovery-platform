#!/bin/bash

# Security cleanup script - Remove any accidentally committed secrets

echo "🔍 Scanning for potential secrets..."

# Check for Google API keys
if git grep -n "AIzaSy" >/dev/null 2>&1; then
    echo "❌ Found Google API keys in repository!"
    git grep -n "AIzaSy"
    exit 1
else
    echo "✅ No Google API keys found"
fi

# Check for other common secrets
PATTERNS=(
    "AIzaSy"                    # Google API keys
    "sk_live_"                  # Stripe live keys
    "sk_test_"                  # Stripe test keys
    "rk_live_"                  # Stripe restricted keys
    "AKIA[0-9A-Z]{16}"         # AWS access keys
    "ya29\.[0-9A-Za-z\-_]+"   # Google OAuth tokens
)

for pattern in "${PATTERNS[@]}"; do
    if git grep -E "$pattern" >/dev/null 2>&1; then
        echo "❌ Found potential secret: $pattern"
        git grep -E "$pattern"
        exit 1
    fi
done

echo "✅ Repository clean - no secrets detected"