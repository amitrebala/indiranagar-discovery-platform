#!/bin/bash

# Claude Code Deployment-Aware Commit Script
# This script integrates with Claude Code to handle deployment validation automatically

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PRE_DEPLOY_SCRIPT="$SCRIPT_DIR/vercel-pre-deploy.sh"
ERROR_LOG="$PROJECT_ROOT/.vercel-errors.log"
CLAUDE_PROMPT="$PROJECT_ROOT/.claude-fix-prompt.txt"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Logging
log_info() {
    echo -e "${BLUE}[CLAUDE-DEPLOY]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_claude() {
    echo -e "${MAGENTA}[CLAUDE]${NC} $1"
}

# Usage
usage() {
    echo "Claude Code Deployment-Aware Commit"
    echo ""
    echo "Usage: $0 \"commit message\" [options]"
    echo ""
    echo "Options:"
    echo "  --no-fix      Don't attempt automatic fixes"
    echo "  --verbose     Show detailed output"
    echo ""
    echo "This script:"
    echo "1. Validates Vercel deployment locally"
    echo "2. Automatically fixes errors if found"
    echo "3. Commits only when deployment passes"
    echo "4. Pushes to GitHub with confidence"
}

# Parse arguments
COMMIT_MSG="$1"
NO_FIX=false
VERBOSE=false

shift || true
while [[ $# -gt 0 ]]; do
    case $1 in
        --no-fix)
            NO_FIX=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --help|-h)
            usage
            exit 0
            ;;
        *)
            shift
            ;;
    esac
done

# Validate arguments
if [[ -z "$COMMIT_MSG" ]]; then
    log_error "Commit message required"
    usage
    exit 1
fi

