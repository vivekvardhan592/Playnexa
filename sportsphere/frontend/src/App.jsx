import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustStrip from './components/TrustStrip';
import ProblemSection from './components/ProblemSection';
import MultiSportProfile from './components/MultiSportProfile';
import MatchRadarSection from './components/MatchRadarSection';
import TrustSafety from './components/TrustSafety';
import HowItWorks from './components/HowItWorks';
import CommunitySection from './components/CommunitySection';
import FinalCTA from './components/FinalCTA';
import MatchModal from './components/MatchModal';
import ChatModal from './components/ChatModal';

import LiveToast from './components/LiveToast';

export default function App() {
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [activeChatAthlete, setActiveChatAthlete] = useState(null);

  const handleOpenChatModal = (athlete) => {
    setActiveChatAthlete(athlete || {
      name: 'Rahul S.',
      sport: 'Badminton',
      avatar: '/athlete_rahul.jpg',
    });
  };

  return (
    <div className="min-h-screen bg-[#080a0f] text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-['Plus_Jakarta_Sans',sans-serif] relative overflow-x-hidden">
      
      {/* Top Fixed Navbar */}
      <Navbar onOpenMatchModal={() => setIsMatchModalOpen(true)} />

      {/* Main Storytelling Sections */}
      <main>
        {/* SECTION 2 — HERO & INTERACTIVE MATCH RADAR */}
        <Hero
          onOpenMatchModal={() => setIsMatchModalOpen(true)}
          onOpenChatModal={handleOpenChatModal}
        />

        {/* SECTION 3 — TRUST STRIP */}
        <TrustStrip />

        {/* SECTION 4 — THE PROBLEM & UNIFICATION TRANSFORMATION */}
        <ProblemSection />

        {/* SECTION 5 — MULTI-SPORT IDENTITY */}
        <MultiSportProfile />

        {/* SECTION 6 — MATCH RADAR & EXPLAINABLE DISCOVERY ENGINE */}
        <MatchRadarSection onOpenChatModal={handleOpenChatModal} />

        {/* SECTION 7 — TRUST & SAFETY THROUGH PARTICIPATION */}
        <TrustSafety />

        {/* SECTION 8 — HOW IT WORKS */}
        <HowItWorks />

        {/* SECTION 9 — COMMUNITY & ACTIVE SOCIAL FEED */}
        <CommunitySection onOpenChatModal={handleOpenChatModal} />

        {/* SECTION 10 — FINAL EMOTIONAL CTA */}
        <FinalCTA onOpenMatchModal={() => setIsMatchModalOpen(true)} />
      </main>

      {/* Interactive Live Notification Toast */}
      <LiveToast onOpenChatModal={handleOpenChatModal} />

      {/* Interactive Popup Modals */}
      <MatchModal
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
        onOpenChatModal={handleOpenChatModal}
      />

      <ChatModal
        isOpen={!!activeChatAthlete}
        athlete={activeChatAthlete}
        onClose={() => setActiveChatAthlete(null)}
      />

    </div>
  );
}
