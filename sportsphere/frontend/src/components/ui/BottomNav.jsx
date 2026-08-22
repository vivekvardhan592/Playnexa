import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Swords, MessageSquare, User } from 'lucide-react';

const MOBILE_NAV = [
  { path: '/app', icon: Home, label: 'Home', end: true },
  { path: '/app/discover', icon: Search, label: 'Discover' },
  { path: '/app/matches', icon: Swords, label: 'Matches' },
  { path: '/app/messages', icon: MessageSquare, label: 'Messages', badge: 3 },
  { path: '/app/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#080a0f]/95 backdrop-blur-xl border-t border-slate-800/80 px-4 py-2 flex items-center justify-around shadow-2xl">
      {MOBILE_NAV.map(({ path, icon: Icon, label, end, badge }) => (
        <NavLink
          key={path}
          to={path}
          end={end}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-medium transition-all relative py-1 px-2 rounded-xl
            ${isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`
          }
        >
          <Icon className="w-5 h-5" />
          <span>{label}</span>
          {badge && (
            <span className="absolute top-0 right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-extrabold flex items-center justify-center">
              {badge}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
