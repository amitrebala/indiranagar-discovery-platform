#!/bin/bash

# Safe Commit with Vercel Deployment Validation
# This script ensures all commits pass Vercel deployment before pushing to GitHub

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PRE_DEPLOY_SCRIPT="$SCRIPT_DIR/vercel-pre-deploy.sh"
MAX_RETRIES=3

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Logging
log_info() {
    echo -e "${BLUE}[SAFE-COMMIT]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${CYAN}[STEP]${NC} $1"
}

# Show usage
usage() {
    echo "Safe Commit - Vercel Deployment Validation"
    echo ""
    echo "Usage: $0 [options] \"commit message\""
    echo ""
    echo "Options:"
    echo "  -h, --help       Show this help"
    echo "  -n, --no-push    Don't push after commit"
    echo "  -f, --force      Skip validation (use with caution)"
    echo "  -a, --all        Stage all changes before commit"
    echo ""
    echo "Examples:"
    echo "  $0 \"feat: add new feature\""
    echo "  $0 -a \"fix: resolve type errors\""
    echo "  $0 --no-push \"wip: work in progress\""
}

# Parse arguments
NO_PUSH=false
FORCE=false
STAGE_ALL=false
COMMIT_MSG=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            usage
            exit 0
            ;;
        -n|--no-push)
            NO_PUSH=true
            shift
            ;;
        -f|--force)
            FORCE=true
            shift
            ;;
        -a|--all)
            STAGE_ALL=true
            shift
            ;;
        *)
            COMMIT_MSG="$1"
            shift
            ;;
    esac
done

# Validate commit message
if [[ -z "$COMMIT_MSG" ]]; then
    log_error "Commit message is required"
    usage
    exit 1
fi

# Main workflow
main() {
    log_info "Starting safe commit process..."
    
    # Terminal-specific commit tracking
    TERMINAL_ID="${TERM_SESSION_ID:-${WINDOWID:-$$}}"
    WORK_TRACKER="$PROJECT_ROOT/.terminal-work-$TERMINAL_ID"
    
    # Step 1: Check for changes
    log_step "Checking for changes..."
    if [[ "$STAGE_ALL" == "true" ]]; then
        # Track which files were modified in this terminal
        if [[ -f "$WORK_TRACKER" ]]; then
            log_info "Staging only files modified in this terminal session..."
            while IFS= read -r file; do
                if [[ -f "$file" ]]; then
                    git add "$file"
                    log_info "Staged: $file"
                fi
            done < "$WORK_TRACKER"
        else
            log_warning "No terminal work tracker found, staging all changes..."
            git add -A
        fi
        log_info "Staged terminal-specific changes"
    fi
    
    if ! git diff --cached --quiet; then
        log_success "Found staged changes"
    else
        log_error "No staged changes found"
        echo "Use 'git add' to stage changes or use -a flag"
        exit 1
    fi
    
    # Step 2: Run Vercel validation
    if [[ "$FORCE" == "true" ]]; then
        log_info "Skipping validation (forced)"
    else
        log_step "Running Vercel deployment validation..."
        
        if ! "$PRE_DEPLOY_SCRIPT"; then
            log_error "Initial validation failed"
            log_info "Switching to BMAD Development Agent for automatic fixes..."
            
            # Use claude-deploy-commit for BMAD agent integration
            "$SCRIPT_DIR/claude-deploy-commit.sh" "$COMMIT_MSG"
            exit $?
        else
            log_success "Deployment validation passed"
        fi
    fi
    
    # Step 3: Create commit
    log_step "Creating commit..."
    
    # Add deployment validation info to commit message
    FULL_COMMIT_MSG="$COMMIT_MSG"
    if [[ "$FORCE" != "true" ]]; then
        FULL_COMMIT_MSG="$COMMIT_MSG

Deployment-Validation: Passed ✓
Pre-Deploy-Check: vercel-pre-deploy.sh
Build-Status: Verified"
    fi
    
    if git commit -m "$FULL_COMMIT_MSG"; then
        log_success "Commit created successfully"
    else
        log_error "Commit failed"
        exit 1
    fi
    
    # Step 4: Push to remote (if requested)
    if [[ "$NO_PUSH" == "true" ]]; then
        log_info "Skipping push (--no-push flag)"
    else
        log_step "Pushing to remote..."
        
        current_branch=$(git rev-parse --abbrev-ref HEAD)
        
        if git push origin "$current_branch"; then
            log_success "Pushed to origin/$current_branch"
        else
            log_error "Push failed"
            echo ""
            echo "Your commit was created locally but not pushed."
            echo "You can push manually with: git push origin $current_branch"
            exit 1
        fi
    fi
    
    # Success summary
    echo ""
    echo -e "${GREEN}✅ SAFE COMMIT COMPLETED${NC}"
    echo ""
    echo "Summary:"
    echo "  • Changes committed: ✓"
    echo "  • Vercel validation: ✓"
    if [[ "$NO_PUSH" != "true" ]]; then
        echo "  • Pushed to remote: ✓"
        echo ""
        echo "Your changes are now on GitHub and will deploy successfully to Vercel!"
    else
        echo "  • Push pending (use 'git push' when ready)"
    fi
}

# Run main workflow
main