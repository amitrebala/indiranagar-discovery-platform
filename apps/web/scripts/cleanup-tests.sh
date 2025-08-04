#!/bin/bash

# Test process cleanup script
# Terminates any hanging Vitest processes

echo "🧹 Cleaning up test processes..."

# Find and kill Vitest processes
VITEST_PIDS=$(pgrep -f "vitest" | head -10)

if [ -z "$VITEST_PIDS" ]; then
    echo "✅ No Vitest processes found"
else
    echo "🔍 Found Vitest processes: $VITEST_PIDS"
    
    # Graceful termination first
    echo "💬 Attempting graceful termination..."
    echo "$VITEST_PIDS" | xargs -r kill -TERM 2>/dev/null
    
    # Wait a moment for graceful shutdown
    sleep 2
    
    # Force kill any remaining processes
    REMAINING_PIDS=$(pgrep -f "vitest" | head -10)
    if [ ! -z "$REMAINING_PIDS" ]; then
        echo "⚠️  Force killing remaining processes: $REMAINING_PIDS"
        echo "$REMAINING_PIDS" | xargs -r kill -KILL 2>/dev/null
    fi
    
    echo "✅ Test process cleanup complete"
fi

# Check for any Node processes consuming high CPU (potential stuck tests)
HIGH_CPU_NODES=$(ps aux | awk '$3 > 50.0 && /vitest/ {print $2}' | head -5)
if [ ! -z "$HIGH_CPU_NODES" ]; then
    echo "⚠️  Found high-CPU Vitest processes, terminating: $HIGH_CPU_NODES"
    echo "$HIGH_CPU_NODES" | xargs -r kill -KILL 2>/dev/null
fi

echo "🎯 Process cleanup finished"