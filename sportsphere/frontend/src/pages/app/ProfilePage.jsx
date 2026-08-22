import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle2, ShieldCheck, MapPin, Calendar, Trophy, Flame, Zap, Award, Edit3 } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeSportIndex, setActiveSportIndex] = useState(0);

  const activeSportObj = user?.sports[activeSportIndex] || user?.sports[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner & Header Profile Card */}
      <div className="glass-panel rounded-3xl border border-slate-800 p-6 sm:p-8 relative overflow-hidden">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={user?.avatar || '/athlete_rahul.jpg'}
                alt={user?.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-emerald-400 shadow-xl shadow-emerald-500/20"
              />
              {user?.verified && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1 rounded-full shadow">
                  <CheckCircle2 className="w-4 h-4 fill-slate-950 stroke-emerald-500" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
                  {user?.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-xs font-mono font-bold border border-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>VERIFIED ATHLETE</span>
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {user?.area}, {user?.city}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  Member since {user?.memberSince}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl pt-1">
                "{user?.bio}"
              </p>
            </div>
          </div>

          <button
            onClick={() => alert('Profile editing modal ready')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Edit3 className="w-4 h-4 text-emerald-400" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* MULTI-SPORT IDENTITY SELECTOR TABS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
            MULTI-SPORT IDENTITY ({user?.sports.length || 0} SPORTS REPRESENTED)
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {user?.sports.map((s, idx) => (
            <button
              key={s.sport}
              onClick={() => setActiveSportIndex(idx)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 border ${
                activeSportIndex === idx
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span>{s.emoji}</span>
              <span>{s.sport}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                activeSportIndex === idx ? 'bg-slate-950/20 text-slate-950 font-extrabold' : 'bg-slate-950 text-emerald-400'
              }`}>
                {s.skillLevel}
              </span>
            </button>
          ))}
        </div>

        {/* DYNAMIC SPORT-AWARE METRICS CARD */}
        {activeSportObj && (
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeSportObj.emoji}</span>
                <div>
                  <h3 className="font-heading font-extrabold text-xl text-white">
                    {activeSportObj.sport} Analytics
                  </h3>
                  <span className="text-xs text-emerald-400 font-semibold">
                    Skill Level: {activeSportObj.skillLevel}
                  </span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                Sport-Aware Data Schema
              </span>
            </div>

            {/* Metrics Grid based on Sport */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(activeSportObj.metrics || {}).map(([key, val]) => (
                <div key={key} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </div>
                  <div className="font-heading font-extrabold text-lg text-white">
                    {val}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* REPUTATION & PARTICIPATION TRUST PROFILE */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="font-heading font-extrabold text-xl text-white">Participation & Trust Profile</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Reputation on SportSphere grows through real match participation, not arbitrary reviews.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-mono font-bold border border-emerald-800">
            {user?.trust?.attendanceRatePct}% ATTENDANCE SCORE
          </span>
        </div>

        {/* 4 Trust Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
            <div className="text-3xl font-extrabold font-heading text-emerald-400">
              {user?.trust?.completed} / {user?.trust?.totalScheduled}
            </div>
            <div className="text-xs font-medium text-slate-300">Matches Completed</div>
            <div className="text-[10px] font-mono text-slate-400">Scheduled games show-up</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
            <div className="text-3xl font-extrabold font-heading text-cyan-400">
              {user?.trust?.zeroFlakeStreak} Games
            </div>
            <div className="text-xs font-medium text-slate-300">Zero-Flake Streak</div>
            <div className="text-[10px] font-mono text-slate-400">Consecutive clean attendance</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
            <div className="text-3xl font-extrabold font-heading text-white">
              {user?.trust?.uniqueCoPlayersMet} Athletes
            </div>
            <div className="text-xs font-medium text-slate-300">Unique Players Met</div>
            <div className="text-[10px] font-mono text-slate-400">Verified co-players</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
            <div className="text-3xl font-extrabold font-heading text-amber-400">
              {user?.trust?.monthsActive} Months
            </div>
            <div className="text-xs font-medium text-slate-300">Community Tenure</div>
            <div className="text-[10px] font-mono text-slate-400">Active member history</div>
          </div>
        </div>

      </section>

    </div>
  );
}
