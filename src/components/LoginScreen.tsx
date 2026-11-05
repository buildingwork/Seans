import React, { useState } from 'react';
import { verifySeanAccess } from '../utils/nameVerification';
import { playCelebrationFanfare, playNedryChirp } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { ShieldCheck, ShieldAlert, KeyRound, UserCheck } from 'lucide-react';
import { SeanSpelling } from '../types';

interface LoginScreenProps {
  onSuccess: (name: string, spelling: SeanSpelling) => void;
  onTriggerSimon: (attemptedName: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess, onTriggerSimon }) => {
  const [inputName, setInputName] = useState('');
  const [rejectionError, setRejectionError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputName.trim()) return;

    setIsVerifying(true);
    setRejectionError(null);

    // Give a brief cinematic verification pause
    setTimeout(() => {
      setIsVerifying(false);
      const result = verifySeanAccess(inputName);

      if (result.isSimon) {
        playNedryChirp();
        onTriggerSimon(inputName.trim());
        return;
      }

      if (result.allowed && result.matchedSpelling) {
        // Confetti burst!
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'],
        });
        playCelebrationFanfare();
        onSuccess(result.detectedName, result.matchedSpelling);
      } else {
        setRejectionError(result.reason);
      }
    }, 280);
  };

  const handleQuickFill = (name: string) => {
    setInputName(name);
    setRejectionError(null);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-emerald-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-amber-500/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Top Bar Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-4 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-black font-extrabold text-xl">
            S
          </div>
          <div>
            <h1 className="font-extrabold tracking-tight text-lg text-white">THE SEAN SANCTUARY</h1>
            <p className="text-xs text-stone-400">Official Portal for the Global League of Seans</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/80">
            <ShieldCheck className="w-3.5 h-3.5" />
            Zero-Simon Tolerance Active
          </span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="max-w-xl mx-auto w-full my-auto py-8">
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-md relative">
          {/* Subtle highlight ring */}
          <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-stone-800 border border-stone-700/60 text-emerald-400 mb-3 shadow-inner">
              <KeyRound className="w-7 h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Identity Verification Gate
            </h2>
            <p className="text-sm text-stone-400 mt-1.5 max-w-md mx-auto">
              Please enter your full or first name to authenticate with the Sean registry.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name-input" className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Your Legal or Chosen Name
              </label>
              <div className="relative">
                <input
                  id="name-input"
                  type="text"
                  value={inputName}
                  onChange={(e) => {
                    setInputName(e.target.value);
                    if (rejectionError) setRejectionError(null);
                  }}
                  placeholder="e.g. Sean, Shaun, Shawn, Seán..."
                  autoFocus
                  className="w-full px-4 py-3.5 bg-stone-950 border border-stone-700 focus:border-emerald-500 rounded-xl text-white text-lg placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium transition"
                />
              </div>
            </div>

            {/* Error rejection banner */}
            {rejectionError && (
              <div className="p-3.5 bg-red-950/60 border border-red-700/70 rounded-xl text-red-200 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in zoom-in-95">
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold block">ACCESS DENIED</span>
                  <span>{rejectionError}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying || !inputName.trim()}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-black py-3.5 px-6 rounded-xl transition duration-150 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <div className="w-5 h-5 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Sean Heritage...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-5 h-5" />
                  <span>Authenticate & Enter Sanctuary</span>
                </>
              )}
            </button>
          </form>

          {/* Spellings Accepted section */}
          <div className="mt-6 pt-5 border-t border-stone-800">
            <div className="flex items-center justify-between text-xs text-stone-400 mb-2.5">
              <span className="font-semibold text-stone-300">Accepted Spelling Variants:</span>
              <span className="text-[11px] text-emerald-400 font-medium">All Seans welcome</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['Sean', 'Shaun', 'Shawn', 'Seán', 'Sion', 'Shon', 'Shane'].map((spelling) => (
                <button
                  key={spelling}
                  type="button"
                  onClick={() => handleQuickFill(spelling)}
                  className="px-2.5 py-1 text-xs bg-stone-800/80 hover:bg-stone-700 border border-stone-700 rounded-lg text-stone-300 hover:text-white transition cursor-pointer"
                >
                  {spelling}
                </button>
              ))}
            </div>
          </div>


        </div>
      </main>

      {/* Footer disclaimer */}
      <footer className="max-w-4xl mx-auto w-full py-4 text-center text-xs text-stone-600 border-t border-stone-900">
        <p>The Sean Sanctuary &bull; Built strictly for Seans</p>
      </footer>
    </div>
  );
};
