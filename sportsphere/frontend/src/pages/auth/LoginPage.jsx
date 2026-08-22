import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Sparkles, ArrowRight, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('vivek@sportsphere.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/app');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    demoLogin();
    navigate('/app');
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-6">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
          Welcome Back to <span className="text-gradient-emerald">SportSphere</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Enter your credentials or click Instant Demo Access to enter.
        </p>
      </div>

      {/* Demo Quick Access Button */}
      <div>
        <button
          onClick={handleDemoAccess}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs hover:border-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-emerald-400 fill-emerald-400" />
          <span>Instant Demo Login (Judge Quick Pass)</span>
          <ArrowRight className="w-4 h-4 text-emerald-400" />
        </button>
      </div>

      <div className="flex items-center gap-3 my-2">
        <div className="flex-1 h-px bg-slate-800" />
        <span className="text-[11px] font-mono text-slate-400">OR LOGIN WITH EMAIL</span>
        <div className="flex-1 h-px bg-slate-800" />
      </div>

      {/* Login Form */}
      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5">EMAIL ADDRESS</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none transition-colors"
              placeholder="athlete@domain.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5">PASSWORD</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded bg-slate-900 border-slate-700 text-emerald-400 focus:ring-0" />
            <span>Remember me</span>
          </label>
          <Link to="/auth/forgot-password" className="text-emerald-400 font-bold hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-extrabold text-sm hover:opacity-95 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Sign In to Your Sphere</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </form>

      <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
        Don't have an athlete profile yet?{' '}
        <Link to="/auth/signup" className="text-emerald-400 font-bold hover:underline">
          Create Athlete Identity
        </Link>
      </div>

    </div>
  );
}
