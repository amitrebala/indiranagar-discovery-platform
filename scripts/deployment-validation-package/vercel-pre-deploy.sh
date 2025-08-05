#!/bin/bash

# Vercel Pre-Deployment Validation Script
# This script validates and fixes Vercel deployment issues BEFORE committing to GitHub
# Usage: ./scripts/vercel-pre-deploy.sh [options]

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
WEB_APP_DIR="$PROJECT_ROOT/apps/web"
MAX_FIX_ATTEMPTS=3
VERCEL_CONFIG_FILE=".vercel/project.json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[PRE-DEPLOY]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_fix() {
    echo -e "${MAGENTA}[AUTO-FIX]${NC} $1"
}

# Track errors and fixes
ERROR_LOG="$PROJECT_ROOT/.vercel-errors.log"
FIX_LOG="$PROJECT_ROOT/.vercel-fixes.log"
BUILD_OUTPUT="$PROJECT_ROOT/.vercel-build-output.log"

# Initialize logs
init_logs() {
    > "$ERROR_LOG"
    > "$FIX_LOG"
    > "$BUILD_OUTPUT"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi
    
    # Check Vercel CLI
    if ! command -v vercel &> /dev/null; then
        log_warning "Vercel CLI not installed. Installing..."
        npm i -g vercel
    fi
    
    # Check if in git repo
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "Not in a git repository"
        exit 1
    fi
    
    # Check for Vercel configuration
    if [[ ! -f "$PROJECT_ROOT/$VERCEL_CONFIG_FILE" ]] && [[ ! -f "$WEB_APP_DIR/$VERCEL_CONFIG_FILE" ]]; then
        log_warning "No Vercel configuration found. Initializing..."
        cd "$WEB_APP_DIR" || cd "$PROJECT_ROOT"
        vercel link --yes || true
        cd "$PROJECT_ROOT"
    fi
    
    log_success "Prerequisites verified"
}

# Detect project structure
detect_project_structure() {
    if [[ -f "$WEB_APP_DIR/package.json" ]]; then
        export BUILD_DIR="$WEB_APP_DIR"
        log_info "Detected monorepo structure - using apps/web"
    else
        export BUILD_DIR="$PROJECT_ROOT"
        log_info "Detected single package structure"
    fi
}

# Run local Vercel build
run_vercel_build() {
    log_info "Running local Vercel build simulation..."
    cd "$BUILD_DIR"
    
    # Set production environment
    export NODE_ENV=production
    export VERCEL=1
    export CI=1
    
    # Run build and capture output
    if vercel build --prod > "$BUILD_OUTPUT" 2>&1; then
        log_success "Vercel build completed successfully"
        return 0
    else
        log_error "Vercel build failed"
        return 1
    fi
}

# Parse build errors
parse_build_errors() {
    log_info "Analyzing build errors..."
    
    # Extract TypeScript errors
    grep -E "(TS[0-9]+:|Type error:|TypeError)" "$BUILD_OUTPUT" > "$ERROR_LOG" || true
    
    # Extract module resolution errors
    grep -E "(Cannot find module|Module not found|Failed to resolve)" "$BUILD_OUTPUT" >> "$ERROR_LOG" || true
    
    # Extract syntax errors
    grep -E "(SyntaxError|Unexpected token|Parsing error)" "$BUILD_OUTPUT" >> "$ERROR_LOG" || true
    
    # Extract missing dependency errors
    grep -E "(Cannot resolve|Could not resolve|not installed)" "$BUILD_OUTPUT" >> "$ERROR_LOG" || true
    
    # Count errors
    ERROR_COUNT=$(wc -l < "$ERROR_LOG" | tr -d ' ')
    log_warning "Found $ERROR_COUNT errors to fix"
}

# Auto-fix TypeScript errors
fix_typescript_errors() {
    log_fix "Attempting to fix TypeScript errors..."
    
    # Common TypeScript fixes
    while IFS= read -r error; do
        if [[ "$error" =~ "Property '([^']+)' does not exist on type" ]]; then
            property="${BASH_REMATCH[1]}"
            log_fix "Adding missing property: $property"
            # Add to fix log for Claude Code
            echo "TypeScript: Add missing property '$property'" >> "$FIX_LOG"
        elif [[ "$error" =~ "Type '([^']+)' is not assignable to type '([^']+)'" ]]; then
            from_type="${BASH_REMATCH[1]}"
            to_type="${BASH_REMATCH[2]}"
            log_fix "Type mismatch: $from_type -> $to_type"
            echo "TypeScript: Fix type mismatch from '$from_type' to '$to_type'" >> "$FIX_LOG"
        fi
    done < <(grep "TS[0-9]+" "$ERROR_LOG")
}

