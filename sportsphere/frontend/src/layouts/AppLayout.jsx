import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar';
import BottomNav from '../components/ui/BottomNav';
import ThemeToggle from '../components/ui/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { Bell, Plus, Search, MapPin, Sparkles } from 'lucide-react';

export default function AppLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#080a0f] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] flex relative overflow-x-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-60 flex flex-col min-w-0 pb-20 md:pb-8">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-[#080a0f]/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Mobile Logo Branding */}
          <div className="flex items-center gap-2 md:hidden">
            <Link to="/app" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 p-0.5">
                <div className="w-full h-full bg-[#080a0f] rounded-[6px] flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>
              <span className="font-heading font-extrabold text-base text-white">
                Sport<span className="text-emerald-400">Sphere</span>
              </span>
            </Link>
          </div>

          {/* Quick Location Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{user?.area || 'Gachibowli'}, {user?.city || 'Hyderabad'}</span>
            <span className="text-emerald-400 font-mono text-[11px] bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800/60">
              {user?.discoveryRadius || 10} km radius
            </span>
          </div>

          {/* Actions: Theme Toggle + Notifications + Create Match CTA + User Avatar */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            <button
              onClick={() => navigate('/app/create-match')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Create Match</span>
            </button>

            <Link
              to="/app/notifications"
              className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </Link>

            <Link to="/app/profile" className="flex items-center gap-2 group">
              <img
                src={user?.avatar || '/athlete_rahul.jpg'}
                alt={user?.name || 'Athlete'}
                className="w-8 h-8 rounded-xl object-cover border border-slate-700 group-hover:border-emerald-400 transition-colors"
              />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <BottomNav />
    </div>
  );
}
