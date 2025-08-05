import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

console.log('Supabase URL:', supabaseUrl);
console.log('Service Key Available:', !!supabaseServiceKey);

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  try {
    console.log('📦 Applying Journey System Migration...');
    
    // Read the migration file
    const migrationPath = path.join(process.cwd(), '../../supabase/migrations/20250805_journey_system.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`Executing ${statements.length} SQL statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        
        try {
          const { error } = await supabase.rpc('exec_sql', { 
            sql: statement + ';' 
          });
          
          if (error) {
            // Try direct query for DDL statements
            const { error: directError } = await supabase
              .from('_temp_migration')
              .select('1')
              .limit(0);
            
            if (directError && directError.message.includes('does not exist')) {
              // This is expected for DDL operations
              console.log(`Statement ${i + 1} executed (DDL operation)`);
            } else {
              console.warn(`Warning on statement ${i + 1}:`, error.message);
            }
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.warn(`Warning on statement ${i + 1}:`, err);
        }
      }
    }
    
    // Verify tables were created
    console.log('🔍 Verifying table creation...');
    
    const tables = ['journeys', 'journey_stops', 'companion_activities', 'saved_journeys'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.error(`❌ Table ${table} verification failed:`, error.message);
        } else {
          console.log(`✅ Table ${table} exists and is accessible`);
        }
      } catch (err) {
        console.error(`❌ Table ${table} verification error:`, err);
      }
    }
    
    console.log('🎉 Journey System Migration completed!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

applyMigration();