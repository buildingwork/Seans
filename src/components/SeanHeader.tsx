import React from 'react';
import { SeanSpelling } from '../types';
import { ShieldCheck, LogOut, Skull, Sparkles } from 'lucide-react';

interface SeanHeaderProps {
  currentSean: string;
  spelling: SeanSpelling;
  onLogout: () => void;
  onTestNedry: () => void;
}

export const SeanHeader: React.FC<SeanHeaderProps> = ({
  currentSean,
  spelling,
  onLogout,
  onTestNedry,
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
          {/* Nedry Simulator button */}
          <button
            onClick={onTestNedry}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-800/80 text-red-300 text-xs font-bold transition cursor-pointer"
            title="Simulate Simon intrusion & Dennis Nedry warning"
          >
            <Skull className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden md:inline">Test Simon Trap</span>
          </button>

          {/* Census Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-400">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Active Seans: <strong className="text-emerald-400 font-bold">14,892</strong></span>
            <span className="text-stone-600">|</span>
            <span>Simons Allowed: <strong className="text-red-400 font-bold">0</strong></span>
          </div>

          {/* Download Source Code */}
          <a
            href="/sean-sanctuary.zip"
            download="sean-sanctuary.zip"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/80 text-emerald-300 hover:text-emerald-200 text-xs font-bold transition shadow-sm cursor-pointer"
            title="Download full project source code as a ZIP archive"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download Site (.zip)</span>
          </a>

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
