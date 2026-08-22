import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Heart, MapPin, Users } from 'lucide-react';

export default function FinalCTA({ onOpenMatchModal }) {
  return (
    <footer className="relative bg-[#05070a] border-t border-slate-800/80 pt-12 pb-10 overflow-hidden">
      
      {/* Background Animated Ecosystem Particle Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-emerald-500/15 via-cyan-500/10 to-transparent rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Emotional Final CTA Box */}
        <div className="glass-panel rounded-3xl p-8 sm:p-16 border border-slate-700/60 text-center shadow-2xl relative overflow-hidden">
          
          {/* Animated Background Ring */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border border-emerald-500/20 animate-ping-slow pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full border border-cyan-500/20 animate-ping-slow pointer-events-none"></div>

          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Ready to Play?</span>
            </div>

            <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Your next game is{' '}
              <span className="text-gradient-emerald">closer than you think.</span>
            </h2>

            <p className="text-slate-300 text-lg sm:text-xl leading-relaxed max-w-xl mx-auto">
              Find your people. Find your game. Start playing. Join thousands of local athletes on SportSphere today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={onOpenMatchModal}
                className="w-full sm:w-auto px-9 py-4 rounded-xl font-extrabold text-base text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 fill-slate-950" />
                <span>Join SportSphere Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href="#community"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base text-slate-200 bg-slate-900 border border-slate-700 hover:border-slate-500 transition-all flex items-center justify-center gap-2"
              >
                <Users className="w-5 h-5 text-cyan-400" />
                <span>Explore the Community</span>
              </a>
            </div>
          </div>

        </div>

        {/* Footer Navigation & Credits */}
        <div className="mt-20 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-400 to-cyan-400 p-0.5">
              <div className="w-full h-full bg-[#080a0f] rounded-[6px] flex items-center justify-center font-bold text-emerald-400 text-xs font-heading">
                SS
              </div>
            </div>
            <span className="font-heading font-extrabold text-white text-base">
              Sport<span className="text-emerald-400">Sphere</span>
            </span>
          </div>

          {/* Quick links */}
          <div className="flex items-center gap-6 font-medium">
            <a href="#discover" className="hover:text-emerald-400 transition-colors">Discover</a>
            <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</a>
            <a href="#community" className="hover:text-emerald-400 transition-colors">Community Feed</a>
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-2 font-mono">
            <span>Built for Hackathon 2026</span>
            <span>•</span>
            <span className="text-slate-400">Unified Athlete Platform</span>
          </div>

        </div>

      </div>
    </footer>
  );
}
