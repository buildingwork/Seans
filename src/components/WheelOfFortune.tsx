import React, { useEffect, useRef, useState } from 'react';
import { FAMOUS_SEANS, fetchWikipediaSummary, WikiData } from '../data/famousSeans';
import { FamousSean } from '../types';
import { playWheelTick, playCelebrationFanfare } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Disc3, ExternalLink, Sparkles, Trophy, BookOpen, Quote, Shuffle, Check, Loader2 } from 'lucide-react';

const SLICE_COLORS = [
  '#059669', // Emerald
  '#0284c7', // Sky
  '#7c3aed', // Violet
  '#db2777', // Pink
  '#ea580c', // Orange
  '#16a34a', // Green
  '#2563eb', // Blue
  '#9333ea', // Purple
  '#e11d48', // Rose
  '#d97706', // Amber
  '#0d9488', // Teal
  '#4f46e5', // Indigo
];

export const WheelOfFortune: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedSean, setSelectedSean] = useState<FamousSean | null>(FAMOUS_SEANS[0]);
  const [wikiData, setWikiData] = useState<WikiData | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isLoadingWiki, setIsLoadingWiki] = useState(false);
  const [copiedQuote, setCopiedQuote] = useState(false);

  // Physics animation state
  const angleRef = useRef<number>(0);
  const angularVelocityRef = useRef<number>(0);
  const lastTickIndexRef = useRef<number>(-1);
  const animationFrameIdRef = useRef<number | null>(null);

  const seans = FAMOUS_SEANS;
  const numSlices = seans.length;
  const arcSize = (2 * Math.PI) / numSlices;

  // Draw wheel on canvas
  const drawWheel = (angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 18;

    ctx.clearRect(0, 0, width, height);

    // Save context
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);

    for (let i = 0; i < numSlices; i++) {
      const sliceAngle = i * arcSize;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, sliceAngle, sliceAngle + arcSize);
      ctx.closePath();

      ctx.fillStyle = SLICE_COLORS[i % SLICE_COLORS.length];
      ctx.fill();

      // Border between slices
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#0c0a09';
      ctx.stroke();

      // Slice Text
      ctx.save();
      ctx.rotate(sliceAngle + arcSize / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;

      const seanName = seans[i].name;
      // Truncate name if too long for slice
      const displayName = seanName.length > 17 ? seanName.substring(0, 15) + '…' : seanName;
      ctx.fillText(displayName, radius - 22, 0);

      // Little category dot
      ctx.beginPath();
      ctx.arc(radius - 10, 0, 3.5, 0, 2 * Math.PI);
      ctx.fillStyle = '#fef08a';
      ctx.fill();

      ctx.restore();
    }

    ctx.restore();

    // Outer ring shadow and metal rim
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 2, 0, 2 * Math.PI);
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#292524';
    ctx.stroke();

    // Center Hub (Golden Sean Medallion)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 36, 0, 2 * Math.PI);
    ctx.fillStyle = '#1c1917';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#f59e0b';
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'black 16px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SEAN', centerX, centerY);
    ctx.restore();

    // Top Pointer Arrow (Points down into the top of the wheel)
    ctx.save();
    ctx.translate(centerX, centerY - radius);
    ctx.beginPath();
    ctx.moveTo(-16, -18);
    ctx.lineTo(16, -18);
    ctx.lineTo(0, 14);
    ctx.closePath();
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.restore();
  };

  // Initial draw and load initial wiki data
  useEffect(() => {
    drawWheel(0);
    if (selectedSean) {
      loadWikiData(selectedSean);
    }
  }, []);

  const loadWikiData = async (sean: FamousSean) => {
    setIsLoadingWiki(true);
    const data = await fetchWikipediaSummary(sean.wikipediaTitle, sean);
    setWikiData(data);
    setIsLoadingWiki(false);
  };

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setCopiedQuote(false);

    // Initial random velocity
    const baseVelocity = 0.28 + Math.random() * 0.18;
    angularVelocityRef.current = baseVelocity;

    const friction = 0.974; // Snappy 3.5-second deceleration

    const step = () => {
      angleRef.current = (angleRef.current + angularVelocityRef.current) % (2 * Math.PI);
      angularVelocityRef.current *= friction;

      // Calculate current slice under pointer
      // Pointer is at -PI/2 (top: 12 o'clock)
      const normalizedAngle = (angleRef.current % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
      // Top position corresponds to -Math.PI / 2
      let relativeAngle = (3 * Math.PI / 2 - normalizedAngle) % (2 * Math.PI);
      if (relativeAngle < 0) relativeAngle += 2 * Math.PI;

      const currentSliceIndex = Math.floor(relativeAngle / arcSize) % numSlices;

      // Play tick sound whenever we cross into a new slice
      if (currentSliceIndex !== lastTickIndexRef.current) {
        lastTickIndexRef.current = currentSliceIndex;
        playWheelTick(1 + (angularVelocityRef.current * 1.5));
      }

      drawWheel(angleRef.current);

      if (angularVelocityRef.current > 0.0018) {
        animationFrameIdRef.current = requestAnimationFrame(step);
      } else {
        // Spin finished!
        setIsSpinning(false);
        const winningSean = seans[currentSliceIndex];
        setSelectedSean(winningSean);
        loadWikiData(winningSean);

        // Confetti & fanfare
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.65 },
          colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#ffffff'],
        });
        playCelebrationFanfare();
      }
    };

    animationFrameIdRef.current = requestAnimationFrame(step);
  };

  const handleInstantRandom = () => {
    if (isSpinning) return;
    const randomIndex = Math.floor(Math.random() * seans.length);
    const sean = seans[randomIndex];
    setSelectedSean(sean);
    loadWikiData(sean);

    // Align wheel to that slice
    const targetAngle = (3 * Math.PI / 2 - (randomIndex + 0.5) * arcSize) % (2 * Math.PI);
    angleRef.current = targetAngle;
    drawWheel(targetAngle);

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
    });
    playCelebrationFanfare();
  };

  const handleCopyQuote = (quote: string) => {
    navigator.clipboard.writeText(quote);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
              <Disc3 className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              The Wikipedia Wheel of Seans
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Spin the wheel of fortune to discover iconic Seans across history, cinema, sports & pop culture on Wikipedia.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstantRandom}
            disabled={isSpinning}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-xl text-xs font-semibold border border-stone-700 transition cursor-pointer disabled:opacity-50"
          >
            <Shuffle className="w-3.5 h-3.5" />
            Quick Random Sean
          </button>
        </div>
      </div>

      {/* Main Wheel + Wiki Card Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: The Wheel */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative p-2 bg-stone-950/80 rounded-full border border-stone-800 shadow-2xl">
            <canvas
              ref={canvasRef}
              width={380}
              height={380}
              className="max-w-full h-auto drop-shadow-2xl rounded-full"
            />
          </div>

          <div className="mt-5 w-full max-w-xs flex flex-col gap-2">
            <button
              onClick={spinWheel}
              disabled={isSpinning}
              className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black py-3 px-6 rounded-xl shadow-lg shadow-amber-500/25 transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-stone-950" />
              <span>{isSpinning ? 'SPINNING THE SEANS...' : 'SPIN WHEEL OF SEANS!'}</span>
            </button>
            <span className="text-center text-[11px] text-stone-500">
              12 Legendary Seans loaded on the wheel
            </span>
          </div>
        </div>

        {/* Right: Wikipedia Showcase Result */}
        <div className="lg:col-span-7">
          {selectedSean && (
            <div className="bg-stone-950/90 border border-stone-800 rounded-2xl p-5 sm:p-6 relative overflow-hidden shadow-2xl">
              {/* Highlight ribbon */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    Wheel of Fortune Winner
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-800 text-stone-300 border border-stone-700">
                    Spelling: {selectedSean.spelling}
                  </span>
                  <span className="text-xs text-stone-400 hidden sm:inline">
                    &bull; {selectedSean.category}
                  </span>
                </div>

                <div className="text-xs font-mono text-stone-500">
                  {selectedSean.born && <span>Born: {selectedSean.born}</span>}
                </div>
              </div>

              {/* Sean Header & Image */}
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <div className="w-28 h-36 sm:w-32 sm:h-40 rounded-xl overflow-hidden bg-stone-800 border-2 border-stone-700 shrink-0 shadow-md relative group flex items-center justify-center">
                  {/* Fallback Icon Background */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-stone-800 to-stone-900 text-stone-500">
                    <span className="text-3xl font-black text-amber-400/80">
                      {selectedSean.name.replace(/^(Sir|The)\s+/i, '').charAt(0)}
                    </span>
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest mt-1 font-bold">
                      {selectedSean.spelling}
                    </span>
                  </div>

                  <img
                    src={wikiData?.thumbnailUrl || selectedSean.imageUrl}
                    alt={selectedSean.name}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105 relative z-10"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-20" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight truncate">
                    {selectedSean.name}
                  </h3>
                  <p className="text-amber-400 font-medium text-xs sm:text-sm mt-0.5">
                    {selectedSean.tagline}
                  </p>

                  {/* Wikipedia Extract */}
                  <div className="mt-3 p-3 bg-stone-900/90 rounded-xl border border-stone-800/80 text-xs sm:text-sm text-stone-300 leading-relaxed max-h-36 overflow-y-auto">
                    {isLoadingWiki ? (
                      <div className="flex items-center gap-2 text-stone-400 py-3">
                        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                        <span>Querying Wikipedia REST API for {selectedSean.name}...</span>
                      </div>
                    ) : (
                      wikiData?.extract || selectedSean.summary
                    )}
                  </div>
                </div>
              </div>

              {/* Quote box */}
              {selectedSean.quote && (
                <div className="mt-4 p-3 bg-stone-900/60 border border-stone-800/60 rounded-xl flex items-start gap-2.5">
                  <Quote className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs sm:text-sm italic text-stone-300">
                    &quot;{selectedSean.quote}&quot;
                  </div>
                  <button
                    onClick={() => handleCopyQuote(selectedSean.quote!)}
                    className="text-[11px] font-semibold text-stone-400 hover:text-white px-2 py-1 bg-stone-800 hover:bg-stone-700 rounded-md border border-stone-700 transition flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    {copiedQuote ? <Check className="w-3 h-3 text-emerald-400" /> : null}
                    {copiedQuote ? 'Copied' : 'Copy Quote'}
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={wikiData?.pageUrl || `https://en.wikipedia.org/wiki/${selectedSean.wikipediaTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm border border-stone-700 transition hover:border-amber-500/50"
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Read Full Article on Wikipedia</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </a>

                <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
                  <span>Data verified from Wikipedia</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
