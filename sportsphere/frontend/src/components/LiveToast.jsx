import React, { useState, useEffect } from 'react';
import { Zap, Radio, X, ArrowRight, CheckCircle2 } from 'lucide-react';

const EVENT_NOTIFICATIONS = [
  {
    id: 1,
    title: 'New Match Ping near Gachibowli!',
    text: 'Rahul S. is looking for 1 Badminton Doubles partner (1.2 km away)',
    time: 'Just now',
    athlete: { name: 'Rahul S.', sport: 'Badminton', avatar: '/athlete_rahul.jpg' },
  },
  {
    id: 2,
    title: 'Local Activity Badge Earned! 🏆',
    text: 'Priya M. completed her 10K Morning Run around KBR Park in 48:15!',
    time: '2m ago',
    athlete: { name: 'Priya M.', sport: 'Running', avatar: '/athlete_priya.jpg' },
  },
  {
    id: 3,
    title: 'Open Turf Spot in Madhapur ⚽',
    text: 'Arjun K. needs 2 midfielders for 7v7 Football tomorrow 7 AM',
    time: '5m ago',
    athlete: { name: 'Arjun K.', sport: 'Football', avatar: '/athlete_arjun.jpg' },
  },
];

export default function LiveToast({ onOpenChatModal }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % EVENT_NOTIFICATIONS.length);
        setVisible(true);
      }, 400);
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  const currentEvent = EVENT_NOTIFICATIONS[currentIdx];

  return (
    <div className="fixed bottom-5 right-5 z-40 max-w-sm w-full px-4 animate-toast-slide">
      <div className="glass-panel p-4 rounded-2xl border border-emerald-500/40 shadow-2xl bg-slate-950/90 text-left relative overflow-hidden group">
        
        {/* Glowing Top Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400"></div>

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img
                src={currentEvent.athlete.avatar}
                alt={currentEvent.athlete.name}
                className="w-10 h-10 rounded-xl object-cover border border-emerald-400/60"
              />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 font-heading">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>{currentEvent.title}</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 leading-snug">
                {currentEvent.text}
              </p>
            </div>
          </div>

          <button
            onClick={() => setVisible(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action button */}
        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400">{currentEvent.time}</span>
          <button
            onClick={() => onOpenChatModal(currentEvent.athlete)}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-all cursor-pointer"
          >
            <span>View Ping</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  );
}
