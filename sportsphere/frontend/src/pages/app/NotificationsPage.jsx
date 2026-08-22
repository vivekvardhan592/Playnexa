import React, { useState, useEffect } from 'react';
import { getNotifications } from '../../services/api';
import { Bell, CheckCircle2, MessageSquare, Calendar, Trophy, UserPlus } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function loadNotifications() {
      const data = await getNotifications();
      setNotifications(data);
    }
    loadNotifications();
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">Notifications</h1>
          <p className="text-xs text-slate-400">Connection requests, match updates, and event reminders.</p>
        </div>

        <button
          onClick={markAllRead}
          className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer"
        >
          Mark all as read
        </button>
      </div>

      <div className="glass-panel rounded-3xl border border-slate-800 divide-y divide-slate-800/80 overflow-hidden">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 sm:p-5 flex items-start gap-4 transition-colors ${
              n.read ? 'bg-transparent' : 'bg-emerald-950/20'
            }`}
          >
            {n.avatar ? (
              <img src={n.avatar} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
                <Bell className="w-5 h-5" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-bold text-sm text-white">{n.title}</h4>
                <span className="text-[10px] font-mono text-slate-400">{n.time}</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{n.subtitle}</p>
            </div>

            {!n.read && (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0 self-center" />
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
