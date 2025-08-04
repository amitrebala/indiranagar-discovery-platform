#!/bin/bash

# Quick Setup for BMAD Vercel Auto-Fix System
# Bypasses dependency installation since we're in Claude Code environment

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/.vercel-auto-fix-config"

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_header() {
    echo -e "\n${BOLD}${BLUE}=== $1 ===${NC}\n"
}

# Quick setup main function
main() {
    log_header "BMAD Vercel Auto-Fix Quick Setup"
    
    echo "🚀 Setting up BMAD-enhanced Vercel Auto-Fix system..."
    echo "📦 Dependencies: Already available (jq, curl, netcat)"
    echo "🤖 Claude Code: Running in Claude Code environment"
    echo
    
    # Check if config already exists
    if [[ -f "$CONFIG_FILE" ]]; then
        log_info "⚙️ Existing configuration found"
        source "$CONFIG_FILE"
        echo "   Project ID: $PROJECT_ID"
        echo "   Team ID: ${TEAM_ID:-'Not specified'}"
        
        read -p "Use existing configuration? (Y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Nn]$ ]]; then
            rm -f "$CONFIG_FILE"
        else
            log_success "Using existing configuration"
            show_usage_instructions
            return 0
        fi
    fi
    
    # Get Vercel configuration
    log_header "Vercel Configuration"
    
    echo "You need a Vercel API token to use this system."
    echo "📝 Get one at: https://vercel.com/account/tokens"
    echo "   1. Go to Vercel Dashboard"
    echo "   2. Settings → Tokens"
    echo "   3. Create new token with 'Full Access' or 'Read and Write'"
    echo
    read -p "Enter your Vercel API token: " -s VERCEL_TOKEN
    echo
    
    if [[ -z "$VERCEL_TOKEN" ]]; then
        log_error "❌ Vercel token is required"
        exit 1
    fi
    
    echo "You need your Vercel project ID."
    echo "📝 Find it at: https://vercel.com/dashboard"
    echo "   - Or run: vercel ls (if you have Vercel CLI)"
    echo "   - Or check your project URL: vercel.com/team/PROJECT_ID"
    echo
    read -p "Enter your Vercel project ID: " PROJECT_ID
    
    if [[ -z "$PROJECT_ID" ]]; then
        log_error "❌ Project ID is required"
        exit 1
    fi
    
    read -p "Enter your Vercel team ID (optional, press Enter to skip): " TEAM_ID
    
    # Test API access
    log_header "Testing Vercel API Access"
    
    local url="https://api.vercel.com/v6/deployments?projectId=$PROJECT_ID&limit=1"
    if [[ -n "$TEAM_ID" ]]; then
        url="$url&teamId=$TEAM_ID"
    fi
    
    log_info "🔍 Testing API access..."
    
    local response=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" "$url")
    local deployment_id=$(echo "$response" | jq -r '.deployments[0].uid // "null"' 2>/dev/null)
    
    if [[ "$deployment_id" != "null" && -n "$deployment_id" ]]; then
        log_success "✅ API access successful"
        log_info "📦 Latest deployment: $deployment_id"
    else
        log_error "❌ API access failed"
        echo "Response: $response"
        echo
        echo "Common issues:"
        echo "  - Invalid API token"
        echo "  - Incorrect project ID"
        echo "  - Insufficient token permissions"
        exit 1
    fi
    
    # Save configuration
    log_header "Saving Configuration"
    
    cat > "$CONFIG_FILE" << EOF
# BMAD Vercel Auto-Fix Configuration
VERCEL_TOKEN="$VERCEL_TOKEN"
PROJECT_ID="$PROJECT_ID"
TEAM_ID="$TEAM_ID"

# BMAD Settings
MAX_FIX_ATTEMPTS=10
BMAD_ENABLED=1
STORY_DIR=".bmad-stories"
BMAD_AGENT_MODE="developer"
EOF
    
    chmod 600 "$CONFIG_FILE"
    log_success "✅ Configuration saved to $CONFIG_FILE"
    
    # Create helper scripts
    log_header "Creating Helper Scripts"
    
    create_helper_scripts
    
    # GitHub Actions setup instructions
    log_header "GitHub Actions Setup"
    
    if [[ ! -d ".git" ]]; then
        log_warn "⚠️ Not in a git repository"
        echo "   GitHub Actions integration will be limited"
    else
        echo "📋 To complete GitHub Actions setup:"
        echo "   1. Go to your GitHub repository"
        echo "   2. Settings → Secrets and variables → Actions"
        echo "   3. Add these repository secrets:"
        echo "      - VERCEL_TOKEN: $VERCEL_TOKEN"
        echo "      - VERCEL_PROJECT_ID: $PROJECT_ID"
        if [[ -n "$TEAM_ID" ]]; then
            echo "      - VERCEL_TEAM_ID: $TEAM_ID"
        fi
        echo
        echo "   ✅ GitHub Actions workflow is already configured"
        echo "   🔄 It will run automatically every 10 minutes"
        echo "   🎯 You can also trigger it manually from Actions tab"
    fi
    
    show_usage_instructions
}

