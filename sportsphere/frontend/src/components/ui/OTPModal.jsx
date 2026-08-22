import React, { useState } from 'react';
import { ShieldCheck, Sparkles, ArrowRight, X, CheckCircle2 } from 'lucide-react';

export default function OTPModal({ isOpen, onClose, email, onVerified }) {
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Auto-focus next input box
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const fullCode = otp.join('');
    if (fullCode.length !== 6) {
      setError('Please enter all 6 digits of your OTP.');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setLoading(false);
      onVerified();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080a0f]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-700 shadow-2xl relative space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400 mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-extrabold text-2xl text-white">Enter OTP Verification Code</h3>
          <p className="text-xs text-slate-400">
            We sent a 6-digit security code to <strong className="text-emerald-400">{email || 'your email'}</strong>
          </p>
        </div>

        {/* Demo Hint Pill */}
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-center text-xs text-emerald-300 font-mono flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
          <span>Demo OTP Code: <strong>123456</strong></span>
        </div>

        {/* 6 Digit Input Boxes */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center gap-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
                className="w-11 h-13 bg-slate-900 border border-slate-800 rounded-xl text-center font-mono font-extrabold text-lg text-emerald-400 focus:border-emerald-400 focus:outline-none transition-colors"
              />
            ))}
          </div>

          {error && <div className="text-xs text-red-400 text-center font-medium">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-extrabold text-sm hover:opacity-95 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Verifying...' : 'Verify OTP & Launch'}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Didn't receive code?{' '}
          <button onClick={() => alert('New OTP sent: 123456')} className="text-emerald-400 font-bold hover:underline cursor-pointer">
            Resend OTP
          </button>
        </div>

      </div>
    </div>
  );
}
