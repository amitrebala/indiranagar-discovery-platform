#!/bin/bash

echo "🔍 Event Discovery System Status Check"
echo "======================================"
echo ""

# Check Redis
echo "1. Redis Status:"
if redis-cli ping > /dev/null 2>&1; then
    echo "   ✅ Redis is running on port 6379"
    redis-cli INFO server | grep redis_version | head -1
else
    echo "   ❌ Redis is not running"
    echo "   Run: brew services start redis"
fi
echo ""

# Check Next.js dev server
echo "2. Next.js Development Server:"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "   ✅ Dev server running on http://localhost:3000"
else
    echo "   ❌ Dev server not running"
    echo "   Run: cd apps/web && npm run dev"
fi
echo ""

# Check Events API
echo "3. Events API Endpoint:"
EVENTS_COUNT=$(curl -s http://localhost:3000/api/events/discovered 2>/dev/null | jq '.events | length' 2>/dev/null || echo "error")
if [ "$EVENTS_COUNT" != "error" ]; then
    echo "   ✅ API endpoint working"
    echo "   📊 Events in database: $EVENTS_COUNT"
else
    echo "   ⚠️  API endpoint exists but may have issues"
fi
echo ""

# Check Event Processor dependencies
echo "4. Event Processor:"
if [ -d "apps/event-processor/node_modules" ]; then
    echo "   ✅ Dependencies installed"
    if [ -f "apps/event-processor/.env" ]; then
        echo "   ✅ Environment variables configured"
    else
        echo "   ❌ Missing .env file"
        echo "   Run: cp apps/web/.env.local apps/event-processor/.env"
    fi
else
    echo "   ❌ Dependencies not installed"
    echo "   Run: cd apps/event-processor && npm install"
fi
echo ""

# Check database migration status
echo "5. Database Tables:"
echo "   ℹ️  To check if tables exist, run:"
echo "   cd apps/web && npx tsx scripts/create-event-tables.ts"
echo ""

# URLs
echo "📍 Access Points:"
echo "   • Events Page: http://localhost:3000/events"
echo "   • Admin Dashboard: http://localhost:3000/admin/events"
echo "   • API Endpoint: http://localhost:3000/api/events/discovered"
echo "   • Redis Monitor: redis-cli monitor"
echo ""

# Next steps
echo "📋 Next Steps:"
if [ "$EVENTS_COUNT" == "0" ] || [ "$EVENTS_COUNT" == "error" ]; then
    echo "   1. Run database migration in Supabase Dashboard"
    echo "   2. Start event processor: cd apps/event-processor && npm run dev"
    echo "   3. Seed mock events: cd apps/web && npx tsx scripts/seed-mock-events.ts"
else
    echo "   ✨ System appears to be fully operational!"
fi
echo ""
echo "For detailed setup instructions, see: EVENT-DISCOVERY-SETUP.md"