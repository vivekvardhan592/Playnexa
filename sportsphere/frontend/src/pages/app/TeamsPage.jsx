import React, { useState, useEffect } from 'react';
import { getTeams } from '../../services/api';
import { ShieldCheck, Users, MapPin, Trophy, Plus, ArrowRight } from 'lucide-react';

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    async function loadTeams() {
      const data = await getTeams();
      setTeams(data);
    }
    loadTeams();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-white">
            Local <span className="text-gradient-emerald">Teams & Pods</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Join or form local sports squads, running pods, and turf teams.
          </p>
        </div>

        <button
          onClick={() => alert('Create Team Modal ready')}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-extrabold text-xs hover:opacity-95 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Form New Team</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div
            key={team.id}
            className="glass-panel-interactive rounded-3xl p-6 border border-slate-800 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-800 flex items-center gap-1.5">
                  <span>{team.emoji}</span>
                  <span>{team.sport}</span>
                </span>
                <span className="text-xs font-mono font-bold text-slate-300">
                  {team.skillLevel}
                </span>
              </div>

              <h3 className="font-heading font-extrabold text-xl text-white mb-2">{team.name}</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">{team.description}</p>

              <div className="space-y-2 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{team.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{team.members} Active Members</span>
                </div>
                {team.matches > 0 && (
                  <div className="flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{team.wins} Wins in {team.matches} Matches</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => alert(`Requested to join ${team.name}!`)}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Join Team</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
