#!/bin/bash

# Vercel Monitoring Script
# Continuously monitors Vercel deployments and triggers auto-fix when needed

set -euo pipefail

# Configuration
PROJECT_ID="${1:-}"
TEAM_ID="${2:-}"
CHECK_INTERVAL="${CHECK_INTERVAL:-300}"  # 5 minutes default
LOG_FILE="${LOG_FILE:-monitor-vercel.log}"
PID_FILE="${PID_FILE:-monitor-vercel.pid}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging functions
log_with_timestamp() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log_info() {
    log_with_timestamp "${BLUE}[INFO]${NC} $1"
}

log_warn() {
    log_with_timestamp "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    log_with_timestamp "${RED}[ERROR]${NC} $1"
}

log_success() {
    log_with_timestamp "${GREEN}[SUCCESS]${NC} $1"
}

# Signal handlers
cleanup() {
    log_info "Shutting down monitor..."
    rm -f "$PID_FILE"
    exit 0
}

trap cleanup SIGTERM SIGINT

# Check if monitor is already running
check_running() {
    if [[ -f "$PID_FILE" ]]; then
        local pid=$(cat "$PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            log_error "Monitor is already running with PID: $pid"
            exit 1
        else
            log_warn "Stale PID file found, removing..."
            rm -f "$PID_FILE"
        fi
    fi
}

# Validate arguments and prerequisites
validate_setup() {
    if [[ -z "$PROJECT_ID" ]]; then
        echo "Usage: $0 <project-id> [team-id]"
        echo ""
        echo "Environment variables:"
        echo "  CHECK_INTERVAL  - Monitoring interval in seconds (default: 300)"
        echo "  LOG_FILE        - Log file path (default: monitor-vercel.log)"
        echo "  PID_FILE        - PID file path (default: monitor-vercel.pid)"
        exit 1
    fi
    
    if [[ ! -f "$SCRIPT_DIR/vercel-auto-fix.sh" ]]; then
        log_error "vercel-auto-fix.sh not found in $SCRIPT_DIR"
        exit 1
    fi
    
    if [[ ! -x "$SCRIPT_DIR/vercel-auto-fix.sh" ]]; then
        log_error "vercel-auto-fix.sh is not executable"
        exit 1
    fi
}

# Get deployment status
get_deployment_status() {
    local url="https://api.vercel.com/v6/deployments"
    local params="projectId=$PROJECT_ID&limit=1"
    
    if [[ -n "$TEAM_ID" ]]; then
        params="$params&teamId=$TEAM_ID"
    fi
    
    if [[ -z "$VERCEL_TOKEN" ]]; then
        log_error "VERCEL_TOKEN environment variable is required"
        return 1
    fi
    
    curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
         "$url?$params" 2>/dev/null | jq -r '.deployments[0] // {}'
}

# Check if deployment needs fixing
needs_fixing() {
    local deployment="$1"
    local state=$(echo "$deployment" | jq -r '.state // "UNKNOWN"')
    local deployment_id=$(echo "$deployment" | jq -r '.uid // ""')
    
    if [[ -z "$deployment_id" || "$deployment_id" == "null" ]]; then
        log_warn "Could not fetch deployment information"
        return 1
    fi
    
    case "$state" in
        "ERROR")
            log_warn "Deployment $deployment_id is in ERROR state"
            return 0
            ;;
        "READY")
            return 1
            ;;
        "BUILDING"|"QUEUED"|"INITIALIZING")
            return 1
            ;;
        *)
            log_warn "Deployment $deployment_id has unknown state: $state"
            return 1
            ;;
    esac
}

# Run auto-fix
run_auto_fix() {
    log_info "Running auto-fix..."
    
    local fix_args=("$PROJECT_ID")
    if [[ -n "$TEAM_ID" ]]; then
        fix_args+=("$TEAM_ID")
    fi
    
    if "$SCRIPT_DIR/vercel-auto-fix.sh" "${fix_args[@]}" >> "$LOG_FILE" 2>&1; then
        log_success "Auto-fix completed successfully"
        return 0
    else
        log_error "Auto-fix failed"
        return 1
    fi
}

# Statistics tracking
declare -A stats
stats[checks]=0
stats[fixes_attempted]=0
stats[fixes_successful]=0
stats[start_time]=$(date +%s)

# Print statistics
print_stats() {
    local runtime=$(($(date +%s) - stats[start_time]))
    local hours=$((runtime / 3600))
    local minutes=$(((runtime % 3600) / 60))
    
    log_info "=== Monitor Statistics ==="
    log_info "Runtime: ${hours}h ${minutes}m"
    log_info "Checks performed: ${stats[checks]}"
    log_info "Fixes attempted: ${stats[fixes_attempted]}"
    log_info "Fixes successful: ${stats[fixes_successful]}"
    
    if [[ ${stats[fixes_attempted]} -gt 0 ]]; then
        local success_rate=$((stats[fixes_successful] * 100 / stats[fixes_attempted]))
        log_info "Success rate: ${success_rate}%"
    fi
}

