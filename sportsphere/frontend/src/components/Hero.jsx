import React, { useState, useEffect } from 'react';
import { MapPin, ShieldCheck, Zap, Sparkles, Navigation, ArrowRight, CheckCircle2, MessageSquare, Compass, Radio } from 'lucide-react';

const INITIAL_ATHLETES = {
  Badminton: [
    {
      id: 'rahul',
      name: 'Rahul S.',
      sport: 'Badminton',
      level: 'Intermediate',
      distance: '1.2 km away',
      matchPct: 94,
      verified: true,
      avatar: '/athlete_rahul.jpg',
      status: 'Available Today',
      reason: 'Same sport + compatible level',
    },
    {
      id: 'arjun',
      name: 'Arjun K.',
      sport: 'Badminton',
      level: 'Intermediate',
      distance: '2.1 km away',
      matchPct: 91,
      verified: true,
      avatar: '/athlete_arjun.jpg',
      status: 'Looking for Doubles',
      reason: 'Plays 3x/week in Madhapur',
    },
  ],
  Cricket: [
    {
      id: 'ananya',
      name: 'Ananya R.',
      sport: 'Cricket',
      level: 'Advanced All-Rounder',
      distance: '1.8 km away',
      matchPct: 96,
      verified: true,
      avatar: '/athlete_priya.jpg',
      status: 'Weekend Match Ready',
      reason: 'T20 Hard Tennis Player',
    },
    {
      id: 'rahul',
      name: 'Rahul S.',
      sport: 'Cricket',
      level: 'Intermediate Batter',
      distance: '1.2 km away',
      matchPct: 89,
      verified: true,
      avatar: '/athlete_rahul.jpg',
      status: 'Available Sat Morning',
      reason: 'Gachibowli Local Ground',
    },
  ],
  Running: [
    {
      id: 'priya',
      name: 'Priya M.',
      sport: 'Running',
      level: '10K Pace 4:45/km',
      distance: '0.8 km away',
      matchPct: 98,
      verified: true,
      avatar: '/athlete_priya.jpg',
      status: 'Morning Pod (6 AM)',
      reason: 'KBR Park Ring Route',
    },
    {
      id: 'arjun',
      name: 'Arjun K.',
      sport: 'Running',
      level: '5K / Half Marathon',
      distance: '2.1 km away',
      matchPct: 92,
      verified: true,
      avatar: '/athlete_arjun.jpg',
      status: 'Training for 21K',
      reason: 'Same weekend schedule',
    },
  ],
  Football: [
    {
      id: 'arjun',
      name: 'Arjun K.',
      sport: 'Football',
      level: 'Midfielder (7v7)',
      distance: '2.1 km away',
      matchPct: 95,
      verified: true,
      avatar: '/athlete_arjun.jpg',
      status: 'Needs 2 Players Tomorrow',
      reason: 'Turf Booked in Hitec',
    },
    {
      id: 'rahul',
      name: 'Rahul S.',
      sport: 'Football',
      level: 'Winger / Striker',
      distance: '1.2 km away',
      matchPct: 90,
      verified: true,
      avatar: '/athlete_rahul.jpg',
      status: 'Free Evening Matches',
      reason: 'High attendance rating',
    },
  ],
};

