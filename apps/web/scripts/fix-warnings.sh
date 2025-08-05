#!/bin/bash

echo "🧹 Fixing ESLint warnings..."

# Fix unescaped entities in React components
echo "Fixing unescaped entities..."
find . -name "*.tsx" -o -name "*.jsx" | while read file; do
  # Skip node_modules and test files
  if [[ "$file" == *"node_modules"* ]] || [[ "$file" == *".test."* ]]; then
    continue
  fi
  
  # Replace common unescaped entities
  sed -i '' "s/'/\&apos;/g" "$file" 2>/dev/null
  sed -i '' 's/"/\&quot;/g' "$file" 2>/dev/null
done

# Remove unused imports
echo "Removing unused imports..."
npx eslint . --fix --rule '{
  "@typescript-eslint/no-unused-vars": ["error", {"argsIgnorePattern": "^_", "varsIgnorePattern": "^_"}]
}' 2>/dev/null

echo "✅ Automated fixes applied"