import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Navigation, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';

export default function AthleteCard({ athlete, onConnect }) {
  const navigate = useNavigate();

  return (
    <div className="glass-panel-interactive rounded-2xl p-5 border border-slate-800 flex flex-col justify-between group">
      <div>
        {/* Header: Photo, Name, Verified, Sport & Match % */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <img
              src={athlete.avatar}
              alt={athlete.name}
              className="w-12 h-12 rounded-xl object-cover border border-slate-700 group-hover:border-emerald-400 transition-colors"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h4
                  onClick={() => navigate(`/app/athlete/${athlete.id}`)}
                  className="font-heading font-bold text-base text-white hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {athlete.name}
                </h4>
                {athlete.verified && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                )}
              </div>
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                <span>{athlete.sports[0]?.sport || athlete.sport}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-300">{athlete.sports[0]?.skillLevel || athlete.level}</span>
              </div>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-400 text-xs font-mono font-bold border border-emerald-800/60 shrink-0">
            {athlete.matchScore}% MATCH
          </span>
        </div>

        {/* Distance & Attendance */}
        <div className="flex items-center justify-between text-xs text-slate-400 py-2 border-y border-slate-800/80 my-3">
          <span className="flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5 text-slate-400" />
            {athlete.distanceKm} km away ({athlete.area || 'Hyderabad'})
          </span>
          <span className="text-emerald-400 font-mono font-semibold">
            {athlete.trust?.attendanceRatePct || athlete.attendancePct || 94}% Attendance
          </span>
        </div>

        {/* Explainable "Why This Match" Bullets */}
        <div className="space-y-1.5 my-3">
          {(athlete.matchReasons || athlete.reasons || []).slice(0, 2).map((reason, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action CTAs */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-2">
        <button
          onClick={() => navigate(`/app/athlete/${athlete.id}`)}
          className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
        >
          View Profile
        </button>
        <button
          onClick={() => onConnect ? onConnect(athlete) : navigate('/app/messages')}
          className="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-extrabold text-xs hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5 fill-slate-950" />
          Connect
        </button>
      </div>
    </div>
  );
}
