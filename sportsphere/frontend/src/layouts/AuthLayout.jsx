import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import ThemeToggle from '../components/ui/ThemeToggle';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#080a0f] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col justify-between relative overflow-hidden">
      
      {/* Background Animated Atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Header Logo + Theme Toggle */}
      <header className="p-6 max-w-7xl mx-auto w-full flex items-center justify-between z-10">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#080a0f] rounded-[10px] flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-400 animate-pulse" />
            </div>
          </div>
          <span className="font-heading text-xl font-extrabold text-white">
            Sport<span className="text-emerald-400">Sphere</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/" className="text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors">
            ← Back to Overview
          </Link>
        </div>
      </header>

      {/* Auth Form Card Outlet */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10 w-full max-w-md mx-auto">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-slate-400 font-mono z-10">
        Built for Hackathon 2026 • Unified Athlete Platform
      </footer>
    </div>
  );
}
