import { ATHLETES, MATCHES, EVENTS, TEAMS, POSTS, CONVERSATIONS, NOTIFICATIONS } from '../data/mockData.js';

// ============================================================
// SportSphere Service Layer
// Returns mock data now; structured for easy REST API swap
// ============================================================

// Simulate network delay
const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

// --- Athletes ---
export async function getAthletes(filters = {}) {
  await delay();
  let results = [...ATHLETES];
  if (filters.sport && filters.sport !== 'All') results = results.filter((a) => a.sports.some((s) => s.sport === filters.sport));
  if (filters.skill && filters.skill !== 'All') results = results.filter((a) => a.sports.some((s) => s.skillLevel === filters.skill));
  if (filters.maxDistance) results = results.filter((a) => a.distanceKm <= filters.maxDistance);
  results.sort((a, b) => b.matchScore - a.matchScore);
  return results;
}

export async function getAthleteById(id) {
  await delay();
  return ATHLETES.find((a) => a.id === id) || null;
}

// --- Matches ---
export async function getMatches(filters = {}) {
  await delay();
  let results = [...MATCHES];
  if (filters.sport && filters.sport !== 'All') results = results.filter((m) => m.sport === filters.sport);
  if (filters.status) results = results.filter((m) => m.status === filters.status);
  return results;
}

export async function getMatchById(id) {
  await delay();
  return MATCHES.find((m) => m.id === id) || null;
}

export async function createMatch(data) {
  await delay(300);
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
  await delay(300);
  const match = MATCHES.find((m) => m.id === matchId);
  if (match && match.currentPlayers < match.maxPlayers) {
    match.currentPlayers += 1;
    if (match.currentPlayers === match.maxPlayers) match.status = 'FULL';
  }
  return match;
}

// --- Events ---
export async function getEvents() {
  await delay();
  return [...EVENTS];
}

export async function getEventById(id) {
  await delay();
  return EVENTS.find((e) => e.id === id) || null;
}

// --- Teams ---
export async function getTeams() {
  await delay();
  return [...TEAMS];
}

// --- Community ---
export async function getCommunityPosts() {
  await delay();
  return [...POSTS];
}

// --- Messages ---
export async function getConversations() {
  await delay();
  return [...CONVERSATIONS];
}

export async function getConversationById(id) {
  await delay();
  return CONVERSATIONS.find((c) => c.id === id) || null;
}

export async function sendMessage(convId, text) {
  await delay(200);
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

// --- Notifications ---
export async function getNotifications() {
  await delay();
  return [...NOTIFICATIONS];
}
