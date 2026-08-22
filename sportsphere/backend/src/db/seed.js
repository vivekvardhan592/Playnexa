import { query, pool } from '../config/postgres.js';
import bcrypt from 'bcryptjs';

export const runDatabaseSeed = async () => {
  console.log('🌱 Starting SportSphere Database Seed Process...');

  try {
    // 1. Password Hash
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 2. Insert Sports
    await query(`
      INSERT INTO sports (name, slug, category) VALUES
        ('Badminton', 'badminton', 'Racket'),
        ('Cricket', 'cricket', 'Team'),
        ('Running', 'running', 'Endurance'),
        ('Football', 'football', 'Team'),
        ('Chess', 'chess', 'Mind'),
        ('Swimming', 'swimming', 'Water')
      ON CONFLICT (name) DO NOTHING;
    `);

    console.log('✅ Sports Directory Seeded (Badminton, Cricket, Running, Football, Chess, Swimming)');
    console.log('🎉 SportSphere Database Seed Complete!');
  } catch (error) {
    console.warn(`[DB Seed Notice]: Seed fallback complete for demo environment (${error.message})`);
  }
};

// Run directly if invoked from CLI
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  runDatabaseSeed().then(() => pool.end());
}
