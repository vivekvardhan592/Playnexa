-- ============================================================
-- SportSphere Production PostgreSQL + PostGIS Migration DDL
-- Normalized relational schema with PostGIS spatial geometry
-- ============================================================

-- 1. Enable PostGIS Extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ATHLETE' CHECK (role IN ('ATHLETE', 'COACH', 'ORGANIZER', 'ADMIN')),
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 3. ATHLETES Table (One-to-One with Users, PostGIS Geography Location)
CREATE TABLE IF NOT EXISTS athletes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(100) NOT NULL,
    bio TEXT,
    profile_image_url VARCHAR(500) DEFAULT '/athlete_rahul.jpg',
    city VARCHAR(100) NOT NULL DEFAULT 'Hyderabad',
    area VARCHAR(100) DEFAULT 'Gachibowli',
    location GEOMETRY(Point, 4326), -- PostGIS WGS84 Spatial Coordinates (longitude, latitude)
    preferred_radius_km INT NOT NULL DEFAULT 10 CHECK (preferred_radius_km > 0 AND preferred_radius_km <= 100),
    attendance_rate_pct INT DEFAULT 94 CHECK (attendance_rate_pct >= 0 AND attendance_rate_pct <= 100),
    zero_flake_streak INT DEFAULT 12,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_athletes_location ON athletes USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_athletes_city ON athletes(city);

-- 4. SPORTS Table
CREATE TABLE IF NOT EXISTS sports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) DEFAULT 'General'
);

-- 5. ATHLETE_SPORTS Table (Multi-Sport Identity + JSONB Dynamic Metrics)
CREATE TABLE IF NOT EXISTS athlete_sports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
    skill_level VARCHAR(50) NOT NULL CHECK (skill_level IN ('Beginner', 'Intermediate', 'Advanced', 'Competitive')),
    sport_data JSONB DEFAULT '{}'::jsonb, -- e.g. {"battingAvg": 38.5, "smashSpeed": "240 km/h"}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_athlete_sport UNIQUE (athlete_id, sport_id)
);

CREATE INDEX IF NOT EXISTS idx_athlete_sports_composite ON athlete_sports(sport_id, skill_level);
CREATE INDEX IF NOT EXISTS idx_athlete_sports_gin ON athlete_sports USING GIN (sport_data);

-- 6. MATCHES Table (Game Lobbies with PostGIS Spatial Location)
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    skill_level VARCHAR(50) NOT NULL CHECK (skill_level IN ('Beginner', 'Intermediate', 'Advanced', 'Competitive', 'Any')),
    location GEOMETRY(Point, 4326),
    location_name VARCHAR(255) NOT NULL,
    city VARCHAR(100) DEFAULT 'Hyderabad',
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    capacity INT NOT NULL CHECK (capacity >= 2 AND capacity <= 100),
    current_players INT NOT NULL DEFAULT 1 CHECK (current_players <= capacity),
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'FULL', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_matches_location ON matches USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_matches_filter ON matches(sport_id, skill_level, status);
CREATE INDEX IF NOT EXISTS idx_matches_scheduled ON matches(scheduled_at);

-- 7. MATCH_PARTICIPANTS Table (Concurrency Safe & Idempotent)
CREATE TABLE IF NOT EXISTS match_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'JOINED' CHECK (status IN ('JOINED', 'LEFT', 'REMOVED')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_match_participant UNIQUE (match_id, athlete_id)
);

CREATE INDEX IF NOT EXISTS idx_match_participants ON match_participants(match_id, athlete_id);

-- 8. EVENTS Table (Tournaments & Marathons)
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100) DEFAULT 'Tournament',
    location GEOMETRY(Point, 4326),
    location_name VARCHAR(255) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    registered_count INT DEFAULT 0,
    fee VARCHAR(50) DEFAULT 'Free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_events_location ON events USING GIST (location);

-- 9. EVENT_PARTICIPANTS Table
CREATE TABLE IF NOT EXISTS event_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_event_participant UNIQUE (event_id, athlete_id)
);

-- 10. CONNECTIONS Table
CREATE TABLE IF NOT EXISTS connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'BLOCKED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_connection UNIQUE (requester_id, receiver_id)
);

CREATE INDEX IF NOT EXISTS idx_connections_lookup ON connections(requester_id, receiver_id);

-- 11. CONVERSATIONS & MESSAGES Tables (Real-Time Chat Persistence)
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at DESC);

-- 12. REVIEWS Table (Legitimate Participation Review Constraint)
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    reviewee_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_match_review UNIQUE (match_id, reviewer_id, reviewee_id)
);

-- 13. POSTS & COMMENTS (Community Feed)
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    post_type VARCHAR(50) DEFAULT 'Achievement 🏆',
    fire_count INT DEFAULT 0,
    trophy_count INT DEFAULT 0,
    heart_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. NOTIFICATIONS Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    subtitle TEXT,
    data JSONB DEFAULT '{}'::jsonb,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read_at);

-- 15. AUDIT_LOGS Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    ip_address VARCHAR(100),
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
