import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMatchById, joinMatch } from '../../services/api';
import { ArrowLeft, Clock, MapPin, CheckCircle2, ShieldCheck, Users, MessageSquare, ArrowRight } from 'lucide-react';

export default function MatchDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    async function loadMatch() {
      const data = await getMatchById(id || 'match_1');
      setMatch(data);
    }
    loadMatch();
  }, [id]);

  if (!match) {
    return <div className="py-12 text-center text-slate-400">Loading match details...</div>;
  }

  const isFull = match.currentPlayers >= match.maxPlayers;

  const handleJoinToggle = async () => {
    if (!hasJoined && !isFull) {
      const updated = await joinMatch(match.id);
      if (updated) setMatch({ ...updated });
      setHasJoined(true);
    } else if (hasJoined) {
      setMatch((prev) => ({
        ...prev,
        currentPlayers: Math.max(1, prev.currentPlayers - 1),
        status: 'OPEN',
      }));
      setHasJoined(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      <button
        onClick={() => navigate(-1)}
        className="text-xs font-bold text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Discovery</span>
      </button>

      {/* Match Banner Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-800">
                {match.emoji} {match.sport} • {match.skillLevel}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-400 text-xs font-mono font-bold border border-cyan-800">
                {match.matchType || 'Casual'}
              </span>
            </div>

            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-white">
              {match.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                {match.date} at {match.time}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cyan-400" />
                {match.locationName} ({match.distanceKm} km away)
              </span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-2xl font-extrabold font-heading text-white">
              {match.currentPlayers} / {match.maxPlayers}
            </div>
            <div className="text-xs font-mono text-slate-400 uppercase">PLAYERS REGISTERED</div>
          </div>
        </div>

        {/* Player Slot Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>PLAYER SLOTS</span>
            <span className={isFull ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
              {isFull ? 'LOBBY FULL' : `${match.maxPlayers - match.currentPlayers} SPOTS AVAILABLE`}
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-300 ${
                isFull ? 'bg-red-500' : 'bg-gradient-to-r from-emerald-400 to-cyan-400'
              }`}
              style={{ width: `${(match.currentPlayers / match.maxPlayers) * 100}%` }}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 py-2">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase">MATCH DETAILS & RULES</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {match.description}
          </p>
        </div>

        {/* Participant List */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase">
            REGISTERED ATHLETES ({match.participants?.length || match.currentPlayers})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(match.participants || []).map((p, idx) => (
              <div
                key={p.id || idx}
                onClick={() => navigate(`/app/athlete/${p.id || 'rahul'}`)}
                className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 cursor-pointer hover:border-emerald-400 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-9 h-9 rounded-xl object-cover border border-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-xs text-white">{p.name}</span>
                      {p.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />}
                    </div>
                    <span className="text-[11px] text-slate-400">{p.sports?.[0]?.skillLevel || 'Intermediate'}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  {p.trust?.attendanceRatePct || 94}% Show-up
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Primary CTA */}
        <div className="pt-4 border-t border-slate-800 flex items-center gap-4">
          <button
            onClick={() => navigate('/app/messages')}
            className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Group Chat</span>
          </button>

          <button
            disabled={isFull && !hasJoined}
            onClick={handleJoinToggle}
            className={`flex-1 py-3.5 rounded-xl font-extrabold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
              hasJoined
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
                : isFull
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 hover:opacity-95 shadow-lg shadow-emerald-500/25'
            }`}
          >
            <span>{hasJoined ? 'Leave Match' : isFull ? 'MATCH FULL' : 'Join Match Now'}</span>
            {!hasJoined && !isFull && <ArrowRight className="w-4 h-4 stroke-[3]" />}
          </button>
        </div>

      </div>

    </div>
  );
}
