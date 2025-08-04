#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/.vercel-auto-fix-config"

if [[ ! -f "$CONFIG_FILE" ]]; then
    echo "❌ Configuration not found. Run quick-setup.sh first."
    exit 1
fi

source "$CONFIG_FILE"
export VERCEL_TOKEN PROJECT_ID TEAM_ID CHECK_INTERVAL

echo "🔄 Starting BMAD Vercel monitoring for FUTURE deployments..."
echo "🎯 Project ID: $PROJECT_ID"
echo "⏱️ Check interval: ${CHECK_INTERVAL:-300} seconds"
echo "📋 Skipping existing failures, monitoring NEW deployments only"
echo "🤖 Using /dev agent for all fixes"
echo ""

"$SCRIPT_DIR/monitor-vercel.sh" start "$PROJECT_ID" "$TEAM_ID"