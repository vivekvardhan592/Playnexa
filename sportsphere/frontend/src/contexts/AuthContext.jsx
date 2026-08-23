import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiLogin, apiRegister, apiLogout, apiGetProfile } from '../services/api.js';
import { initSocket, disconnectSocket } from '../services/socket.js';

const AuthContext = createContext(null);

const DEMO_USER = {
  id: 'user_1',
  athleteId: 'ed3e0581-b173-4e21-b2c8-6707d96b3ad2',
  name: 'Vivek Kumar',
  email: 'vivek@sportsphere.com',
  city: 'Hyderabad',
  area: 'Gachibowli',
  bio: 'Weekend badminton player and competitive cricket enthusiast. Always looking for the next game.',
  avatar: '/athlete_rahul.jpg',
  verified: true,
  memberSince: 'Jan 2026',
  sports: [
    {
      sport: 'Badminton',
      emoji: '🏸',
      skillLevel: 'Advanced',
      metrics: { matches: 42, winRate: '68%', playingStyle: 'Aggressive Smash', personalBest: '21-8 set win' },
    },
    {
      sport: 'Cricket',
      emoji: '🏏',
      skillLevel: 'Intermediate',
      metrics: { matches: 28, runs: 892, average: '38.5', role: 'All-Rounder (Batting)' },
    },
  ],
  trust: {
    totalScheduled: 24,
    completed: 22,
    attendanceRatePct: 92,
    zeroFlakeStreak: 14,
    uniqueCoPlayersMet: 18,
    monthsActive: 8,
  },
  availability: {
    days: ['Monday', 'Wednesday', 'Friday', 'Saturday', 'Sunday'],
    timeRange: '6:00 AM – 8:00 PM',
    preferredPlayTimes: 'Evenings & Weekend Mornings',
  },
  discoveryRadius: 10,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const profile = await apiGetProfile();
        if (profile && profile.user) {
          setUser((prev) => ({ ...prev, ...profile.user }));
          setIsAuthenticated(true);
          if (profile.token) {
            setAuthToken(profile.token);
            initSocket(profile.token);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    const res = await apiLogin(email, password);
    if (res && res.user) {
      setUser((prev) => ({ ...prev, ...res.user }));
      setIsAuthenticated(true);
      if (res.token) {
        setAuthToken(res.token);
        initSocket(res.token);
      }
      return true;
    }
    return false;
  };

  const demoLogin = async () => login('vivek@sportsphere.com', 'password123');

  const signup = async (data) => {
    const res = await apiRegister(data);
    if (res && res.user) {
      setUser((prev) => ({ ...prev, ...res.user }));
      setIsAuthenticated(true);
      if (res.token) {
        setAuthToken(res.token);
        initSocket(res.token);
      }
      return true;
    }
    return false;
  };

  const logout = async () => {
    await apiLogout();
    disconnectSocket();
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, authToken, loading, login, demoLogin, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { DEMO_USER };
