import React, { useState, useEffect } from 'react';
import { getEvents, registerForEvent, leaveEvent } from '../../services/api';
import { Calendar, MapPin, Users, Trophy, CheckCircle2, ShieldCheck, ArrowRight, Check } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [registeredIds, setRegisteredIds] = useState(new Set());
  const [loadingId, setLoadingId] = useState(null);

  const loadEvents = async () => {
    const data = await getEvents();
    setEvents(data);
    const registered = new Set();
    data.forEach((e) => {
      if (e.is_registered) registered.add(e.id);
    });
    setRegisteredIds(registered);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleToggleRegistration = async (eventId) => {
    setLoadingId(eventId);
    const isRegistered = registeredIds.has(eventId);

    try {
      if (isRegistered) {
        await leaveEvent(eventId);
        setRegisteredIds((prev) => {
          const next = new Set(prev);
          next.delete(eventId);
          return next;
        });
      } else {
        await registerForEvent(eventId);
        setRegisteredIds((prev) => {
          const next = new Set(prev);
          next.add(eventId);
          return next;
        });
      }
      await loadEvents();
    } catch (err) {
      console.error('Event registration error:', err.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="space-y-1">
        <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-white">
          Local <span className="text-gradient-emerald">Tournaments & Events</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Compete in verified local tournaments, running half marathons, and turf leagues.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((event) => {
          const isRegistered = registeredIds.has(event.id) || Boolean(event.is_registered);
          const isLoading = loadingId === event.id;

          return (
            <div
              key={event.id}
              className="glass-panel-interactive rounded-3xl p-6 border border-slate-800 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-800 flex items-center gap-1.5">
                    <span>{event.emoji || '🏆'}</span>
                    <span>{event.category}</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-800">
                    {event.fee}
                  </span>
                </div>

                <h3 className="font-heading font-extrabold text-xl text-white mb-2">{event.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{event.description}</p>

                <div className="space-y-2 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{event.date} at {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{event.locationName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{event.participants || 0} / {event.maxParticipants || 100} Registered</span>
                  </div>
                </div>
              </div>

              <button
                disabled={isLoading}
                onClick={() => handleToggleRegistration(event.id)}
                className={`w-full py-3 rounded-xl font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  isRegistered
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/80'
                    : 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 hover:opacity-95 shadow-md shadow-emerald-500/20'
                }`}
              >
                {isLoading ? (
                  <span>Updating...</span>
                ) : isRegistered ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Registered (Click to Leave Event)</span>
                  </>
                ) : (
                  <>
                    <span>Register Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
