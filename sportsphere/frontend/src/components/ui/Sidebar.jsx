import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home, Search, Swords, Calendar, MessageSquare, Users, User,
  Bell, Settings, LogOut, Shield, ChevronLeft, ChevronRight
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/app', icon: Home, label: 'Home', end: true },
  { path: '/app/discover', icon: Search, label: 'Discover' },
  { path: '/app/matches', icon: Swords, label: 'Matches' },
  { path: '/app/events', icon: Calendar, label: 'Events' },
  { path: '/app/messages', icon: MessageSquare, label: 'Messages', badge: 3 },
  { path: '/app/community', icon: Users, label: 'Community' },
  { path: '/app/profile', icon: User, label: 'Profile' },
];

const SECONDARY_ITEMS = [
  { path: '/app/notifications', icon: Bell, label: 'Notifications', badge: 3 },
  { path: '/app/teams', icon: Shield, label: 'Teams' },
  { path: '/app/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 flex flex-col transition-all duration-300 ease-out
        ${collapsed ? 'w-[72px]' : 'w-[240px]'}
        bg-[#080a0f]/95 backdrop-blur-xl border-r border-slate-800/60`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800/60">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 shrink-0">
          <div className="w-full h-full bg-[#080a0f] rounded-[10px] flex items-center justify-center">
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-400 animate-pulse" />
          </div>
        </div>
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="font-heading text-lg font-extrabold tracking-tight text-white flex items-center gap-1 whitespace-nowrap">
              Sport<span className="text-emerald-400">Sphere</span>
            </span>
          </div>
        )}
      </div>

      {/* Primary Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ path, icon: Icon, label, end, badge }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative
              ${isActive
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
              }`
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">{label}</span>}
            {badge && (
              <span className={`${collapsed ? 'absolute top-1 right-1' : 'ml-auto'} min-w-[20px] h-5 flex items-center justify-center px-1.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold`}>
                {badge}
              </span>
            )}
          </NavLink>
        ))}

        <div className="pt-4 mt-4 border-t border-slate-800/60 space-y-1">
          {SECONDARY_ITEMS.map(({ path, icon: Icon, label, badge }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-slate-800/60 text-white'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
                }`
              }
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              {!collapsed && <span className="whitespace-nowrap">{label}</span>}
              {badge && (
                <span className={`${collapsed ? 'absolute top-1 right-1' : 'ml-auto'} min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-full bg-red-500 text-white text-[9px] font-bold`}>
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User Panel */}
      <div className="px-3 py-4 border-t border-slate-800/60">
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-xl object-cover border border-slate-700" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{user.name}</div>
              <div className="text-[11px] text-emerald-400 font-medium truncate">{user.city}</div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all w-full cursor-pointer"
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all z-50 cursor-pointer"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </aside>
  );
}
