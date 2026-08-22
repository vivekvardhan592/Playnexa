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

    const json = await res.json();

    if (!res.ok) {
      const error = new Error(json?.error?.message || json?.message || `HTTP Error ${res.status}`);
      error.statusCode = res.status;
      error.code = json?.error?.code;
      throw error;
    }

    return json.data || json;
  } catch (error) {
    // Re-throw errors with statusCode (real backend errors)
    if (error.statusCode) throw error;
    // Network errors — fall through to mock data
    console.warn(`[API Notice]: Endpoint ${endpoint} fallback active (${error.message})`);
    return null;
  }
}

// === Auth Services ===
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

export async function apiForgotPassword(email) {
  const result = await fetchAPI('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
  return result || { success: true, message: `Password reset verification code sent to ${email}` };
}

export async function apiResetPassword(email, otpCode, newPassword) {
  const result = await fetchAPI('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, otpCode, newPassword }),
  });
  return result || { success: true, message: 'Password reset successfully!' };
}

export async function apiLogout() {
  await fetchAPI('/auth/logout', { method: 'POST' });
}

export async function apiGetProfile() {
  return await fetchAPI('/auth/profile');
}

// === Discovery Services (Phase 5 Backend) ===
export async function getAthletes(filters = {}) {
  const params = new URLSearchParams();
  if (filters.sport && filters.sport !== 'All') params.set('sport', filters.sport);
  if (filters.skill && filters.skill !== 'All') params.set('skill', filters.skill);
  if (filters.longitude) params.set('longitude', filters.longitude);
  if (filters.latitude) params.set('latitude', filters.latitude);
  if (filters.radiusKm || filters.maxDistance) params.set('radiusKm', filters.radiusKm || filters.maxDistance || 10);
  if (filters.limit) params.set('limit', filters.limit);

  const apiData = await fetchAPI(`/v1/discovery/athletes?${params.toString()}`);
  if (apiData && apiData.athletes) return apiData.athletes;

  // Fallback to mock data
  let results = [...ATHLETES];
  if (filters.sport && filters.sport !== 'All') results = results.filter((a) => a.sports.some((s) => s.sport === filters.sport));
  if (filters.skill && filters.skill !== 'All') results = results.filter((a) => a.sports.some((s) => s.skillLevel === filters.skill));
  if (filters.maxDistance) results = results.filter((a) => a.distanceKm <= filters.maxDistance);
  results.sort((a, b) => b.matchScore - a.matchScore);
  return results;
}

export async function getAthleteById(id) {
  const apiData = await fetchAPI(`/v1/athletes/${id}`);
  if (apiData) return apiData;
  return ATHLETES.find((a) => a.id === id) || ATHLETES[0];
}

// === Matches Services (Phase 6 Backend) ===
export async function getMatches(filters = {}) {
  const params = new URLSearchParams();
  if (filters.sport && filters.sport !== 'All') params.set('sport', filters.sport);
  if (filters.longitude) params.set('longitude', filters.longitude);
  if (filters.latitude) params.set('latitude', filters.latitude);
  if (filters.radiusKm) params.set('radiusKm', filters.radiusKm);
  if (filters.status) params.set('status', filters.status);

  const apiData = await fetchAPI(`/v1/matches/radar?${params.toString()}`);
  if (apiData && apiData.matches) return apiData.matches;

  // Fallback to mock
  let results = [...MATCHES];
  if (filters.sport && filters.sport !== 'All') results = results.filter((m) => m.sport === filters.sport);
  return results;
}

export async function getMatchById(id) {
  const apiData = await fetchAPI(`/v1/matches/${id}`);
  if (apiData && apiData.match) return apiData.match;
  return MATCHES.find((m) => m.id === id) || MATCHES[0];
}

export async function createMatch(data) {
  const apiData = await fetchAPI('/v1/matches/create', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (apiData && apiData.match) return apiData.match;

  // Fallback mock
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
  const apiData = await fetchAPI(`/v1/matches/${matchId}/join`, { method: 'POST' });
  if (apiData && apiData.match) return apiData.match;

  // Fallback mock
  const match = MATCHES.find((m) => m.id === matchId);
  if (match && match.currentPlayers < match.maxPlayers) {
    match.currentPlayers += 1;
    if (match.currentPlayers === match.maxPlayers) match.status = 'FULL';
  }
  return match;
}

export async function leaveMatch(matchId) {
  const apiData = await fetchAPI(`/v1/matches/${matchId}/leave`, { method: 'POST' });
  if (apiData) return apiData;
  return null;
}

// === Chat Services (Phase 7 Backend) ===
export async function getConversations() {
  const apiData = await fetchAPI('/v1/chat/conversations');
  if (apiData && apiData.conversations) return apiData.conversations;

  // Fallback to mock
  return [...CONVERSATIONS];
}

export async function startConversation(otherAthleteId) {
  const apiData = await fetchAPI('/v1/chat/conversations', {
    method: 'POST',
    body: JSON.stringify({ otherAthleteId }),
  });
  if (apiData && apiData.conversationId) return apiData;
  return { conversationId: `conv_${Date.now()}` };
}

export async function getMessageHistory(conversationId, { limit = 50, before = null } = {}) {
  const params = new URLSearchParams();
  if (limit) params.set('limit', limit);
  if (before) params.set('before', before);

  const apiData = await fetchAPI(`/v1/chat/conversations/${conversationId}/messages?${params.toString()}`);
  if (apiData && apiData.messages) return apiData.messages;
  return [];
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

// === Events Services ===
export async function getEvents() {
  const apiData = await fetchAPI('/v1/events');
  if (apiData && apiData.events) return apiData.events;
  return [...EVENTS];
}

export async function getEventById(id) {
  return EVENTS.find((e) => e.id === id) || EVENTS[0];
}

// === Teams Services ===
export async function getTeams() {
  const apiData = await fetchAPI('/v1/teams');
  if (apiData && apiData.teams) return apiData.teams;
  return [...TEAMS];
}

// === Community Services ===
export async function getCommunityPosts() {
  const apiData = await fetchAPI('/v1/community/feed');
  if (apiData && apiData.posts) return apiData.posts;
  return [...POSTS];
}

export async function createCommunityPost(content) {
  const apiData = await fetchAPI('/v1/community/posts', {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
  if (apiData && apiData.post) return apiData.post;
  return null;
}

// === Notifications Services ===
export async function getNotifications() {
  const apiData = await fetchAPI('/v1/notifications');
  if (apiData && apiData.notifications) return apiData.notifications;
  return [...NOTIFICATIONS];
}
