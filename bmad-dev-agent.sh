#!/bin/bash

# BMAD Development Agent Integration Script
# Provides specialized BMAD methodology integration for automated development tasks

set -euo pipefail

# Configuration
BMAD_AGENT_MODE="${BMAD_AGENT_MODE:-developer}"
CLAUDE_CODE_PATH="${CLAUDE_CODE_PATH:-claude-code}"
STORY_DIR="${STORY_DIR:-.bmad-stories}"
DEBUG="${DEBUG:-0}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# Logging functions with BMAD styling
log_info() {
    echo -e "${BLUE}[BMAD-INFO]${NC} $1" >&2
}

log_warn() {
    echo -e "${YELLOW}[BMAD-WARN]${NC} $1" >&2
}

log_error() {
    echo -e "${RED}[BMAD-ERROR]${NC} $1" >&2
}

log_success() {
    echo -e "${GREEN}[BMAD-SUCCESS]${NC} $1" >&2
}

log_agent() {
    echo -e "${PURPLE}[BMAD-AGENT]${NC} $1" >&2
}

log_story() {
    echo -e "${CYAN}[BMAD-STORY]${NC} $1" >&2
}

debug_log() {
    if [[ "$DEBUG" == "1" ]]; then
        echo -e "[BMAD-DEBUG] $1" >&2
    fi
}

# BMAD Agent Activation Header
print_bmad_header() {
    local agent_type="$1"
    cat << EOF

${BOLD}${PURPLE}
╔══════════════════════════════════════════════════════════════╗
║                    BMAD-METHOD ACTIVATION                    ║
║                                                              ║
║  Agent: ${agent_type^^}                                     ║
║  Mode: Emergency Deployment Recovery                         ║
║  Framework: Story-Driven Development                        ║
║  Context: Iterative Fix-Deploy-Verify Cycle                ║
╚══════════════════════════════════════════════════════════════╝
${NC}

EOF
}

