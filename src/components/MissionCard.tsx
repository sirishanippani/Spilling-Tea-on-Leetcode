import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RoadmapDay, StudyLog } from '../types';
import { ExternalLink, RefreshCw, Trash2, BookOpen, PlusCircle, Edit3 } from 'lucide-react';
import { getStickerForDay } from '../data/roadmap';

interface MissionCardProps {
  dayItem: RoadmapDay;
  dayLogs: StudyLog[];
  onComplete: (
    day: number,
    problemName: string,
    difficulty: 'Easy' | 'Medium' | 'Hard',
    duration: number,
    notes: string
  ) => void;
  onDeleteLog: (id: string, xpEarned: number, dayNumber?: number) => void;
  onEditLog: (log: StudyLog) => void;
  isCompleted?: boolean;
}

export default function MissionCard({ dayItem, dayLogs = [], onComplete, onDeleteLog, onEditLog, isCompleted = false }: MissionCardProps) {
  const [problemName, setProblemName] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [duration, setDuration] = useState(45);
  const [notes, setNotes] = useState('');
  const [showTips, setShowTips] = useState(false);

  // Synchronize with active dayItem when it changes
  useEffect(() => {
    setProblemName(dayItem.problemName);
    setDifficulty(dayItem.difficulty);
    setNotes('');
    setDuration(45);
    setShowTips(false);
  }, [dayItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalProblemName = problemName.trim() || dayItem.problemName;
    onComplete(
      dayItem.day,
      finalProblemName,
      difficulty,
      duration,
      notes.trim() || `Conquered Day ${dayItem.day}: ${finalProblemName}!`
    );
    // Reset individual inputs (except problem name which resets to default)
    setNotes('');
    setProblemName(dayItem.problemName);
    setDifficulty(dayItem.difficulty);
  };

  const getDifficultyColor = (diff: 'Easy' | 'Medium' | 'Hard') => {
    switch (diff) {
      case 'Easy': 
        return 'text-emerald-800 bg-emerald-100/80 border-emerald-400 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700';
      case 'Medium': 
        return 'text-amber-800 bg-amber-100/80 border-amber-400 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700';
      case 'Hard': 
        return 'text-rose-800 bg-rose-100/80 border-rose-400 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-700';
    }
  };

  return (
    <div className="bg-[#fcfaf2] dark:bg-[#140e28] border-2 border-slate-800 dark:border-pink-orchid/40 rounded-[2rem] pl-16 pr-6 py-6 sm:pl-20 sm:pr-8 sm:py-8 shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] dark:shadow-[6px_6px_0px_0px_rgba(224,177,203,0.15)] flex flex-col justify-between h-full relative font-sans text-left text-slate-900 dark:text-slate-100">
      
      {/* Pink vertical ledger notebook margin line */}
      <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-rose-400/40 dark:bg-rose-900/40 pointer-events-none" />

      {/* Realistic Left Spiral Ring Coil Binding (Protrudes outside left border, stable on all screen sizes) */}
      <div className="absolute top-6 bottom-6 left-[-16px] flex flex-col justify-between pointer-events-none z-10 py-2">
        {Array.from({ length: 11 }).map((_, idx) => (
          <div key={idx} className="flex items-center gap-0.5 relative">
            {/* Metal hand-sketched wire binder rings looping out of the hole and curving to the left paper edge */}
            <svg 
              className="w-13 h-8 overflow-visible drop-shadow-[2px_3px_2px_rgba(30,41,59,0.15)] dark:drop-shadow-[1px_2px_1.5px_rgba(0,0,0,0.5)]" 
              viewBox="0 0 52 20" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Main loop wire sketch */}
              <path 
                d="M 44 10 C 44 1.5, 34 -4.5, 14 2 C 1 6, 2 15, 14 18 C 34 22.5, 44 16.5, 44 10" 
                stroke="#1e293b" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
              />
              {/* Highlight inner line */}
              <path 
                d="M 44 10 C 44 1.5, 34 -4.5, 14 2 C 1 6, 2 15, 14 18" 
                stroke="#baa6ff" 
                strokeWidth="1.2" 
                strokeLinecap="round" 
              />
              {/* Light reflection on wire */}
              <path 
                d="M 38 6 C 30 -1, 18 1, 8 6" 
                stroke="#ffffff" 
                strokeWidth="0.8" 
                strokeLinecap="round" 
                className="opacity-70"
              />
            </svg>
            
            {/* Sheet punched circle hole */}
            <div className="w-3.5 h-3.5 rounded-full bg-slate-300 dark:bg-black/85 border border-slate-400 dark:border-pink-orchid/20 flex items-center justify-center shadow-inner relative z-0 -ml-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1e293b] dark:bg-[#0c081f]" />
            </div>
          </div>
        ))}
      </div>

      {/* Cute Scrapbook Washi Tape Corner */}
      <div className="absolute -top-3.5 right-10 w-24 h-7 bg-indigo-500/10 dark:bg-pink-300/10 border border-dashed border-indigo-400/40 dark:border-pink-300/30 rotate-[3deg] rounded-xs shadow-[1px_1px_2px_rgba(0,0,0,0.03)] flex items-center justify-center pointer-events-none select-none z-20">
        <span className="text-[10px] font-black tracking-widest text-[#7161ef]/60 dark:text-pink-orchid/50 font-display">📓 MEMO</span>
      </div>
      <div className="absolute top-4 right-1/4 w-16 h-4 bg-amber-200/40 border-l border-r border-dashed border-amber-300 rotate-[-12deg] opacity-60 pointer-events-none select-none z-10" />

      {/* Cute Notebook Scrapbook Sticker */}
      <div className="absolute right-4 top-14 sm:right-6 sm:top-14 rotate-[12deg] z-20 flex flex-col items-center select-none pointer-events-none group">
        {isCompleted ? (
          <div className="relative bg-[#fffef0] dark:bg-[#201a42] border-2 border-slate-900 dark:border-pink-300 rounded-3xl p-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,183,197,0.25)] flex flex-col items-center justify-center min-w-[75px] transform hover:scale-110 hover:rotate-[15deg] transition duration-300">
            {/* Custom cute tape stripe on the sticker */}
            <div className="absolute -top-2 left-1/4 w-8 h-3 bg-rose-400 dark:bg-pink-400 border border-dashed border-rose-600 dark:border-pink-300 rotate-[-15deg] rounded-xs" />
            <span className="text-3xl filter drop-shadow-[1px_2px_1px_rgba(0,0,0,0.15)] transform duration-200 animate-bounce-subtle">
              {getStickerForDay(dayItem.day)}
            </span>
            <span className="text-[8px] font-black tracking-wider text-rose-650 bg-rose-100 dark:text-pink-300 dark:bg-dark-amethyst/70 uppercase mt-2 px-2 py-0.5 rounded-full border border-rose-350 dark:border-pink-300/35 leading-none">
              SAVED! 🎀
            </span>
          </div>
        ) : (
          <div className="relative bg-white dark:bg-[#150f2b] border-2 border-slate-400 dark:border-pink-orchid/40 rounded-3xl p-3 shadow-[3px_3px_0px_0px_rgba(148,163,184,0.15)] flex flex-col items-center justify-center min-w-[75px] border-dashed">
            <span className="text-3xl filter saturate-[0.8] drop-shadow-[1px_1px_0px_rgba(0,0,0,0.05)]" title="Day Milestone Sticker Reward">
              {getStickerForDay(dayItem.day)}
            </span>
            <span className="text-[8px] font-black tracking-wider text-slate-500 bg-slate-100 dark:text-slate-350 dark:bg-[#20153f] uppercase mt-2 px-2 py-0.5 rounded-full border border-slate-300 dark:border-pink-orchid/20 leading-none flex items-center gap-0.5">
              <span>REWARD</span> <span>🔒</span>
            </span>
          </div>
        )}
      </div>

      <div className="pt-2">
        {/* Playful Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <span className="text-sm font-bold font-display uppercase tracking-wider text-medium-slate-blue dark:text-pink-orchid">
            Lesson #{dayItem.day} of 90
          </span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full border-2 ${getDifficultyColor(dayItem.difficulty)}`}>
            Recommended: {dayItem.difficulty}
          </span>
        </div>

        {/* Humorous Title Block */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 tracking-wide leading-tight">
            {dayItem.problemName}
          </h1>
          <p className="text-xs text-dusty-grape dark:text-slate-400 mt-1 font-mono">
            Tag: <span className="font-extrabold text-medium-slate-blue dark:text-sky-blue-light">{dayItem.topic}</span> • Core focus: <span className="underline decoration-wavy decoration-wisteria font-extrabold">{dayItem.pattern}</span>
          </p>
        </div>

        {/* LeetCode link */}
        <div className="mb-6 flex flex-wrap gap-2">
          <a
            href={dayItem.link}
            target="_blank"
            rel="noopener noreferrer"
            referrerPolicy="no-referrer"
            id="launch-study-problem"
            className="inline-flex items-center gap-1.5 text-xs text-slate-800 hover:text-medium-slate-blue dark:text-slate-100 hover:dark:text-sky-blue-light font-extrabold bg-white dark:bg-dark-amethyst/65 px-4 py-2.5 rounded-full border-2 border-slate-800 dark:border-pink-orchid/40 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(30,41,59,1)] cursor-pointer transition-all"
          >
            Go Solve this on LeetCode
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Tips Section */}
        <div className="mb-6 bg-white dark:bg-[#191330]/60 rounded-2xl p-4 border-2 border-slate-800 dark:border-pink-orchid/40">
          <button
            onClick={() => setShowTips(!showTips)}
            className="flex items-center justify-between w-full text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none font-display text-left cursor-pointer"
          >
            <span className="flex items-center gap-2 text-medium-slate-blue dark:text-sky-blue-light transition-colors">
              Secrets to saving yourself from infinite recursive loops
            </span>
            <span className="text-[11px] font-bold text-dusty-grape dark:text-slate-400 bg-slate-100 dark:bg-dusty-grape/40 px-2.5 py-1 rounded-full border border-slate-300 dark:border-pink-orchid/20 shrink-0">
              {showTips ? 'Hide Cheat Codes' : 'Show Cheat Codes'}
            </span>
          </button>
          
          <AnimatePresence initial={false}>
            {showTips && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="border-t border-slate-200 dark:border-slate-800 my-3"></div>
                <ul className="space-y-2 text-sm text-dusty-grape dark:text-slate-300 leading-relaxed font-writing">
                  {dayItem.tips.map((tip, idx) => (
                    <li key={idx} className="flex gap-2 items-start text-[14.5px] font-semibold">
                      <span className="text-medium-slate-blue dark:text-sky-blue-light font-extrabold shrink-0 font-sans">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* MULTIPLE QUESTIONS PRACTICE LOGS LIST (Show previous attempts for this day) */}
      <div className="border-t-2 border-dashed border-slate-200 dark:border-slate-800 pt-5 mt-4">
        {dayLogs.length > 0 && (
          <div className="mb-6 bg-slate-100/40 dark:bg-dark-amethyst/40 border-2 border-slate-800 dark:border-pink-orchid/40 rounded-2xl p-4">
            <h3 className="text-xs font-bold text-medium-slate-blue dark:text-pink-orchid flex items-center gap-1.5 uppercase tracking-wider mb-2 font-display">
              Practiced Today ({dayLogs.length} Questions)
            </h3>
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
              {dayLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between gap-3 bg-white dark:bg-dark-amethyst/65 p-3 rounded-xl border border-slate-200 dark:border-slate-800 transition text-xs"
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-wrap items-center gap-1.5 font-bold text-slate-800 dark:text-slate-100">
                      <span className="text-slate-900 dark:text-slate-200">{log.problemName || dayItem.problemName}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-sans inline-block border ${getDifficultyColor(log.difficulty || 'Easy')}`}>
                        {log.difficulty || 'Easy'}
                      </span>
                    </div>
                    <div className="text-dusty-grape dark:text-slate-400 mt-1 flex items-center gap-2">
                      <span>{log.duration} min struggle</span>
                      <span>•</span>
                      <span className="italic truncate inline-block max-w-[200px]" title={log.notes}>
                        "{log.notes}"
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onEditLog(log)}
                      className="p-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-50/55 text-indigo-650 dark:hover:bg-pink-orchid/15 dark:text-pink-orchid dark:border-pink-orchid/30 cursor-pointer transition"
                      title="Correct this entry"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteLog(log.id, log.xpEarned, log.dayNumber)}
                      className="p-1.5 rounded-lg border border-red-300 hover:bg-rose-100 text-red-650 dark:hover:bg-rose-950/20 dark:text-rose-400 cursor-pointer transition"
                      title="Delete this entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LOG FORM - ALWAYS OPEN to facilitate multiple logs for the same day */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-dark-amethyst/20 border-2 border-slate-800 dark:border-pink-orchid/40 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-black text-slate-800 dark:text-pink-orchid flex items-center gap-1 uppercase tracking-wider font-display">
              <PlusCircle className="w-4 h-4 text-medium-slate-blue dark:text-pink-orchid inline shrink-0" />
              Log code solution for Day {dayItem.day}
            </h3>
            <span className="text-[11px] text-dusty-grape dark:text-slate-400 font-sans">Feel free to change name to log other questions!</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Custom Question Title */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">
                Question Solved:
              </label>
              <input
                type="text"
                value={problemName}
                onChange={(e) => setProblemName(e.target.value)}
                placeholder="e.g., Two Sum"
                className="w-full text-xs px-3.5 py-2 border-2 border-slate-300 dark:border-pink-orchid/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-medium-slate-blue bg-white dark:bg-[#150f2b] text-slate-900 dark:text-slate-100 placeholder-slate-400"
                required
              />
            </div>

            {/* Custom Difficulty Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">
                Difficulty Level:
              </label>
              <div className="flex gap-1.5 p-1 bg-slate-50 dark:bg-[#1a1333] border border-slate-300 dark:border-pink-orchid/20 rounded-xl">
                {(['Easy', 'Medium', 'Hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      difficulty === diff
                        ? diff === 'Easy'
                          ? 'bg-emerald-200 text-emerald-950 border border-emerald-500'
                          : diff === 'Medium'
                          ? 'bg-amber-200 text-amber-955 border border-amber-500'
                          : 'bg-rose-200 text-rose-950 border border-rose-500'
                        : 'text-dusty-grape dark:text-slate-400 hover:text-slate-900 font-sans'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Timer struggle */}
            <div>
              <label className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">
                <span>Attempt Time</span>
                <span className="text-medium-slate-blue dark:text-sky-blue-light font-mono font-bold bg-slate-100 dark:bg-dark-amethyst px-1.5 py-0.5 rounded border border-slate-300">
                  {duration} mins
                </span>
              </label>
              <input
                type="range"
                min="5"
                max="180"
                step="5"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-dark-amethyst rounded-lg appearance-none cursor-pointer accent-medium-slate-blue"
              />
            </div>

            {/* Scribble input */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">
                Tears shed / notes / breakthroughs:
              </label>
              <input
                type="text"
                placeholder="e.g., Mind blown by key-mapping! Spent 45 min on edge cases."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs px-3.5 py-2 border-2 border-slate-300 dark:border-pink-orchid/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-medium-slate-blue bg-white dark:bg-[#150f2b] text-slate-900 dark:text-slate-100 placeholder-slate-400"
              />
            </div>
          </div>

          <button
            type="submit"
            id="log-mission-completion"
            className="w-full py-3.5 px-4 text-xs font-bold text-white bg-indigo-650 hover:bg-slate-800 dark:bg-bright-lavender dark:hover:bg-bright-lavender/90 dark:text-dark-amethyst rounded-full border-2 border-slate-800 dark:border-pink-orchid/40 shadow-[3px_3px_0px_0px_rgba(30,41,59,1)] dark:shadow-[3px_3px_0px_0px_rgba(224,177,203,0.15)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-1.5 font-display uppercase tracking-wider font-extrabold"
          >
            Log this question! (+{difficulty === 'Easy' ? 100 : difficulty === 'Medium' ? 120 : 150} XP)
          </button>
        </form>
      </div>
    </div>
  );
}
