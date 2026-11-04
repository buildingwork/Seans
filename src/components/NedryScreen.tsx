import React, { useEffect, useState } from 'react';
import { playNedryChirp } from '../utils/soundEffects';
import { Volume2, VolumeX, Terminal, ShieldAlert, ArrowLeft } from 'lucide-react';

interface NedryScreenProps {
  attemptedName: string;
  onDismiss: () => void;
  onTrySean: () => void;
}

export const NedryScreen: React.FC<NedryScreenProps> = ({ attemptedName, onDismiss, onTrySean }) => {
  const [repetitionCount, setRepetitionCount] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [fingerWagAngle, setFingerWagAngle] = useState(15);

  useEffect(() => {
    // Play sound initially
    if (soundEnabled) {
      playNedryChirp();
    }

    // Finger wag animation
    const wagInterval = setInterval(() => {
      setFingerWagAngle((prev) => (prev > 0 ? -20 : 20));
    }, 280);

    // Spam the magic word lines
    const spamInterval = setInterval(() => {
      setRepetitionCount((prev) => (prev < 40 ? prev + 1 : prev));
    }, 180);

    return () => {
      clearInterval(wagInterval);
      clearInterval(spamInterval);
    };
  }, [soundEnabled]);

  const handlePlaySound = () => {
    playNedryChirp();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4 select-none overflow-hidden font-mono"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, #0a1f0d 0%, #000000 100%)',
      }}
    >
      {/* CRT Scanline and curvature overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]" />
      <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-emerald-500/20 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)]" />

      {/* Top Banner */}
      <div className="w-full max-w-4xl bg-stone-900 border-2 border-red-600 rounded-t-lg px-4 py-2 flex items-center justify-between text-xs text-red-400">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-600 animate-ping inline-block" />
          <span className="font-bold tracking-widest uppercase">
            JURASSIC_PARK_CENTRAL_SYSTEMS // INTRUDER_TRAP.SYS
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1 hover:text-white px-2 py-0.5 border border-red-800 rounded bg-red-950/40"
            title="Toggle Audio"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{soundEnabled ? 'AUDIO ON' : 'MUTED'}</span>
          </button>
          <button
            onClick={onDismiss}
            className="text-stone-400 hover:text-white hover:bg-red-700/50 px-2 py-0.5 rounded border border-stone-700"
          >
            [ESC / ABORT]
          </button>
        </div>
      </div>

      {/* Main Terminal Window */}
      <div className="w-full max-w-4xl bg-black border-2 border-t-0 border-red-600 rounded-b-lg shadow-[0_0_50px_rgba(220,38,38,0.4)] p-4 md:p-6 flex flex-col md:flex-row gap-6 items-center">
        {/* Left: Nedry Animated Avatar / Finger Wag */}
        <div className="flex flex-col items-center bg-stone-950 border-2 border-red-500/60 p-4 rounded-lg w-full md:w-80 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
          <div className="relative w-48 h-56 bg-slate-900 rounded-md overflow-hidden border border-red-400/40 flex items-center justify-center p-2">
            {/* Retro Nedry Cartoon Vector */}
            <svg
              viewBox="0 0 200 240"
              className="w-full h-full"
              style={{ filter: 'drop-shadow(0 0 6px #ef4444)' }}
            >
              {/* Hawaiian shirt background */}
              <rect x="25" y="140" width="150" height="95" rx="10" fill="#38bdf8" />
              <path d="M 45 150 Q 60 170 50 190" stroke="#facc15" strokeWidth="6" fill="none" />
              <path d="M 125 150 Q 140 170 130 190" stroke="#facc15" strokeWidth="6" fill="none" />
              <path d="M 85 160 Q 100 180 90 200" stroke="#e11d48" strokeWidth="6" fill="none" />
              {/* Neck */}
              <rect x="75" y="115" width="50" height="30" fill="#fed7aa" />
              {/* Face */}
              <ellipse cx="100" cy="85" rx="55" ry="50" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
              {/* Nedry Messy Hair */}
              <path
                d="M 45 70 C 40 30, 80 15, 100 20 C 130 15, 160 30, 155 70 C 145 60, 135 50, 120 50 C 105 50, 95 55, 80 50 C 65 50, 50 60, 45 70 Z"
                fill="#573a24"
              />
              {/* Glasses */}
              <rect x="62" y="68" width="30" height="22" rx="4" fill="none" stroke="#0f172a" strokeWidth="4" />
              <rect x="108" y="68" width="30" height="22" rx="4" fill="none" stroke="#0f172a" strokeWidth="4" />
              <line x1="92" y1="78" x2="108" y2="78" stroke="#0f172a" strokeWidth="3" />
              {/* Smirking eyes */}
              <circle cx="77" cy="79" r="4" fill="#0f172a" />
              <circle cx="123" cy="79" r="4" fill="#0f172a" />
              {/* Dennis Nedry Smug Grin */}
              <path d="M 75 105 Q 100 125 130 102" stroke="#991b1b" strokeWidth="4" fill="none" />
              {/* Animated Wagging Hand & Finger */}
              <g
                transform={`rotate(${fingerWagAngle}, 150, 130)`}
                style={{ transition: 'transform 0.12s ease-in-out' }}
              >
                {/* Hand palm */}
                <ellipse cx="150" cy="120" rx="16" ry="14" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
                {/* Index finger pointing up wagging */}
                <rect x="145" y="65" width="10" height="55" rx="5" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
                {/* Fingernail */}
                <ellipse cx="150" cy="72" rx="3" ry="4" fill="#fbcfe8" />
              </g>
            </svg>
            <div className="absolute bottom-1 bg-red-950/80 border border-red-600 px-2 py-0.5 rounded text-[10px] text-red-200 uppercase tracking-widest">
              D. Nedry (IT Architect)
            </div>
          </div>

          <div className="mt-3 text-center">
            <span className="text-red-400 font-bold text-sm tracking-widest block">
              SIMON DETECTED: &quot;{attemptedName}&quot;
            </span>
            <span className="text-amber-400 text-xs italic">
              &quot;Access denied. And... Simon didn&apos;t say the magic word!&quot;
            </span>
          </div>

          <button
            onClick={handlePlaySound}
            className="mt-3 w-full bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-3 rounded flex items-center justify-center gap-2 border border-red-400 text-xs active:scale-95 transition-all shadow-[0_0_12px_rgba(239,68,68,0.5)]"
          >
            <Volume2 className="w-4 h-4" />
            PLAY &quot;AH AH AH!&quot; AUDIO
          </button>
        </div>

        {/* Right: The Terminal Feed */}
        <div className="flex-1 w-full bg-stone-950/90 border border-emerald-500/50 rounded-lg p-4 flex flex-col h-80 overflow-hidden text-emerald-400 text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-800 text-stone-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>GUEST_CONSOLE // TTY_NEDRY_01</span>
            </div>
            <span className="text-red-400 font-bold animate-pulse">SECURITY VIOLATION</span>
          </div>

          {/* Terminal stream */}
          <div className="flex-1 overflow-y-auto space-y-1 font-mono pr-2">
            <div className="text-stone-400">login: {attemptedName}</div>
            <div className="text-stone-400">password: **********</div>
            <div className="text-red-500 font-bold">access: PERMISSION DENIED.</div>
            <div className="text-red-500 font-bold">access: PERMISSION DENIED.</div>
            <div className="text-red-500 font-bold">access: PERMISSION DENIED... AND...</div>

            {Array.from({ length: repetitionCount }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-2 text-amber-300 font-bold">
                <span className="text-red-500 text-[10px]">[{String(idx + 1).padStart(2, '0')}]</span>
                <span className="tracking-wider">YOU DIDN&apos;T SAY THE MAGIC WORD!</span>
                {idx % 3 === 0 && <span className="text-red-400 ml-1">PLEASE!</span>}
              </div>
            ))}
            <div className="text-emerald-300 animate-pulse pt-2 flex items-center gap-1">
              <span>root@isla-nublar-sean:~#</span>
              <span className="w-2 h-4 bg-emerald-400 inline-block" />
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-3 mt-2 border-t border-emerald-900/60 flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={onDismiss}
              className="flex items-center gap-1 text-stone-400 hover:text-white hover:bg-stone-800 px-3 py-1.5 rounded border border-stone-700 text-xs transition"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to Gate
            </button>

            <button
              onClick={onTrySean}
              className="bg-emerald-600 hover:bg-emerald-500 text-black font-bold px-3 py-1.5 rounded border border-emerald-300 text-xs flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.4)] transition"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              &quot;I am actually a Sean! Let me in!&quot;
            </button>
          </div>
        </div>
      </div>

      {/* Footer warning */}
      <div className="text-stone-500 text-[11px] mt-4 text-center">
        Notice: Simons attempting unlawful entry into The Sean Sanctuary will remain locked in the Nedry subroutine.
      </div>
    </div>
  );
};
