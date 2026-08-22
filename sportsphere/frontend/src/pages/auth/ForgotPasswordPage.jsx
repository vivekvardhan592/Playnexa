import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiForgotPassword, apiResetPassword } from '../../services/api';
import { Mail, ArrowRight, CheckCircle2, Lock, KeyRound, Sparkles } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // Step 1: Send Request, Step 2: Reset Form, Step 3: Success
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('123456');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSendResetCode = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    const res = await apiForgotPassword(email);
    setLoading(false);

    if (res) {
      setMessage(res.message || `Password reset code sent to ${email}`);
      setStep(2);
    } else {
      setError('Failed to send reset code. Please try again.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await apiResetPassword(email, otpCode, newPassword);
    setLoading(false);

    if (res) {
      setStep(3);
    } else {
      setError('Invalid or expired verification code.');
    }
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
          Reset Your Password
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          {step === 1 && 'Enter your registered email to receive a password reset code.'}
          {step === 2 && `Enter the code sent to ${email} and your new password.`}
          {step === 3 && 'Password updated successfully!'}
        </p>
      </div>

      {/* Step 1: Request Reset Code */}
      {step === 1 && (
        <form onSubmit={handleSendResetCode} className="space-y-4">
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

          {error && <div className="text-xs text-red-400 font-medium text-center">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-extrabold text-sm hover:opacity-95 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Sending Request...' : 'Send Reset Verification Code'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Step 2: Enter OTP & New Password */}
      {step === 2 && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          {/* Demo Hint Banner */}
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-center text-xs text-emerald-300 font-mono flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span>Verification Code Sent! Demo OTP: <strong>123456</strong></span>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">VERIFICATION CODE (OTP)</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-emerald-400 font-mono font-bold focus:border-emerald-400 focus:outline-none"
                placeholder="123456"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">NEW PASSWORD</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
                placeholder="Minimum 6 characters"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">CONFIRM NEW PASSWORD</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
                placeholder="Confirm password"
              />
            </div>
          </div>

          {error && <div className="text-xs text-red-400 font-medium text-center">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-extrabold text-sm hover:opacity-95 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Updating Password...' : 'Reset Password & Save'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Step 3: Success Confirmation */}
      {step === 3 && (
        <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-lg font-heading font-extrabold text-white">Password Updated!</h3>
          <p className="text-xs text-slate-300">
            Your SportSphere account password has been reset successfully.
          </p>
          <Link
            to="/auth/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all"
          >
            <span>Return to Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {step !== 3 && (
        <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
          Remembered your password?{' '}
          <Link to="/auth/login" className="text-emerald-400 font-bold hover:underline">
            Sign In
          </Link>
        </div>
      )}

    </div>
  );
}
