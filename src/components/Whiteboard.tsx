import React, { useState, useEffect, useRef } from 'react';
import { StickyNote as StickyNoteType, SeanSpelling } from '../types';
import { playStickyPop } from '../utils/soundEffects';
import {
  PenTool,
  StickyNote as NoteIcon,
  Plus,
  Trash2,
  Heart,
  Download,
  RotateCcw,
  Eraser,
  Palette,
  Sparkles,
} from 'lucide-react';

interface WhiteboardProps {
  currentSean: string;
  spelling: SeanSpelling;
}

const COLOR_MAP: Record<StickyNoteType['color'], { bg: string; border: string; text: string; badge: string }> = {
  yellow: {
    bg: 'bg-amber-100 dark:bg-amber-900/40',
    border: 'border-amber-400 dark:border-amber-600/70',
    text: 'text-amber-950 dark:text-amber-100',
    badge: 'bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-200',
  },
  pink: {
    bg: 'bg-rose-100 dark:bg-rose-900/40',
    border: 'border-rose-400 dark:border-rose-600/70',
    text: 'text-rose-950 dark:text-rose-100',
    badge: 'bg-rose-200 text-rose-900 dark:bg-rose-800 dark:text-rose-200',
  },
  cyan: {
    bg: 'bg-cyan-100 dark:bg-cyan-900/40',
    border: 'border-cyan-400 dark:border-cyan-600/70',
    text: 'text-cyan-950 dark:text-cyan-100',
    badge: 'bg-cyan-200 text-cyan-900 dark:bg-cyan-800 dark:text-cyan-200',
  },
  green: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/40',
    border: 'border-emerald-400 dark:border-emerald-600/70',
    text: 'text-emerald-950 dark:text-emerald-100',
    badge: 'bg-emerald-200 text-emerald-900 dark:bg-emerald-800 dark:text-emerald-200',
  },
  orange: {
    bg: 'bg-orange-100 dark:bg-orange-900/40',
    border: 'border-orange-400 dark:border-orange-600/70',
    text: 'text-orange-950 dark:text-orange-100',
    badge: 'bg-orange-200 text-orange-900 dark:bg-orange-800 dark:text-orange-200',
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900/40',
    border: 'border-purple-400 dark:border-purple-600/70',
    text: 'text-purple-950 dark:text-purple-100',
    badge: 'bg-purple-200 text-purple-900 dark:bg-purple-800 dark:text-purple-200',
  },
};

const SEED_NOTES: StickyNoteType[] = [
  {
    id: 'seed-1',
    authorName: 'Sean Connery',
    authorSpelling: 'Sean',
    color: 'yellow',
    content: 'Rule #1 of the Sean Sanctuary: Under no circumstances shall any Simon be granted access to the executive sauna.',
    createdAt: Date.now() - 3600000 * 5,
    x: 0,
    y: 0,
    likes: 42,
    rotation: -2,
  },
  {
    id: 'seed-2',
    authorName: 'Shaun White',
    authorSpelling: 'Shaun',
    color: 'cyan',
    content: 'Dropped in at the halfpipe today. Can confirm: Shaun with a U gets 20% higher airtime.',
    createdAt: Date.now() - 3600000 * 3,
    x: 0,
    y: 0,
    likes: 27,
    rotation: 3,
  },
  {
    id: 'seed-3',
    authorName: 'Shawn Michaels',
    authorSpelling: 'Shawn',
    color: 'orange',
    content: 'If Simon Cowell tries to critique my spelling again, he is receiving immediate Sweet Chin Music.',
    createdAt: Date.now() - 3600000 * 2,
    x: 0,
    y: 0,
    likes: 38,
    rotation: -1,
  },
  {
    id: 'seed-4',
    authorName: 'Seán the Traditional',
    authorSpelling: 'Seán',
    color: 'green',
    content: 'Do not forget the fada (á) when entering the Gaelic archives, a chairde!',
    createdAt: Date.now() - 3600000 * 1,
    x: 0,
    y: 0,
    likes: 19,
    rotation: 2,
  },
  {
    id: 'seed-5',
    authorName: 'Sean Bean',
    authorSpelling: 'Sean',
    color: 'pink',
    content: 'Just survived an entire meeting without being written out of the script. Progress.',
    createdAt: Date.now() - 1800000,
    x: 0,
    y: 0,
    likes: 56,
    rotation: -3,
  },
];

