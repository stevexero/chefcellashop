import { createClient } from '@/app/utils/supabase/server';
import fs from 'fs';
import path from 'path';

async function runMigrations() {
  const supabase = await createClient();

  // Read all migration files
  const migrationsDir = path.join(process.cwd(), 'app/lib/db/migrations');
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  for (const file of migrationFiles) {
    console.log(`Running migration: ${file}`);
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

    try {
      // Split SQL into individual statements
      const statements = sql.split(';').filter((stmt) => stmt.trim());

      for (const statement of statements) {
        if (statement.trim()) {
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          if (error) throw error;
        }
      }

      console.log(`Migration ${file} completed successfully`);
    } catch (error) {
      console.error(`Error running migration ${file}:`, error);
      throw error;
    }
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { runMigrations };

// run with npx tsx app/lib/db/migrate.ts
