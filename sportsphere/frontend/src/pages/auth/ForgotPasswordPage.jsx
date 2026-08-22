import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <h2 className="font-heading font-extrabold text-2xl text-white">Reset Password</h2>
        <p className="text-xs text-slate-400">
          Enter your email to receive a password reset link.
        </p>
      </div>

      {sent ? (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
          <div className="text-sm font-bold text-white">Reset Link Sent!</div>
          <p className="text-xs text-slate-300">
            Check your inbox for <strong>{email}</strong> for instructions.
          </p>
          <Link to="/auth/login" className="inline-block mt-2 text-xs font-bold text-emerald-400 hover:underline">
            ← Return to Sign In
          </Link>
        </div>
      ) : (
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
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
                placeholder="athlete@domain.com"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-extrabold text-sm hover:opacity-95 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Send Reset Link</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
        Remembered your password?{' '}
        <Link to="/auth/login" className="text-emerald-400 font-bold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
