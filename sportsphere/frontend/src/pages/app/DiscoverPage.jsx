import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAthletes, getMatches, getEvents } from '../../services/api';
import AthleteCard from '../../components/ui/AthleteCard';
import MatchCard from '../../components/ui/MatchCard';
import EmptyState from '../../components/ui/EmptyState';
import { Search, Sliders, MapPin, Radio, Users, Swords, Calendar } from 'lucide-react';

export default function DiscoverPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('athletes'); // 'athletes' | 'matches' | 'events'

  // Filters
  const [selectedSport, setSelectedSport] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [maxDistance, setMaxDistance] = useState(10);

  // Data
  const [athletes, setAthletes] = useState([]);
  const [matches, setMatches] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const athData = await getAthletes({ sport: selectedSport, skill: selectedSkill, maxDistance });
      setAthletes(athData);

      const matchData = await getMatches({ sport: selectedSport });
      setMatches(matchData);

      const eventData = await getEvents();
      setEvents(eventData);

      setLoading(false);
    }
    loadData();
  }, [selectedSport, selectedSkill, maxDistance]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="space-y-1">
        <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-white">
          Find Your <span className="text-gradient-emerald">People & Matches.</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Discover compatible local athletes, active game lobbies, and local tournaments.
        </p>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 gap-4 overflow-x-auto">
        <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('athletes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'athletes'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Athletes ({athletes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'matches'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Matches ({matches.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'events'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Events ({events.length})</span>
          </button>
        </div>

        <button
          onClick={() => navigate('/app/radar')}
          className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1.5 shrink-0"
        >
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Switch to Match Radar View →</span>
        </button>
      </div>

      {/* Filter Control Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold text-slate-300">DISCOVERY FILTERS:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-1.5 text-xs font-medium focus:border-emerald-400 focus:outline-none cursor-pointer"
          >
            <option value="All">All Sports</option>
            <option value="Badminton">Badminton 🏸</option>
            <option value="Cricket">Cricket 🏏</option>
            <option value="Running">Running 🏃</option>
            <option value="Football">Football ⚽</option>
            <option value="Chess">Chess ♟️</option>
          </select>

          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-1.5 text-xs font-medium focus:border-emerald-400 focus:outline-none cursor-pointer"
          >
            <option value="All">All Skill Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
            <span>Radius:</span>
            <input
              type="range"
              min="2"
              max="25"
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-24 h-1.5 bg-slate-900 rounded appearance-none cursor-pointer accent-emerald-400"
            />
            <span className="text-emerald-400 font-bold">{maxDistance} km</span>
          </div>
        </div>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'athletes' && (
        athletes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {athletes.map((athlete) => (
              <AthleteCard
                key={athlete.id}
                athlete={athlete}
                onConnect={() => navigate('/app/messages')}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No athletes found nearby"
            description="We couldn't find compatible athletes matching your filters. Try expanding your search radius."
            actionLabel="Expand Radius to 25 km"
            onAction={() => setMaxDistance(25)}
          />
        )
      )}

      {activeTab === 'matches' && (
        matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {matches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onJoin={() => navigate(`/app/matches/${match.id}`)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No open game lobbies"
            description="Be the first athlete to host a game lobby in your area."
            actionLabel="Create a Match"
            onAction={() => navigate('/app/create-match')}
          />
        )
      )}

      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {events.map((event) => (
            <div
              key={event.id}
              className="glass-panel-interactive rounded-2xl p-5 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-400 text-xs font-mono font-bold border border-emerald-800">
                  {event.category}
                </span>
                <h3 className="font-heading font-bold text-lg text-white mt-2">{event.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{event.description}</p>
                <div className="text-xs text-slate-300 space-y-1 mt-3">
                  <div>📍 {event.locationName}</div>
                  <div>📅 {event.date}</div>
                  <div>👥 {event.participants} registered</div>
                </div>
              </div>
              <button
                onClick={() => navigate('/app/events')}
                className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-extrabold text-xs cursor-pointer"
              >
                Register ({event.fee})
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
