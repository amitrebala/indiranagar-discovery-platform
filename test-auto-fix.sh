#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/.vercel-auto-fix-config"

if [[ ! -f "$CONFIG_FILE" ]]; then
    echo "❌ Configuration not found. Run quick-setup.sh first."
    exit 1
fi

source "$CONFIG_FILE"
export VERCEL_TOKEN PROJECT_ID TEAM_ID

echo "🧪 Testing BMAD Vercel Auto-Fix system..."
echo "🎯 Project ID: $PROJECT_ID"
echo "📋 Note: This will only fix NEW deployment failures"
echo "🤖 Using /dev agent for all fixes"
echo ""

"$SCRIPT_DIR/vercel-auto-fix.sh" "$PROJECT_ID" "$TEAM_ID"