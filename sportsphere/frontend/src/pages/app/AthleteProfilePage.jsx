import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAthleteById } from '../../services/api';
import { CheckCircle2, ShieldCheck, MapPin, MessageSquare, ArrowLeft, Navigation, Sparkles } from 'lucide-react';

export default function AthleteProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [athlete, setAthlete] = useState(null);
  const [activeSportIndex, setActiveSportIndex] = useState(0);

  useEffect(() => {
    async function loadAthlete() {
      const data = await getAthleteById(id || 'rahul');
      setAthlete(data);
    }
    loadAthlete();
  }, [id]);

  if (!athlete) {
    return <div className="py-12 text-center text-slate-400">Loading athlete profile...</div>;
  }

  const activeSportObj = athlete.sports[activeSportIndex] || athlete.sports[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="text-xs font-bold text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Discovery</span>
      </button>

      {/* Header Profile Card */}
      <div className="glass-panel rounded-3xl border border-slate-800 p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={athlete.avatar}
                alt={athlete.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-emerald-400 shadow-xl shadow-emerald-500/20"
              />
              {athlete.verified && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1 rounded-full shadow">
                  <CheckCircle2 className="w-4 h-4 fill-slate-950 stroke-emerald-500" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
                  {athlete.fullName || athlete.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-xs font-mono font-bold border border-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>VERIFIED</span>
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  {athlete.distanceKm} km away ({athlete.area || 'Hyderabad'})
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl pt-1">
                "{athlete.bio}"
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/app/messages')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-extrabold text-xs hover:opacity-95 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <MessageSquare className="w-4 h-4 fill-slate-950" />
            <span>Connect & Challenge</span>
          </button>
        </div>
      </div>

      {/* Multi-Sport Tabs */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {athlete.sports.map((s, idx) => (
            <button
              key={s.sport}
              onClick={() => setActiveSportIndex(idx)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 border ${
                activeSportIndex === idx
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <span>{s.emoji}</span>
              <span>{s.sport}</span>
              <span className="text-[10px] opacity-80">({s.skillLevel})</span>
            </button>
          ))}
        </div>

        {activeSportObj && (
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="font-heading font-extrabold text-xl text-white">
              {activeSportObj.sport} Analytics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(activeSportObj.metrics || {}).map(([key, val]) => (
                <div key={key} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
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

      {/* Trust Profile */}
      <section className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="font-heading font-extrabold text-lg text-white">Trust & Attendance Signals</h2>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            {athlete.trust?.attendanceRatePct || athlete.attendancePct}% Attendance
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-2xl font-extrabold text-white">{athlete.trust?.completed || athlete.sessionsCount}</div>
            <div className="text-[11px] text-slate-400">Sessions Completed</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-2xl font-extrabold text-emerald-400">{athlete.trust?.zeroFlakeStreak || 12} Games</div>
            <div className="text-[11px] text-slate-400">Zero-Flake Streak</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-2xl font-extrabold text-cyan-400">{athlete.trust?.uniqueCoPlayersMet || 18}</div>
            <div className="text-[11px] text-slate-400">Co-Players Met</div>
          </div>
        </div>
      </section>

    </div>
  );
}