# Status report (can be called externally)
status_report() {
    if [[ ! -f "$PID_FILE" ]]; then
        echo "Monitor is not running"
        return 1
    fi
    
    local pid=$(cat "$PID_FILE")
    if ! kill -0 "$pid" 2>/dev/null; then
        echo "Monitor PID file exists but process is not running"
        return 1
    fi
    
    echo "Monitor is running with PID: $pid"
    echo "Project ID: $PROJECT_ID"
    echo "Check interval: ${CHECK_INTERVAL}s"
    echo "Log file: $LOG_FILE"
    
    if [[ -f "$LOG_FILE" ]]; then
        echo "Recent activity:"
        tail -n 5 "$LOG_FILE"
    fi
}

# Daemon mode
daemon_mode() {
    echo $$ > "$PID_FILE"
    
    log_info "Starting Vercel monitor daemon"
    log_info "Project ID: $PROJECT_ID"
    log_info "Check interval: ${CHECK_INTERVAL}s"
    log_info "PID: $$"
    
    local last_deployment_id=""
    local last_known_file="$SCRIPT_DIR/.vercel-last-known-deployment"
    
    # Load last known deployment to skip existing failures
    if [[ -f "$last_known_file" ]]; then
        last_deployment_id=$(cat "$last_known_file")
        log_info "📋 Skipping known deployment: $last_deployment_id"
    fi
    
    while true; do
        stats[checks]=$((stats[checks] + 1))
        
        local deployment=$(get_deployment_status)
        if [[ $? -eq 0 ]] && [[ -n "$deployment" ]]; then
            local current_deployment_id=$(echo "$deployment" | jq -r '.uid // ""')
            local created_at=$(echo "$deployment" | jq -r '.createdAt // ""')
            
            # Only check for fixes if this is a new deployment or we haven't seen it before
            if [[ "$current_deployment_id" != "$last_deployment_id" ]]; then
                log_info "🆕 New deployment detected: $current_deployment_id (created: $created_at)"
                
                if needs_fixing "$deployment"; then
                    log_warn "🚨 New deployment failed - activating BMAD /dev agent"
                    stats[fixes_attempted]=$((stats[fixes_attempted] + 1))
                    
                    if run_auto_fix; then
                        stats[fixes_successful]=$((stats[fixes_successful] + 1))
                    fi
                else
                    log_info "✅ New deployment successful: $current_deployment_id"
                fi
                
                # Update last known deployment
                echo "$current_deployment_id" > "$last_known_file"
                last_deployment_id="$current_deployment_id"
            fi
        else
            log_warn "Failed to fetch deployment status"
        fi
        
        # Print stats every hour
        if [[ $((stats[checks] % 12)) -eq 0 ]]; then
            print_stats
        fi
        
        sleep "$CHECK_INTERVAL"
    done
}

# Handle command line arguments
case "${1:-}" in
    "status")
        status_report
        exit $?
        ;;
    "stop")
        if [[ -f "$PID_FILE" ]]; then
            local pid=$(cat "$PID_FILE")
            if kill -0 "$pid" 2>/dev/null; then
                log_info "Stopping monitor (PID: $pid)"
                kill "$pid"
                sleep 2
                if kill -0 "$pid" 2>/dev/null; then
                    log_warn "Process still running, sending SIGKILL"
                    kill -9 "$pid"
                fi
                rm -f "$PID_FILE"
                log_success "Monitor stopped"
            else
                log_warn "PID file exists but process is not running"
                rm -f "$PID_FILE"
            fi
        else
            log_info "Monitor is not running"
        fi
        exit 0
        ;;
    "stats")
        if [[ -f "$LOG_FILE" ]]; then
            echo "=== Recent Log Entries ==="
            tail -n 20 "$LOG_FILE"
            echo ""
        fi
        status_report
        exit 0
        ;;
    "")
        echo "Usage: $0 <command> [project-id] [team-id]"
        echo ""
        echo "Commands:"
        echo "  start <project-id> [team-id]  - Start monitoring"
        echo "  status                        - Show monitor status"
        echo "  stop                          - Stop monitoring"
        echo "  stats                         - Show statistics and recent logs"
        echo ""
        exit 1
        ;;
    "start")
        PROJECT_ID="${2:-}"
        TEAM_ID="${3:-}"
        ;;
    *)
        # Assume first argument is project ID for backward compatibility
        ;;
esac

# Main execution for daemon mode
validate_setup
check_running
daemon_mode