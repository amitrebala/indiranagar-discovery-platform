#!/bin/bash

# Vercel Auto-Fix Setup Script
# Automates the complete setup of the Vercel auto-fix system

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

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Install dependencies
install_dependencies() {
    log_header "Installing Dependencies"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if ! command_exists brew; then
            log_error "Homebrew is required but not installed"
            echo "Install Homebrew: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
            exit 1
        fi
        
        log_info "Installing dependencies via Homebrew..."
        brew install jq curl netcat || {
            log_warn "Some dependencies may already be installed"
        }
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command_exists apt-get; then
            log_info "Installing dependencies via apt..."
            sudo apt-get update
            sudo apt-get install -y jq curl netcat-openbsd
        elif command_exists yum; then
            log_info "Installing dependencies via yum..."
            sudo yum install -y jq curl netcat
        elif command_exists pacman; then
            log_info "Installing dependencies via pacman..."
            sudo pacman -S jq curl gnu-netcat
        else
            log_error "Unsupported Linux distribution"
            exit 1
        fi
    else
        log_error "Unsupported operating system: $OSTYPE"
        exit 1
    fi
    
    log_success "Dependencies installed"
}

# Check Claude Code installation
check_claude_code() {
    log_header "Checking Claude Code"
    
    if command_exists claude-code; then
        log_success "Claude Code is already installed"
        claude-code --version || true
    else
        log_warn "Claude Code not found in PATH"
        echo "To install Claude Code:"
        echo "1. Visit: https://docs.anthropic.com/en/docs/claude-code"
        echo "2. Follow the installation instructions"
        echo "3. Run this setup script again"
        
        read -p "Do you want to continue without Claude Code? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# Get Vercel configuration
get_vercel_config() {
    log_header "Vercel Configuration"
    
    # Load existing config if available
    if [[ -f "$CONFIG_FILE" ]]; then
        source "$CONFIG_FILE"
        log_info "Loaded existing configuration"
    fi
    
    # Get Vercel token
    if [[ -z "${VERCEL_TOKEN:-}" ]]; then
        echo "You need a Vercel API token to use this system."
        echo "Get one at: https://vercel.com/account/tokens"
        echo
        read -p "Enter your Vercel API token: " -s VERCEL_TOKEN
        echo
        
        if [[ -z "$VERCEL_TOKEN" ]]; then
            log_error "Vercel token is required"
            exit 1
        fi
    else
        log_info "Using existing Vercel token"
    fi
    
    # Get project ID
    if [[ -z "${PROJECT_ID:-}" ]]; then
        echo "You need your Vercel project ID."
        echo "Find it at: https://vercel.com/dashboard"
        echo "Or run: vercel ls"
        echo
        read -p "Enter your Vercel project ID: " PROJECT_ID
        
        if [[ -z "$PROJECT_ID" ]]; then
            log_error "Project ID is required"
            exit 1
        fi
    else
        log_info "Using existing project ID: $PROJECT_ID"
    fi
    
    # Get team ID (optional)
    if [[ -z "${TEAM_ID:-}" ]]; then
        read -p "Enter your Vercel team ID (optional, press Enter to skip): " TEAM_ID
    fi
    
    # Save configuration
    cat > "$CONFIG_FILE" << EOF
# Vercel Auto-Fix Configuration
VERCEL_TOKEN="$VERCEL_TOKEN"
PROJECT_ID="$PROJECT_ID"
TEAM_ID="$TEAM_ID"
EOF
    
    chmod 600 "$CONFIG_FILE"
    log_success "Configuration saved to $CONFIG_FILE"
}

# Test Vercel API access
test_vercel_api() {
    log_header "Testing Vercel API Access"
    
    source "$CONFIG_FILE"
    
    local url="https://api.vercel.com/v6/deployments?projectId=$PROJECT_ID&limit=1"
    if [[ -n "$TEAM_ID" ]]; then
        url="$url&teamId=$TEAM_ID"
    fi
    
    log_info "Testing API access..."
    
    local response=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" "$url")
    local deployment_id=$(echo "$response" | jq -r '.deployments[0].uid // "null"' 2>/dev/null)
    
    if [[ "$deployment_id" != "null" && -n "$deployment_id" ]]; then
        log_success "API access successful"
        log_info "Latest deployment: $deployment_id"
    else
        log_error "API access failed"
        echo "Response: $response"
        exit 1
    fi
}

# Setup GitHub Actions
setup_github_actions() {
    log_header "Setting up GitHub Actions"
    
    if [[ ! -d ".git" ]]; then
        log_warn "Not in a git repository, skipping GitHub Actions setup"
        return 0
    fi
    
    source "$CONFIG_FILE"
    
    log_info "GitHub Actions workflow is already created at .github/workflows/vercel-auto-fix.yml"
    
    echo "To complete GitHub Actions setup:"
    echo "1. Go to your GitHub repository settings"
    echo "2. Navigate to Settings > Secrets and variables > Actions"
    echo "3. Add these secrets:"
    echo "   - VERCEL_TOKEN: $VERCEL_TOKEN"
    echo "   - VERCEL_PROJECT_ID: $PROJECT_ID"
    if [[ -n "$TEAM_ID" ]]; then
        echo "   - VERCEL_TEAM_ID: $TEAM_ID"
    fi
    echo
    echo "4. The workflow will run automatically every 10 minutes"
    echo "5. You can also trigger it manually from the Actions tab"
    
    read -p "Press Enter to continue..."
}

# Create helper scripts
create_helper_scripts() {
    log_header "Creating Helper Scripts"
    
    # Create quick test script
    cat > "$SCRIPT_DIR/test-auto-fix.sh" << 'EOF'
#!/bin/bash
# Quick test script for Vercel auto-fix

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/.vercel-auto-fix-config"

if [[ ! -f "$CONFIG_FILE" ]]; then
    echo "Configuration not found. Run setup-vercel-auto-fix.sh first."
    exit 1
fi

source "$CONFIG_FILE"

echo "Testing Vercel auto-fix system..."
echo "Project ID: $PROJECT_ID"

"$SCRIPT_DIR/vercel-auto-fix.sh" "$PROJECT_ID" "$TEAM_ID"
EOF
    
    chmod +x "$SCRIPT_DIR/test-auto-fix.sh"
    
    # Create monitoring start script
    cat > "$SCRIPT_DIR/start-monitoring.sh" << 'EOF'
#!/bin/bash
# Start Vercel monitoring

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/.vercel-auto-fix-config"

if [[ ! -f "$CONFIG_FILE" ]]; then
    echo "Configuration not found. Run setup-vercel-auto-fix.sh first."
    exit 1
fi

source "$CONFIG_FILE"

echo "Starting Vercel monitoring..."
echo "Project ID: $PROJECT_ID"
echo "Check interval: ${CHECK_INTERVAL:-300} seconds"

"$SCRIPT_DIR/monitor-vercel.sh" start "$PROJECT_ID" "$TEAM_ID"
EOF
    
    chmod +x "$SCRIPT_DIR/start-monitoring.sh"
    
    # Create webhook start script
    cat > "$SCRIPT_DIR/start-webhook.sh" << 'EOF'
#!/bin/bash
# Start Vercel webhook receiver

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/.vercel-auto-fix-config"

if [[ ! -f "$CONFIG_FILE" ]]; then
    echo "Configuration not found. Run setup-vercel-auto-fix.sh first."
    exit 1
fi

source "$CONFIG_FILE"
export PROJECT_ID TEAM_ID

echo "Starting webhook receiver..."
echo "Project ID: $PROJECT_ID"
echo "Port: ${WEBHOOK_PORT:-3001}"

"$SCRIPT_DIR/webhook-receiver.sh" start
EOF
    
    chmod +x "$SCRIPT_DIR/start-webhook.sh"
    
    log_success "Helper scripts created"
}

# Print usage instructions
print_usage_instructions() {
    log_header "Setup Complete!"
    
    source "$CONFIG_FILE"
    
    echo -e "${GREEN}✅ Vercel Auto-Fix system is ready!${NC}"
    echo
    echo -e "${BOLD}Available scripts:${NC}"
    echo "  ./vercel-auto-fix.sh           - Run auto-fix once"
    echo "  ./test-auto-fix.sh             - Test the auto-fix system"
    echo "  ./start-monitoring.sh          - Start continuous monitoring"
    echo "  ./start-webhook.sh             - Start webhook receiver"
    echo "  ./monitor-vercel.sh status     - Check monitoring status"
    echo "  ./webhook-receiver.sh status   - Check webhook status"
    echo
    echo -e "${BOLD}Usage patterns:${NC}"
    echo
    echo -e "${YELLOW}1. One-time fix:${NC}"
    echo "   ./test-auto-fix.sh"
    echo
    echo -e "${YELLOW}2. Continuous monitoring:${NC}"
    echo "   ./start-monitoring.sh &"
    echo "   # Monitor runs in background, checking every 5 minutes"
    echo
    echo -e "${YELLOW}3. Webhook-based (for production):${NC}"
    echo "   ./start-webhook.sh &"
    echo "   # Set up webhook in Vercel dashboard pointing to your server"
    echo
    echo -e "${YELLOW}4. GitHub Actions (automated):${NC}"
    echo "   # Already configured - runs every 10 minutes automatically"
    echo
    echo -e "${BOLD}Configuration:${NC}"
    echo "  Project ID: $PROJECT_ID"
    echo "  Team ID: ${TEAM_ID:-'Not specified'}"
    echo "  Config file: $CONFIG_FILE"
    echo
    echo -e "${BLUE}For more help, see the individual script help:${NC}"
    echo "  ./vercel-auto-fix.sh --help"
    echo "  ./monitor-vercel.sh --help"
    echo "  ./webhook-receiver.sh --help"
}

# Main execution
main() {
    log_header "Vercel Auto-Fix Setup"
    
    echo "This script will set up the complete Vercel auto-fix system."
    echo "It includes:"
    echo "  - Dependency installation"
    echo "  - Vercel API configuration"
    echo "  - GitHub Actions setup"
    echo "  - Helper scripts creation"
    echo
    
    read -p "Continue with setup? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Setup cancelled"
        exit 0
    fi
    
    install_dependencies
    check_claude_code
    get_vercel_config
    test_vercel_api
    setup_github_actions
    create_helper_scripts
    print_usage_instructions
    
    log_success "Setup completed successfully!"
}

# Handle command line arguments
case "${1:-setup}" in
    "setup"|"")
        main
        ;;
    "test")
        source "$CONFIG_FILE" 2>/dev/null || {
            log_error "Configuration not found. Run setup first."
            exit 1
        }
        log_info "Testing auto-fix system..."
        "$SCRIPT_DIR/vercel-auto-fix.sh" "$PROJECT_ID" "$TEAM_ID"
        ;;
    "status")
        echo "=== Vercel Auto-Fix System Status ==="
        
        if [[ -f "$CONFIG_FILE" ]]; then
            source "$CONFIG_FILE"
            echo "✅ Configuration: Found"
            echo "   Project ID: $PROJECT_ID"
            echo "   Team ID: ${TEAM_ID:-'Not specified'}"
        else
            echo "❌ Configuration: Not found"
        fi
        
        echo
        echo "📜 Scripts:"
        for script in vercel-auto-fix.sh monitor-vercel.sh webhook-receiver.sh; do
            if [[ -x "$SCRIPT_DIR/$script" ]]; then
                echo "   ✅ $script"
            else
                echo "   ❌ $script (missing or not executable)"
            fi
        done
        
        echo
        echo "🤖 GitHub Actions:"
        if [[ -f "$SCRIPT_DIR/.github/workflows/vercel-auto-fix.yml" ]]; then
            echo "   ✅ Workflow file exists"
        else
            echo "   ❌ Workflow file missing"
        fi
        
        echo
        echo "🔄 Running Services:"
        "$SCRIPT_DIR/monitor-vercel.sh" status 2>/dev/null || echo "   ❌ Monitor: Not running"
        "$SCRIPT_DIR/webhook-receiver.sh" status 2>/dev/null || echo "   ❌ Webhook: Not running"
        ;;
    "clean")
        log_info "Cleaning up auto-fix system..."
        
        # Stop services
        "$SCRIPT_DIR/monitor-vercel.sh" stop 2>/dev/null || true
        "$SCRIPT_DIR/webhook-receiver.sh" stop 2>/dev/null || true
        
        # Remove config and generated files
        rm -f "$CONFIG_FILE"
        rm -f "$SCRIPT_DIR/test-auto-fix.sh"
        rm -f "$SCRIPT_DIR/start-monitoring.sh"
        rm -f "$SCRIPT_DIR/start-webhook.sh"
        rm -f "$SCRIPT_DIR"/*.log
        rm -f "$SCRIPT_DIR"/*.pid
        
        log_success "Cleanup completed"
        ;;
    "help"|"--help")
        echo "Vercel Auto-Fix Setup Script"
        echo
        echo "Usage: $0 [command]"
        echo
        echo "Commands:"
        echo "  setup (default)  - Run complete setup process"
        echo "  test            - Test the auto-fix system"
        echo "  status          - Show system status"
        echo "  clean           - Remove all configuration and stop services"
        echo "  help            - Show this help message"
        echo
        ;;
    *)
        log_error "Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac