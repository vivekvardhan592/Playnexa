import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Layouts
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';

// Landing Page Components
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

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import OnboardingPage from './pages/onboarding/OnboardingPage';

// Authenticated Application Pages
import HomePage from './pages/app/HomePage';
import DiscoverPage from './pages/app/DiscoverPage';
import MatchRadarPage from './pages/app/MatchRadarPage';
import ProfilePage from './pages/app/ProfilePage';
import AthleteProfilePage from './pages/app/AthleteProfilePage';
import CreateMatchPage from './pages/app/CreateMatchPage';
import MatchDetailPage from './pages/app/MatchDetailPage';
import MessagesPage from './pages/app/MessagesPage';
import EventsPage from './pages/app/EventsPage';
import CommunityPage from './pages/app/CommunityPage';
import NotificationsPage from './pages/app/NotificationsPage';
import TeamsPage from './pages/app/TeamsPage';

function LandingPage() {
  const navigate = useNavigate();
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [activeChatAthlete, setActiveChatAthlete] = useState(null);

  const handleOpenChatModal = (athlete) => {
    setActiveChatAthlete(athlete || {
      name: 'Rahul S.',
      sport: 'Badminton',
      avatar: '/athlete_rahul.jpg',
    });
  };

  const handlePrimaryMatchClick = () => {
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-emerald-500 selection:text-slate-950 font-['Plus_Jakarta_Sans',sans-serif] relative overflow-x-hidden">
      <Navbar onOpenMatchModal={handlePrimaryMatchClick} />
      <main>
        <Hero onOpenMatchModal={handlePrimaryMatchClick} onOpenChatModal={handleOpenChatModal} />
        <TrustStrip />
        <ProblemSection />
        <MultiSportProfile />
        <MatchRadarSection onOpenChatModal={handleOpenChatModal} />
        <TrustSafety />
        <HowItWorks />
        <CommunitySection onOpenChatModal={handleOpenChatModal} />
        <FinalCTA onOpenMatchModal={handlePrimaryMatchClick} />
      </main>

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

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Authentication Routes */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="onboarding" element={<OnboardingPage />} />
            </Route>

            {/* Authenticated Application Routes */}
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<HomePage />} />
              <Route path="discover" element={<DiscoverPage />} />
              <Route path="radar" element={<MatchRadarPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="athlete/:id" element={<AthleteProfilePage />} />
              <Route path="create-match" element={<CreateMatchPage />} />
              <Route path="matches" element={<DiscoverPage />} />
              <Route path="matches/:id" element={<MatchDetailPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="community" element={<CommunityPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="teams" element={<TeamsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
