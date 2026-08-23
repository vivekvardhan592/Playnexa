const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper for HTTP requests with HttpOnly cookies credentials — STRICT BACKEND DIRECT CALLS
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
    console.error(`[Backend API Error]: ${endpoint}`, error.message);
    throw error;
  }
}

// === Auth Services ===
export async function apiLogin(email, password) {
  return await fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function apiRegister(data) {
  return await fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiForgotPassword(email) {
  return await fetchAPI('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function apiResetPassword(email, otpCode, newPassword) {
  return await fetchAPI('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, otpCode, newPassword }),
  });
}

export async function apiLogout() {
  return await fetchAPI('/auth/logout', { method: 'POST' });
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
  return apiData?.athletes || [];
}

export async function getAthleteById(id) {
  return await fetchAPI(`/v1/athletes/${id}`);
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
  return apiData?.matches || [];
}

export async function getMatchById(id) {
  const apiData = await fetchAPI(`/v1/matches/${id}`);
  return apiData?.match || apiData;
}

export async function createMatch(data) {
  const apiData = await fetchAPI('/v1/matches/create', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return apiData?.match || apiData;
}

export async function joinMatch(matchId) {
  const apiData = await fetchAPI(`/v1/matches/${matchId}/join`, { method: 'POST' });
  return apiData?.match || apiData;
}

export async function leaveMatch(matchId) {
  return await fetchAPI(`/v1/matches/${matchId}/leave`, { method: 'POST' });
}

// === Chat Services (Phase 7 Backend) ===
export async function getConversations() {
  const apiData = await fetchAPI('/v1/chat/conversations');
  return apiData?.conversations || [];
}

export async function startConversation(otherAthleteId) {
  return await fetchAPI('/v1/chat/conversations', {
    method: 'POST',
    body: JSON.stringify({ otherAthleteId }),
  });
}

export async function getMessageHistory(conversationId, { limit = 50, before = null } = {}) {
  const params = new URLSearchParams();
  if (limit) params.set('limit', limit);
  if (before) params.set('before', before);

  const apiData = await fetchAPI(`/v1/chat/conversations/${conversationId}/messages?${params.toString()}`);
  return apiData?.messages || [];
}

export async function sendMessage(convId, text) {
  return await fetchAPI('/v1/chat/send', {
    method: 'POST',
    body: JSON.stringify({ conversationId: convId, content: text }),
  });
}

// === Events Services ===
export async function getEvents() {
  const apiData = await fetchAPI('/v1/events');
  return apiData?.events || [];
}

export async function getEventById(id) {
  return await fetchAPI(`/v1/events/${id}`);
}

export async function registerForEvent(eventId) {
  return await fetchAPI(`/v1/events/${eventId}/register`, { method: 'POST' });
}

export async function leaveEvent(eventId) {
  return await fetchAPI(`/v1/events/${eventId}/leave`, { method: 'POST' });
}

export async function updateAthleteProfile(data) {
  const apiData = await fetchAPI('/v1/athletes/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return apiData?.athlete || apiData;
}

// === Teams Services ===
export async function getTeams() {
  const apiData = await fetchAPI('/v1/teams');
  return apiData?.teams || [];
}

// === Community Services ===
export async function getCommunityPosts() {
  const apiData = await fetchAPI('/v1/community/feed');
  return apiData?.posts || [];
}

export async function createCommunityPost(content) {
  const apiData = await fetchAPI('/v1/community/posts', {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
  return apiData?.post || apiData;
}

// === Notifications Services ===
export async function getNotifications() {
  const apiData = await fetchAPI('/v1/notifications');
  return apiData?.notifications || [];
}
