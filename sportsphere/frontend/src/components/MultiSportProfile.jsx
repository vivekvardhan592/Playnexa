import React, { useState } from 'react';
import { UserCheck, ShieldCheck, Trophy, MapPin, Activity, Flame, Award, Calendar, CheckCircle2, Zap } from 'lucide-react';

const SPORTS_DATA = {
  Cricket: {
    icon: '🏏',
    title: 'Cricket',
    badge: 'Intermediate All-Rounder',
    stats: [
      { label: 'Batting Average', value: '38.5' },
      { label: 'Primary Role', value: 'Right-arm Medium Pace' },
      { label: 'Preferred Format', value: 'T20 & 10-Overs' },
      { label: 'Preferred Ground', value: 'Gachibowli Turf Ground' },
    ],
    highlight: 'Scored 42* off 28 balls in recent local weekend clash.',
    gear: 'Kookaburra English Willow',
    activeCount: '24 Games Played',
  },
  Badminton: {
    icon: '🏸',
    title: 'Badminton',
    badge: 'Advanced Singles & Doubles',
    stats: [
      { label: 'Match Record', value: '18W - 4L (82% Win Rate)' },
      { label: 'Top Smash Speed', value: '240 km/h' },
      { label: 'Court Type', value: 'Indoor Wooden / Synthetic' },
      { label: 'Racket Setup', value: 'Yonex Astrox 88D Pro' },
    ],
    highlight: 'Semifinalist in Madhapur Badminton Amateur Championship.',
    gear: 'Yonex Astrox 88D',
    activeCount: '22 Matches Completed',
  },
  Running: {
    icon: '🏃',
    title: 'Running',
    badge: '10K & Half-Marathoner',
    stats: [
      { label: '10K Personal Best', value: '44 mins 12 secs' },
      { label: 'Average Pace', value: '4:25 min/km' },
      { label: 'Weekly Volume', value: '32 km / week' },
      { label: 'Favorite Route', value: 'KBR Park Ring Road' },
    ],
    highlight: 'Completed Hyderabad 10K Challenge in top 15% bracket.',
    gear: 'Garmin Forerunner + Nike Vaporfly',
    activeCount: '48 Runs Recorded',
  },
  Swimming: {
    icon: '🏊',
    title: 'Swimming',
    badge: 'Freestyle Specialist',
    stats: [
      { label: '100m PB', value: '1 min 12 secs' },
      { label: 'Preferred Stroke', value: 'Freestyle / Butterfly' },
      { label: 'Pool Type', value: '50m Olympic Standard' },
      { label: 'Time Preference', value: '6:00 AM Early Morning' },
    ],
    highlight: 'Consistently swims 2.5 km weekly workouts.',
    gear: 'Speedo Fastskin',
    activeCount: '15 Pool Sessions',
  },
  Chess: {
    icon: '♟️',
    title: 'Chess',
    badge: '1785 Rapid Elo',
    stats: [
      { label: 'Rapid Rating', value: '1785 Elo' },
      { label: 'Time Control', value: '10+0 Blitz & Rapid' },
      { label: 'Favorite Opening', value: 'Sicilian Defense / KID' },
      { label: 'Preferred Venue', value: 'Coffee Shops & Local Clubs' },
    ],
    highlight: 'Undefeated in 8 consecutive weekend over-the-board cafe matches.',
    gear: 'FIDE Wooden Board',
    activeCount: '34 Over-the-Board Games',
  },
};

export default function MultiSportProfile() {
  const [selectedSport, setSelectedSport] = useState('Badminton');
  const activeData = SPORTS_DATA[selectedSport];

  return (
    <section className="py-12 sm:py-16 relative bg-gradient-to-b from-[#080a0f] via-[#0b0f19] to-[#080a0f] overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sport-Agnostic, Sport-Aware</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            One Athlete. <span className="text-gradient-emerald">Every Sport.</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            SportSphere adapts naturally to each sport. We don't force a cricketer, a runner, and a chess player into the exact same rigid profile structure.
          </p>
        </div>

        {/* Profile Card Container */}
        <div className="mt-8 max-w-4xl mx-auto glass-panel rounded-3xl p-6 sm:p-10 border border-slate-700/60 shadow-2xl">
          
          {/* Top Athlete Header Information */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-400 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-heading font-black text-2xl text-emerald-400">
                    V
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 rounded-full p-0.5">
                  <CheckCircle2 className="w-4 h-4 fill-slate-950 stroke-emerald-500" />
                </div>
              </div>

              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-black text-2xl text-white">Vivek Kumar</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    ✓ Verified Athlete
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    Hyderabad, India
                  </span>
                  <span>•</span>
                  <span>Member since March 2025</span>
                </div>
              </div>
            </div>

            {/* Global Trust & Participation Signals */}
            <div className="grid grid-cols-3 gap-4 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-center w-full sm:w-auto">
              <div>
                <div className="font-mono font-bold text-lg text-emerald-400">24</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Matches</div>
              </div>
              <div className="border-x border-slate-800 px-3">
                <div className="font-mono font-bold text-lg text-cyan-400">92%</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Attendance</div>
              </div>
              <div>
                <div className="font-mono font-bold text-lg text-teal-400">18</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Unique Players</div>
              </div>
            </div>
          </div>

          {/* Interactive Sport Tabs Selector */}
          <div className="mt-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {Object.keys(SPORTS_DATA).map((sportKey) => {
                const sportObj = SPORTS_DATA[sportKey];
                const isActive = selectedSport === sportKey;
                return (
                  <button
                    key={sportKey}
                    onClick={() => setSelectedSport(sportKey)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 scale-[1.02]'
                        : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-base">{sportObj.icon}</span>
                    <span>{sportObj.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Sport-Specific Profile Card Details */}
          <div className="mt-6 glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 text-left transition-all duration-300 animate-in fade-in zoom-in-95">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeData.icon}</span>
                <div>
                  <h4 className="font-heading font-extrabold text-xl text-white">
                    {activeData.title} Profile
                  </h4>
                  <span className="text-xs text-slate-400">{activeData.activeCount}</span>
                </div>
              </div>

              <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                {activeData.badge}
              </span>
            </div>

            {/* Sport-Specific Dynamic Grid Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {activeData.stats.map((stat, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80">
                  <div className="text-xs font-medium text-slate-400">{stat.label}</div>
                  <div className="font-heading font-bold text-base text-white mt-1">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Highlight & Equipment Context */}
            <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-2.5">
                <Trophy className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-white">Recent Highlight: </span>
                  {activeData.highlight}
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-white">Equipment & Setup: </span>
                  {activeData.gear}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
