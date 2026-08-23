import { pool } from '../config/postgres.js';

// This is deliberately additive: it can be run on an empty database as well as
// on the database used by earlier hackathon builds.
export const runCoreMigrations = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query('CREATE EXTENSION IF NOT EXISTS postgis');
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'ATHLETE',
        is_verified BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        last_login_at TIMESTAMPTZ
      );
      CREATE TABLE IF NOT EXISTS athletes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        display_name VARCHAR(100) NOT NULL,
        bio TEXT,
        profile_image_url VARCHAR(500) DEFAULT '/athlete_rahul.jpg',
        city VARCHAR(100) NOT NULL DEFAULT 'Hyderabad',
        area VARCHAR(100) DEFAULT 'Gachibowli',
        location GEOMETRY(Point, 4326),
        preferred_radius_km INT NOT NULL DEFAULT 10,
        attendance_rate_pct INT DEFAULT 94,
        zero_flake_streak INT DEFAULT 12,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS sports (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) UNIQUE NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        category VARCHAR(50) DEFAULT 'General'
      );
      CREATE TABLE IF NOT EXISTS athlete_sports (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
        sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
        skill_level VARCHAR(50) NOT NULL,
        sport_data JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (athlete_id, sport_id)
      );
      CREATE TABLE IF NOT EXISTS matches (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        creator_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
        sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL, description TEXT,
        skill_level VARCHAR(50) NOT NULL DEFAULT 'Any',
        location GEOMETRY(Point, 4326), location_name VARCHAR(255) NOT NULL,
        city VARCHAR(100) DEFAULT 'Hyderabad', scheduled_at TIMESTAMPTZ NOT NULL,
        capacity INT NOT NULL, current_players INT NOT NULL DEFAULT 1,
        status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS match_participants (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
        athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
        status VARCHAR(50) NOT NULL DEFAULT 'JOINED',
        joined_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (match_id, athlete_id)
      );
      CREATE TABLE IF NOT EXISTS events (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL, description TEXT,
        category VARCHAR(100) DEFAULT 'Tournament', location GEOMETRY(Point, 4326),
        location_name VARCHAR(255) NOT NULL, start_time TIMESTAMPTZ NOT NULL,
        capacity INT NOT NULL, registered_count INT NOT NULL DEFAULT 0,
        fee VARCHAR(50) DEFAULT 'Free', created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS event_participants (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
        joined_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (event_id, athlete_id)
      );
      CREATE TABLE IF NOT EXISTS community_posts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
        content TEXT NOT NULL, likes_count INT NOT NULL DEFAULT 0,
        comments_count INT NOT NULL DEFAULT 0, created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS teams (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), name VARCHAR(150) NOT NULL,
        description TEXT, city VARCHAR(100) DEFAULT 'Hyderabad', members_count INT NOT NULL DEFAULT 0,
        sport_id UUID REFERENCES sports(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL, title VARCHAR(200) NOT NULL, body TEXT,
        is_read BOOLEAN NOT NULL DEFAULT FALSE, created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_athletes_location ON athletes USING GIST (location);
      CREATE INDEX IF NOT EXISTS idx_matches_location ON matches USING GIST (location);
      CREATE INDEX IF NOT EXISTS idx_community_posts_created ON community_posts(created_at DESC);
    `);

    // Required reference data. The application resolves sport UUIDs by name,
    // so this is safe to run repeatedly and avoids frontend seed-ID coupling.
    await client.query(`
      INSERT INTO sports (name, slug, category) VALUES
        ('Badminton', 'badminton', 'Racket'),
        ('Cricket', 'cricket', 'Team'),
        ('Running', 'running', 'Endurance'),
        ('Football', 'football', 'Team'),
        ('Chess', 'chess', 'Mind'),
        ('Swimming', 'swimming', 'Water')
      ON CONFLICT (name) DO NOTHING;
    `);

    // Keep the advertised local demo login usable without relying on a
    // separate manual seed command. This account is only created outside prod.
    if (process.env.NODE_ENV !== 'production') {
      await client.query(`
        INSERT INTO users (email, password_hash, role)
        VALUES ('vivek@sportsphere.com', $1, 'ATHLETE')
        ON CONFLICT (email) DO NOTHING;
      `, ['$2b$10$3iGRZlOrtMSTfTE08acbw.bq22yEMmJvDAzH9znJ83Zl8tt/tjnUm']);
      await client.query(`
        INSERT INTO athletes (user_id, display_name, city, area, location)
        SELECT id, 'Vivek Kumar', 'Hyderabad', 'Gachibowli',
               ST_SetSRID(ST_MakePoint(78.38, 17.44), 4326)
        FROM users WHERE email = 'vivek@sportsphere.com'
        ON CONFLICT (user_id) DO NOTHING;
      `);
    }

    // Upgrade databases that were created with the original, incompatible DDL.
    await client.query(`
      ALTER TABLE notifications ADD COLUMN IF NOT EXISTS athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE;
      ALTER TABLE notifications ADD COLUMN IF NOT EXISTS body TEXT;
      ALTER TABLE notifications ADD COLUMN IF NOT EXISTS is_read BOOLEAN NOT NULL DEFAULT FALSE;
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'user_id'
        ) THEN
          ALTER TABLE notifications ALTER COLUMN user_id DROP NOT NULL;
        END IF;
      END $$;
    `);

    await client.query('COMMIT');
    console.log('[Core Migrations] Database schema ready.');
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
};
