import { ATHLETES, MATCHES, EVENTS, TEAMS, POSTS, CONVERSATIONS, NOTIFICATIONS } from '../data/mockData.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper for HTTP requests with HttpOnly cookies credentials
async function fetchAPI(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      credentials: 'include', // Send & receive HttpOnly authentication cookies
    });

    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const json = await res.json();
    return json.data || json;
  } catch (error) {
    console.warn(`[API Notice]: Endpoint ${endpoint} fallback active (${error.message})`);
    return null;
  }
}

// --- Auth Services ---
export async function apiLogin(email, password) {
  const result = await fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return result;
}

export async function apiRegister(data) {
  const result = await fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return result;
}

export async function apiLogout() {
  await fetchAPI('/auth/logout', { method: 'POST' });
}

export async function apiGetProfile() {
  return await fetchAPI('/auth/profile');
}

// --- Athletes Services ---
export async function getAthletes(filters = {}) {
  const query = new URLSearchParams(filters).toString();
  const apiData = await fetchAPI(`/athletes/nearby?${query}`);
  if (apiData && apiData.athletes) return apiData.athletes;

  // Fallback to seeded demo data
  let results = [...ATHLETES];
  if (filters.sport && filters.sport !== 'All') results = results.filter((a) => a.sports.some((s) => s.sport === filters.sport));
  if (filters.skill && filters.skill !== 'All') results = results.filter((a) => a.sports.some((s) => s.skillLevel === filters.skill));
  if (filters.maxDistance) results = results.filter((a) => a.distanceKm <= filters.maxDistance);
  results.sort((a, b) => b.matchScore - a.matchScore);
  return results;
}

export async function getAthleteById(id) {
  const apiData = await fetchAPI(`/athletes/${id}`);
  if (apiData) return apiData;
  return ATHLETES.find((a) => a.id === id) || ATHLETES[0];
}

// --- Matches Services ---
export async function getMatches(filters = {}) {
  const query = new URLSearchParams(filters).toString();
  const apiData = await fetchAPI(`/matches/radar?${query}`);
  if (apiData && apiData.matches) return apiData.matches;

  let results = [...MATCHES];
  if (filters.sport && filters.sport !== 'All') results = results.filter((m) => m.sport === filters.sport);
  return results;
}

export async function getMatchById(id) {
  const apiData = await fetchAPI(`/matches/${id}`);
  if (apiData) return apiData;
  return MATCHES.find((m) => m.id === id) || MATCHES[0];
}

export async function createMatch(data) {
  const apiData = await fetchAPI('/matches/create', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (apiData && apiData.match) return apiData.match;

  const newMatch = {
    id: `match_${Date.now()}`,
    ...data,
    status: 'OPEN',
    currentPlayers: 1,
    participants: [],
    creator: { name: 'Vivek Kumar', avatar: '/athlete_rahul.jpg', verified: true },
  };
  MATCHES.unshift(newMatch);
  return newMatch;
}

export async function joinMatch(matchId) {
  const apiData = await fetchAPI(`/matches/${matchId}/join`, { method: 'POST' });
  if (apiData && apiData.match) return apiData.match;

  const match = MATCHES.find((m) => m.id === matchId);
  if (match && match.currentPlayers < match.maxPlayers) {
    match.currentPlayers += 1;
    if (match.currentPlayers === match.maxPlayers) match.status = 'FULL';
  }
  return match;
}

// --- Events Services ---
export async function getEvents() {
  const apiData = await fetchAPI('/events');
  if (apiData && apiData.events) return apiData.events;
  return [...EVENTS];
}

export async function getEventById(id) {
  return EVENTS.find((e) => e.id === id) || EVENTS[0];
}

// --- Teams Services ---
export async function getTeams() {
  return [...TEAMS];
}

// --- Community Services ---
export async function getCommunityPosts() {
  const apiData = await fetchAPI('/community/feed');
  if (apiData && apiData.posts) return apiData.posts;
  return [...POSTS];
}

// --- Messages Services ---
export async function getConversations() {
  const apiData = await fetchAPI('/chat/messages');
  if (apiData && apiData.messages) {
    return [
      {
        id: 'conv_rahul',
        athlete: ATHLETES[0],
        lastMessage: apiData.messages[apiData.messages.length - 1]?.text || 'Hey Vivek!',
        timestamp: 'Just now',
        unreadCount: 0,
        messages: apiData.messages,
      },
      ...CONVERSATIONS.slice(1),
    ];
  }
  return [...CONVERSATIONS];
}

export async function sendMessage(convId, text) {
  const apiData = await fetchAPI('/chat/send', {
    method: 'POST',
    body: JSON.stringify({ text, receiverName: 'Rahul S.', sport: 'Badminton' }),
  });

  const conv = CONVERSATIONS.find((c) => c.id === convId);
  if (conv) {
    const msg = { id: Date.now(), sender: 'Vivek', text, time: 'Just now', isOwn: true };
    conv.messages.push(msg);
    conv.lastMessage = text;
    conv.timestamp = 'Just now';
    return msg;
  }
  return null;
}

// --- Notifications Services ---
export async function getNotifications() {
  return [...NOTIFICATIONS];
}
