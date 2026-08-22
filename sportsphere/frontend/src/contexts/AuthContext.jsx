import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const DEMO_USER = {
  id: 'user_vivek',
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
    {
      sport: 'Running',
      emoji: '🏃',
      skillLevel: 'Beginner',
      metrics: { best5k: '28:15', best10k: '58:30', totalKm: '142 km', preferredTime: '6:00 AM' },
    },
    {
      sport: 'Swimming',
      emoji: '🏊',
      skillLevel: 'Beginner',
      metrics: { laps: 120, preferredStroke: 'Freestyle', bestLap: '42s (50m)' },
    },
    {
      sport: 'Chess',
      emoji: '♟️',
      skillLevel: 'Intermediate',
      metrics: { rating: 1650, wins: 84, format: 'Rapid 10+0', winStreak: 5 },
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

  const login = (email, password) => {
    // Demo login — accepts anything
    setUser(DEMO_USER);
    setIsAuthenticated(true);
    return true;
  };

  const demoLogin = () => {
    setUser(DEMO_USER);
    setIsAuthenticated(true);
    return true;
  };

  const signup = (data) => {
    const newUser = { ...DEMO_USER, ...data };
    setUser(newUser);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, demoLogin, signup, logout, updateUser }}>
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
