import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Menu, X, Users, MapPin, Search } from 'lucide-react';

export default function Navbar({ onOpenMatchModal }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#080a0f]/85 backdrop-blur-xl border-b border-slate-800/60 py-3 shadow-2xl shadow-emerald-950/20'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#080a0f] rounded-[10px] flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-400 animate-pulse relative">
                  <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-40"></div>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                Sport<span className="text-emerald-400">Sphere</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase -mt-1">
                Multi-Sport Network
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a
              href="#discover"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Search className="w-4 h-4 text-emerald-400/70" />
              Discover
            </a>
            <a
              href="#how-it-works"
              className="hover:text-emerald-400 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#community"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Users className="w-4 h-4 text-cyan-400/70" />
              Community
            </a>
          </nav>

          {/* Right Action CTA & Live Stats */}
          <div className="hidden md:flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-mono text-emerald-400 font-semibold">1,420</span>
              <span className="text-slate-400">Athletes near Hyderabad</span>
            </div>

            <button
              onClick={onOpenMatchModal}
              className="relative inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 mr-2 text-slate-950 fill-slate-950" />
              Find Your Match
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-800 px-6 py-6 mt-2 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-4 text-base font-medium text-slate-200">
            <a
              href="#discover"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 hover:text-emerald-400 py-1"
            >
              <Search className="w-4 h-4 text-emerald-400" />
              Discover Matches
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-emerald-400 py-1"
            >
              How It Works
            </a>
            <a
              href="#community"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 hover:text-emerald-400 py-1"
            >
              <Users className="w-4 h-4 text-cyan-400" />
              Community
            </a>
          </nav>
          
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hyderabad Radius · 1,420 Active Players</span>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMatchModal();
              }}
              className="w-full py-3 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:opacity-90 transition-opacity"
            >
              Find Your Match
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