export const Whiteboard: React.FC<WhiteboardProps> = ({ currentSean, spelling }) => {
  const [activeTab, setActiveTab] = useState<'sticky' | 'draw'>('sticky');
  const [notes, setNotes] = useState<StickyNoteType[]>(() => {
    try {
      const saved = localStorage.getItem('SEAN_SANCTUARY_NOTES');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return SEED_NOTES;
  });

  const [newNoteText, setNewNoteText] = useState('');
  const [selectedColor, setSelectedColor] = useState<StickyNoteType['color']>('yellow');

  // Drawing Canvas state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#10b981'); // emerald
  const [lineWidth, setLineWidth] = useState(4);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('SEAN_SANCTUARY_NOTES', JSON.stringify(notes));
    } catch {
      // ignore
    }
  }, [notes]);

  // Handle adding a sticky note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const randomRot = Math.floor(Math.random() * 8) - 4;
    const newNote: StickyNoteType = {
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      authorName: currentSean,
      authorSpelling: spelling,
      color: selectedColor,
      content: newNoteText.trim(),
      createdAt: Date.now(),
      x: 0,
      y: 0,
      likes: 1,
      rotation: randomRot,
    };

    setNotes([newNote, ...notes]);
    setNewNoteText('');
    playStickyPop();
  };

  const handleLike = (id: string) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, likes: n.likes + 1 } : n)));
  };

  const handleDelete = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  // Drawing Canvas setup & handlers
  useEffect(() => {
    if (activeTab !== 'draw') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill dark chalkboard background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Chalkboard grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Welcoming Sean header on board
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('SEAN WHITEBOARD CANVAS v1.0 -- SEANS FREE TO DOODLE', 20, 30);
  }, [activeTab]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isEraser ? '#0f172a' : drawColor;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `sean-sanctuary-whiteboard-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md">
      {/* Header and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
              <NoteIcon className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              The Sean Community Whiteboard
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Leave notes, announcements, jokes, or freehand sketches exclusively for verified Seans.
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800 self-start sm:self-center">
          <button
            onClick={() => setActiveTab('sticky')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'sticky'
                ? 'bg-emerald-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <NoteIcon className="w-3.5 h-3.5" />
            <span>Sticky Board ({notes.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('draw')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'draw'
                ? 'bg-emerald-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Doodle Canvas</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Sticky Notes Board */}
      {activeTab === 'sticky' && (
        <div className="space-y-6">
          {/* Post New Note Box */}
          <form
            onSubmit={handleAddNote}
            className="bg-stone-950/80 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-lg"
          >
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-stone-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Post as <span className="text-emerald-400 underline">{currentSean}</span> ({spelling})
              </span>
              <span className="text-stone-500">Seans only &bull; Simons prohibited</span>
            </div>

            <textarea
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Leave a message for fellow Seans... (e.g., 'Who is organizing the 2027 Sean Summit?')"
              rows={2}
              className="w-full bg-stone-900 border border-stone-700 focus:border-emerald-500 rounded-xl p-3 text-white text-sm placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition resize-none"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-stone-800">
              {/* Color picker */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400 flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5" /> Note Color:
                </span>
                <div className="flex items-center gap-1.5">
                  {(['yellow', 'pink', 'cyan', 'green', 'orange', 'purple'] as StickyNoteType['color'][]).map(
                    (c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`w-5 h-5 rounded-full border-2 transition transform active:scale-90 ${
                          c === 'yellow'
                            ? 'bg-amber-300'
                            : c === 'pink'
                            ? 'bg-rose-400'
                            : c === 'cyan'
                            ? 'bg-cyan-400'
                            : c === 'green'
                            ? 'bg-emerald-400'
                            : c === 'orange'
                            ? 'bg-orange-400'
                            : 'bg-purple-400'
                        } ${selectedColor === c ? 'border-white scale-110 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'}`}
                      />
                    )
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={!newNoteText.trim()}
                className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Pin to Sean Board
              </button>
            </div>
          </form>

          {/* Sticky Notes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {notes.map((note) => {
              const style = COLOR_MAP[note.color] || COLOR_MAP.yellow;
              return (
                <div
                  key={note.id}
                  style={{ transform: `rotate(${note.rotation}deg)` }}
                  className={`${style.bg} ${style.border} ${style.text} border-2 rounded-2xl p-4 shadow-lg transition-transform hover:scale-[1.02] hover:z-10 relative flex flex-col justify-between min-h-[170px] backdrop-blur-xs`}
                >
                  {/* Pushpin indicator */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-600 shadow-md border-2 border-stone-800 flex items-center justify-center">
                    <span className="w-1 h-1 rounded-full bg-white opacity-80" />
                  </div>

                  <div>
                    {/* Header with author */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/10 dark:border-white/10 text-xs">
                      <span className="font-bold truncate max-w-[150px]">{note.authorName}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${style.badge}`}>
                        {note.authorSpelling}
                      </span>
                    </div>

                    {/* Content */}
                    <p className="text-sm font-medium leading-snug whitespace-pre-wrap break-words">
                      {note.content}
                    </p>
                  </div>

                  {/* Footer actions */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-black/10 dark:border-white/10 text-xs">
                    <button
                      onClick={() => handleLike(note.id)}
                      className="flex items-center gap-1 hover:opacity-80 active:scale-90 transition font-bold cursor-pointer"
                      title="Endorse this note"
                    >
                      <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                      <span>{note.likes}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] opacity-60">
                        {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="opacity-40 hover:opacity-100 hover:text-red-500 transition cursor-pointer p-1"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Canvas Drawing Board */}
      {activeTab === 'draw' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-stone-950 rounded-xl border border-stone-800">
            <div className="flex items-center gap-3">
              {/* Color Swatches */}
              <div className="flex items-center gap-1.5">
                {['#10b981', '#38bdf8', '#fbbf24', '#f43f5e', '#a855f7', '#ffffff'].map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setDrawColor(color);
                      setIsEraser(false);
                    }}
                    style={{ backgroundColor: color }}
                    className={`w-6 h-6 rounded-full border-2 transition transform active:scale-90 cursor-pointer ${
                      drawColor === color && !isEraser
                        ? 'border-white scale-110 shadow-sm'
                        : 'border-transparent opacity-80'
                    }`}
                  />
                ))}
              </div>

              <div className="h-4 w-px bg-stone-800 mx-1" />

              {/* Eraser */}
              <button
                onClick={() => setIsEraser(!isEraser)}
                className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                  isEraser
                    ? 'bg-amber-500 text-stone-950 border-amber-400'
                    : 'bg-stone-900 text-stone-300 border-stone-700 hover:text-white'
                }`}
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Eraser</span>
              </button>

              {/* Line width */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-400">
                <span>Size:</span>
                {[2, 5, 12].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setLineWidth(sz)}
                    className={`px-2 py-0.5 rounded border text-[11px] font-bold ${
                      lineWidth === sz
                        ? 'bg-stone-800 text-emerald-400 border-emerald-500'
                        : 'bg-stone-900 text-stone-500 border-stone-800 hover:text-stone-300'
                    }`}
                  >
                    {sz}px
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearCanvas}
                className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white rounded-lg text-xs font-semibold border border-stone-700 flex items-center gap-1 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear
              </button>
              <button
                onClick={downloadCanvas}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold rounded-lg text-xs flex items-center gap-1 transition cursor-pointer shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Save Image
              </button>
            </div>
          </div>

          {/* Canvas Element */}
          <div className="w-full overflow-hidden rounded-2xl border-2 border-stone-800 shadow-2xl bg-slate-950">
            <canvas
              ref={canvasRef}
              width={900}
              height={500}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-auto cursor-crosshair touch-none select-none block"
            />
          </div>
        </div>
      )}
    </div>
  );
};
