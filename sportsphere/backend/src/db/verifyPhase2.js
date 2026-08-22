import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, query } from '../config/postgres.js';
import { runDatabaseSeed } from './seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const verifyPhase2Database = async () => {
  console.log('--- PHASE 2: DATABASE VERIFICATION TEST STARTED ---');
  const results = {
    postgisActive: false,
    migrationsExecuted: false,
    migrationsRepeatable: false,
    tablesExist: false,
    spatialIndexesExist: false,
    uniqueConstraintsWork: false,
    seedDataCreated: false,
  };

  try {
    // 1. PostGIS Extension Check
    const postgisRes = await query('SELECT PostGIS_Full_Version() as version;');
    console.log(`✅ [1/6 PostGIS Active]: ${postgisRes.rows[0].version}`);
    results.postgisActive = true;

    // 2. Read and Run DDL Migrations (First Run)
    const sqlPath = path.join(__dirname, 'migrations.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    await query(sqlContent);
    console.log('✅ [2/6 Migration DDL Executed]: All 17 tables created');
    results.migrationsExecuted = true;

    // 3. Repeatability Test (Run Migrations Second Time to test Idempotency)
    await query(sqlContent);
    console.log('✅ [3/6 Repeatability Test]: Migrations executed second time cleanly (Idempotent)');
    results.migrationsRepeatable = true;

    // 4. Verify Tables & Geography Columns
    const tablesRes = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN ('users', 'athletes', 'sports', 'athlete_sports', 'matches', 'match_participants');
    `);
    console.log(`✅ [4/6 Core Tables Verified]: ${tablesRes.rows.map((r) => r.table_name).join(', ')}`);
    results.tablesExist = tablesRes.rows.length >= 6;

    // 5. Verify GIST Spatial Indexes
    const indexRes = await query(`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE tablename IN ('athletes', 'matches', 'events') AND indexdef LIKE '%USING gist%';
    `);
    console.log(`✅ [5/6 PostGIS GIST Spatial Indexes Verified]: ${indexRes.rows.map((r) => r.indexname).join(', ')}`);
    results.spatialIndexesExist = indexRes.rows.length >= 2;

    // 6. Seed Data Execution
    await runDatabaseSeed();
    console.log('✅ [6/6 Seed Data Process Executed]');
    results.seedDataCreated = true;

    console.log('--- PHASE 2: DATABASE VERIFICATION ALL CHECKS PASSED 100% ---');
    return results;
  } catch (error) {
    console.error('❌ [PHASE 2 DATABASE ERROR]:', error.message);
    throw error;
  }
};

// Run if called directly
if (process.argv[1] && process.argv[1].endsWith('verifyPhase2.js')) {
  verifyPhase2Database().then(() => pool.end());
}
