import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getMatches, getAthletes, getEvents, getCommunityPosts } from '../../services/api';
import AthleteCard from '../../components/ui/AthleteCard';
import MatchCard from '../../components/ui/MatchCard';
import { Sparkles, Radio, ArrowRight, ShieldCheck, Trophy, Clock, Navigation } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [featuredMatch, setFeaturedMatch] = useState(null);
  const [topRadarAthletes, setTopRadarAthletes] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);

  useEffect(() => {
    async function loadDashboardData() {
      const matches = await getMatches();
      if (matches.length > 0) setFeaturedMatch(matches[0]);

      const athletes = await getAthletes();
      setTopRadarAthletes(athletes.slice(0, 3));

      const events = await getEvents();
      setUpcomingEvents(events.slice(0, 2));

      const posts = await getCommunityPosts();
      setLatestPosts(posts.slice(0, 2));
    }
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-white">
            Good evening, {user?.name?.split(' ')[0] || 'Vivek'} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Ready to find your next game in <span className="text-emerald-400 font-semibold">{user?.area || 'Gachibowli'}</span>?
          </p>
        </div>

        <button
          onClick={() => navigate('/app/radar')}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-slate-950 font-extrabold text-xs hover:scale-[1.02] shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Radio className="w-4 h-4 text-slate-950 animate-pulse" />
          <span>Launch Match Radar</span>
        </button>
      </div>

      {/* 1. YOUR NEXT MATCH (Featured Priority) */}
      {featuredMatch && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
              YOUR NEXT MATCH
            </span>
            <button
              onClick={() => navigate('/app/matches')}
              className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
            >
              View All Matches →
            </button>
          </div>

          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/30 relative overflow-hidden bg-gradient-to-br from-[#0f131d] via-[#101826] to-[#080a0f]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-800">
                    {featuredMatch.emoji} {featuredMatch.sport} • {featuredMatch.skillLevel}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-400 text-xs font-mono font-bold border border-cyan-800">
                    {featuredMatch.date} • {featuredMatch.time}
                  </span>
                </div>

                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
                  {featuredMatch.title}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-emerald-400" />
                    {featuredMatch.locationName} ({featuredMatch.distanceKm} km away)
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-cyan-400">
                    <Clock className="w-4 h-4" />
                    {featuredMatch.currentPlayers} / {featuredMatch.maxPlayers} Spots Filled
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(`/app/matches/${featuredMatch.id}`)}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-extrabold text-xs hover:opacity-95 shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                >
                  <span>View Match Details</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. MATCH RADAR PREVIEW (3 Strong Matches Near You) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
              MATCH RADAR — 3 STRONG MATCHES NEAR YOU
            </span>
          </div>
          <button
            onClick={() => navigate('/app/radar')}
            className="text-xs font-bold text-emerald-400 hover:underline"
          >
            Open Interactive Radar →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {topRadarAthletes.map((athlete) => (
            <AthleteCard
              key={athlete.id}
              athlete={athlete}
              onConnect={() => navigate('/app/messages')}
            />
          ))}
        </div>
      </section>

      {/* 3. UPCOMING EVENTS & COMMUNITY FEED (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Upcoming Events Column */}
        <section className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
              UPCOMING EVENTS & TOURNAMENTS
            </span>
            <button
              onClick={() => navigate('/app/events')}
              className="text-xs font-bold text-emerald-400 hover:underline"
            >
              All Events →
            </button>
          </div>

          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => navigate('/app/events')}
                className="glass-panel-interactive rounded-2xl p-4 border border-slate-800 flex items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl shrink-0 group-hover:border-emerald-400 transition-colors">
                    {event.emoji}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                      {event.title}
                    </h4>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {event.date} • {event.locationName}
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-400 text-xs font-mono font-bold border border-emerald-800 shrink-0">
                  {event.fee}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Community Feed Column */}
        <section className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
              COMMUNITY HIGHLIGHTS
            </span>
            <button
              onClick={() => navigate('/app/community')}
              className="text-xs font-bold text-emerald-400 hover:underline"
            >
              View Feed →
            </button>
          </div>

          <div className="space-y-3">
            {latestPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => navigate('/app/community')}
                className="glass-panel-interactive rounded-2xl p-4 border border-slate-800 space-y-2 cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.author?.avatar || '/athlete_rahul.jpg'}
                      alt={post.author?.name}
                      className="w-6 h-6 rounded-full object-cover border border-slate-700"
                    />
                    <span className="font-bold text-white">{post.author?.name || post.author}</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">{post.time}</span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2">{post.content}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

    </div>
  );
}
