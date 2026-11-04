/**
 * Web Audio API synthesizer for retro Jurassic Park Nedry alarms,
 * wheel spin ticks, celebration fanfares, and sticky note pops.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playNedryChirp() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Dennis Nedry "Uh-uh-uh" three-tone mocking chirp
  const chirps = [0, 0.16, 0.32];
  chirps.forEach((delay) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(680, now + delay);
    osc.frequency.exponentialRampToValueAtTime(420, now + delay + 0.12);

    gain.gain.setValueAtTime(0.2, now + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + delay);
    osc.stop(now + delay + 0.15);
  });

  // Jurassic Park computer buzzer sound
  const buzzOsc = ctx.createOscillator();
  const buzzGain = ctx.createGain();
  buzzOsc.type = 'square';
  buzzOsc.frequency.setValueAtTime(140, now + 0.5);
  buzzGain.gain.setValueAtTime(0.18, now + 0.5);
  buzzGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
  buzzOsc.connect(buzzGain);
  buzzGain.connect(ctx.destination);
  buzzOsc.start(now + 0.5);
  buzzOsc.stop(now + 0.9);

  // Also synthesize voice if available
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("Ah ah ah! You didn't say the magic word!");
      utterance.pitch = 1.6;
      utterance.rate = 1.2;
      utterance.volume = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore if speech synthesis blocked
    }
  }
}

export function playWheelTick(pitchMultiplier = 1) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(800 * pitchMultiplier, now);
  osc.frequency.exponentialRampToValueAtTime(300 * pitchMultiplier, now + 0.04);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.04);
}

export function playCelebrationFanfare() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [
    { freq: 523.25, time: 0, dur: 0.12 },     // C5
    { freq: 659.25, time: 0.12, dur: 0.12 },  // E5
    { freq: 783.99, time: 0.24, dur: 0.12 },  // G5
    { freq: 1046.50, time: 0.36, dur: 0.35 }, // C6
  ];

  const now = ctx.currentTime;
  notes.forEach((n) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(n.freq, now + n.time);

    gain.gain.setValueAtTime(0.15, now + n.time);
    gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + n.time);
    osc.stop(now + n.time + n.dur);
  });
}

export function playStickyPop() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.09);
}
