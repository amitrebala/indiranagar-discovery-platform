#!/bin/bash

# Deployment Validation Package Installer
# This script installs the complete deployment validation system

set -e

# Get directories
PACKAGE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPTS_DIR="$(dirname "$PACKAGE_DIR")"
PROJECT_ROOT="$(dirname "$SCRIPTS_DIR")"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}Installing Vercel Deployment Validation Package...${NC}"
echo ""

# Step 1: Copy scripts to project scripts directory
echo "📁 Installing validation scripts..."

# Copy main scripts
cp "$PACKAGE_DIR"/*.sh "$SCRIPTS_DIR/" 2>/dev/null || true
chmod +x "$SCRIPTS_DIR"/*.sh

echo "✅ Scripts installed to $SCRIPTS_DIR/"

# Step 2: Install Git hooks
echo ""
echo "🔗 Installing Git hooks..."

if [[ -f "$SCRIPTS_DIR/install-deployment-hooks.sh" ]]; then
    "$SCRIPTS_DIR/install-deployment-hooks.sh"
else
    echo -e "${YELLOW}Warning: Git hooks installer not found${NC}"
fi

# Step 3: Check for Vercel CLI
echo ""
echo "🔍 Checking dependencies..."

if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
    npm i -g vercel
fi

# Step 4: Link Vercel project if needed
echo ""
echo "🔗 Checking Vercel project link..."

VERCEL_CONFIG=".vercel/project.json"
if [[ ! -f "$PROJECT_ROOT/$VERCEL_CONFIG" ]] && [[ ! -f "$PROJECT_ROOT/apps/web/$VERCEL_CONFIG" ]]; then
    echo "No Vercel configuration found."
    read -p "Would you like to link a Vercel project now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cd "$PROJECT_ROOT"
        vercel link
    fi
fi

# Step 5: Create quick access aliases (optional)
echo ""
read -p "Would you like to create command aliases for easier access? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    ALIAS_FILE="$PROJECT_ROOT/.deployment-aliases"
    cat > "$ALIAS_FILE" << 'EOF'
#!/bin/bash
# Deployment validation aliases

alias vdeploy='./scripts/vercel-pre-deploy.sh'
alias vsafe='./scripts/safe-commit.sh'
alias vclaude='./scripts/claude-deploy-commit.sh'

echo "Deployment aliases loaded:"
echo "  vdeploy  - Run deployment validation"
echo "  vsafe    - Safe commit with validation"
echo "  vclaude  - Claude-integrated commit"
EOF
    
    echo ""
    echo "Aliases created! To use them, run:"
    echo -e "${GREEN}source .deployment-aliases${NC}"
fi

# Step 6: Summary
echo ""
echo -e "${GREEN}✅ Deployment Validation Package Installed!${NC}"
echo ""
echo "Available commands:"
echo "  ./scripts/vercel-pre-deploy.sh      - Validate deployment"
echo "  ./scripts/safe-commit.sh            - Safe commit with validation"
echo "  ./scripts/claude-deploy-commit.sh   - Claude-integrated commit"
echo ""
echo "Quick start:"
echo -e "  ${BLUE}./scripts/safe-commit.sh \"feat: my new feature\"${NC}"
echo ""
echo "For more information, see:"
echo "  ./scripts/deployment-validation-package/README.md"