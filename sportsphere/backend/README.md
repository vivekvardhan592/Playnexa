# SportSphere Backend API & Real-Time Socket Service

Production-ready, hackathon-friendly Node.js / Express backend service powering **SportSphere** — the unified multi-sport platform for athletes.

---

## 🏗️ Architecture & Directory Structure

```
sportsphere/backend/
├── server.js                     # Express App & Socket.io server entry point
├── package.json                  # Dependencies & scripts
├── .env.example                  # Environment configuration variables
└── src/
    ├── config/
    │   └── db.js                 # MongoDB connection setup with fallback
    ├── controllers/
    │   ├── authController.js     # User registration, JWT login, profile fetching
    │   ├── athleteController.js  # Multi-sport identity & local discovery APIs
    │   ├── matchController.js    # Match Radar engine (Sport+Skill+Distance calculation)
    │   ├── communityController.js# Social feed updates, post creation & reactions
    │   └── chatController.js     # Real-time athlete direct messaging
    ├── middleware/
    │   ├── authMiddleware.js     # JWT bearer token verification
    │   └── errorHandler.js       # Global error handler
    ├── models/
    │   ├── User.js               # Athlete schema with multi-sport identity & attendance %
    │   ├── Match.js              # Match/Game creation schema
    │   ├── Post.js               # Community post & reaction schema
    │   └── Message.js            # Athlete direct message schema
    └── routes/
        ├── authRoutes.js         # /api/auth endpoints
        ├── athleteRoutes.js      # /api/athletes endpoints
        ├── matchRoutes.js        # /api/matches endpoints
        ├── communityRoutes.js    # /api/community endpoints
        └── chatRoutes.js         # /api/chat endpoints
```

---

## ⚡ Quick Start

1. **Install Dependencies**:
   ```bash
   cd sportsphere/backend
   npm install
   ```

2. **Configure Environment**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

3. **Run Server**:
   - **Development**: `npm run dev`
   - **Production**: `npm start`

4. **Health Check**:
   Visit `http://localhost:5000/api/health` to confirm server status.

---

## 📡 API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Create new athlete account
- `POST /api/auth/login` — Login & receive JWT token
- `GET /api/auth/profile` — Fetch current athlete profile

### Athletes & Multi-Sport Profile (`/api/athletes`)
- `GET /api/athletes/nearby` — Discover local athletes by sport & radius
- `PUT /api/athletes/sports-profile` — Update sport-specific metrics (Batting Avg, Smash Speed, 10K Pace)

### Match Radar Engine (`/api/matches`)
- `GET /api/matches/radar` — Filter matches by Sport + Skill + Distance Radius
- `POST /api/matches/create` — Create open game lobby
- `POST /api/matches/:matchId/join` — Join open game lobby

### Community Social Feed (`/api/community`)
- `GET /api/community/feed` — Get active social posts & achievements
- `POST /api/community/post` — Share new update or match spot opening
- `POST /api/community/post/:id/react` — Toggle reactions (🔥, 🏆, ❤️)
- `POST /api/community/post/:id/comment` — Add comment

### Real-Time Chat (`/api/chat` & Socket.io)
- `GET /api/chat/messages` — Fetch direct message thread
- `POST /api/chat/send` — Send direct message with instant auto-reply simulation
- **Socket Events**: `send_message`, `receive_message`, `match_created`, `new_match_ping`
