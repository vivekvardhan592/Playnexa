import React, { useState } from 'react';
import { UserPlus, Radar, MessageSquare, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    title: 'CREATE',
    headline: 'Build your athlete profile.',
    description: 'Add your sports, skill levels, preferred venues, and weekly schedule in under 60 seconds.',
    icon: UserPlus,
    accent: 'from-emerald-400 to-teal-400',
    borderColor: 'border-emerald-500/40',
    previewTitle: 'Profile Setup Preview',
    previewContent: (
      <div className="space-y-3 text-left">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
            🏏
          </div>
          <div>
            <div className="font-bold text-white text-sm">Cricket Profile</div>
            <div className="text-xs text-slate-400">All-Rounder · Intermediate · T20</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg">
            🏸
          </div>
          <div>
            <div className="font-bold text-white text-sm">Badminton Profile</div>
            <div className="text-xs text-slate-400">Doubles · Advanced · Indoor Wooden</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    num: '02',
    title: 'DISCOVER',
    headline: 'Find athletes & matches near you.',
    description: 'Use the local Match Radar to filter by sport, skill level, distance radius, and open game slots.',
    icon: Radar,
    accent: 'from-cyan-400 to-blue-400',
    borderColor: 'border-cyan-500/40',
    previewTitle: 'Radar Scanner Preview',
    previewContent: (
      <div className="space-y-3 text-left">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
            <div>
              <div className="font-bold text-white text-sm">Badminton Doubles Game</div>
              <div className="text-xs text-slate-400">Madhapur Turf · 1.2 km away · Needs 1 player</div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 text-xs font-mono font-bold">
            96% MATCH
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
            <div>
              <div className="font-bold text-white text-sm">Morning 10K Running Pod</div>
              <div className="text-xs text-slate-400">KBR Park · 0.8 km away · 6:00 AM</div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-400 text-xs font-mono font-bold">
            92% MATCH
          </span>
        </div>
      </div>
    ),
  },
  {
    num: '03',
    title: 'CONNECT & PLAY',
    headline: 'Chat, join and show up.',
    description: 'Message players directly, confirm venue location, split court fees, and build lasting sports friendships.',
    icon: MessageSquare,
    accent: 'from-teal-400 to-emerald-400',
    borderColor: 'border-teal-500/40',
    previewTitle: 'Direct Chat & Match Confirmation',
    previewContent: (
      <div className="space-y-3 text-left">
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-slate-200">
          <span className="font-bold text-emerald-400">Rahul: </span>
          "Hey Vivek! Court 2 booked at Madhapur for 6 PM. Ready for doubles?"
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 text-right ml-6">
          <span className="font-bold text-cyan-400">You: </span>
          "Count me in! Bringing extra Yonex shuttles. See you at 6!"
        </div>
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-400 font-mono pt-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Match Confirmed & Calendar Sync Active</span>
        </div>
      </div>
    ),
  },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="py-12 sm:py-16 relative bg-[#080a0f] overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Simple 3-Step Journey</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            How <span className="text-gradient-emerald">SportSphere</span> Works
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            From creating your multi-sport profile to walking onto the court, everything happens seamlessly in 3 quick steps.
          </p>
        </div>

        {/* 3 Step Interactive Process Grid */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Step Cards List */}
          <div className="lg:col-span-7 space-y-4 text-left">
            {STEPS.map((step, idx) => {
              const IconComp = step.icon;
              const isActive = activeStep === idx;
              return (
                <div
                  key={step.num}
                  onClick={() => setActiveStep(idx)}
                  className={`glass-panel p-6 rounded-3xl border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? `${step.borderColor} bg-slate-900/90 shadow-xl shadow-emerald-950/30 scale-[1.01]`
                      : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`px-3 py-1.5 rounded-xl font-heading font-black text-lg bg-gradient-to-r ${step.accent} text-slate-950 shrink-0`}>
                      {step.num}
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs font-mono font-bold text-slate-400 tracking-wider">
                        {step.title}
                      </div>
                      <h3 className="font-heading font-bold text-xl text-white">
                        {step.headline}
                      </h3>
                      <p className="text-sm text-slate-300 leading-relaxed pt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Live Preview Box */}
          <div className="lg:col-span-5">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-2xl relative">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  STEP {STEPS[activeStep].num} PREVIEW
                </span>
                <span className="text-xs font-semibold text-white font-heading">
                  {STEPS[activeStep].previewTitle}
                </span>
              </div>

              <div className="py-2">
                {STEPS[activeStep].previewContent}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 text-center">
                <button
                  onClick={() => setActiveStep((activeStep + 1) % 3)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  <span>Next Step Preview</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
