import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, CheckCircle2, ArrowRight } from 'lucide-react';

export default function MatchCard({ match, onJoin }) {
  const navigate = useNavigate();
  const isFull = match.currentPlayers >= match.maxPlayers;

  return (
    <div className="glass-panel-interactive rounded-2xl p-5 border border-slate-800 flex flex-col justify-between group">
      <div>
        {/* Top Header: Sport Badge & Slots */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
            <span>{match.emoji || '🏸'}</span>
            <span>{match.sport}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-300 font-mono">{match.skillLevel}</span>
          </span>

          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
              isFull
                ? 'bg-red-950/80 text-red-400 border-red-800/60'
                : 'bg-slate-900 text-cyan-400 border-slate-700'
            }`}
          >
            {isFull ? 'MATCH FULL' : `${match.currentPlayers} / ${match.maxPlayers} PLAYERS`}
          </span>
        </div>

        {/* Match Title */}
        <h3
          onClick={() => navigate(`/app/matches/${match.id}`)}
          className="font-heading font-extrabold text-lg text-white group-hover:text-emerald-400 transition-colors cursor-pointer mb-2"
        >
          {match.title}
        </h3>

        {/* Date, Time & Venue */}
        <div className="space-y-1.5 text-xs text-slate-300 my-3">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{match.date} at {match.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{match.locationName} ({match.distanceKm} km away)</span>
          </div>
        </div>

        {/* Creator Info */}
        {match.creator && (
          <div className="flex items-center gap-2 py-2 border-t border-slate-800/80 my-3 text-xs text-slate-400">
            <img
              src={match.creator.avatar}
              alt={match.creator.name}
              className="w-6 h-6 rounded-full object-cover border border-slate-700"
            />
            <span>Hosted by <strong className="text-slate-200">{match.creator.name}</strong></span>
            {match.creator.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />}
          </div>
        )}
      </div>

      {/* Action CTA */}
      <div className="mt-2 pt-3 border-t border-slate-800/60 flex items-center gap-2">
        <button
          onClick={() => navigate(`/app/matches/${match.id}`)}
          className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
        >
          View Details
        </button>
        <button
          disabled={isFull}
          onClick={() => onJoin ? onJoin(match.id) : navigate(`/app/matches/${match.id}`)}
          className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer ${
            isFull
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 hover:opacity-95 shadow-md shadow-emerald-500/20'
          }`}
        >
          <span>{isFull ? 'FULL' : 'Join Match'}</span>
          {!isFull && <ArrowRight className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}