# Create helper scripts
create_helper_scripts() {
    # Test script
    cat > "$SCRIPT_DIR/test-auto-fix.sh" << 'EOF'
#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/.vercel-auto-fix-config"

if [[ ! -f "$CONFIG_FILE" ]]; then
    echo "❌ Configuration not found. Run quick-setup.sh first."
    exit 1
fi

source "$CONFIG_FILE"
export VERCEL_TOKEN PROJECT_ID TEAM_ID

echo "🧪 Testing BMAD Vercel Auto-Fix system..."
echo "🎯 Project ID: $PROJECT_ID"

"$SCRIPT_DIR/vercel-auto-fix.sh" "$PROJECT_ID" "$TEAM_ID"
EOF
    chmod +x "$SCRIPT_DIR/test-auto-fix.sh"
    
    # Start monitoring script
    cat > "$SCRIPT_DIR/start-monitoring.sh" << 'EOF'
#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/.vercel-auto-fix-config"

if [[ ! -f "$CONFIG_FILE" ]]; then
    echo "❌ Configuration not found. Run quick-setup.sh first."
    exit 1
fi

source "$CONFIG_FILE"
export VERCEL_TOKEN PROJECT_ID TEAM_ID CHECK_INTERVAL

echo "🔄 Starting BMAD Vercel monitoring..."
echo "🎯 Project ID: $PROJECT_ID"
echo "⏱️ Check interval: ${CHECK_INTERVAL:-300} seconds"

"$SCRIPT_DIR/monitor-vercel.sh" start "$PROJECT_ID" "$TEAM_ID"
EOF
    chmod +x "$SCRIPT_DIR/start-monitoring.sh"
    
    # Start webhook script
    cat > "$SCRIPT_DIR/start-webhook.sh" << 'EOF'
#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/.vercel-auto-fix-config"

if [[ ! -f "$CONFIG_FILE" ]]; then
    echo "❌ Configuration not found. Run quick-setup.sh first."
    exit 1
fi

source "$CONFIG_FILE"
export PROJECT_ID TEAM_ID WEBHOOK_PORT

echo "📡 Starting BMAD webhook receiver..."
echo "🎯 Project ID: $PROJECT_ID"
echo "🔌 Port: ${WEBHOOK_PORT:-3001}"

"$SCRIPT_DIR/webhook-receiver.sh" start
EOF
    chmod +x "$SCRIPT_DIR/start-webhook.sh"
    
    log_success "✅ Helper scripts created"
}

# Show usage instructions
show_usage_instructions() {
    log_header "🎉 BMAD Setup Complete!"
    
    source "$CONFIG_FILE"
    
    echo -e "${GREEN}✅ BMAD Vercel Auto-Fix system is ready!${NC}"
    echo
    echo -e "${BOLD}📋 Available Commands:${NC}"
    echo "  ./test-auto-fix.sh             - Test the system immediately"
    echo "  ./start-monitoring.sh          - Start continuous monitoring"
    echo "  ./start-webhook.sh             - Start webhook receiver"
    echo "  ./vercel-auto-fix.sh           - Run manual fix"
    echo "  ./bmad-dev-agent.sh            - BMAD development agent tools"
    echo
    echo -e "${BOLD}🚀 Usage Patterns:${NC}"
    echo
    echo -e "${YELLOW}1. Quick Test (Recommended first step):${NC}"
    echo "   ./test-auto-fix.sh"
    echo
    echo -e "${YELLOW}2. Continuous Monitoring:${NC}"
    echo "   ./start-monitoring.sh &"
    echo "   # Monitors every 5 minutes in background"
    echo
    echo -e "${YELLOW}3. Webhook-Based (For production):${NC}"
    echo "   ./start-webhook.sh &"
    echo "   # Then configure webhook in Vercel Dashboard"
    echo "   # URL: http://your-server:3001/webhook"
    echo
    echo -e "${YELLOW}4. GitHub Actions (Automated):${NC}"
    echo "   # Already configured - runs every 10 minutes"
    echo "   # Add secrets to GitHub repository as shown above"
    echo
    echo -e "${BOLD}📊 Monitoring Commands:${NC}"
    echo "  ./monitor-vercel.sh status     - Check monitoring status"
    echo "  ./webhook-receiver.sh status   - Check webhook status"
    echo "  ls -la .bmad-stories/          - View BMAD development stories"
    echo
    echo -e "${BOLD}⚙️ Configuration:${NC}"
    echo "  Project ID: $PROJECT_ID"
    echo "  Team ID: ${TEAM_ID:-'Not specified'}"
    echo "  Config file: $CONFIG_FILE"
    echo "  BMAD enabled: Yes"
    echo "  Max attempts: 10"
    echo
    echo -e "${BLUE}🎯 Next Steps:${NC}"
    echo "1. Run: ./test-auto-fix.sh (to verify everything works)"
    echo "2. Set up GitHub Actions secrets (for automation)"
    echo "3. Choose monitoring method (webhook/continuous/GitHub Actions)"
    echo
    echo -e "${GREEN}🤖 BMAD Features Active:${NC}"
    echo "✅ Story-driven development"
    echo "✅ Iterative fix-deploy-verify cycles"
    echo "✅ Context preservation between attempts"
    echo "✅ Systematic error classification"
    echo "✅ Emergency deployment recovery"
    
    log_success "🎉 Setup completed successfully!"
}

# Run main function
main "$@"