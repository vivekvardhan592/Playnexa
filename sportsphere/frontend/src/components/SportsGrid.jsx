import React from 'react';
import { Compass, Users, Sparkles, ArrowRight } from 'lucide-react';

const SPORTS_LIST = [
  { name: 'Cricket', icon: '🏏', players: '2,450+', tag: 'T20 & Box Cricket' },
  { name: 'Football', icon: '⚽', players: '1,890+', tag: '7v7 & Turf Matches' },
  { name: 'Badminton', icon: '🏸', players: '3,120+', tag: 'Singles & Doubles' },
  { name: 'Swimming', icon: '🏊', players: '980+', tag: 'Pool Laps & Pods' },
  { name: 'Athletics & Running', icon: '🏃', players: '2,100+', tag: '10K & Marathoners' },
  { name: 'Chess', icon: '♟️', players: '1,340+', tag: 'OTB Rapid & Blitz' },
  { name: 'Basketball', icon: '🏀', players: '1,150+', tag: '3v3 & Full Court' },
  { name: 'Tennis', icon: '🎾', players: '870+', tag: 'Clay & Hard Court' },
];

export default function SportsGrid({ onOpenMatchModal }) {
  return (
    <section id="sports-grid" className="py-12 sm:py-16 relative bg-[#080a0f] overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Active Sports Directory</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Supported Sports & <span className="text-gradient-emerald">Local Communities.</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Explore active player networks across 20+ sports categories. Click any sport to discover local players and active matches nearby.
          </p>
        </div>

        {/* Sports Grid */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {SPORTS_LIST.map((sport, idx) => (
            <div
              key={idx}
              onClick={onOpenMatchModal}
              className="glass-panel-interactive rounded-3xl p-6 border border-slate-800 text-left transition-all duration-300 group cursor-pointer hover:border-emerald-500/50"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                  {sport.icon}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                  {sport.players}
                </span>
              </div>

              <h3 className="font-heading font-extrabold text-xl text-white group-hover:text-emerald-400 transition-colors">
                {sport.name}
              </h3>

              <div className="text-xs text-slate-400 mt-1 font-medium">
                {sport.tag}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Find Players</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 max-w-4xl mx-auto glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div>
            <h4 className="font-heading font-bold text-white text-lg">Don't see your sport listed?</h4>
            <p className="text-xs text-slate-400">SportSphere supports custom user-created sports communities & niche local clubs.</p>
          </div>
          <button
            onClick={onOpenMatchModal}
            className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-400 text-white font-bold text-xs shrink-0 cursor-pointer transition-colors"
          >
            + Add Your Sport
          </button>
        </div>

      </div>
    </section>
  );
}
