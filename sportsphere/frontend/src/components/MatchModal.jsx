import React, { useState } from 'react';
import { X, Sparkles, MapPin, CheckCircle2, ArrowRight, MessageSquare, Zap, ShieldCheck } from 'lucide-react';

export default function MatchModal({ isOpen, onClose, onOpenChatModal }) {
  const [step, setStep] = useState(1);
  const [selectedSport, setSelectedSport] = useState('Badminton');
  const [skillLevel, setSkillLevel] = useState('Intermediate');
  const [radius, setRadius] = useState(5);
  const [isSearching, setIsSearching] = useState(false);

  if (!isOpen) return null;

  const handleRunMatch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setStep(3);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/40 shadow-2xl overflow-hidden text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Wizard Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-cyan-400 p-0.5">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-xl text-white">Find Your Match Wizard</h3>
            <p className="text-xs text-slate-400">Hyderabad · Intelligent Local Discovery</p>
          </div>
        </div>

        {/* Wizard Step 1: Select Sport & Skill */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-400 uppercase mb-2">
                1. SELECT YOUR SPORT
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {['Badminton', 'Cricket', 'Running', 'Football', 'Swimming', 'Chess'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSport(s)}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      selectedSport === s
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-400 uppercase mb-2">
                2. YOUR SKILL LEVEL
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSkillLevel(lvl)}
                    className={`py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      skillLevel === lvl
                        ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20'
                        : 'bg-slate-900 text-slate-300 border border-slate-800'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <span>Next: Set Location Radius</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Wizard Step 2: Distance Radius */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-mono font-bold text-slate-400 uppercase mb-3">
                <span>MAXIMUM DISTANCE RADIUS</span>
                <span className="text-emerald-400 font-bold">{radius} km from your current spot</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-2">
                <span>1 km (Neighborhood)</span>
                <span>5 km (Local Hub)</span>
                <span>15 km (City Radius)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-semibold text-white">Target Location: </span>
                <span>Hyderabad (Gachibowli / Madhapur radius)</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3 rounded-xl font-bold text-xs bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              >
                Back
              </button>
              <button
                onClick={handleRunMatch}
                disabled={isSearching}
                className="w-2/3 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                {isSearching ? (
                  <span>Scanning Local Radius...</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>Run Match Radar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Wizard Step 3: Instant Matched Results */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Found 2 high-compatibility matches within {radius} km!</span>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="/athlete_rahul.jpg" alt="Rahul" className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <div className="font-bold text-white text-sm">Rahul S.</div>
                    <div className="text-xs text-slate-400">{selectedSport} · {skillLevel} · 1.2 km</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenChatModal({ name: 'Rahul S.', sport: selectedSport, avatar: '/athlete_rahul.jpg' });
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Connect
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="/athlete_priya.jpg" alt="Priya" className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <div className="font-bold text-white text-sm">Priya M.</div>
                    <div className="text-xs text-slate-400">{selectedSport} · {skillLevel} · 0.8 km</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenChatModal({ name: 'Priya M.', sport: selectedSport, avatar: '/athlete_priya.jpg' });
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Connect
                </button>
              </div>
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white font-bold text-xs"
            >
              Start New Search
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
