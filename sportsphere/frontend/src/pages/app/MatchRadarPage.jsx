import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAthletes } from '../../services/api';
import AthleteCard from '../../components/ui/AthleteCard';
import { Radio, Sliders, MapPin, CheckCircle2, Navigation, MessageSquare, Sparkles } from 'lucide-react';

export default function MatchRadarPage() {
  const navigate = useNavigate();
  const [selectedSport, setSelectedSport] = useState('Badminton');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [maxDistance, setMaxDistance] = useState(5);
  const [athletes, setAthletes] = useState([]);
  const [activeAthleteNode, setActiveAthleteNode] = useState(null);

  useEffect(() => {
    async function fetchRadarAthletes() {
      const data = await getAthletes({ sport: selectedSport, skill: selectedSkill, maxDistance });
      setAthletes(data);
      if (data.length > 0) setActiveAthleteNode(data[0]);
    }
    fetchRadarAthletes();
  }, [selectedSport, selectedSkill, maxDistance]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-mono font-bold border border-emerald-800 mb-1">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>SIGNATURE MATCH RADAR ENGINE</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-white">
            Sport + Skill + Location = <span className="text-gradient-emerald">Relevant People</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>Hyderabad Center • {athletes.length} Active Nodes</span>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold text-slate-300">RADAR CONTROLS:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {['Badminton', 'Cricket', 'Running', 'Football'].map((sport) => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedSport === sport
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sport}
              </button>
            ))}
          </div>

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

      {/* Main Radar Layout: Graphic on Left, Ranked Cards on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Interactive 2D Radar Canvas */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-slate-800 relative overflow-hidden flex flex-col justify-between min-h-[420px]">
          
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE RADAR SWEEP ({maxDistance} KM)</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Updating 2s intervals</span>
          </div>

          {/* Canvas Graphic Container */}
          <div className="relative w-full h-80 rounded-2xl bg-gradient-to-b from-slate-950 via-[#0c1018] to-slate-950 border border-slate-800/80 overflow-hidden flex items-center justify-center my-4">
            
            {/* Concentric Distance Rings */}
            <div className="absolute w-72 h-72 rounded-full border border-emerald-500/15" />
            <div className="absolute w-48 h-48 rounded-full border border-emerald-500/25" />
            <div className="absolute w-28 h-28 rounded-full border border-emerald-500/35" />

            {/* Crosshairs */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] opacity-30 pointer-events-none" />

            {/* Rotating Scanner Line */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-80 h-80 rounded-full animate-radar-sweep relative">
                <div className="w-1/2 h-1/2 bg-gradient-to-br from-emerald-500/30 to-transparent rounded-tl-full border-t border-l border-emerald-400/50" />
              </div>
            </div>

            {/* Center User Node */}
            <div className="absolute z-20 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-lg shadow-emerald-400/50 flex items-center justify-center font-bold text-slate-950 text-xs">
                YOU
              </div>
              <span className="mt-1 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[10px] font-mono text-emerald-400 font-bold">
                Vivek (Center)
              </span>
            </div>

            {/* Dynamic Athlete Nodes on Radar */}
            {athletes.map((athlete, index) => {
              const positions = [
                { top: '15%', right: '15%' },
                { bottom: '15%', left: '15%' },
                { top: '20%', left: '20%' },
                { bottom: '20%', right: '20%' },
              ];
              const pos = positions[index % positions.length];

              return (
                <div
                  key={athlete.id}
                  style={pos}
                  onClick={() => setActiveAthleteNode(athlete)}
                  className="absolute z-20 animate-float flex flex-col items-center cursor-pointer group"
                >
                  <div className="relative">
                    <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-emerald-500 text-slate-950 text-[10px] font-mono font-bold rounded-full shadow">
                      {athlete.matchScore}%
                    </span>
                    <img
                      src={athlete.avatar}
                      alt={athlete.name}
                      className={`w-11 h-11 rounded-full border-2 object-cover transition-transform group-hover:scale-110 shadow-lg ${
                        activeAthleteNode?.id === athlete.id
                          ? 'border-emerald-400 shadow-emerald-500/50 scale-110'
                          : 'border-cyan-400 shadow-cyan-500/30'
                      }`}
                    />
                  </div>
                  <span className="mt-1 text-[11px] font-bold text-slate-200 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800">
                    {athlete.name} ({athlete.distanceKm} km)
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-center text-xs text-slate-400 font-mono">
            Click any athlete node on the radar to inspect match breakdown details.
          </div>
        </div>

        {/* Right Ranked Results Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
              RANKED MATCH RESULTS ({athletes.length})
            </span>
          </div>

          <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
            {athletes.map((athlete) => (
              <AthleteCard
                key={athlete.id}
                athlete={athlete}
                onConnect={() => navigate('/app/messages')}
              />
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
