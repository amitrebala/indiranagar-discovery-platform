#!/bin/bash

# Vercel Auto-Fix Script
# Monitors Vercel deployments and automatically attempts to fix failures using Claude Code

set -euo pipefail

# Configuration
PROJECT_ID="${1:-}"
TEAM_ID="${2:-}"
MAX_FIX_ATTEMPTS="${MAX_FIX_ATTEMPTS:-10}"
BMAD_ENABLED="${BMAD_ENABLED:-1}"
STORY_DIR="${STORY_DIR:-.bmad-stories}"
CLAUDE_CODE_PATH="${CLAUDE_CODE_PATH:-claude-code}"
VERCEL_TOKEN="${VERCEL_TOKEN:-}"
DEBUG="${DEBUG:-0}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" >&2
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1" >&2
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" >&2
}

debug_log() {
    if [[ "$DEBUG" == "1" ]]; then
        echo -e "[DEBUG] $1" >&2
    fi
}

# Validate prerequisites
validate_prerequisites() {
    log_info "Validating prerequisites..."
    
    if [[ -z "$VERCEL_TOKEN" ]]; then
        log_error "VERCEL_TOKEN environment variable is required"
        exit 1
    fi
    
    if [[ -z "$PROJECT_ID" ]]; then
        log_error "Project ID is required as first argument"
        echo "Usage: $0 <project-id> [team-id]"
        exit 1
    fi
    
    if ! command -v curl &> /dev/null; then
        log_error "curl is required but not installed"
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        log_error "jq is required but not installed"
        echo "Install with: brew install jq"
        exit 1
    fi
    
    if ! command -v "$CLAUDE_CODE_PATH" &> /dev/null; then
        log_error "Claude Code not found at: $CLAUDE_CODE_PATH"
        echo "Install Claude Code or set CLAUDE_CODE_PATH environment variable"
        exit 1
    fi
    
    log_success "Prerequisites validated"
}

# Get latest deployment
get_latest_deployment() {
    local url="https://api.vercel.com/v6/deployments"
    local params="projectId=$PROJECT_ID&limit=1"
    
    if [[ -n "$TEAM_ID" ]]; then
        params="$params&teamId=$TEAM_ID"
    fi
    
    debug_log "Fetching latest deployment: $url?$params"
    
    curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
         "$url?$params" | jq -r '.deployments[0]'
}

# Get deployment logs
get_deployment_logs() {
    local deployment_id="$1"
    local url="https://api.vercel.com/v2/deployments/$deployment_id/events"
    
    debug_log "Fetching deployment logs: $url"
    
    curl -s -H "Authorization: Bearer $VERCEL_TOKEN" "$url"
}

# Extract error information from logs
extract_error_info() {
    local logs="$1"
    local error_summary=""
    local build_errors=""
    local type_errors=""
    
    # Extract build failures
    build_errors=$(echo "$logs" | jq -r '.[] | select(.type == "stderr" and (.text | contains("error") or contains("Error") or contains("failed"))) | .text' 2>/dev/null | head -20)
    
    # Extract TypeScript errors
    type_errors=$(echo "$logs" | jq -r '.[] | select(.type == "stderr" and (.text | contains("TS") or contains("Type"))) | .text' 2>/dev/null | head -10)
    
    # Create comprehensive error summary
    if [[ -n "$build_errors" ]]; then
        error_summary="BUILD ERRORS:\n$build_errors\n\n"
    fi
    
    if [[ -n "$type_errors" ]]; then
        error_summary="${error_summary}TYPE ERRORS:\n$type_errors\n\n"
    fi
    
    echo -e "$error_summary"
}

