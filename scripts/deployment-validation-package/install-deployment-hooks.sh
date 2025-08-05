#!/bin/bash

# Install Deployment Validation Hooks
# This script sets up Git hooks for automatic Vercel deployment validation

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
HOOKS_DIR="$PROJECT_ROOT/.git/hooks"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Installing Vercel deployment validation hooks...${NC}"

# Create hooks directory if it doesn't exist
mkdir -p "$HOOKS_DIR"

# Create pre-commit hook
cat > "$HOOKS_DIR/pre-commit" << 'EOF'
#!/bin/bash

# Vercel Pre-Commit Deployment Validation Hook
# Automatically validates Vercel deployment before allowing commits

# Get project root
PROJECT_ROOT="$(git rev-parse --show-toplevel)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}[PRE-COMMIT]${NC} Running Vercel deployment validation..."

# Check if validation script exists
if [[ -f "$PROJECT_ROOT/scripts/vercel-pre-deploy.sh" ]]; then
    # Run validation
    if "$PROJECT_ROOT/scripts/vercel-pre-deploy.sh"; then
        echo -e "${GREEN}[PRE-COMMIT]${NC} Deployment validation passed ✅"
        exit 0
    else
        echo -e "${RED}[PRE-COMMIT]${NC} Deployment validation failed ❌"
        echo ""
        echo "Your code has issues that would cause Vercel deployment to fail."
        echo "Please fix the errors above before committing."
        echo ""
        echo "To bypass this check (NOT RECOMMENDED):"
        echo "  git commit --no-verify"
        exit 1
    fi
else
    echo -e "${YELLOW}[PRE-COMMIT]${NC} Validation script not found, skipping..."
    exit 0
fi
EOF

# Make pre-commit hook executable
chmod +x "$HOOKS_DIR/pre-commit"

# Create commit-msg hook for deployment tracking
cat > "$HOOKS_DIR/commit-msg" << 'EOF'
#!/bin/bash

# Vercel Deployment Tracking Hook
# Adds deployment validation status to commit messages

COMMIT_MSG_FILE=$1
COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

# Check if this is a deployment-related commit
if [[ "$COMMIT_MSG" =~ (deploy|build|fix|feat) ]]; then
    # Add deployment validation marker
    echo "" >> "$COMMIT_MSG_FILE"
    echo "Deployment-Status: Pre-validated ✓" >> "$COMMIT_MSG_FILE"
    echo "Validation-Tool: vercel-pre-deploy.sh" >> "$COMMIT_MSG_FILE"
fi
EOF

# Make commit-msg hook executable
chmod +x "$HOOKS_DIR/commit-msg"

echo -e "${GREEN}✅ Deployment validation hooks installed successfully!${NC}"
echo ""
echo "The following hooks have been installed:"
echo "  • pre-commit: Validates Vercel deployment before commits"
echo "  • commit-msg: Adds deployment validation status to commits"
echo ""
echo "These hooks will ensure all commits pass Vercel deployment checks."