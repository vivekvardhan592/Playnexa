import React from 'react';
import { ShieldCheck, MapPin, Users, Zap } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    title: 'Verified Profiles',
    description: 'Real identity & phone checks',
  },
  {
    icon: MapPin,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10 border-cyan-500/20',
    title: 'Local Discovery',
    description: 'Precision radius search',
  },
  {
    icon: Users,
    color: 'text-teal-400',
    bgColor: 'bg-teal-500/10 border-teal-500/20',
    title: 'Community Driven',
    description: 'Participation-based trust',
  },
  {
    icon: Zap,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10 border-amber-500/20',
    title: 'Real-Time Connections',
    description: 'Instant athlete chat',
  },
];

export default function TrustStrip() {
  return (
    <section className="py-8 border-y border-slate-800/80 bg-slate-950/40 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {TRUST_ITEMS.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl glass-card border border-slate-800/80 hover:border-slate-700 transition-all duration-300"
              >
                <div className={`p-2.5 rounded-xl border ${item.bgColor} shrink-0`}>
                  <IconComponent className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="text-left">
                  <div className="font-heading font-bold text-slate-100 text-sm sm:text-base flex items-center gap-1.5">
                    <span className="text-emerald-400 text-xs">✓</span>
                    {item.title}
                  </div>
                  <div className="text-xs text-slate-400 font-normal mt-0.5">
                    {item.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
