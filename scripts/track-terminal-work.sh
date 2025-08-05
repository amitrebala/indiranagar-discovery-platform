#!/bin/bash

# Terminal Work Tracker
# This script tracks which files are modified in each terminal session

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Get unique terminal identifier
TERMINAL_ID="${TERM_SESSION_ID:-${WINDOWID:-$$}}"
WORK_TRACKER="$PROJECT_ROOT/.terminal-work-$TERMINAL_ID"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

case "$1" in
    "init")
        echo -e "${BLUE}Initializing terminal work tracker...${NC}"
        > "$WORK_TRACKER"
        echo "Terminal ID: $TERMINAL_ID"
        echo "Tracking file: $WORK_TRACKER"
        
        # Set up file watching
        if command -v fswatch &> /dev/null; then
            echo "Starting file watcher..."
            fswatch -o . | while read f; do
                git status --porcelain | awk '{print $2}' >> "$WORK_TRACKER"
                sort -u "$WORK_TRACKER" -o "$WORK_TRACKER"
            done &
            echo "File tracking active"
        else
            echo -e "${YELLOW}fswatch not found. Install with: brew install fswatch${NC}"
            echo "Files will be tracked when you run commands"
        fi
        ;;
        
    "add")
        shift
        for file in "$@"; do
            echo "$file" >> "$WORK_TRACKER"
        done
        sort -u "$WORK_TRACKER" -o "$WORK_TRACKER"
        echo -e "${GREEN}Added files to terminal work tracker${NC}"
        ;;
        
    "list")
        if [[ -f "$WORK_TRACKER" ]]; then
            echo -e "${BLUE}Files modified in this terminal:${NC}"
            cat "$WORK_TRACKER"
        else
            echo "No files tracked yet"
        fi
        ;;
        
    "clear")
        > "$WORK_TRACKER"
        echo -e "${GREEN}Cleared terminal work tracker${NC}"
        ;;
        
    "status")
        echo "Terminal ID: $TERMINAL_ID"
        if [[ -f "$WORK_TRACKER" ]]; then
            count=$(wc -l < "$WORK_TRACKER" | tr -d ' ')
            echo "Files tracked: $count"
        else
            echo "No tracking active"
        fi
        ;;
        
    *)
        echo "Terminal Work Tracker"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  init    Initialize tracking for this terminal"
        echo "  add     Add files to track"
        echo "  list    List tracked files"
        echo "  clear   Clear tracked files"
        echo "  status  Show tracking status"
        ;;
esac