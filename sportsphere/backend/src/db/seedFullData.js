import { query, pool } from '../config/postgres.js';
import bcrypt from 'bcryptjs';

export const seedFullDatabase = async () => {
  console.log('🌱 Starting Full SportSphere Database Seeding...');

  try {
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Insert Sports
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
    console.log('✅ 1. Sports directory seeded.');

    // Fetch real Sport UUIDs
    const sportsRes = await query(`SELECT id, name FROM sports;`);
    const sportMap = {};
    sportsRes.rows.forEach((s) => {
      sportMap[s.name] = s.id;
    });

    const badmintonId = sportMap['Badminton'];
    const cricketId = sportMap['Cricket'];
    const runningId = sportMap['Running'];
    const footballId = sportMap['Football'];

    // 2. Insert Test Users & Athletes
    // Vivek (Test User)
    const userVivek = await query(`
      INSERT INTO users (email, password_hash)
      VALUES ('vivek@sportsphere.com', $1)
      ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
      RETURNING id;
    `, [hashedPassword]);
    const vivekUserId = userVivek.rows[0].id;

    await query(`
      INSERT INTO athletes (id, user_id, display_name, city, area, bio, profile_image_url, location, attendance_rate_pct, zero_flake_streak)
      VALUES (
        'ed3e0581-b173-4e21-b2c8-6707d96b3ad2',
        $1,
        'Vivek Kumar',
        'Hyderabad',
        'Gachibowli',
        'Weekend badminton player and competitive cricket enthusiast.',
        '/athlete_rahul.jpg',
        ST_SetSRID(ST_MakePoint(78.38, 17.44), 4326),
        96,
        14
      )
      ON CONFLICT (id) DO UPDATE SET display_name = EXCLUDED.display_name;
    `, [vivekUserId]);

    // Rahul Sharma
    const userRahul = await query(`
      INSERT INTO users (email, password_hash)
      VALUES ('rahul@sportsphere.com', $1)
      ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
      RETURNING id;
    `, [hashedPassword]);
    const rahulUserId = userRahul.rows[0].id;

    await query(`
      INSERT INTO athletes (id, user_id, display_name, city, area, bio, profile_image_url, location, attendance_rate_pct, zero_flake_streak)
      VALUES (
        'a1111111-1111-1111-1111-111111111111',
        $1,
        'Rahul Sharma',
        'Hyderabad',
        'Gachibowli',
        'Aggressive smash player in Badminton and top-order batter in Cricket.',
        '/athlete_rahul.jpg',
        ST_SetSRID(ST_MakePoint(78.375, 17.445), 4326),
        94,
        12
      )
      ON CONFLICT (id) DO UPDATE SET display_name = EXCLUDED.display_name;
    `, [rahulUserId]);

    // Priya Mehta
    const userPriya = await query(`
      INSERT INTO users (email, password_hash)
      VALUES ('priya@sportsphere.com', $1)
      ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
      RETURNING id;
    `, [hashedPassword]);
    const priyaUserId = userPriya.rows[0].id;

    await query(`
      INSERT INTO athletes (id, user_id, display_name, city, area, bio, profile_image_url, location, attendance_rate_pct, zero_flake_streak)
      VALUES (
        'a2222222-2222-2222-2222-222222222222',
        $1,
        'Priya Mehta',
        'Hyderabad',
        'Hitec City',
        'Marathon runner and casual badminton enthusiast.',
        '/athlete_priya.jpg',
        ST_SetSRID(ST_MakePoint(78.385, 17.450), 4326),
        98,
        18
      )
      ON CONFLICT (id) DO UPDATE SET display_name = EXCLUDED.display_name;
    `, [priyaUserId]);

    // Arjun Kumar
    const userArjun = await query(`
      INSERT INTO users (email, password_hash)
      VALUES ('arjun@sportsphere.com', $1)
      ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
      RETURNING id;
    `, [hashedPassword]);
    const arjunUserId = userArjun.rows[0].id;

    await query(`
      INSERT INTO athletes (id, user_id, display_name, city, area, bio, profile_image_url, location, attendance_rate_pct, zero_flake_streak)
      VALUES (
        'a3333333-3333-3333-3333-333333333333',
        $1,
        'Arjun Kumar',
        'Hyderabad',
        'Kondapur',
        'Fast bowler and competitive turf football midfielder.',
        '/athlete_arjun.jpg',
        ST_SetSRID(ST_MakePoint(78.368, 17.460), 4326),
        92,
        8
      )
      ON CONFLICT (id) DO UPDATE SET display_name = EXCLUDED.display_name;
    `, [arjunUserId]);

    console.log('✅ 2. Test Athletes seeded (Vivek, Rahul, Priya, Arjun).');

    // 3. Insert Athlete Sports & Skill Levels
    await query(`
      INSERT INTO athlete_sports (athlete_id, sport_id, skill_level) VALUES
        ('ed3e0581-b173-4e21-b2c8-6707d96b3ad2', $1, 'Advanced'),
        ('ed3e0581-b173-4e21-b2c8-6707d96b3ad2', $2, 'Intermediate'),
        ('a1111111-1111-1111-1111-111111111111', $1, 'Advanced'),
        ('a1111111-1111-1111-1111-111111111111', $2, 'Intermediate'),
        ('a2222222-2222-2222-2222-222222222222', $3, 'Advanced'),
        ('a2222222-2222-2222-2222-222222222222', $1, 'Beginner'),
        ('a3333333-3333-3333-3333-333333333333', $4, 'Intermediate'),
        ('a3333333-3333-3333-3333-333333333333', $2, 'Advanced')
      ON CONFLICT DO NOTHING;
    `, [badmintonId, cricketId, runningId, footballId]);
    console.log('✅ 3. Athlete Multi-Sport Skill Levels seeded.');

    // 4. Insert Matches
    await query(`
      INSERT INTO matches (id, creator_id, sport_id, title, description, skill_level, location, location_name, city, scheduled_at, capacity, current_players, status) VALUES
        (
          'b1111111-1111-1111-1111-111111111111',
          'a1111111-1111-1111-1111-111111111111',
          $1,
          'Saturday Badminton Doubles Session',
          'Casual badminton doubles game. Court booked for 2 hours. Looking for 2 intermediate players.',
          'Intermediate',
          ST_SetSRID(ST_MakePoint(78.38, 17.44), 4326),
          'Gachibowli Indoor Sports Complex',
          'Hyderabad',
          CURRENT_TIMESTAMP + INTERVAL '1 day',
          4,
          2,
          'OPEN'
        ),
        (
          'b2222222-2222-2222-2222-222222222222',
          'a3333333-3333-3333-3333-333333333333',
          $2,
          'Weekend 7v7 Turf Football Match',
          'Fast-paced 7v7 turf match. Need 2 midfielders to complete team rosters. ₹200/player.',
          'Intermediate',
          ST_SetSRID(ST_MakePoint(78.385, 17.45), 4326),
          'AstroTurf Hitec City',
          'Hyderabad',
          CURRENT_TIMESTAMP + INTERVAL '2 days',
          14,
          12,
          'OPEN'
        ),
        (
          'b3333333-3333-3333-3333-333333333333',
          'a2222222-2222-2222-2222-222222222222',
          $3,
          'Sunrise 5K Morning Run Pod',
          'Group morning run around KBR Park loop. Pace around 5:30 min/km. Hydration provided.',
          'Beginner',
          ST_SetSRID(ST_MakePoint(78.41, 17.42), 4326),
          'KBR Park Main Gate',
          'Hyderabad',
          CURRENT_TIMESTAMP + INTERVAL '12 hours',
          10,
          6,
          'OPEN'
        )
      ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
    `, [badmintonId, footballId, runningId]);
    console.log('✅ 4. Game Lobby Matches seeded.');

    // 5. Insert Match Participants
    await query(`
      INSERT INTO match_participants (match_id, athlete_id, status) VALUES
        ('b1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'JOINED'),
        ('b1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 'JOINED'),
        ('b2222222-2222-2222-2222-222222222222', 'a3333333-3333-3333-3333-333333333333', 'JOINED')
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ 5. Match Participants seeded.');

    // 6. Insert Events & Tournaments
    await query(`
      INSERT INTO events (id, title, description, category, start_time, fee, location_name, registered_count, capacity, sport_id, organizer_id) VALUES
        (
          'c1111111-1111-1111-1111-111111111111',
          'Telangana Open Badminton Championship 2026',
          'Official regional singles and doubles championship with trophies and cash prize pool.',
          'Tournament 🏆',
          CURRENT_TIMESTAMP + INTERVAL '10 days',
          '₹500 Entry',
          'Pullela Gopichand Badminton Academy',
          42,
          64,
          $1,
          $3
        ),
        (
          'c2222222-2222-2222-2222-222222222222',
          'Hyderabad Night 10K Running Marathon',
          'Illuminated night run around Durgam Cheruvu cable bridge. Finisher medals for all runners.',
          'Marathon 🏃‍♀️',
          CURRENT_TIMESTAMP + INTERVAL '15 days',
          '₹750 Entry',
          'Durgam Cheruvu Amphitheatre',
          180,
          300,
          $2,
          $3
        )
      ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;
    `, [badmintonId, runningId, rahulUserId]);
    console.log('✅ 6. Local Events & Tournaments seeded.');

    // 7. Insert Community Feed Posts
    await query(`
      INSERT INTO community_posts (id, athlete_id, content, likes_count, comments_count) VALUES
        (
          'd1111111-1111-1111-1111-111111111111',
          'a1111111-1111-1111-1111-111111111111',
          'Won the Gachibowli Open Badminton Doubles Silver Medal! 🥈 Shoutout to Arjun for pairing up through SportSphere!',
          24,
          6
        ),
        (
          'd2222222-2222-2222-2222-222222222222',
          'a2222222-2222-2222-2222-222222222222',
          'Completed my first 10K run around KBR Park in 48:15! Thanks to the morning running pod for setting the pace! 🏃‍♀️💨',
          42,
          9
        )
      ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content;
    `);
    console.log('✅ 7. Community Feed Posts seeded.');

    console.log('🎉 Full SportSphere Database Seeding Completed Successfully!');
  } catch (error) {
    console.error('❌ Database Seeding Error:', error.message);
  }
};

// Execute if run directly from terminal
if (process.argv[1] && process.argv[1].endsWith('seedFullData.js')) {
  seedFullDatabase().then(() => pool.end());
}
