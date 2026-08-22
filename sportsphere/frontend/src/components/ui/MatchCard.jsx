import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Clock, MapPin, Users, CheckCircle2, ArrowRight, Crown, Check } from 'lucide-react';

export default function MatchCard({ match, onJoin }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userAthleteId = user?.athleteId || user?.id;
  const creatorId = match.creator_id || match.creator?.id || match.creator?.athleteId;

  const isCreator = Boolean(
    userAthleteId && creatorId && String(creatorId) === String(userAthleteId)
  );

  const hasJoined = Boolean(
    userAthleteId && (match.participants || []).some((p) => {
      const pid = p.athlete_id || p.id;
      return pid && String(pid) === String(userAthleteId);
    })
  );

  const currentPlayers = match.current_players || match.currentPlayers || 1;
  const maxPlayers = match.capacity || match.maxPlayers || 4;
  const isFull = currentPlayers >= maxPlayers;

  return (
    <div className="glass-panel-interactive rounded-2xl p-5 border border-slate-800 flex flex-col justify-between group">
      <div>
        {/* Top Header: Sport Badge & Slots */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
            <span>{match.emoji || '🏸'}</span>
            <span>{match.sport_name || match.sport}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-300 font-mono">{match.skill_level || match.skillLevel || 'Any'}</span>
          </span>

          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
              isFull
                ? 'bg-red-950/80 text-red-400 border-red-800/60'
                : 'bg-slate-900 text-cyan-400 border-slate-700'
            }`}
          >
            {isFull ? 'MATCH FULL' : `${currentPlayers} / ${maxPlayers} PLAYERS`}
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
            <span>{match.scheduled_at ? new Date(match.scheduled_at).toLocaleString() : `${match.date || 'Today'} at ${match.time || '6:00 PM'}`}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{match.location_name || match.locationName} ({match.distanceKm || match.distance_km || 1.2} km away)</span>
          </div>
        </div>

        {/* Creator Info */}
        {(match.creator || match.creator_name) && (
          <div className="flex items-center gap-2 py-2 border-t border-slate-800/80 my-3 text-xs text-slate-400">
            <img
              src={match.creator?.avatar || match.creator_avatar || '/athlete_rahul.jpg'}
              alt={match.creator?.name || match.creator_name}
              className="w-6 h-6 rounded-full object-cover border border-slate-700"
            />
            <span>Hosted by <strong className="text-slate-200">{match.creator?.name || match.creator_name}</strong></span>
            {isCreator && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-extrabold bg-amber-950 text-amber-400 border border-amber-800 flex items-center gap-0.5 ml-auto">
                <Crown className="w-2.5 h-2.5" /> HOST
              </span>
            )}
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

        {isCreator ? (
          <button
            onClick={() => navigate(`/app/matches/${match.id}`)}
            className="flex-1 py-2.5 rounded-xl bg-amber-950/80 border border-amber-800/80 text-amber-300 font-extrabold text-xs flex items-center justify-center gap-1 cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Host</span>
          </button>
        ) : hasJoined ? (
          <button
            onClick={() => navigate(`/app/matches/${match.id}`)}
            className="flex-1 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 font-extrabold text-xs flex items-center justify-center gap-1 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Joined</span>
          </button>
        ) : (
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
        )}
      </div>
    </div>
  );
}
