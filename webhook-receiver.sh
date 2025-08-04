#!/bin/bash

# Vercel Webhook Receiver Script
# Receives webhook notifications from Vercel and triggers auto-fix for failed deployments

set -euo pipefail

# Configuration
PORT="${WEBHOOK_PORT:-3001}"
PROJECT_ID="${PROJECT_ID:-}"
TEAM_ID="${TEAM_ID:-}"
LOG_FILE="${LOG_FILE:-webhook-receiver.log}"
PID_FILE="${PID_FILE:-webhook-receiver.pid}"
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
    log_info "Shutting down webhook receiver..."
    rm -f "$PID_FILE"
    # Kill any background processes
    jobs -p | xargs -r kill 2>/dev/null || true
    exit 0
}

trap cleanup SIGTERM SIGINT

# Check if receiver is already running
check_running() {
    if [[ -f "$PID_FILE" ]]; then
        local pid=$(cat "$PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            log_error "Webhook receiver is already running with PID: $pid"
            exit 1
        else
            log_warn "Stale PID file found, removing..."
            rm -f "$PID_FILE"
        fi
    fi
}

# Validate prerequisites
validate_setup() {
    if ! command -v nc &> /dev/null && ! command -v netcat &> /dev/null; then
        log_error "netcat (nc) is required but not installed"
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

# Process webhook payload
process_webhook() {
    local payload="$1"
    local deployment_state=""
    local deployment_id=""
    local project_id=""
    
    # Try to parse JSON payload
    if command -v jq &> /dev/null; then
        deployment_state=$(echo "$payload" | jq -r '.deployment.state // .state // ""' 2>/dev/null)
        deployment_id=$(echo "$payload" | jq -r '.deployment.uid // .uid // ""' 2>/dev/null)
        project_id=$(echo "$payload" | jq -r '.deployment.projectId // .projectId // ""' 2>/dev/null)
    else
        # Fallback parsing for basic cases
        deployment_state=$(echo "$payload" | grep -o '"state":"[^"]*"' | cut -d'"' -f4 || echo "")
        deployment_id=$(echo "$payload" | grep -o '"uid":"[^"]*"' | cut -d'"' -f4 || echo "")
        project_id=$(echo "$payload" | grep -o '"projectId":"[^"]*"' | cut -d'"' -f4 || echo "")
    fi
    
    log_info "Webhook received - Deployment: $deployment_id, State: $deployment_state, Project: $project_id"
    
    # Check if this is for our project (if PROJECT_ID is set)
    if [[ -n "$PROJECT_ID" ]] && [[ "$project_id" != "$PROJECT_ID" ]]; then
        log_info "Ignoring webhook for different project: $project_id"
        return 0
    fi
    
    # Trigger auto-fix for failed deployments
    if [[ "$deployment_state" == "ERROR" ]] || [[ "$deployment_state" == "FAILED" ]]; then
        log_warn "Deployment failed, triggering auto-fix..."
        trigger_auto_fix "$project_id" &
    else
        log_info "Deployment state '$deployment_state' does not require auto-fix"
    fi
}

# Trigger auto-fix in background
trigger_auto_fix() {
    local target_project_id="${1:-$PROJECT_ID}"
    
    if [[ -z "$target_project_id" ]]; then
        log_error "No project ID available for auto-fix"
        return 1
    fi
    
    log_info "Starting auto-fix for project: $target_project_id"
    
    local fix_args=("$target_project_id")
    if [[ -n "$TEAM_ID" ]]; then
        fix_args+=("$TEAM_ID")
    fi
    
    # Run auto-fix with timeout and logging
    if timeout 600 "$SCRIPT_DIR/vercel-auto-fix.sh" "${fix_args[@]}" >> "$LOG_FILE" 2>&1; then
        log_success "Auto-fix completed successfully for $target_project_id"
    else
        log_error "Auto-fix failed for $target_project_id"
    fi
}

# Simple HTTP server using netcat
start_http_server() {
    log_info "Starting webhook receiver on port $PORT"
    
    while true; do
        # Read HTTP request
        {
            read request_line
            while IFS= read -r header && [[ "$header" != $'\r' ]]; do
                [[ "$header" =~ ^Content-Length:\ ([0-9]+) ]] && content_length="${BASH_REMATCH[1]}"
            done
            
            # Read body if present
            body=""
            if [[ -n "${content_length:-}" ]] && [[ "$content_length" -gt 0 ]]; then
                body=$(head -c "$content_length")
            fi
            
            # Log request
            log_info "Received request: $request_line"
            
            # Send response
            cat << 'EOF'
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 27
Connection: close

{"status": "ok", "message": "webhook received"}
EOF
            
            # Process webhook if it's a POST request with body
            if [[ "$request_line" =~ ^POST ]] && [[ -n "$body" ]]; then
                process_webhook "$body"
            fi
            
        } | nc -l -p "$PORT" -q 1 2>/dev/null || {
            log_warn "Connection handling failed, continuing..."
            sleep 1
        }
    done
}

# Alternative server using Python (if available)
start_python_server() {
    cat << 'EOF' > /tmp/webhook-server.py
#!/usr/bin/env python3
import json
import subprocess
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WebhookHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8')
        
        logger.info(f"Received webhook: {self.path}")
        
        try:
            payload = json.loads(body) if body else {}
            
            # Extract deployment info
            deployment = payload.get('deployment', payload)
            state = deployment.get('state', '')
            deployment_id = deployment.get('uid', '')
            project_id = deployment.get('projectId', '')
            
            logger.info(f"Deployment {deployment_id} state: {state}")
            
            # Trigger auto-fix for failed deployments
            if state in ['ERROR', 'FAILED']:
                logger.info("Triggering auto-fix...")
                subprocess.Popen([
                    'bash', '-c', 
                    f'echo "Webhook triggered auto-fix for {deployment_id}" >> {sys.argv[2]} && {sys.argv[1]} {project_id} >> {sys.argv[2]} 2>&1'
                ])
            
        except Exception as e:
            logger.error(f"Error processing webhook: {e}")
        
        # Send response
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        response = json.dumps({"status": "ok", "message": "webhook received"})
        self.wfile.write(response.encode())

if __name__ == '__main__':
    port = int(sys.argv[3]) if len(sys.argv) > 3 else 3001
    server = HTTPServer(('0.0.0.0', port), WebhookHandler)
    print(f"Webhook server listening on port {port}")
    server.serve_forever()
EOF

    python3 /tmp/webhook-server.py "$SCRIPT_DIR/vercel-auto-fix.sh" "$LOG_FILE" "$PORT"
}

# Status report
status_report() {
    if [[ ! -f "$PID_FILE" ]]; then
        echo "Webhook receiver is not running"
        return 1
    fi
    
    local pid=$(cat "$PID_FILE")
    if ! kill -0 "$pid" 2>/dev/null; then
        echo "Webhook receiver PID file exists but process is not running"
        return 1
    fi
    
    echo "Webhook receiver is running with PID: $pid"
    echo "Port: $PORT"
    echo "Project ID: ${PROJECT_ID:-'Any project'}"
    echo "Log file: $LOG_FILE"
    
    if [[ -f "$LOG_FILE" ]]; then
        echo "Recent activity:"
        tail -n 5 "$LOG_FILE"
    fi
    
    # Check if port is actually listening
    if command -v lsof &> /dev/null; then
        if lsof -i ":$PORT" -t &>/dev/null; then
            echo "Port $PORT is actively listening"
        else
            echo "Warning: Port $PORT does not appear to be listening"
        fi
    fi
}

# Main execution
case "${1:-start}" in
    "start")
        validate_setup
        check_running
        
        echo $$ > "$PID_FILE"
        log_info "Starting Vercel webhook receiver"
        log_info "Port: $PORT"
        log_info "Project ID: ${PROJECT_ID:-'Any project'}"
        log_info "PID: $$"
        
        # Try Python server first, fallback to netcat
        if command -v python3 &> /dev/null; then
            log_info "Using Python HTTP server"
            start_python_server
        else
            log_info "Using netcat HTTP server"
            start_http_server
        fi
        ;;
    "status")
        status_report
        exit $?
        ;;
    "stop")
        if [[ -f "$PID_FILE" ]]; then
            local pid=$(cat "$PID_FILE")
            if kill -0 "$pid" 2>/dev/null; then
                log_info "Stopping webhook receiver (PID: $pid)"
                kill "$pid"
                sleep 2
                if kill -0 "$pid" 2>/dev/null; then
                    log_warn "Process still running, sending SIGKILL"
                    kill -9 "$pid"
                fi
                rm -f "$PID_FILE"
                log_success "Webhook receiver stopped"
            else
                log_warn "PID file exists but process is not running"
                rm -f "$PID_FILE"
            fi
        else
            log_info "Webhook receiver is not running"
        fi
        ;;
    "test")
        # Send test webhook
        if [[ -z "${2:-}" ]]; then
            echo "Usage: $0 test <state> [deployment-id] [project-id]"
            echo "Example: $0 test ERROR deploy_123 prj_456"
            exit 1
        fi
        
        local test_state="$2"
        local test_deployment_id="${3:-test_deployment_$(date +%s)}"
        local test_project_id="${4:-${PROJECT_ID:-test_project}}"
        
        local test_payload=$(cat << EOF
{
  "deployment": {
    "uid": "$test_deployment_id",
    "state": "$test_state",
    "projectId": "$test_project_id"
  }
}
EOF
)
        
        echo "Sending test webhook to localhost:$PORT"
        echo "Payload: $test_payload"
        
        curl -X POST \
             -H "Content-Type: application/json" \
             -d "$test_payload" \
             "http://localhost:$PORT/webhook" || {
            echo "Failed to send test webhook. Is the receiver running?"
            exit 1
        }
        ;;
    *)
        echo "Usage: $0 <command>"
        echo ""
        echo "Commands:"
        echo "  start                                    - Start webhook receiver"
        echo "  status                                   - Show receiver status"
        echo "  stop                                     - Stop webhook receiver"
        echo "  test <state> [deployment-id] [project-id] - Send test webhook"
        echo ""
        echo "Environment variables:"
        echo "  WEBHOOK_PORT   - Port to listen on (default: 3001)"
        echo "  PROJECT_ID     - Project ID to filter webhooks (optional)"
        echo "  TEAM_ID        - Team ID for auto-fix (optional)"
        echo "  LOG_FILE       - Log file path (default: webhook-receiver.log)"
        echo ""
        exit 1
        ;;
esac