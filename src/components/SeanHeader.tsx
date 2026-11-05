import React from 'react';
import { SeanSpelling } from '../types';
import { ShieldCheck, LogOut, Sparkles } from 'lucide-react';

interface SeanHeaderProps {
  currentSean: string;
  spelling: SeanSpelling;
  onLogout: () => void;
}

export const SeanHeader: React.FC<SeanHeaderProps> = ({
  currentSean,
  spelling,
  onLogout,
}) => {
  return (
    <header className="bg-stone-900/90 border-b border-stone-800 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Logo and Sanctuary Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-stone-950 font-black text-xl shadow-lg shadow-emerald-500/20">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                THE SEAN SANCTUARY
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 border border-emerald-700/60 text-emerald-400">
                <ShieldCheck className="w-3 h-3" />
                Seans Only
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Logged in as <span className="text-emerald-400 font-bold">{currentSean}</span> &bull; Variant:{' '}
              <span className="text-amber-400 font-semibold">{spelling}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Census Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-400">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Active Seans: <strong className="text-emerald-400 font-bold">14,892</strong></span>
            <span className="text-stone-600">|</span>
            <span>Simons Allowed: <strong className="text-red-400 font-bold">0</strong></span>
          </div>

          {/* Switch User / Log out */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-300 hover:text-white text-xs font-semibold transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Switch Sean</span>
          </button>
        </div>
      </div>
    </header>
  );
};
