import React, { useState, useEffect } from 'react';
import { X, Check, Sparkles, User, MapPin, FileText, CheckCircle2 } from 'lucide-react';
import { SPORTS_LIST, SKILL_LEVELS } from '../data/mockData';

export default function EditProfileModal({ isOpen, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    area: '',
    bio: '',
    selectedSports: [],
    sportSkills: {},
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      const sportsNames = (user.sports || []).map((s) => s.sport || s.name);
      const skillsMap = {};
      (user.sports || []).forEach((s) => {
        skillsMap[s.sport || s.name] = s.skillLevel || s.skill_level || 'Intermediate';
      });

      setFormData({
        name: user.name || user.displayName || 'Vivek Kumar',
        city: user.city || 'Hyderabad',
        area: user.area || 'Gachibowli',
        bio: user.bio || '',
        selectedSports: sportsNames.length > 0 ? sportsNames : ['Badminton', 'Cricket'],
        sportSkills: skillsMap,
      });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const toggleSport = (sportName) => {
    if (formData.selectedSports.includes(sportName)) {
      if (formData.selectedSports.length > 1) {
        setFormData((prev) => ({
          ...prev,
          selectedSports: prev.selectedSports.filter((s) => s !== sportName),
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        selectedSports: [...prev.selectedSports, sportName],
        sportSkills: { ...prev.sportSkills, [sportName]: 'Intermediate' },
      }));
    }
  };

  const handleSkillChange = (sportName, level) => {
    setFormData((prev) => ({
      ...prev,
      sportSkills: { ...prev.sportSkills, [sportName]: level },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const updatedSports = formData.selectedSports.map((s) => {
      const item = SPORTS_LIST.find((sp) => sp.sport === s);
      const existing = (user?.sports || []).find((sp) => (sp.sport || sp.name) === s);
      return {
        sport: s,
        emoji: item?.emoji || '⚽',
        skillLevel: formData.sportSkills[s] || 'Intermediate',
        metrics: existing?.metrics || { matches: 0, winRate: '75%', playingStyle: 'Versatile' },
      };
    });

    const updatedUserData = {
      name: formData.name,
      city: formData.city,
      area: formData.area,
      bio: formData.bio,
      sports: updatedSports,
    };

    await onSave(updatedUserData);
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="glass-panel w-full max-w-2xl rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 my-8 shadow-2xl relative">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-xl text-white">Edit Athlete Profile</h2>
              <p className="text-xs text-slate-400">Update your multi-sport identity and location details.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
          
          {/* Basic Info */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">FULL NAME</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">CITY</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">LOCAL AREA / NEIGHBORHOOD</label>
              <input
                type="text"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
                placeholder="e.g. Gachibowli / Hitec City"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">ATHLETE BIO</label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none resize-none"
                placeholder="Describe your sports background, play frequency, and favorite venues..."
              />
            </div>
          </div>

          {/* Multi-Sport Representation */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <label className="block text-xs font-mono text-slate-300">
              REPRESENTED SPORTS ({formData.selectedSports.length})
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SPORTS_LIST.map(({ sport, emoji }) => {
                const isSelected = formData.selectedSports.includes(sport);
                return (
                  <div
                    key={sport}
                    onClick={() => toggleSport(sport)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{emoji}</span>
                      <span className="text-xs font-bold">{sport}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skill Levels per Selected Sport */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <label className="block text-xs font-mono text-slate-300">ASSIGN SKILL LEVELS</label>
            <div className="space-y-3">
              {formData.selectedSports.map((sport) => {
                const item = SPORTS_LIST.find((s) => s.sport === sport);
                const currentLevel = formData.sportSkills[sport] || 'Intermediate';

                return (
                  <div key={sport} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-xs text-white">
                      <span>{item?.emoji || '⚽'}</span>
                      <span>{sport}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {SKILL_LEVELS.map((level) => (
                        <button
                          type="button"
                          key={level}
                          onClick={() => handleSkillChange(sport, level)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer text-center ${
                            currentLevel === level
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-extrabold text-xs hover:opacity-95 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
