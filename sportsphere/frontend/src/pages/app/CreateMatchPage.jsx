import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMatch } from '../../services/api';
import { SPORTS_LIST, SKILL_LEVELS } from '../../data/mockData';
import { ArrowLeft, Sparkles, Plus, Calendar, Clock, MapPin, Users } from 'lucide-react';

export default function CreateMatchPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: 'Badminton Doubles Evening Game',
    sport: 'Badminton',
    skillLevel: 'Intermediate',
    date: 'Today',
    time: '6:00 PM',
    locationName: 'Gachibowli Indoor Sports Complex',
    distanceKm: 1.2,
    maxPlayers: 4,
    description: 'Casual badminton doubles session. Court reserved for 2 hours.',
    matchType: 'Casual',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const item = SPORTS_LIST.find((s) => s.sport === formData.sport);

      const payload = {
        title: formData.title,
        sport: formData.sport,
        skillLevel: formData.skillLevel,
        locationName: formData.locationName,
        city: 'Hyderabad',
        description: formData.description,
        capacity: Number(formData.maxPlayers) || 4,
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        longitude: 78.38,
        latitude: 17.44,
        emoji: item?.emoji || '🏸',
      };

      const newMatch = await createMatch(payload);

      if (newMatch && (newMatch.id || newMatch.match?.id)) {
        const matchId = newMatch.id || newMatch.match?.id;
        navigate(`/app/matches/${matchId}`);
      } else {
        navigate('/app/matches');
      }
    } catch (err) {
      console.error('Match creation error:', err.message);
      setError(err.message || 'Failed to publish match to backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      <button
        onClick={() => navigate(-1)}
        className="text-xs font-bold text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Matches</span>
      </button>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
          {error}
        </div>
      )}

      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-mono font-bold border border-emerald-800 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CREATE A GAME LOBBY</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
            Host a <span className="text-gradient-emerald">Game Match.</span>
          </h1>
          <p className="text-xs text-slate-400">
            Post an open match spot for local compatible athletes to join.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">MATCH TITLE</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
              placeholder="e.g. Saturday Badminton Doubles"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">SPORT</label>
              <select
                value={formData.sport}
                onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none cursor-pointer"
              >
                {SPORTS_LIST.map((s) => (
                  <option key={s.sport} value={s.sport}>{s.emoji} {s.sport}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">REQUIRED SKILL LEVEL</label>
              <select
                value={formData.skillLevel}
                onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none cursor-pointer"
              >
                {SKILL_LEVELS.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">DATE & DAY</label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
                placeholder="e.g. Today / Saturday"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">TIME</label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
                placeholder="e.g. 6:00 PM"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">LOCATION / VENUE NAME</label>
            <input
              type="text"
              value={formData.locationName}
              onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
              placeholder="e.g. Gachibowli Indoor Turf"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">MAXIMUM PLAYERS</label>
              <input
                type="number"
                min="2"
                max="30"
                value={formData.maxPlayers}
                onChange={(e) => setFormData({ ...formData, maxPlayers: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">MATCH TYPE</label>
              <select
                value={formData.matchType}
                onChange={(e) => setFormData({ ...formData, matchType: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none cursor-pointer"
              >
                <option value="Casual">Casual Game</option>
                <option value="Competitive">Competitive Match</option>
                <option value="Training">Training / Practice</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">MATCH DESCRIPTION</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none resize-none"
              placeholder="Provide court reservation details, turf rules..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-extrabold text-sm hover:opacity-95 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{loading ? 'Publishing to Radar...' : 'Publish Match to Radar'}</span>
          </button>
        </form>
      </div>

    </div>
  );
}
