import React from 'react';
import { ShieldCheck, CheckCircle2, UserCheck, Award, Lock, Users, AlertTriangle } from 'lucide-react';

export default function TrustSafety() {
  return (
    <section className="py-12 sm:py-16 relative bg-gradient-to-b from-[#080a0f] via-[#0d111c] to-[#080a0f] overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-teal-400">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Participation-Based Reputation</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Know who you're <span className="text-gradient-emerald">playing with.</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Ratings can be inflated. <span className="text-white font-semibold">Reputation is built through real participation, punctuality, and verified attendance.</span>
          </p>
        </div>

        {/* Main Trust Breakdown Card */}
        <div className="mt-14 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Narrative Assurances */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2.5 text-emerald-400 font-heading font-bold text-lg">
                <CheckCircle2 className="w-5 h-5" />
                <span>Verified Activity over Blind Ratings</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Ratings are only one signal. SportSphere measures actual show-up rates, completed games, and unique player endorsements to ensure zero flaky cancellations.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2.5 text-cyan-400 font-heading font-bold text-lg">
                <Lock className="w-5 h-5" />
                <span>Safety & Comfort Controls</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Options for women-only match lobbies, verified college student groups, and public sports turf check-ins so everyone feels safe showing up.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2.5 text-teal-400 font-heading font-bold text-lg">
                <Users className="w-5 h-5" />
                <span>100% Identity Verification</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Every athlete profile undergoes mobile OTP verification and optional photo ID validation before joining open local games.
              </p>
            </div>

          </div>

          {/* Right Live Trust Score Breakdown Card */}
          <div className="lg:col-span-6">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl relative">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    TRUSTED ATHLETE CARD
                  </span>
                  <h4 className="font-heading font-bold text-xl text-white mt-0.5">Rahul Sharma</h4>
                </div>

                <div className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  VERIFIED ATHLETE
                </div>
              </div>

              {/* Attendance Bar */}
              <div className="space-y-2 text-left mb-6">
                <div className="flex justify-between text-xs font-bold text-slate-300 font-mono">
                  <span>SHOW-UP & ATTENDANCE RATE</span>
                  <span className="text-emerald-400">92%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden p-0.5 border border-slate-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 w-[92%]"></div>
                </div>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-2xl font-black text-white font-mono">24</div>
                  <div className="text-xs text-slate-400 mt-1">Sessions Scheduled</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-2xl font-black text-emerald-400 font-mono">22</div>
                  <div className="text-xs text-slate-400 mt-1">Games Completed</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-2xl font-black text-cyan-400 font-mono">18</div>
                  <div className="text-xs text-slate-400 mt-1">Unique Co-Players</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-2xl font-black text-teal-400 font-mono">14 Match</div>
                  <div className="text-xs text-slate-400 mt-1">Zero-Flake Streak 🔥</div>
                </div>
              </div>

              {/* Trust Badge Endorsements */}
              <div className="mt-6 pt-6 border-t border-slate-800 text-left">
                <div className="text-xs font-mono font-bold text-slate-400 uppercase mb-3">
                  COMMUNITY SIGNALS & BADGES
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-400" />
                    Punctual Player
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-cyan-400" />
                    Fair Play Advocate
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-teal-400" />
                    Organized 6 Matches
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
