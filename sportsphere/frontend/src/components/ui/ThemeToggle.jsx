import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`relative group p-2 rounded-xl border transition-all duration-300 cursor-pointer
        ${isDark
          ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 hover:bg-amber-500/10'
          : 'bg-amber-50 border-amber-200 text-amber-600 hover:text-indigo-600 hover:border-indigo-400/40 hover:bg-indigo-50'
        } ${className}`}
    >
      <div className="relative w-5 h-5 overflow-hidden">
        {/* Sun Icon (shows in dark mode — click to go light) */}
        <Sun
          className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${
            isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'
          }`}
        />
        {/* Moon Icon (shows in light mode — click to go dark) */}
        <Moon
          className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${
            isDark ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
          }`}
        />
      </div>
    </button>
  );
}
