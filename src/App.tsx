/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { NedryScreen } from './components/NedryScreen';
import { SeanHeader } from './components/SeanHeader';
import { Whiteboard } from './components/Whiteboard';
import { WheelOfFortune } from './components/WheelOfFortune';
import { SpellingDebate } from './components/SpellingDebate';
import { SeanSpelling } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [userSpelling, setUserSpelling] = useState<SeanSpelling>('Sean');
  const [nedryTriggeredName, setNedryTriggeredName] = useState<string | null>(null);

  // Initialize from sessionStorage or URL query params (autostart / test support)
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const autostart = searchParams.get('autostart');
      const paramName = searchParams.get('name');
      const testSimon = searchParams.get('simon');

      if (testSimon) {
        setNedryTriggeredName('Simon');
        return;
      }

      if (autostart === '1' || paramName) {
        const nameToUse = paramName || 'Sean Ryan';
        setCurrentUser(nameToUse);
        setUserSpelling('Sean');
        return;
      }

      const storedUser = sessionStorage.getItem('SEAN_SANCTUARY_USER');
      const storedSpelling = sessionStorage.getItem('SEAN_SANCTUARY_SPELLING') as SeanSpelling;
      if (storedUser && storedSpelling) {
        setCurrentUser(storedUser);
        setUserSpelling(storedSpelling);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleLoginSuccess = (name: string, spelling: SeanSpelling) => {
    setCurrentUser(name);
    setUserSpelling(spelling);
    setNedryTriggeredName(null);
    try {
      sessionStorage.setItem('SEAN_SANCTUARY_USER', name);
      sessionStorage.setItem('SEAN_SANCTUARY_SPELLING', spelling);
    } catch {
      // ignore
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      sessionStorage.removeItem('SEAN_SANCTUARY_USER');
      sessionStorage.removeItem('SEAN_SANCTUARY_SPELLING');
    } catch {
      // ignore
    }
  };

  const handleTriggerSimon = (name: string) => {
    setNedryTriggeredName(name);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Jurassic Park Dennis Nedry Screen for Simons */}
      {nedryTriggeredName && (
        <NedryScreen
          attemptedName={nedryTriggeredName}
          onDismiss={() => setNedryTriggeredName(null)}
          onTrySean={() => {
            setNedryTriggeredName(null);
            handleLoginSuccess('Sean (Reformed Simon)', 'Sean');
          }}
        />
      )}

      {/* If not logged in as a Sean, render Login Screen */}
      {!currentUser ? (
        <LoginScreen
          onSuccess={handleLoginSuccess}
          onTriggerSimon={handleTriggerSimon}
        />
      ) : (
        /* Inside the Sanctuary */
        <div className="flex-1 flex flex-col">
          <SeanHeader
            currentSean={currentUser}
            spelling={userSpelling}
            onLogout={handleLogout}
            onTestNedry={() => handleTriggerSimon('Simon Cowell')}
          />

          <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-8">
            {/* Welcoming Banner */}
            <div className="bg-gradient-to-r from-emerald-950/50 via-stone-900 to-teal-950/40 border border-emerald-800/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-full bg-emerald-500/5 blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 mb-3">
                  <span>Welcome to the Clubhouse</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">{currentUser}</span>!
                </h2>
                <p className="text-sm sm:text-base text-stone-300 mt-2 leading-relaxed">
                  You have successfully passed security. Explore the Whiteboard to leave messages for your fellow Seans, or spin the Wheel of Fortune to discover iconic Seans on Wikipedia.
                </p>
              </div>
            </div>

            {/* Whiteboard for leaving notes */}
            <section id="whiteboard">
              <Whiteboard currentSean={currentUser} spelling={userSpelling} />
            </section>

            {/* Wheel of Fortune (Wikipedia Seans) */}
            <section id="wheel-of-fortune">
              <WheelOfFortune />
            </section>

            {/* The Great Sean Spelling Debate */}
            <section id="census">
              <SpellingDebate userSpelling={userSpelling} />
            </section>
          </main>

          {/* Footer */}
          <footer className="border-t border-stone-800/80 bg-stone-900/50 py-6 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
              <p>The Sean Sanctuary &bull; Built strictly for people named Sean, Shaun, Shawn, Seán &amp; variants.</p>
              <p>Simons are cordially redirected to Dennis Nedry&apos;s Isla Nublar terminal.</p>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
