import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SPORTS_LIST, SKILL_LEVELS } from '../../data/mockData';
import { CheckCircle2, ArrowRight, ArrowLeft, Sparkles, MapPin, ShieldCheck, Zap } from 'lucide-react';

export default function OnboardingPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Form State
  const [profile, setProfile] = useState({
    name: user?.name || 'Vivek Kumar',
    city: user?.city || 'Hyderabad',
    area: 'Gachibowli',
    bio: 'Weekend badminton player and competitive cricket enthusiast.',
  });

  const [selectedSports, setSelectedSports] = useState(['Badminton', 'Cricket', 'Running']);
  const [sportSkills, setSportSkills] = useState({
    Badminton: 'Advanced',
    Cricket: 'Intermediate',
    Running: 'Beginner',
  });

  const [availability, setAvailability] = useState({
    days: ['Monday', 'Wednesday', 'Saturday', 'Sunday'],
    preferredTime: 'Evenings & Weekend Mornings',
  });

  const [radius, setRadius] = useState(10);

  const toggleSport = (sportName) => {
    if (selectedSports.includes(sportName)) {
      if (selectedSports.length > 1) {
        setSelectedSports(selectedSports.filter((s) => s !== sportName));
      }
    } else {
      setSelectedSports([...selectedSports, sportName]);
      setSportSkills({ ...sportSkills, [sportName]: 'Intermediate' });
    }
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Finalize onboarding
      updateUser({
        ...profile,
        sports: selectedSports.map((s) => {
          const item = SPORTS_LIST.find((sp) => sp.sport === s);
          return {
            sport: s,
            emoji: item?.emoji || '⚽',
            skillLevel: sportSkills[s] || 'Intermediate',
            metrics: { matches: 0, status: 'Active' },
          };
        }),
        discoveryRadius: radius,
        availability: {
          days: availability.days,
          preferredPlayTimes: availability.preferredTime,
        },
      });
      navigate('/app');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto glass-panel rounded-3xl p-6 sm:p-10 border border-slate-700/80 shadow-2xl space-y-6">
      
      {/* Progress Bar Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400">
          <span className="text-emerald-400">STEP {step} OF 5</span>
          <span>{step === 1 ? 'BASIC PROFILE' : step === 2 ? 'CHOOSE SPORTS' : step === 3 ? 'SKILL LEVELS' : step === 4 ? 'AVAILABILITY' : 'DISCOVERY RADIUS'}</span>
        </div>
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Basic Profile */}
      {step === 1 && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="space-y-1">
            <h2 className="font-heading font-extrabold text-2xl text-white">Create Your Athlete Profile</h2>
            <p className="text-xs text-slate-400">This is how other local athletes will discover you on SportSphere.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">YOUR NAME</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">CITY</label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">LOCAL AREA / NEIGHBORHOOD</label>
                <input
                  type="text"
                  value={profile.area}
                  onChange={(e) => setProfile({ ...profile, area: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">SHORT BIO</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={3}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none resize-none"
                placeholder="Tell nearby players what sports you love..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Choose Sports */}
      {step === 2 && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="space-y-1">
            <h2 className="font-heading font-extrabold text-2xl text-white">Select Your Sports</h2>
            <p className="text-xs text-slate-400">Represent all the sports you play in one unified profile.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SPORTS_LIST.map(({ sport, emoji }) => {
              const isSelected = selectedSports.includes(sport);
              return (
                <div
                  key={sport}
                  onClick={() => toggleSport(sport)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{emoji}</span>
                    <span className="text-xs font-bold">{sport}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: Skill Levels */}
      {step === 3 && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="space-y-1">
            <h2 className="font-heading font-extrabold text-2xl text-white">Define Your Skill Levels</h2>
            <p className="text-xs text-slate-400">SportSphere uses this to match you with compatible skill levels.</p>
          </div>

          <div className="space-y-4">
            {selectedSports.map((sport) => {
              const item = SPORTS_LIST.find((s) => s.sport === sport);
              return (
                <div key={sport} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-white">
                    <span>{item?.emoji || '⚽'}</span>
                    <span>{sport}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {SKILL_LEVELS.map((level) => {
                      const isCurrent = sportSkills[sport] === level;
                      return (
                        <button
                          key={level}
                          onClick={() => setSportSkills({ ...sportSkills, [sport]: level })}
                          className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {level}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 4: Availability */}
      {step === 4 && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="space-y-1">
            <h2 className="font-heading font-extrabold text-2xl text-white">When Do You Play?</h2>
            <p className="text-xs text-slate-400">Help the Match Radar engine know when you are free.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-2">AVAILABLE DAYS</label>
              <div className="flex flex-wrap gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                  const active = availability.days.includes(day);
                  return (
                    <button
                      key={day}
                      onClick={() => {
                        if (active) setAvailability({ ...availability, days: availability.days.filter((d) => d !== day) });
                        else setAvailability({ ...availability, days: [...availability.days, day] });
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        active
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-2">PREFERRED PLAY TIME</label>
              <select
                value={availability.preferredTime}
                onChange={(e) => setAvailability({ ...availability, preferredTime: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
              >
                <option value="Early Mornings (6:00 AM – 9:00 AM)">Early Mornings (6:00 AM – 9:00 AM)</option>
                <option value="Evenings (5:00 PM – 9:00 PM)">Evenings (5:00 PM – 9:00 PM)</option>
                <option value="Weekend Mornings">Weekend Mornings</option>
                <option value="Flexible / Anytime">Flexible / Anytime</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Discovery Radius */}
      {step === 5 && (
        <div className="space-y-5 animate-in fade-in duration-300 text-center">
          <div className="space-y-1">
            <h2 className="font-heading font-extrabold text-2xl text-white">Match Radar Discovery Radius</h2>
            <p className="text-xs text-slate-400">How far are you willing to travel for a game?</p>
          </div>

          <div className="py-6 space-y-6">
            <div className="text-4xl font-extrabold font-heading text-emerald-400">{radius} km</div>
            <input
              type="range"
              min="2"
              max="25"
              step="1"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-xs font-mono text-slate-400 px-2">
              <span>2 km (Local neighborhood)</span>
              <span>10 km (City radius)</span>
              <span>25 km (Greater area)</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 text-xs text-emerald-300 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            <span>Your SportSphere profile is ready to launch!</span>
          </div>
        </div>
      )}

      {/* Footer Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : <div />}

        <button
          onClick={handleNext}
          className="px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-extrabold text-xs hover:opacity-95 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center gap-2 ml-auto"
        >
          <span>{step === 5 ? 'Launch SportSphere' : 'Next Step'}</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>

    </div>
  );
}
