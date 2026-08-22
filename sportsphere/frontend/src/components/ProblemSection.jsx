import React, { useState } from 'react';
import { MessageCircle, Activity, Globe, Flame, Layers, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';

export default function ProblemSection() {
  const [unified, setUnified] = useState(true);

  return (
    <section className="py-12 sm:py-16 relative overflow-hidden bg-[#080a0f]">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>The Fragmented Reality</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Sports shouldn't be <span className="text-amber-400">fragmented.</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            You shouldn't need five different apps, endless WhatsApp group noise, and separate forums just to find someone available to play tomorrow.
          </p>
        </div>

        {/* Interactive Unification Transformation Visualizer */}
        <div className="mt-14 max-w-5xl mx-auto glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800/80 shadow-2xl relative">
          
          {/* Toggle Control Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-10">
            <div className="text-left">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">CURRENT ARCHITECTURE</span>
              <h3 className="text-xl font-bold text-white font-heading">
                {unified ? 'Unified SportSphere Ecosystem' : 'Fragmented Chaos (Status Quo)'}
              </h3>
            </div>

            <button
              onClick={() => setUnified(!unified)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-lg ${
                unified
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/25 hover:bg-emerald-400'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
              }`}
            >
              <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${unified ? 'rotate-180' : ''}`} />
              <span>{unified ? 'Click to view Fragmented Chaos' : 'Click to Unify with SportSphere'}</span>
            </button>
          </div>

          {/* Interactive State Display */}
          {unified ? (
            /* UNIFIED STATE */
            <div className="py-8 transition-all duration-700 animate-in fade-in zoom-in-95">
              <div className="relative flex flex-col items-center justify-center">
                
                {/* Central SportSphere Core */}
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-cyan-500/20 border-2 border-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.3)] flex items-center justify-center p-4">
                  <div className="w-full h-full rounded-full bg-slate-950/90 border border-slate-800 flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-400 to-cyan-400 flex items-center justify-center mb-2">
                      <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
                    </div>
                    <span className="font-heading font-black text-white text-lg sm:text-xl">SportSphere</span>
                    <span className="text-[10px] font-mono text-emerald-400 mt-0.5">ONE UNIFIED HUB</span>
                  </div>

                  {/* Pulsing Connected Orbit Lines */}
                  <div className="absolute inset-0 rounded-full border border-emerald-400/30 animate-ping-slow pointer-events-none"></div>
                </div>

                {/* Orbiting Integrated Sports Nodes */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mt-10">
                  <div className="glass-card p-4 rounded-2xl border border-emerald-500/30 text-left bg-emerald-950/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">🏏</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">CONNECTED</span>
                    </div>
                    <div className="font-bold text-white text-sm">Cricket Identity</div>
                    <div className="text-xs text-slate-400">Batting avg & local matches</div>
                  </div>

                  <div className="glass-card p-4 rounded-2xl border border-cyan-500/30 text-left bg-cyan-950/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">🏃</span>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded">CONNECTED</span>
                    </div>
                    <div className="font-bold text-white text-sm">Running Stats</div>
                    <div className="text-xs text-slate-400">10K pace & local pods</div>
                  </div>

                  <div className="glass-card p-4 rounded-2xl border border-emerald-500/30 text-left bg-emerald-950/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">🏸</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">CONNECTED</span>
                    </div>
                    <div className="font-bold text-white text-sm">Badminton Courts</div>
                    <div className="text-xs text-slate-400">Smash rating & games</div>
                  </div>

                  <div className="glass-card p-4 rounded-2xl border border-cyan-500/30 text-left bg-cyan-950/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">♟️</span>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded">CONNECTED</span>
                    </div>
                    <div className="font-bold text-white text-sm">Chess Ratings</div>
                    <div className="text-xs text-slate-400">Rapid Elo & local clubs</div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 bg-emerald-950/40 px-4 py-2 rounded-full border border-emerald-800/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    SportSphere brings them all together into one trusted multi-sport identity.
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* FRAGMENTED STATE */
            <div className="py-8 transition-all duration-700 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-left relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">🏏</span>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded">ISOLATED APP</span>
                  </div>
                  <h4 className="font-bold text-white text-base">Cricket</h4>
                  <p className="text-xs text-slate-400 mt-1">Separate cricket scoring app. Lost match history, no local chat.</p>
                  <div className="mt-3 text-[11px] text-amber-400 font-mono">⚠️ Fragmented Data</div>
                </div>

                <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-left relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <Activity className="w-6 h-6 text-rose-400" />
                    <span className="text-[10px] font-mono text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded">TRACKER ONLY</span>
                  </div>
                  <h4 className="font-bold text-white text-base">Running</h4>
                  <p className="text-xs text-slate-400 mt-1">Fitness tracker app. Tracks distance, but zero local running buddies.</p>
                  <div className="mt-3 text-[11px] text-rose-400 font-mono">⚠️ Isolated Metrics</div>
                </div>

                <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-left relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <MessageCircle className="w-6 h-6 text-amber-400" />
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded">CHAOTIC GROUP</span>
                  </div>
                  <h4 className="font-bold text-white text-base">Badminton</h4>
                  <p className="text-xs text-slate-400 mt-1">500-member WhatsApp group. Spam, lost messages, no skill filtering.</p>
                  <div className="mt-3 text-[11px] text-amber-400 font-mono">⚠️ High Noise Ratio</div>
                </div>

                <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-left relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <Globe className="w-6 h-6 text-rose-400" />
                    <span className="text-[10px] font-mono text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded">FORUM</span>
                  </div>
                  <h4 className="font-bold text-white text-base">Chess</h4>
                  <p className="text-xs text-slate-400 mt-1">Global website forum. Online games, but impossible to find local cafe matches.</p>
                  <div className="mt-3 text-[11px] text-rose-400 font-mono">⚠️ No Local Discovery</div>
                </div>

              </div>

              <div className="mt-8 text-center">
                <span className="text-xs text-amber-300 font-mono">
                  Result: Endless group notifications, flaky players, and zero unified sports identity.
                </span>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