export default function Hero({ onOpenMatchModal, onOpenChatModal }) {
  const [activeSport, setActiveSport] = useState('Badminton');
  const [radarPulse, setRadarPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRadarPulse((prev) => (prev + 1) % 100);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const currentAthletes = INITIAL_ATHLETES[activeSport] || INITIAL_ATHLETES['Badminton'];

  return (
    <section id="hero" className="relative pt-24 pb-12 md:pt-28 md:pb-14 overflow-hidden">
      
      {/* Glow Effects Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      
      {/* Background Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Narrative Copy */}
          <div className="lg:col-span-6 space-y-8 text-left">
            
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Intelligent Local Discovery Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              Your Sport.{' '}
              <br />
              <span className="text-gradient-emerald">Your People.</span>
              <br />
              <span className="text-gradient-cyan">Your Community.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-xl font-normal leading-relaxed">
              Discover athletes near you, find people at your level, join the game, and build your sports community — <span className="text-white font-medium">all in one place.</span>
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onOpenMatchModal}
                className="group relative inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-base text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 mr-2 text-slate-950 fill-slate-950 group-hover:rotate-12 transition-transform" />
                <span>Find Your Match</span>
                <ArrowRight className="w-5 h-5 ml-2 text-slate-950 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#discover"
                className="inline-flex items-center justify-center px-7 py-4 rounded-xl font-semibold text-base text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-500 transition-all duration-200"
              >
                <Compass className="w-5 h-5 mr-2 text-slate-400" />
                Explore Sports
              </a>
            </div>

            {/* Fast Outcomes Indicator */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-extrabold text-white font-heading">500+</div>
                <div className="text-xs text-slate-400 font-medium">Active Venues</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-emerald-400 font-heading">94%</div>
                <div className="text-xs text-slate-400 font-medium">Match Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-cyan-400 font-heading">&lt; 3 mins</div>
                <div className="text-xs text-slate-400 font-medium">Avg. Time to Match</div>
              </div>
            </div>

          </div>

          {/* Right Hero Interactive Product Visual — MATCH RADAR */}
          <div className="lg:col-span-6 relative">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-2xl shadow-emerald-950/30 relative">
              
              {/* Radar Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">MATCH RADAR</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/50">LIVE</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold text-white">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Hyderabad · Within 5 km</span>
                    </div>
                  </div>
                </div>

                {/* Sport Selector Chips */}
                <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
                  {['Badminton', 'Cricket', 'Running', 'Football'].map((sport) => (
                    <button
                      key={sport}
                      onClick={() => setActiveSport(sport)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeSport === sport
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {sport}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2D Animated Radar Canvas Graphic */}
              <div className="relative w-full h-64 sm:h-72 rounded-2xl bg-gradient-to-b from-slate-950 to-[#0c1018] border border-slate-800/80 overflow-hidden flex items-center justify-center">
                
                {/* Concentric Radar Rings */}
                <div className="absolute w-56 h-56 rounded-full border border-emerald-500/15"></div>
                <div className="absolute w-40 h-40 rounded-full border border-emerald-500/25"></div>
                <div className="absolute w-24 h-24 rounded-full border border-emerald-500/35"></div>
                
                {/* Distance Ring Markers */}
                <span className="absolute top-6 text-[10px] font-mono text-slate-400">5 km radius</span>
                <span className="absolute top-14 text-[10px] font-mono text-slate-400">3 km</span>
                <span className="absolute top-22 text-[10px] font-mono text-slate-400">1 km</span>

                {/* Radar Grid Crosshairs */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30 pointer-events-none"></div>

                {/* Rotating Radar Scanner Line */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-64 rounded-full animate-radar-sweep relative">
                    <div className="w-1/2 h-1/2 bg-gradient-to-br from-emerald-500/25 to-transparent rounded-tl-full border-t border-l border-emerald-400/40"></div>
                  </div>
                </div>

                {/* Center User Node */}
                <div className="absolute z-20 flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-lg shadow-emerald-400/50 flex items-center justify-center font-bold text-slate-950 text-xs">
                    YOU
                  </div>
                  <span className="mt-1 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[10px] font-mono text-emerald-400">
                    Vivek
                  </span>
                </div>

                {/* Nearby Athlete Nodes on Radar */}
                <div className="absolute top-10 right-12 z-20 animate-float flex flex-col items-center">
                  <div className="relative group cursor-pointer" onClick={() => onOpenChatModal(currentAthletes[0])}>
                    <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-emerald-500 text-slate-950 text-[10px] font-mono font-bold rounded-full">
                      {currentAthletes[0]?.matchPct}%
                    </span>
                    <img
                      src={currentAthletes[0]?.avatar}
                      alt={currentAthletes[0]?.name}
                      className="w-11 h-11 rounded-full border-2 border-emerald-400 object-cover shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <span className="mt-1 text-[11px] font-medium text-slate-200 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                    {currentAthletes[0]?.name} ({currentAthletes[0]?.distance})
                  </span>
                </div>

                {currentAthletes[1] && (
                  <div className="absolute bottom-8 left-10 z-20 animate-float [animation-delay:1.5s] flex flex-col items-center">
                    <div className="relative group cursor-pointer" onClick={() => onOpenChatModal(currentAthletes[1])}>
                      <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-cyan-400 text-slate-950 text-[10px] font-mono font-bold rounded-full">
                        {currentAthletes[1]?.matchPct}%
                      </span>
                      <img
                        src={currentAthletes[1]?.avatar}
                        alt={currentAthletes[1]?.name}
                        className="w-10 h-10 rounded-full border-2 border-cyan-400 object-cover shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <span className="mt-1 text-[11px] font-medium text-slate-200 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                      {currentAthletes[1]?.name} ({currentAthletes[1]?.distance})
                    </span>
                  </div>
                )}
              </div>

              {/* Interactive Match Cards Below Radar */}
              <div className="mt-5 space-y-3">
                {currentAthletes.map((athlete) => (
                  <div
                    key={athlete.id + athlete.sport}
                    className="glass-card rounded-2xl p-4 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="relative shrink-0">
                        <img
                          src={athlete.avatar}
                          alt={athlete.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-700 group-hover:border-emerald-400 transition-colors"
                        />
                        {athlete.verified && (
                          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 rounded-full p-0.5 shadow">
                            <CheckCircle2 className="w-3.5 h-3.5 fill-slate-950 stroke-emerald-500" />
                          </div>
                        )}
                      </div>

                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-white text-base">
                            {athlete.name}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                            {athlete.matchPct}% MATCH
                          </span>
                        </div>
                        
                        <div className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
                          <span className="font-semibold text-emerald-400">{athlete.sport}</span>
                          <span>•</span>
                          <span>{athlete.level}</span>
                        </div>

                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-1">
                          <span className="flex items-center gap-1">
                            <Navigation className="w-3 h-3 text-slate-400" />
                            {athlete.distance}
                          </span>
                          <span>•</span>
                          <span className="text-slate-400">{athlete.reason}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenChatModal(athlete)}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 font-semibold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Connect
                    </button>
                  </div>
                ))}
              </div>

              {/* Bottom Signal */}
              <div className="mt-4 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Scanning 5 km radius for active compatible players...</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
