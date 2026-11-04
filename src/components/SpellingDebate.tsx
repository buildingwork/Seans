import React, { useState } from 'react';
import { SeanSpelling } from '../types';
import { Vote, Award, BookMarked, ThumbsUp } from 'lucide-react';

export const SpellingDebate: React.FC<{ userSpelling: SeanSpelling }> = ({ userSpelling }) => {
  const [votes, setVotes] = useState<Record<string, number>>({
    Sean: 5412,
    Shaun: 3120,
    Shawn: 2894,
    'Seán': 1845,
    Sion: 620,
    Shane: 490,
  });
  const [hasVoted, setHasVoted] = useState(false);

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  const handleVote = (spelling: string) => {
    if (hasVoted) return;
    setVotes((prev) => ({
      ...prev,
      [spelling]: (prev[spelling] || 0) + 1,
    }));
    setHasVoted(true);
  };

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30">
              <Vote className="w-5 h-5" />
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
              The Great Sean Spelling Census
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Cast your vote for the supreme spelling or review the global Sean demographic.
          </p>
        </div>

        <div className="text-xs text-stone-400 flex items-center gap-1.5 self-start sm:self-center">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Total Votes: <strong className="text-white font-bold">{totalVotes.toLocaleString()}</strong></span>
        </div>
      </div>

      {/* Poll Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.entries(votes).map(([spelling, count]) => {
          const percentage = Math.round((count / totalVotes) * 100);
          const isUserType = spelling === userSpelling;

          return (
            <div
              key={spelling}
              className={`p-3.5 rounded-xl border transition ${
                isUserType
                  ? 'bg-emerald-950/40 border-emerald-500/60'
                  : 'bg-stone-950/70 border-stone-800/80 hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base text-white">{spelling}</span>
                  {isUserType && (
                    <span className="text-[10px] bg-emerald-500 text-stone-950 font-bold px-1.5 py-0.2 rounded">
                      YOU
                    </span>
                  )}
                </div>
                <span className="font-mono text-stone-300 font-bold">{percentage}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-stone-800 rounded-full overflow-hidden mb-2.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isUserType
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-400">
                <span>{count.toLocaleString()} Seans</span>
                <button
                  onClick={() => handleVote(spelling)}
                  disabled={hasVoted}
                  className={`px-2 py-0.5 rounded font-semibold transition cursor-pointer flex items-center gap-1 ${
                    hasVoted
                      ? 'text-stone-600 cursor-default'
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700'
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" />
                  {hasVoted ? 'Voted' : 'Vote'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sean Etymology Fact Box */}
      <div className="mt-5 p-3.5 bg-stone-950/60 border border-stone-800 rounded-xl text-xs text-stone-300 flex items-start gap-2.5">
        <BookMarked className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white block">Sean Etymology & History:</span>
          The name <strong className="text-emerald-400 font-semibold">Seán</strong> is the Irish borrowing of the Norman-French name <em>Jehan</em> (John), derived from the Hebrew <em>Yohanan</em> meaning &quot;God is gracious&quot;. Anglicized variations include <em>Sean</em>, <em>Shaun</em>, and <em>Shawn</em>, while <em>Siôn</em> is the traditional Welsh cognate.
        </div>
      </div>
    </div>
  );
};
