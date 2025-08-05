#!/bin/bash

# Terminal-Isolated Safe Commit
# Ensures only changes from the current terminal are committed

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Get terminal identifier
TERMINAL_ID="${CLAUDE_TERMINAL_ID:-${TERM_SESSION_ID:-${WINDOWID:-$$}}}"
TERMINAL_WORK_FILE="$PROJECT_ROOT/.terminal-work-$TERMINAL_ID"
TERMINAL_STAGE_FILE="$PROJECT_ROOT/.terminal-stage-$TERMINAL_ID"

log_info() {
    echo -e "${BLUE}[TERMINAL-COMMIT]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Main function
main() {
    local commit_msg="${1:-chore: update code}"
    
    # Concurrency control
    LOCK_FILE="$PROJECT_ROOT/.commit-lock"
    LOCK_TIMEOUT=300  # 5 minutes max wait
    
    # Try to acquire lock
    local waited=0
    while [[ -f "$LOCK_FILE" ]] && [[ $waited -lt $LOCK_TIMEOUT ]]; do
        if [[ $waited -eq 0 ]]; then
            log_warning "Another commit is in progress. Waiting..."
            log_info "Lock held by: $(cat "$LOCK_FILE" 2>/dev/null || echo 'unknown')"
        fi
        sleep 2
        waited=$((waited + 2))
    done
    
    if [[ -f "$LOCK_FILE" ]]; then
        log_error "Timeout waiting for commit lock. Another terminal may be stuck."
        log_info "To force unlock: rm $LOCK_FILE"
        exit 1
    fi
    
    # Acquire lock
    echo "Terminal: $TERMINAL_ID | PID: $$ | Time: $(date)" > "$LOCK_FILE"
    
    # Ensure lock is removed on exit
    trap 'rm -f "$LOCK_FILE"' EXIT
    
    log_info "Terminal ID: $TERMINAL_ID"
    log_info "Preparing terminal-specific commit..."
    
    # Step 1: Identify files changed in this terminal
    > "$TERMINAL_STAGE_FILE"
    
    # Get all modified files
    git_modified=$(git status --porcelain | grep -E '^.M|^M.|^A.|^.A' | awk '{print $2}' || true)
    
    if [[ -z "$git_modified" ]]; then
        log_warning "No modified files found"
        exit 1
    fi
    
    # If we have a work tracker, use it to filter
    if [[ -f "$TERMINAL_WORK_FILE" ]]; then
        log_info "Using terminal work tracker to identify files..."
        
        # Only stage files that appear in both lists
        while IFS= read -r file; do
            if echo "$git_modified" | grep -q "^$file$"; then
                echo "$file" >> "$TERMINAL_STAGE_FILE"
                log_info "Terminal file: $file"
            fi
        done < "$TERMINAL_WORK_FILE"
    else
        # Fallback: Interactive selection
        log_warning "No terminal work tracker found"
        log_info "Please select files to commit:"
        
        echo "$git_modified" | nl -w2 -s'. '
        echo ""
        read -p "Enter file numbers to commit (e.g., 1,3,5 or 'all'): " selection
        
        if [[ "$selection" == "all" ]]; then
            echo "$git_modified" > "$TERMINAL_STAGE_FILE"
        else
            IFS=',' read -ra numbers <<< "$selection"
            for num in "${numbers[@]}"; do
                file=$(echo "$git_modified" | sed -n "${num}p")
                if [[ -n "$file" ]]; then
                    echo "$file" >> "$TERMINAL_STAGE_FILE"
                fi
            done
        fi
    fi
    
    # Step 2: Stage only terminal-specific files
    if [[ ! -s "$TERMINAL_STAGE_FILE" ]]; then
        log_warning "No files selected for commit"
        exit 1
    fi
    
    # Reset staging area
    git reset --quiet
    
    # Stage selected files
    log_info "Staging terminal-specific files..."
    while IFS= read -r file; do
        if [[ -f "$file" ]]; then
            git add "$file"
            log_success "Staged: $file"
        fi
    done < "$TERMINAL_STAGE_FILE"
    
    # Step 3: Run safe commit with staged files
    log_info "Running deployment validation..."
    "$SCRIPT_DIR/safe-commit.sh" "$commit_msg"
    
    # Cleanup
    rm -f "$TERMINAL_STAGE_FILE"
    
    # Clear work tracker after successful commit
    if [[ -f "$TERMINAL_WORK_FILE" ]]; then
        > "$TERMINAL_WORK_FILE"
        log_info "Cleared terminal work tracker"
    fi
}

# Run with provided commit message
main "$@"