# Create BMAD agent prompt
create_claude_prompt() {
    local errors="$1"
    
    # Create comprehensive error files
    ERROR_REPORT="$PROJECT_ROOT/.vercel-error-report.txt"
    BUILD_LOG="$PROJECT_ROOT/.vercel-build-full.log"
    CONTEXT_FILE="$PROJECT_ROOT/.vercel-context.txt"
    
    # Generate detailed error report
    cat > "$ERROR_REPORT" << EOF
VERCEL DEPLOYMENT FAILURE ANALYSIS
==================================
Timestamp: $(date)
Project: $(basename "$PROJECT_ROOT")
Git Branch: $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")

CRITICAL ERRORS:
----------------
$errors

ERROR STATISTICS:
-----------------
Total Errors: $(echo "$errors" | wc -l | tr -d ' ')
TypeScript: $(echo "$errors" | grep -c "TS[0-9]+" || echo "0")
Module/Import: $(echo "$errors" | grep -c "Cannot find module\|Module not found\|Failed to resolve" || echo "0")
Syntax: $(echo "$errors" | grep -c "SyntaxError\|Unexpected token" || echo "0")
Other: $(echo "$errors" | grep -vc "TS[0-9]+\|Cannot find module\|Module not found\|SyntaxError" || echo "0")
EOF
    
    # Create context file
    cat > "$CONTEXT_FILE" << EOF
PROJECT STRUCTURE:
------------------
$(find . -name "package.json" -not -path "*/node_modules/*" | head -10)

BUILD CONFIGURATION:
-------------------
$(cat package.json 2>/dev/null | jq -r '.scripts | to_entries[] | select(.key | contains("build")) | "\(.key): \(.value)"' || echo "No build scripts found")

RECENT CHANGES:
---------------
$(git log --oneline -5 2>/dev/null || echo "No git history available")
EOF
    
    # Copy build log if available
    if [[ -f "$PROJECT_ROOT/.vercel-build-output.log" ]]; then
        cp "$PROJECT_ROOT/.vercel-build-output.log" "$BUILD_LOG"
    else
        echo "No detailed build log available" > "$BUILD_LOG"
    fi
    
    # Capture code intent
    INTENT_FILE="$PROJECT_ROOT/.vercel-intent.txt"
    cat > "$INTENT_FILE" << EOF
CODE INTENT AND RECENT CHANGES:
================================
Working Directory: $(pwd)
Current Branch: $(git rev-parse --abbrev-ref HEAD 2>/dev/null)

STAGED CHANGES:
$(git diff --cached --stat 2>/dev/null || echo "None")

RECENT WORK (Diff Preview):
$(git diff --cached | head -150 2>/dev/null || echo "No diff available")

MODIFIED FILES:
$(git diff --cached --name-only 2>/dev/null || echo "None")

RECENT COMMIT MESSAGES:
$(git log --oneline -5 2>/dev/null || echo "No commits")
EOF
    
    cat > "$CLAUDE_PROMPT" << EOF
/BMad:agents:dev

**GOAL-ORIENTED DEPLOYMENT RECOVERY MISSION**

Critical: Fix deployment while ACHIEVING the intended functionality of the code changes.

**ERROR FILES FOR ANALYSIS:**
1. \`$ERROR_REPORT\` - Categorized error analysis
2. \`$BUILD_LOG\` - Complete build output log
3. \`$CONTEXT_FILE\` - Project structure and recent changes
4. \`$ERROR_LOG\` - Raw error list
5. \`$INTENT_FILE\` - Code intent and recent changes

**MISSION CRITICAL: PRESERVE FUNCTIONALITY**
- The goal is NOT just to make the build pass
- You must UNDERSTAND what the code was trying to achieve
- PRESERVE and ENABLE the intended functionality
- Fix errors in a way that makes the feature WORK CORRECTLY

**GOAL-ORIENTED APPROACH:**

1. **COMPREHENSIVE ANALYSIS PHASE**:
   - READ all provided error files using Read tool
   - Understand the full scope of issues
   - Identify root causes vs symptoms
   - Map error dependencies and relationships

2. **STRATEGIC PLANNING**:
   - Group related errors together
   - Plan fix order based on dependencies
   - Consider ripple effects of changes
   - Ensure fixes won't break other parts

3. **SYSTEMATIC RESOLUTION**:
   Priority Order:
   a) Core compilation errors (TypeScript fundamentals)
   b) Type definition issues (interfaces, types)
   c) Module resolution (imports, paths)
   d) Missing dependencies (npm packages)
   e) Syntax and formatting issues
   f) Configuration problems

4. **ITERATIVE VALIDATION**:
   - After fixing each error category:
     \`\`\`bash
     cd apps/web  # if monorepo structure
     npm run build
     \`\`\`
   - If new errors appear, analyze their relationship to fixes
   - Continue until ALL errors resolved

5. **HOLISTIC VERIFICATION**:
   - Ensure no regression in functionality
   - Verify all imports resolve correctly
   - Check that types are properly defined
   - Confirm build succeeds completely

**PROJECT-SPECIFIC CONTEXT:**
- This is a Next.js/TypeScript project
- Uses Vercel for deployment
- May have monorepo structure (check for apps/web)
- Likely has strict TypeScript configuration

**CRITICAL SUCCESS FACTORS:**
✓ Read and analyze ALL error files before starting fixes
✓ Fix root causes, not just symptoms
✓ Ensure every error is addressed
✓ Validate fixes don't introduce new issues
✓ Build must pass with ZERO errors
✓ Deployment must succeed on Vercel

**DO NOT:**
- Skip reading the error files
- Fix only surface-level issues
- Create unnecessary new files
- Make changes that break existing functionality

Start by reading all error files, then proceed with holistic fixes!
EOF
}

# Main workflow
main() {
    log_info "Starting deployment-aware commit process..."
    
    # Step 1: Initial validation
    log_info "Running Vercel deployment validation..."
    
    if "$PRE_DEPLOY_SCRIPT"; then
        log_success "Initial validation passed!"
    else
        if [[ "$NO_FIX" == "true" ]]; then
            log_error "Validation failed and --no-fix specified"
            exit 1
        fi
        
        log_warning "Validation failed, attempting automatic fixes..."
        
        # Step 2: Capture errors
        if [[ -f "$ERROR_LOG" ]]; then
            errors=$(cat "$ERROR_LOG")
            log_claude "Analyzing deployment errors..."
            
            # Step 3: Create fix prompt
            create_claude_prompt "$errors"
            
            # Step 4: Apply fixes
            log_claude "Applying automatic fixes..."
            
            # This prompt will be picked up by Claude Code
            echo ""
            echo "CLAUDE CODE: Please fix the deployment errors documented in:"
            echo "$CLAUDE_PROMPT"
            echo ""
            echo "After fixing, the script will continue automatically."
            
            # Wait for user to indicate fixes are complete
            read -p "Press ENTER after Claude Code has applied fixes..."
            
            # Step 5: Re-validate
            log_info "Re-validating after fixes..."
            
            if "$PRE_DEPLOY_SCRIPT"; then
                log_success "Validation passed after fixes!"
            else
                log_error "Validation still failing after fixes"
                echo ""
                echo "Manual intervention required. Check:"
                echo "  • $ERROR_LOG for errors"
                echo "  • $PROJECT_ROOT/.vercel-build-output.log for full output"
                exit 1
            fi
        else
            log_error "No error log found"
            exit 1
        fi
    fi
    
    # Step 6: Commit changes
    log_info "Creating commit..."
    
    # Stage all changes
    git add -A
    
    # Create detailed commit message
    FULL_COMMIT_MSG="$COMMIT_MSG

Deployment-Validation: Passed ✓
Validation-Method: claude-deploy-commit.sh
Build-Status: Verified
Pre-Deploy-Check: Successful"
    
    if [[ "$NO_FIX" != "true" ]] && [[ -f "$CLAUDE_PROMPT" ]]; then
        FULL_COMMIT_MSG="$FULL_COMMIT_MSG
Auto-Fixes: Applied via Claude Code"
    fi
    
    git commit -m "$FULL_COMMIT_MSG"
    log_success "Commit created"
    
    # Step 7: Push to remote
    log_info "Pushing to remote..."
    
    current_branch=$(git rev-parse --abbrev-ref HEAD)
    if git push origin "$current_branch"; then
        log_success "Pushed successfully!"
    else
        log_error "Push failed"
        exit 1
    fi
    
    # Cleanup
    rm -f "$ERROR_LOG" "$CLAUDE_PROMPT" "$PROJECT_ROOT/.vercel-build-output.log"
    
    # Success message
    echo ""
    echo -e "${GREEN}✅ DEPLOYMENT-READY COMMIT COMPLETE${NC}"
    echo ""
    echo "Your changes have been:"
    echo "  • Validated against Vercel deployment"
    echo "  • Automatically fixed (if needed)"
    echo "  • Committed with validation metadata"
    echo "  • Pushed to GitHub"
    echo ""
    echo "Vercel will now deploy successfully! 🚀"
}

# Run main workflow
main