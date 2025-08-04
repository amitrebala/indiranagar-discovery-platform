#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/.vercel-auto-fix-config"

if [[ ! -f "$CONFIG_FILE" ]]; then
    echo "❌ Configuration not found. Run quick-setup.sh first."
    exit 1
fi

source "$CONFIG_FILE"
export PROJECT_ID TEAM_ID WEBHOOK_PORT VERCEL_TOKEN

echo "📡 Starting BMAD webhook receiver for FUTURE deployments..."
echo "🎯 Project ID: $PROJECT_ID"
echo "🔌 Port: ${WEBHOOK_PORT:-3001}"
echo "📋 Will only process NEW deployment failures"
echo "🤖 Using /dev agent for all fixes"
echo ""
echo "📌 Configure webhook in Vercel Dashboard:"
echo "   Project Settings → Git → Deploy Hooks"
echo "   URL: http://your-server:${WEBHOOK_PORT:-3001}/webhook"
echo ""

"$SCRIPT_DIR/webhook-receiver.sh" start