# Create comprehensive BMAD development story
create_deployment_recovery_story() {
    local error_info="$1"
    local deployment_id="$2"
    local attempt_num="$3"
    local previous_attempts="${4:-}"
    
    local story_file="$STORY_DIR/deployment-recovery-${deployment_id}-attempt-${attempt_num}.md"
    mkdir -p "$STORY_DIR"
    
    log_story "📖 Creating comprehensive BMAD development story"
    
    cat > "$story_file" << EOF
# Emergency Deployment Recovery - Development Story

## Epic Context
**Epic Name**: Critical Infrastructure Recovery  
**Story ID**: deployment-recovery-${deployment_id}  
**Attempt**: $attempt_num  
**Priority**: CRITICAL  
**Agent Role**: Developer  
**Framework**: BMAD-METHOD  

## Mission Brief
The Vercel deployment pipeline has failed and requires immediate systematic recovery through the BMAD development methodology. This story provides complete context, technical analysis, and step-by-step recovery procedures.

## Deployment Context
- **Deployment ID**: \`$deployment_id\`
- **Failure State**: ERROR
- **Recovery Attempt**: $attempt_num
- **Previous Attempts**: ${previous_attempts:-"None"}
- **Platform**: Vercel
- **Framework**: Next.js/React/TypeScript

## Error Analysis & Technical Context

### Deployment Failure Log
\`\`\`
$error_info
\`\`\`

### Error Classification
Based on the deployment logs, identify and prioritize these error categories:

1. **🔴 CRITICAL - Build Breaking**
   - TypeScript compilation errors
   - Missing critical dependencies
   - Fatal configuration issues

2. **🟡 HIGH - Build Impacting** 
   - Import/export resolution failures
   - Module not found errors
   - Linting failures that block build

3. **🟢 MEDIUM - Quality Issues**
   - Type warnings
   - Unused imports
   - Code style violations

## BMAD Development Workflow

### Phase 1: Analysis & Planning (5 minutes max)
1. **Read and analyze** the complete error log above
2. **Identify root causes** - What specifically is breaking the build?
3. **Prioritize fixes** - Critical errors first, then high, then medium
4. **Plan minimal intervention** - Fix only what's necessary for deployment

### Phase 2: Implementation (Core Development)
Follow this systematic approach:

#### Step 2.1: Environment Setup
\`\`\`bash
# Ensure we're in the correct directory
pwd
ls -la

# Check if this is the main project or apps/web
if [[ -f "apps/web/package.json" ]]; then
    echo "Multi-package repository detected"
    cd apps/web
fi
\`\`\`

#### Step 2.2: Critical Error Resolution
**Priority Order for Fixes:**

1. **TypeScript Compilation Errors**
   - Fix type mismatches
   - Add missing type definitions
   - Resolve import type issues
   
2. **Missing Dependencies**
   - Check package.json for missing packages
   - Install required dependencies: \`npm install [package]\`
   - Update import statements if needed

3. **Module Resolution Issues**
   - Fix relative/absolute import paths
   - Ensure exported modules match imports
   - Check for case sensitivity issues

4. **Configuration Problems**
   - Verify next.config.js/ts settings
   - Check tsconfig.json configuration
   - Validate environment variables

#### Step 2.3: Verification Process
After each fix category, run verification:

\`\`\`bash
# Type checking
npm run type-check 2>&1 || tsc --noEmit 2>&1

# Linting (if critical for build)
npm run lint 2>&1

# Build test (CRITICAL - must pass)
npm run build 2>&1
\`\`\`

### Phase 3: Quality Assurance & Commit

#### Pre-commit Checklist
- [ ] All TypeScript errors resolved
- [ ] All import/export issues fixed  
- [ ] Missing dependencies added
- [ ] Build completes successfully
- [ ] No new critical errors introduced

#### Commit Process
Use this exact commit message format:

\`\`\`
fix: emergency deployment recovery attempt $attempt_num

Deployment-ID: $deployment_id
BMAD-Method: Systematic error resolution
Error-Categories: [list main categories fixed]
Build-Status: VERIFIED

Automated fixes applied through BMAD development agent:
- [specific fix 1]
- [specific fix 2]  
- [specific fix 3]

🤖 Generated with Claude Code (BMAD-METHOD)
Co-Authored-By: Claude <noreply@anthropic.com>
\`\`\`

## Implementation Strategy

### Minimal Intervention Principle
- **ONLY fix deployment-blocking errors**
- **DO NOT refactor or optimize** unless directly related to the failure
- **DO NOT add new features** or make unnecessary changes
- **Focus on surgical precision** - minimal code changes for maximum impact

### Error-Specific Approaches

#### TypeScript Errors
- Use \`any\` type as emergency fallback if complex typing takes too long
- Add missing imports before attempting complex type fixes
- Check for missing \`@types/\` packages

#### Build Configuration
- Verify Next.js version compatibility
- Check for conflicting or missing configuration
- Ensure environment variables are properly defined

#### Dependency Issues
- Use \`npm ls\` to check for missing peer dependencies
- Install exact versions if version conflicts exist
- Check for deprecated packages that need updating

### Success Criteria
- [ ] **CRITICAL**: \`npm run build\` completes without errors
- [ ] **CRITICAL**: No TypeScript compilation errors remain
- [ ] **HIGH**: All imports resolve correctly
- [ ] **HIGH**: No missing dependency errors
- [ ] **MEDIUM**: Linting passes (if required for build)

## Recovery Verification

After implementing fixes, verify the recovery:

1. **Local Build Success**: \`npm run build\` must complete
2. **Type Safety**: \`tsc --noEmit\` must pass
3. **Import Resolution**: No module resolution errors
4. **Dependency Integrity**: \`npm ls\` shows no missing packages

## Deployment Readiness Checklist

Before triggering deployment:
- [ ] All critical errors resolved
- [ ] Build process completes successfully
- [ ] Git working directory is clean (all changes committed)
- [ ] Commit message follows BMAD standards
- [ ] No new errors introduced during fix process

## Context for Next Iteration

If this attempt fails, the next iteration should:
1. Analyze NEW error patterns from the failed deployment
2. Build upon fixes already applied in this attempt
3. Focus on any remaining or newly introduced issues
4. Consider more aggressive fixes if conservative approach fails

## Emergency Escalation

If systematic fixes fail after multiple attempts:
1. **Infrastructure Issues**: Check Vercel status and build environment
2. **Dependency Conflicts**: Consider npm cache clearing or package-lock reset
3. **Configuration Problems**: Verify all environment variables and configs
4. **Breaking Changes**: Check if recent commits introduced incompatible changes

---

**BMAD Agent Instructions**: Follow this story exactly. This is an emergency deployment recovery mission. Focus on speed and precision. Every minute the deployment is broken affects system availability.

EOF

    echo "$story_file"
}

# Create BMAD agent activation prompt
create_bmad_agent_prompt() {
    local story_file="$1"
    local agent_mode="$2"
    local deployment_id="$3" 
    local attempt_num="$4"
    
    cat << EOF
🚨 **BMAD EMERGENCY ACTIVATION** 🚨

You are being activated as a BMAD-METHOD Development Agent for critical deployment recovery.

**AGENT ACTIVATION COMMAND**: /BMad:agents:${agent_mode}

**CRITICAL MISSION PARAMETERS**:
- **Status**: DEPLOYMENT FAILURE - IMMEDIATE ACTION REQUIRED
- **Deployment ID**: $deployment_id
- **Recovery Attempt**: $attempt_num
- **Agent Role**: ${agent_mode^^}
- **Framework**: BMAD-METHOD Story-Driven Development

**MISSION BRIEFING**:
A Vercel deployment has failed and requires systematic recovery. You must follow the BMAD methodology exactly as defined in the development story.

**PRIMARY DIRECTIVE**: 
Read and execute the comprehensive development story located at:
📖 **Story File**: $story_file

This story contains:
- ✅ Complete technical context and error analysis
- ✅ Systematic recovery procedures  
- ✅ Step-by-step implementation workflow
- ✅ Quality assurance checkpoints
- ✅ Success criteria and verification steps

**CRITICAL EXECUTION REQUIREMENTS**:

1. **📖 READ THE STORY COMPLETELY** - The story file contains all context and procedures
2. **🎯 FOLLOW BMAD METHODOLOGY** - Use systematic story-driven development
3. **⚡ EMERGENCY MODE** - Focus on speed and precision
4. **🔧 MINIMAL INTERVENTION** - Fix only deployment-blocking errors
5. **✅ VERIFY EACH STEP** - Run verification commands as specified
6. **📝 COMMIT PROPERLY** - Use the exact commit format provided

**WORKFLOW EXECUTION**:
- Phase 1: Analysis & Planning (5 min max)
- Phase 2: Implementation (systematic error resolution)  
- Phase 3: Quality Assurance & Commit

**SUCCESS METRICS**:
- ✅ \`npm run build\` completes successfully
- ✅ All TypeScript errors resolved
- ✅ All import/export issues fixed
- ✅ No new critical errors introduced

**FAILURE ESCALATION**:
If you cannot resolve the issues, document exactly what was attempted and what barriers were encountered for the next iteration.

**REMEMBER**: This is an emergency deployment recovery. Every minute counts. Execute the story with precision and speed.

🚀 **BEGIN BMAD DEVELOPMENT AGENT EXECUTION NOW**

EOF
}

# Execute BMAD development agent
execute_bmad_agent() {
    local error_info="$1"
    local deployment_id="$2" 
    local attempt_num="$3"
    local previous_attempts="${4:-}"
    
    print_bmad_header "$BMAD_AGENT_MODE"
    
    log_agent "🤖 Initializing BMAD Development Agent"
    log_agent "🎯 Mission: Emergency Deployment Recovery"
    log_agent "📊 Attempt: $attempt_num"
    
    # Create comprehensive development story
    local story_file=$(create_deployment_recovery_story "$error_info" "$deployment_id" "$attempt_num" "$previous_attempts")
    log_success "📖 Development story created: $story_file"
    
    # Create BMAD agent prompt
    local bmad_prompt=$(create_bmad_agent_prompt "$story_file" "$BMAD_AGENT_MODE" "$deployment_id" "$attempt_num")
    local temp_prompt_file=$(mktemp)
    
    echo "$bmad_prompt" > "$temp_prompt_file"
    
    debug_log "BMAD prompt file: $temp_prompt_file"
    debug_log "Story file: $story_file"
    
    log_agent "🚀 Activating BMAD Development Agent..."
    log_info "⏱️  Timeout: 10 minutes for comprehensive fix cycle"
    
    # Execute Claude Code with BMAD agent
    if timeout 600 "$CLAUDE_CODE_PATH" < "$temp_prompt_file"; then
        log_success "✅ BMAD Development Agent execution completed"
        
        # Verify that fixes were applied
        if verify_bmad_fixes_applied; then
            log_success "✅ BMAD fixes successfully applied and verified"
            rm -f "$temp_prompt_file"
            return 0
        else
            log_warn "⚠️ BMAD agent completed but fixes may not be fully applied"
            rm -f "$temp_prompt_file"
            return 1
        fi
    else
        log_error "❌ BMAD Development Agent failed or timed out"
        log_error "📋 Check the story file for manual intervention: $story_file"
        rm -f "$temp_prompt_file"
        return 1
    fi
}

# Verify BMAD fixes were applied
verify_bmad_fixes_applied() {
    log_info "🔍 Verifying BMAD fixes were applied..."
    
    # Check for git changes (indicating work was done)
    if git diff --quiet && git diff --staged --quiet; then
        log_warn "⚠️ No changes detected - BMAD agent may not have applied fixes"
        return 1
    fi
    
    local verification_passed=true
    
    # Determine working directory
    local work_dir="."
    if [[ -f "apps/web/package.json" ]]; then
        work_dir="apps/web"
        log_info "📂 Multi-package repository detected, checking apps/web"
    fi
    
    pushd "$work_dir" > /dev/null
    
    # Critical verification: Build must succeed
    log_info "🏗️  Running critical build verification..."
    if npm run build > /tmp/bmad-build-verification.log 2>&1; then
        log_success "✅ Build verification PASSED"
    else
        log_error "❌ Build verification FAILED"
        log_info "📋 Build log available at: /tmp/bmad-build-verification.log"
        verification_passed=false
    fi
    
    # TypeScript verification
    log_info "📝 Running TypeScript verification..."
    if npm run type-check > /tmp/bmad-typecheck-verification.log 2>&1 || tsc --noEmit > /tmp/bmad-typecheck-verification.log 2>&1; then
        log_success "✅ TypeScript verification PASSED"
    else
        log_warn "⚠️ TypeScript verification issues detected"
        log_info "📋 TypeCheck log available at: /tmp/bmad-typecheck-verification.log"
        # Don't fail on TypeScript warnings, only on build failures
    fi
    
    # Lint verification (if available and critical)
    if jq -e '.scripts.lint' package.json > /dev/null 2>&1; then
        log_info "🧹 Running lint verification..."
        if npm run lint > /tmp/bmad-lint-verification.log 2>&1; then
            log_success "✅ Lint verification PASSED"
        else
            log_warn "⚠️ Lint verification issues detected"
            log_info "📋 Lint log available at: /tmp/bmad-lint-verification.log"
            # Don't fail on lint warnings if build succeeds
        fi
    fi
    
    popd > /dev/null
    
    if [[ "$verification_passed" == "true" ]]; then
        log_success "🎉 All critical BMAD verifications passed"
        return 0
    else
        log_error "💥 Critical BMAD verification failed"
        return 1
    fi
}

# Get BMAD story summary
get_story_summary() {
    local deployment_id="$1"
    
    if [[ ! -d "$STORY_DIR" ]]; then
        echo "No BMAD stories found"
        return 1
    fi
    
    local story_files=$(find "$STORY_DIR" -name "*${deployment_id}*.md" | sort)
    local story_count=$(echo "$story_files" | wc -l | xargs)
    
    echo "📚 BMAD Stories for deployment $deployment_id:"
    echo "   📊 Total stories: $story_count"
    echo "   📂 Story directory: $STORY_DIR"
    
    if [[ $story_count -gt 0 ]]; then
        echo "   📖 Story files:"
        echo "$story_files" | sed 's/^/      /'
    fi
}

# Clean up BMAD stories
cleanup_bmad_stories() {
    local deployment_id="${1:-}"
    
    if [[ -d "$STORY_DIR" ]]; then
        if [[ -n "$deployment_id" ]]; then
            log_info "🧹 Cleaning up BMAD stories for deployment: $deployment_id"
            find "$STORY_DIR" -name "*${deployment_id}*.md" -delete
        else
            log_info "🧹 Cleaning up all BMAD stories"
            rm -rf "$STORY_DIR"
        fi
        log_success "✅ BMAD story cleanup completed"
    else
        log_info "ℹ️ No BMAD stories to clean up"
    fi
}

# Main execution
main() {
    case "${1:-execute}" in
        "execute")
            if [[ $# -lt 3 ]]; then
                echo "Usage: $0 execute <error_info> <deployment_id> <attempt_num> [previous_attempts]"
                exit 1
            fi
            execute_bmad_agent "$2" "$3" "$4" "${5:-}"
            ;;
        "verify")
            verify_bmad_fixes_applied
            ;;
        "summary")
            if [[ $# -lt 2 ]]; then
                echo "Usage: $0 summary <deployment_id>"
                exit 1
            fi
            get_story_summary "$2"
            ;;
        "cleanup")
            cleanup_bmad_stories "${2:-}"
            ;;
        "help"|"--help")
            cat << EOF
BMAD Development Agent Integration Script

Usage: $0 <command> [options]

Commands:
  execute <error_info> <deployment_id> <attempt_num> [previous] - Execute BMAD agent
  verify                                                        - Verify fixes were applied  
  summary <deployment_id>                                       - Show story summary
  cleanup [deployment_id]                                       - Clean up stories
  help                                                          - Show this help

Environment Variables:
  BMAD_AGENT_MODE    - Agent mode (default: developer)
  CLAUDE_CODE_PATH   - Path to Claude Code binary
  STORY_DIR          - Directory for BMAD stories (default: .bmad-stories)
  DEBUG              - Enable debug logging (0|1)

Examples:
  $0 execute "TypeScript error log" "deploy_123" "1"
  $0 verify
  $0 summary deploy_123
  $0 cleanup deploy_123

EOF
            ;;
        *)
            echo "Unknown command: $1"
            echo "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Execute main function
main "$@"