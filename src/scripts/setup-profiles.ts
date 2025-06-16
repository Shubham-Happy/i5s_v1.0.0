
import { supabase } from "@/integrations/supabase/client";
import fs from 'fs';
import path from 'path';

/**
 * This script can be run manually to set up the profiles table
 * You don't need to run this script if you've already run the SQL migrations
 */
async function setupProfiles() {
  try {
    console.log("Setting up profiles table...");
    
    // Read the SQL migration file
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, '../../supabase/migrations/20250422_create_profiles.sql'),
      'utf8'
    );
    
    // Execute the SQL using a custom RPC call
    // This bypasses TypeScript type issues since we are using a function created in our SQL migration
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      console.error("Error setting up profiles:", error);
      return;
    }
    
    console.log("Profiles table set up successfully!");
  } catch (error) {
    console.error("Error in setup script:", error);
  }
}

// Only run if directly invoked
if (require.main === module) {
  setupProfiles();
}

export default setupProfiles;
