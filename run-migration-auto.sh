#!/bin/bash

echo "🚀 Automated Event Discovery Migration"
echo "======================================"
echo ""

# Get the Supabase project details
PROJECT_REF="kcpontmkmfsxbdmnybpb"
SUPABASE_URL="https://${PROJECT_REF}.supabase.co"

# Read the migration SQL
MIGRATION_FILE="supabase/migrations/011_create_event_discovery_tables.sql"

if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Migration file not found: $MIGRATION_FILE"
    exit 1
fi

echo "📋 Migration file found: $MIGRATION_FILE"
echo ""
echo "This script will guide you through running the migration."
echo ""
echo "OPTION 1: Automatic (Using Supabase Dashboard)"
echo "-----------------------------------------------"
echo "1. Open this URL in your browser:"
echo "   ${SUPABASE_URL}/project/${PROJECT_REF}/sql/new"
echo ""
echo "2. Copy and paste the contents of the migration file"
echo ""
echo "3. Click 'Run' to execute the migration"
echo ""
echo "OPTION 2: Using psql (if you have the database password)"
echo "---------------------------------------------------------"
echo "Run this command:"
echo "PGPASSWORD=<your-password> psql -h db.${PROJECT_REF}.supabase.co -p 5432 -U postgres -d postgres -f $MIGRATION_FILE"
echo ""
echo "OPTION 3: Using Supabase CLI (recommended)"
echo "------------------------------------------"
echo "1. First, get your database password from:"
echo "   ${SUPABASE_URL}/project/${PROJECT_REF}/settings/database"
echo ""
echo "2. Then run:"
echo "   supabase db push --db-url postgresql://postgres:<password>@db.${PROJECT_REF}.supabase.co:5432/postgres"
echo ""
echo "📝 Migration Preview:"
echo "===================="
head -50 "$MIGRATION_FILE"
echo "..."
echo ""
echo "Press Enter to open the Supabase Dashboard in your browser..."
read

# Try to open the URL in the default browser
if command -v open &> /dev/null; then
    open "${SUPABASE_URL}/project/${PROJECT_REF}/sql/new"
elif command -v xdg-open &> /dev/null; then
    xdg-open "${SUPABASE_URL}/project/${PROJECT_REF}/sql/new"
else
    echo "Please open this URL manually:"
    echo "${SUPABASE_URL}/project/${PROJECT_REF}/sql/new"
fi

echo ""
echo "✅ Dashboard opened! Please:"
echo "1. Copy the contents from: $MIGRATION_FILE"
echo "2. Paste in the SQL editor"
echo "3. Click 'Run' to create all tables"
echo ""
echo "Once done, the Event Discovery System will be fully operational!"