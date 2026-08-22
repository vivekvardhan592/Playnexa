import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Lock, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: 'Vivek Kumar',
    email: 'vivek@sportsphere.com',
    password: 'password123',
    city: 'Hyderabad',
  });
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
    navigate('/auth/onboarding');
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-6">
      
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-[11px] font-mono font-bold border border-emerald-800">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>JOIN THE UNIFIED ATHLETE NETWORK</span>
        </div>
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
          Build Your <span className="text-gradient-emerald">Athlete Identity</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          One profile for all your sports. Connect, discover, and play.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="e.g. Vivek Kumar"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5">EMAIL ADDRESS</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
              placeholder="athlete@domain.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5">CITY / REGION</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
              placeholder="e.g. Hyderabad"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5">PASSWORD</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
              placeholder="At least 8 characters"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-extrabold text-sm hover:opacity-95 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Continue to Onboarding</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </form>

      <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-emerald-400 font-bold hover:underline">
          Sign In
        </Link>
      </div>

    </div>
  );
}