# Auto-fix module errors
fix_module_errors() {
    log_fix "Attempting to fix module resolution errors..."
    
    while IFS= read -r error; do
        if [[ "$error" =~ "Cannot find module '([^']+)'" ]]; then
            module="${BASH_REMATCH[1]}"
            log_fix "Missing module: $module"
            
            # Check if it's a relative import issue
            if [[ "$module" =~ ^\./ ]]; then
                echo "Module: Fix relative import path for '$module'" >> "$FIX_LOG"
            else
                # Try to install missing dependency
                log_fix "Installing missing dependency: $module"
                cd "$BUILD_DIR"
                npm install "$module" --save || npm install "$module" --save-dev || true
                cd "$PROJECT_ROOT"
            fi
        fi
    done < <(grep -E "Cannot find module|Module not found" "$ERROR_LOG")
}

# Apply BMAD Development Agent fixes
apply_claude_fixes() {
    log_fix "Invoking BMAD Development Agent for intelligent fixes..."
    
    # Create comprehensive error report files
    ERROR_REPORT="$PROJECT_ROOT/.vercel-error-report.txt"
    BUILD_LOG="$PROJECT_ROOT/.vercel-build-full.log"
    
    # Compile full error report
    cat > "$ERROR_REPORT" << EOF
VERCEL DEPLOYMENT ERROR REPORT
==============================
Generated: $(date)
Project: $(basename "$PROJECT_ROOT")

PARSED ERRORS:
--------------
$(cat "$ERROR_LOG" 2>/dev/null || echo "No parsed errors available")

BUILD OUTPUT (Last 200 lines):
------------------------------
$(tail -n 200 "$BUILD_OUTPUT" 2>/dev/null || echo "No build output available")

ERROR CATEGORIES DETECTED:
-------------------------
TypeScript Errors: $(grep -c "TS[0-9]+" "$ERROR_LOG" 2>/dev/null || echo "0")
Module Errors: $(grep -c "Cannot find module\|Module not found" "$ERROR_LOG" 2>/dev/null || echo "0")
Import Errors: $(grep -c "Failed to resolve\|Cannot resolve" "$ERROR_LOG" 2>/dev/null || echo "0")
Syntax Errors: $(grep -c "SyntaxError\|Unexpected token" "$ERROR_LOG" 2>/dev/null || echo "0")
EOF
    
    # Copy full build output
    cp "$BUILD_OUTPUT" "$BUILD_LOG" 2>/dev/null || touch "$BUILD_LOG"
    
    # Create BMAD agent prompt for deployment fixes
    cat << EOF > .vercel-fix-prompt.txt
/BMad:agents:dev

**EMERGENCY DEPLOYMENT RECOVERY - HOLISTIC FIX REQUIRED**

Critical Vercel deployment failure detected. You must fix ALL errors comprehensively.

**ERROR LOG FILES PROVIDED:**
1. Error Report: $ERROR_REPORT (parsed errors and summary)
2. Full Build Log: $BUILD_LOG (complete build output)
3. Error Log: $ERROR_LOG (categorized errors)

**HOLISTIC FIX INSTRUCTIONS:**
1. **READ ALL ERROR FILES FIRST** - Use Read tool to examine:
   - $ERROR_REPORT for error summary
   - $BUILD_LOG for full context
   - $ERROR_LOG for specific issues

2. **ANALYZE COMPREHENSIVELY**:
   - Identify root causes, not just symptoms
   - Look for cascading errors (one error causing others)
   - Check for configuration issues
   - Verify all imports and exports
   - Ensure type definitions are complete

3. **FIX SYSTEMATICALLY**:
   - Start with the most fundamental errors first
   - Fix TypeScript compilation errors
   - Resolve all module and import issues
   - Install any missing dependencies
   - Update type definitions as needed
   - Fix syntax and formatting errors
   - Ensure consistent code patterns

4. **VERIFY THOROUGHLY**:
   - After EACH fix category, run: npm run build
   - Check that fixed errors don't introduce new ones
   - Ensure all related files are updated
   - Validate the entire build pipeline

**PROJECT CONTEXT:**
- Location: $PROJECT_ROOT
- Build Directory: $(if [[ -d "$WEB_APP_DIR" ]]; then echo "$WEB_APP_DIR"; else echo "$PROJECT_ROOT"; fi)
- This is likely a Next.js/TypeScript project with Vercel deployment

**CRITICAL REQUIREMENTS:**
- Fix ALL errors, not just the first few
- Consider the holistic impact of changes
- Maintain existing functionality
- Follow project conventions
- Do NOT create new files unless absolutely necessary
- Ensure the deployment will succeed on Vercel

**SUCCESS METRICS:**
✓ npm run build completes with zero errors
✓ npm run type-check passes (if available)
✓ All imports resolve correctly
✓ No TypeScript compilation errors
✓ Vercel deployment validation passes

Begin comprehensive deployment recovery NOW. Read the error files first!
EOF
    
    # Run Claude Code with BMAD agent
    log_info "BMAD Development Agent activated for holistic deployment fixes..."
    log_info "Error files provided: $ERROR_REPORT, $BUILD_LOG"
    claude code < .vercel-fix-prompt.txt || true
    
    # Clean up
    rm -f .vercel-fix-prompt.txt
}

