import React from 'react';
import { Search, Compass, Plus } from 'lucide-react';

export default function EmptyState({ title, description, icon: Icon = Search, actionLabel, onAction }) {
  return (
    <div className="glass-panel rounded-3xl p-8 sm:p-12 text-center border border-slate-800 my-6 max-w-lg mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 mx-auto mb-4 shadow-inner">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-heading font-extrabold text-xl text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-6">{description}</p>
      {actionLabel && (
        <button
          onClick={onAction}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-extrabold text-xs hover:opacity-95 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