# Create BMAD development story for deployment fix
create_bmad_story() {
    local error_info="$1"
    local deployment_id="$2"
    local attempt_num="$3"
    local story_file="$STORY_DIR/deployment-fix-${deployment_id}-attempt-${attempt_num}.md"
    
    mkdir -p "$STORY_DIR"
    
    cat > "$story_file" << EOF
# Deployment Fix Development Story

## Context
**Epic**: Emergency Deployment Recovery  
**Story ID**: deployment-fix-${deployment_id}-${attempt_num}  
**Priority**: CRITICAL  
**Agent Role**: Developer  
**Deployment ID**: $deployment_id  
**Project ID**: $PROJECT_ID  
**Attempt**: $attempt_num of $MAX_FIX_ATTEMPTS  

## Problem Statement
Vercel deployment failed and requires immediate code fixes to restore service.

## Error Analysis
\`\`\`
$error_info
\`\`\`

## Development Story

### Background
This is an automated deployment recovery process using the BMAD-METHOD framework. The system has detected deployment failures and is systematically working to resolve them through iterative development cycles.

### Requirements
1. **CRITICAL**: Fix all deployment-blocking errors
2. **CRITICAL**: Ensure TypeScript compilation passes
3. **CRITICAL**: Resolve all build configuration issues
4. **HIGH**: Fix missing dependencies and imports
5. **HIGH**: Correct syntax and linting errors
6. **MEDIUM**: Optimize for successful Vercel deployment

### Technical Context
- **Framework**: Next.js/React application
- **Language**: TypeScript
- **Platform**: Vercel deployment
- **Build System**: Next.js build pipeline
- **Package Manager**: npm

### Implementation Approach
1. **Analyze** the specific error patterns from deployment logs
2. **Diagnose** root causes (types, imports, config, dependencies)
3. **Fix** issues systematically starting with blocking errors
4. **Validate** fixes with local builds and type checking
5. **Test** that changes don't introduce new issues
6. **Prepare** for deployment verification

### Acceptance Criteria
- [ ] All TypeScript errors resolved
- [ ] All build errors fixed
- [ ] All import/export issues corrected
- [ ] Missing dependencies added to package.json
- [ ] Linting passes without errors
- [ ] Type checking passes
- [ ] Local build completes successfully
- [ ] No new errors introduced

### Development Instructions
**CRITICAL WORKFLOW**: This is an emergency fix. Focus on minimal, targeted changes that directly address the deployment errors. Do not refactor or optimize unless directly related to the failure.

**Error Priority Order**:
1. Fatal TypeScript compilation errors
2. Missing module/dependency errors  
3. Build configuration issues
4. Import/export statement problems
5. Syntax and parsing errors
6. Linting and code quality issues

**After Each Fix**:
1. Run \`npm run lint\` (if available)
2. Run \`npm run type-check\` or \`tsc --noEmit\` (if available)
3. Run \`npm run build\` to verify build success
4. Commit changes with descriptive message

**Commit Message Format**:
\`\`\`
fix: resolve deployment error - [brief description]

Deployment ID: $deployment_id
Attempt: $attempt_num
Error type: [TypeScript|Build|Dependencies|Import|Syntax]

🤖 Generated with Claude Code (BMAD-METHOD)
Co-Authored-By: Claude <noreply@anthropic.com>
\`\`\`

EOF
    
    echo "$story_file"
}

# Create enhanced BMAD prompt for Claude Code
create_bmad_fix_prompt() {
    local story_file="$1"
    local error_info="$2"
    local deployment_id="$3"
    local attempt_num="$4"
    
    cat << EOF
I need you to act as a BMAD-METHOD development agent to fix critical Vercel deployment failures.

**AGENT ACTIVATION**: /BMad:agents:developer

You are now operating as a Developer agent in emergency deployment recovery mode.

**CRITICAL MISSION**: Read and execute the development story at: $story_file

This story contains:
- Complete context and error analysis
- Detailed technical requirements
- Step-by-step implementation approach
- Acceptance criteria for success

**DEPLOYMENT CONTEXT**:
- Deployment ID: $deployment_id
- Attempt: $attempt_num of $MAX_FIX_ATTEMPTS
- Status: FAILED - requires immediate fixing

**CRITICAL INSTRUCTIONS**:
1. Read the story file thoroughly
2. Follow the BMAD development workflow exactly
3. Make minimal, targeted fixes only
4. Test each fix before proceeding
5. Commit changes with proper attribution
6. Focus on deployment-blocking errors first

**ERROR SUMMARY**:
$error_info

**EXECUTION PRIORITY**:
- Fix fatal compilation errors immediately
- Resolve missing dependencies
- Correct import/export issues
- Address configuration problems
- Ensure clean build completion

**SUCCESS CRITERIA**: The build must complete successfully and be ready for deployment.

Proceed with emergency deployment recovery using the BMAD methodology.
EOF
}

# BMAD-enhanced attempt to fix issues using Claude Code
attempt_bmad_fix() {
    local error_info="$1"
    local deployment_id="$2"
    local attempt_num="$3"
    
    log_info "🔧 BMAD Fix Attempt #$attempt_num for deployment $deployment_id"
    
    # Create BMAD development story
    local story_file=$(create_bmad_story "$error_info" "$deployment_id" "$attempt_num")
    log_info "📖 BMAD story created: $story_file"
    
    # Create enhanced BMAD prompt
    local prompt=$(create_bmad_fix_prompt "$story_file" "$error_info" "$deployment_id" "$attempt_num")
    local temp_prompt_file=$(mktemp)
    
    echo "$prompt" > "$temp_prompt_file"
    
    debug_log "BMAD prompt saved to: $temp_prompt_file"
    debug_log "Story file: $story_file"
    debug_log "Running: $CLAUDE_CODE_PATH < $temp_prompt_file"
    
    # Run Claude Code with extended timeout for BMAD process
    if timeout 600 "$CLAUDE_CODE_PATH" < "$temp_prompt_file"; then
        log_success "✅ BMAD development agent completed successfully"
        
        # Verify the fix was applied
        if verify_fix_applied; then
            log_success "✅ Fix verification passed"
            rm -f "$temp_prompt_file"
            return 0
        else
            log_warn "⚠️ Fix may not have been fully applied"
            rm -f "$temp_prompt_file"
            return 1
        fi
    else
        log_error "❌ BMAD development agent failed or timed out"
        rm -f "$temp_prompt_file"
        return 1
    fi
}

# Verify that fixes were actually applied
verify_fix_applied() {
    log_info "🔍 Verifying fixes were applied..."
    
    # Check if there are uncommitted changes (indicating fixes were made)
    if git diff --quiet && git diff --staged --quiet; then
        log_warn "No changes detected - fixes may not have been applied"
        return 1
    fi
    
    # Try to run build/lint commands if available
    if [[ -f "package.json" ]]; then
        # Check if in apps/web directory
        local build_dir="."
        if [[ -f "apps/web/package.json" ]]; then
            build_dir="apps/web"
        fi
        
        pushd "$build_dir" > /dev/null
        
        # Run type check if available
        if jq -e '.scripts["type-check"]' package.json > /dev/null 2>&1; then
            log_info "Running type check..."
            if npm run type-check; then
                log_success "✅ Type check passed"
            else
                log_warn "⚠️ Type check failed - may need more fixes"
                popd > /dev/null
                return 1
            fi
        fi
        
        # Run lint if available
        if jq -e '.scripts.lint' package.json > /dev/null 2>&1; then
            log_info "Running lint check..."
            if npm run lint; then
                log_success "✅ Lint check passed"
            else
                log_warn "⚠️ Lint check failed - may need more fixes"
                popd > /dev/null
                return 1
            fi
        fi
        
        popd > /dev/null
    fi
    
    return 0
}

# Enhanced deployment trigger with BMAD methodology
trigger_deployment() {
    local attempt_num="${1:-1}"
    local deployment_id="${2:-unknown}"
    
    log_info "🚀 Triggering new deployment (attempt $attempt_num)..."
    
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_warn "Not in a git repository, cannot trigger deployment automatically"
        return 1
    fi
    
    local current_branch=$(git rev-parse --abbrev-ref HEAD)
    log_info "📤 Pushing to trigger deployment on branch: $current_branch"
    
    # Check if there are changes to commit
    if git diff --quiet && git diff --staged --quiet; then
        log_warn "No changes to commit - creating trigger commit"
        echo "# BMAD Auto-fix deployment trigger $(date)" >> .vercel-trigger
        git add .vercel-trigger
    fi
    
    # Stage all changes if any exist
    git add -A
    
    # Create comprehensive commit message
    local commit_msg=$(cat << EOF
fix: automated deployment recovery attempt $attempt_num

Deployment ID: $deployment_id
BMAD Method: Emergency deployment recovery
Attempt: $attempt_num of $MAX_FIX_ATTEMPTS
Timestamp: $(date -u)

This commit contains automated fixes generated by the BMAD
development agent to resolve Vercel deployment failures.

🤖 Generated with Claude Code (BMAD-METHOD)
Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)
    
    if git commit -m "$commit_msg"; then
        log_success "✅ Changes committed successfully"
    else
        log_info "ℹ️ No new changes to commit"
    fi
    
    # Push changes
    if git push origin "$current_branch"; then
        log_success "✅ Changes pushed to $current_branch"
        return 0
    else
        log_error "❌ Git push failed"
        return 1
    fi
}

# Enhanced deployment monitoring with detailed status tracking
wait_for_deployment() {
    local previous_deployment_id="${1:-}"
    local attempt_num="${2:-1}"
    local max_wait=600 # 10 minutes for complex builds
    local wait_time=0
    local check_interval=15
    
    log_info "⏳ Monitoring deployment progress (attempt $attempt_num)..."
    
    while [[ $wait_time -lt $max_wait ]]; do
        local deployment=$(get_latest_deployment)
        local state=$(echo "$deployment" | jq -r '.state // "QUEUED"')
        local deployment_id=$(echo "$deployment" | jq -r '.uid // ""')
        local created_at=$(echo "$deployment" | jq -r '.createdAt // ""')
        
        debug_log "Deployment $deployment_id state: $state (created: $created_at)"
        
        # Skip if this is the same failed deployment we're trying to fix
        if [[ "$deployment_id" == "$previous_deployment_id" ]]; then
            debug_log "Still monitoring old deployment, waiting for new one..."
        else
            case "$state" in
                "READY")
                    log_success "🎉 Deployment completed successfully!"
                    log_info "✅ New deployment ID: $deployment_id"
                    return 0
                    ;;
                "ERROR"|"CANCELED")
                    log_error "❌ New deployment failed with state: $state"
                    log_info "💥 Failed deployment ID: $deployment_id"
                    
                    # Get new error information for next iteration
                    local new_logs=$(get_deployment_logs "$deployment_id")
                    local new_error_info=$(extract_error_info "$new_logs")
                    
                    if [[ -n "$new_error_info" ]]; then
                        log_info "📋 New errors detected for next iteration:"
                        echo "$new_error_info" | head -10
                        
                        # Store new error info for next attempt
                        echo "$new_error_info" > "/tmp/latest-deployment-errors-$deployment_id.txt"
                    fi
                    
                    return 1
                    ;;
                "BUILDING"|"QUEUED"|"INITIALIZING")
                    log_info "🔄 Deployment in progress... ($state)"
                    ;;
                *)
                    debug_log "Unknown deployment state: $state"
                    ;;
            esac
        fi
        
        sleep $check_interval
        wait_time=$((wait_time + check_interval))
        
        # Show progress
        local progress=$((wait_time * 100 / max_wait))
        debug_log "Progress: ${progress}% (${wait_time}/${max_wait}s)"
    done
    
    log_warn "⏰ Deployment monitoring timed out after $max_wait seconds"
    return 1
}

# Cleanup function
cleanup() {
    debug_log "Cleaning up temporary files..."
    rm -f .vercel-trigger
}

# Main execution
main() {
    trap cleanup EXIT
    
    log_info "Starting Vercel Auto-Fix for project: $PROJECT_ID"
    
    validate_prerequisites
    
    local deployment=$(get_latest_deployment)
    local deployment_id=$(echo "$deployment" | jq -r '.uid // ""')
    local state=$(echo "$deployment" | jq -r '.state // "UNKNOWN"')
    
    if [[ -z "$deployment_id" || "$deployment_id" == "null" ]]; then
        log_error "Could not fetch deployment information"
        exit 1
    fi
    
    log_info "Latest deployment: $deployment_id (state: $state)"
    
    if [[ "$state" != "ERROR" ]]; then
        log_info "Latest deployment is not in ERROR state ($state), nothing to fix"
        exit 0
    fi
    
    log_warn "Deployment is in ERROR state, attempting to fix..."
    
    # Get deployment logs and extract error information
    local logs=$(get_deployment_logs "$deployment_id")
    local error_info=$(extract_error_info "$logs")
    
    if [[ -z "$error_info" ]]; then
        log_warn "Could not extract error information from deployment logs"
        log_info "Deployment may have failed due to infrastructure issues"
        exit 1
    fi
    
    debug_log "Error information extracted:\n$error_info"
    
    # BMAD Iterative Fix-Deploy-Verify Cycle
    local attempt=1
    local current_deployment_id="$deployment_id"
    local current_error_info="$error_info"
    
    log_info "🔄 Starting BMAD iterative fix-deploy-verify cycle"
    log_info "🎯 Target: Successful deployment through systematic error resolution"
    
    while [[ $attempt -le $MAX_FIX_ATTEMPTS ]]; do
        log_info "\n" 
        log_info "🔧 === BMAD Fix Cycle $attempt of $MAX_FIX_ATTEMPTS ==="
        log_info "📍 Current deployment: $current_deployment_id"
        log_info "📋 Error count: $(echo "$current_error_info" | wc -l | xargs)"
        
        # Step 1: Apply BMAD fixes
        if attempt_bmad_fix "$current_error_info" "$current_deployment_id" "$attempt"; then
            log_success "✅ BMAD fix cycle $attempt completed"
            
            # Step 2: Trigger new deployment
            if trigger_deployment "$attempt" "$current_deployment_id"; then
                log_success "✅ New deployment triggered"
                
                # Step 3: Wait for deployment and verify
                if wait_for_deployment "$current_deployment_id" "$attempt"; then
                    log_success "\n🎉 === BMAD AUTO-FIX SUCCESSFUL ==="
                    log_success "✅ Deployment completed successfully after $attempt attempts"
                    log_success "🚀 System is now operational"
                    
                    # Clean up story files on success
                    if [[ -d "$STORY_DIR" ]]; then
                        log_info "🧹 Cleaning up BMAD story files"
                        rm -rf "$STORY_DIR"
                    fi
                    
                    exit 0
                else
                    log_warn "❌ Deployment $attempt failed - analyzing new errors"
                    
                    # Get the latest failed deployment info for next iteration
                    local latest_deployment=$(get_latest_deployment)
                    local new_deployment_id=$(echo "$latest_deployment" | jq -r '.uid // ""')
                    
                    if [[ "$new_deployment_id" != "$current_deployment_id" ]]; then
                        log_info "🔍 Analyzing new deployment failure: $new_deployment_id"
                        
                        # Check if we have cached error info
                        if [[ -f "/tmp/latest-deployment-errors-$new_deployment_id.txt" ]]; then
                            current_error_info=$(cat "/tmp/latest-deployment-errors-$new_deployment_id.txt")
                            log_info "📋 Using cached error analysis"
                        else
                            # Fetch new error information
                            local new_logs=$(get_deployment_logs "$new_deployment_id")
                            current_error_info=$(extract_error_info "$new_logs")
                        fi
                        
                        current_deployment_id="$new_deployment_id"
                        
                        if [[ -z "$current_error_info" ]]; then
                            log_warn "⚠️ Could not extract new error information"
                            log_info "📊 This may indicate infrastructure issues or the same errors persist"
                        else
                            log_info "📊 New error patterns detected for iteration $((attempt + 1))"
                        fi
                    else
                        log_warn "⚠️ Same deployment ID - may be infrastructure issue"
                    fi
                fi
            else
                log_error "❌ Could not trigger new deployment for attempt $attempt"
            fi
        else
            log_error "❌ BMAD fix attempt $attempt failed"
        fi
        
        attempt=$((attempt + 1))
        
        if [[ $attempt -le $MAX_FIX_ATTEMPTS ]]; then
            log_info "⏸️ Cooling down for 45 seconds before next iteration..."
            sleep 45
        fi
    done
    
    log_error "\n💥 === BMAD AUTO-FIX EXHAUSTED ==="
    log_error "❌ All $MAX_FIX_ATTEMPTS fix attempts have been exhausted"
    log_error "🔧 Manual intervention is now required"
    
    # Provide detailed failure summary
    log_info "\n📊 === FAILURE SUMMARY ==="
    log_info "🎯 Original deployment: $deployment_id"
    log_info "🔄 Fix attempts made: $MAX_FIX_ATTEMPTS"
    log_info "📁 BMAD stories created in: $STORY_DIR"
    
    if [[ -d "$STORY_DIR" ]]; then
        local story_count=$(find "$STORY_DIR" -name "*.md" | wc -l | xargs)
        log_info "📖 Development stories available: $story_count"
        log_info "💡 Review stories for manual intervention guidance"
    fi
    
    log_info "\n🛠️ === NEXT STEPS ==="
    log_info "1. Review the BMAD development stories in $STORY_DIR"
    log_info "2. Check the latest deployment logs manually"
    log_info "3. Consider infrastructure or configuration issues"
    log_info "4. Apply manual fixes based on story recommendations"
    log_info "5. Re-run this script after manual intervention"
    
    exit 1
}

# Show usage if no arguments
if [[ $# -eq 0 ]]; then
    echo "Vercel Auto-Fix Script"
    echo "Usage: $0 <project-id> [team-id]"
    echo ""
    echo "Environment variables:"
    echo "  VERCEL_TOKEN         - Required: Vercel API token"
    echo "  MAX_FIX_ATTEMPTS     - Optional: Max fix attempts (default: 3)"
    echo "  CLAUDE_CODE_PATH     - Optional: Path to Claude Code binary"
    echo "  DEBUG                - Optional: Enable debug logging (0|1)"
    echo ""
    exit 1
fi

# Run main function
main "$@"