# Validate fixes
validate_fixes() {
    log_info "Validating applied fixes..."
    cd "$BUILD_DIR"
    
    # Run type check
    if npm run type-check 2>/dev/null || npx tsc --noEmit 2>/dev/null; then
        log_success "TypeScript validation passed"
    else
        log_warning "Some TypeScript issues remain"
    fi
    
    # Run build
    if npm run build > /dev/null 2>&1; then
        log_success "Build validation passed"
        return 0
    else
        log_error "Build still failing"
        return 1
    fi
}

# Main deployment validation flow
main() {
    log_info "Starting Vercel pre-deployment validation..."
    
    # Initialize
    init_logs
    check_prerequisites
    detect_project_structure
    
    # Attempt to build and fix errors
    attempt=1
    while [[ $attempt -le $MAX_FIX_ATTEMPTS ]]; do
        log_info "Build attempt $attempt of $MAX_FIX_ATTEMPTS"
        
        if run_vercel_build; then
            log_success "Build successful! Ready for deployment"
            break
        else
            parse_build_errors
            
            if [[ $attempt -lt $MAX_FIX_ATTEMPTS ]]; then
                log_warning "Build failed, attempting automatic fixes..."
                fix_typescript_errors
                fix_module_errors
                apply_claude_fixes
                
                if validate_fixes; then
                    log_success "Fixes applied successfully"
                else
                    log_warning "Some issues remain, retrying..."
                fi
            else
                log_error "Maximum fix attempts reached"
                log_error "Manual intervention required"
                echo ""
                echo "Build errors saved to: $ERROR_LOG"
                echo "View full output: $BUILD_OUTPUT"
                exit 1
            fi
        fi
        
        ((attempt++))
    done
    
    # Final validation
    log_info "Running final Vercel deployment check..."
    cd "$BUILD_DIR"
    
    if vercel --prod --no-deploy > /dev/null 2>&1; then
        log_success "Vercel deployment validation passed!"
        echo ""
        echo -e "${GREEN}✅ DEPLOYMENT READY${NC}"
        echo "All checks passed. You can now safely commit and push."
        
        # Clean up logs on success
        rm -f "$ERROR_LOG" "$FIX_LOG" "$BUILD_OUTPUT"
        return 0
    else
        log_error "Final validation failed"
        return 1
    fi
}

# Handle arguments
case "$1" in
    "--help"|"-h")
        echo "Vercel Pre-Deployment Validation Script"
        echo ""
        echo "Usage: $0 [options]"
        echo ""
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --verbose, -v  Show detailed output"
        echo "  --skip-fixes   Only validate, don't attempt fixes"
        echo ""
        echo "This script validates your code against Vercel's build"
        echo "requirements BEFORE committing to GitHub, preventing"
        echo "deployment failures and saving development time."
        exit 0
        ;;
    "--verbose"|"-v")
        set -x
        ;;
    "--skip-fixes")
        MAX_FIX_ATTEMPTS=1
        ;;
esac

# Run main validation
main