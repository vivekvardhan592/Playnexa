import React, { useState } from 'react';
import { Sliders, CheckCircle2, MessageSquare, Zap, Navigation } from 'lucide-react';

const ATHLETES_DATABASE = [
  {
    id: 'rahul',
    name: 'Rahul S.',
    sport: 'Badminton',
    level: 'Intermediate',
    distanceKm: 1.2,
    availability: 'Available Today',
    matchScore: 96,
    verified: true,
    avatar: '/athlete_rahul.jpg',
    attendancePct: 94,
    sessionsCount: 28,
    reasons: [
      'Same sport & level (Badminton Doubles)',
      '1.2 km away · Available 6 PM Today',
    ],
  },
  {
    id: 'priya',
    name: 'Priya M.',
    sport: 'Running',
    level: 'Advanced',
    distanceKm: 0.8,
    availability: 'Available Today',
    matchScore: 98,
    verified: true,
    avatar: '/athlete_priya.jpg',
    attendancePct: 98,
    sessionsCount: 42,
    reasons: [
      '0.8 km near KBR Park track',
      '10K Morning Runner · 6:00 AM',
    ],
  },
  {
    id: 'arjun',
    name: 'Arjun K.',
    sport: 'Badminton',
    level: 'Intermediate',
    distanceKm: 2.1,
    availability: 'Available Today',
    matchScore: 91,
    verified: true,
    avatar: '/athlete_arjun.jpg',
    attendancePct: 92,
    sessionsCount: 31,
    reasons: [
      '2.1 km away in Madhapur',
      'Looking for doubles court partner',
    ],
  },
];

export default function MatchRadarSection({ onOpenChatModal }) {
  const [selectedSport, setSelectedSport] = useState('All');
  const [maxDistance, setMaxDistance] = useState(10);

  const filteredAthletes = ATHLETES_DATABASE.filter((athlete) => {
    if (selectedSport !== 'All' && athlete.sport !== selectedSport) return false;
    if (athlete.distanceKm > maxDistance) return false;
    return true;
  });

  return (
    <section id="discover" className="py-10 relative bg-[#080a0f] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Compact Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-semibold text-emerald-400">
            <Zap className="w-3.5 h-3.5" />
            <span>Intelligent Matching Engine</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Filter by Sport, Skill & <span className="text-gradient-emerald">Location.</span>
          </h2>
        </div>

        {/* Compact Filter Bar */}
        <div className="mt-6 max-w-3xl mx-auto glass-panel rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-slate-300">QUICK FILTERS:</span>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-white rounded-lg px-3 py-1.5 text-xs font-medium focus:border-emerald-500 focus:outline-none cursor-pointer"
            >
              <option value="All">All Sports</option>
              <option value="Badminton">Badminton</option>
              <option value="Running">Running</option>
            </select>

            <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
              <span>Radius:</span>
              <input
                type="range"
                min="1"
                max="15"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-24 h-1.5 bg-slate-900 rounded appearance-none cursor-pointer accent-emerald-400"
              />
              <span className="text-emerald-400 font-bold">{maxDistance} km</span>
            </div>
          </div>
        </div>

        {/* Compact 3 Match Cards Row */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredAthletes.length > 0 ? (
            filteredAthletes.map((athlete) => (
              <div
                key={athlete.id + athlete.sport}
                className="glass-panel-interactive rounded-2xl p-5 border border-slate-800 text-left flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={athlete.avatar}
                        alt={athlete.name}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-700 group-hover:border-emerald-400 transition-colors"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <h4 className="font-heading font-bold text-base text-white">
                            {athlete.name}
                          </h4>
                          {athlete.verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                          )}
                        </div>
                        <div className="text-xs font-semibold text-emerald-400">
                          {athlete.sport} · <span className="text-slate-300">{athlete.level}</span>
                        </div>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-400 text-xs font-mono font-bold border border-emerald-800/60">
                      {athlete.matchScore}% MATCH
                    </span>
                  </div>

                  {/* Distance & Attendance */}
                  <div className="flex items-center justify-between text-xs text-slate-400 py-1.5 border-y border-slate-800/80 my-3">
                    <span className="flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-slate-400" />
                      {athlete.distanceKm} km away
                    </span>
                    <span className="text-emerald-400 font-mono font-semibold">
                      {athlete.attendancePct}% Attendance
                    </span>
                  </div>

                  {/* 2 Short Highlights */}
                  <div className="space-y-1.5 my-3">
                    {athlete.reasons.map((r, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <button
                  onClick={() => onOpenChatModal(athlete)}
                  className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-bold text-xs hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-slate-950" />
                  Connect & Challenge
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 glass-panel rounded-2xl text-center text-xs text-slate-400">
              No matches found for this filter.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
