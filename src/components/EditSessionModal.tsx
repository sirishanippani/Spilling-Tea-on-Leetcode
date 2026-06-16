import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info, Edit3, HelpCircle } from 'lucide-react';
import { StudyLog, ProblemDifficulty } from '../types';

interface EditSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: StudyLog | null;
  onUpdateLog: (updatedLog: StudyLog) => void;
}

export default function EditSessionModal({ isOpen, onClose, log, onUpdateLog }: EditSessionModalProps) {
  const [date, setDate] = useState('');
  const [problemName, setProblemName] = useState('');
  const [difficulty, setDifficulty] = useState<ProblemDifficulty>('Easy');
  const [duration, setDuration] = useState(45);
  const [problemsCount, setProblemsCount] = useState(1);
  const [notes, setNotes] = useState('');
  const [dayNumber, setDayNumber] = useState<number | ''>('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (log) {
      setDate(log.date || '');
      setProblemName(log.problemName || '');
      setDifficulty(log.difficulty || 'Easy');
      setDuration(log.duration || 45);
      setProblemsCount(log.problemsCount || 1);
      setNotes(log.journalEntry || log.notes || '');
      setDayNumber(log.dayNumber !== undefined ? log.dayNumber : '');
      setErrorMsg('');
    }
  }, [log, isOpen]);

  if (!log) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      setErrorMsg('Please select a valid date.');
      return;
    }

    const selectedDateObj = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (selectedDateObj > today) {
      setErrorMsg('Cannot set entry date into the future!');
      return;
    }

    const parsedDayNumber = dayNumber === '' ? undefined : Number(dayNumber);
    if (parsedDayNumber !== undefined && (parsedDayNumber < 1 || parsedDayNumber > 90)) {
      setErrorMsg('Quest Day Milestone must be between 1 and 90.');
      return;
    }

    const updatedLog: StudyLog = {
      ...log,
      date,
      problemName: log.isTodayTarget ? problemName.trim() : undefined,
      difficulty: log.isTodayTarget ? difficulty : undefined,
      duration,
      problemsCount: log.isTodayTarget ? 1 : problemsCount,
      notes: notes.trim() || `Practised Day ${parsedDayNumber || 'manual'}`,
      journalEntry: notes.trim(),
      dayNumber: parsedDayNumber,
    };

    onUpdateLog(updatedLog);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md z-55 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="bg-[#fcfaf2] dark:bg-[#16142c] border-4 border-slate-900 dark:border-pink-orchid/50 rounded-[2rem] w-full max-w-lg overflow-hidden shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.08)] text-left"
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b-2 border-slate-900 dark:border-pink-orchid/30 flex items-center justify-between bg-amber-100 dark:bg-[#1e1a3b]">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 font-display uppercase tracking-wider">
                  <Edit3 className="w-4 h-4 text-rose-500 animate-pulse" />
                  Correct Log Entry
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-sans">
                  Fix dates, adjust timers, or map sessions to different curriculum levels easily.
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 p-1.5 rounded-full border-2 border-slate-900 dark:border-pink-orchid/40 bg-white dark:bg-[#0c081f] cursor-pointer"
              >
                <X className="w-4 h-4 shrink-0" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 font-sans">
              {errorMsg && (
                <div className="bg-rose-50 dark:bg-rose-950/20 border-2 border-rose-300 dark:border-rose-800 rounded-2xl p-3 text-xs text-rose-700 dark:text-rose-400 flex items-start gap-1.5 font-black">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">
                    Correct Date of Practice:
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setErrorMsg('');
                    }}
                    className="w-full text-xs px-3.5 py-2 border-2 border-slate-300 dark:border-pink-orchid/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-medium-slate-blue bg-white dark:bg-[#150f2b] text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>

                {/* Milestone Day Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1 flex items-center justify-between">
                    <span>Quest Day (1-90) Milestone:</span>
                    <span className="text-[10px] font-mono text-dusty-grape">Leave empty if manual entry</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={dayNumber}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDayNumber(val === '' ? '' : Number(val));
                      setErrorMsg('');
                    }}
                    placeholder="e.g. 5"
                    className="w-full text-xs px-3.5 py-2 border-2 border-slate-300 dark:border-pink-orchid/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-medium-slate-blue bg-white dark:bg-[#150f2b] text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {log.isTodayTarget ? (
                /* Quest Milestones specific inputs */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">
                      Target Question Title:
                    </label>
                    <input
                      type="text"
                      value={problemName}
                      onChange={(e) => setProblemName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2 border-2 border-slate-300 dark:border-pink-orchid/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-medium-slate-blue bg-white dark:bg-[#150f2b] text-slate-900 dark:text-slate-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">
                      Difficulty Level:
                    </label>
                    <div className="flex gap-1 bg-slate-100 dark:bg-[#1a1333] border border-slate-300 dark:border-pink-orchid/20 p-1 rounded-xl">
                      {(['Easy', 'Medium', 'Hard'] as const).map((diff) => (
                        <button
                          key={diff}
                          type="button"
                          onClick={() => setDifficulty(diff)}
                          className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            difficulty === diff
                              ? diff === 'Easy'
                                ? 'bg-emerald-200 text-emerald-950 border border-emerald-500'
                                : diff === 'Medium'
                                ? 'bg-amber-200 text-amber-955 border border-amber-500'
                                : 'bg-rose-200 text-rose-950 border border-rose-500'
                              : 'text-dusty-grape dark:text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Backdated general study log specific inputs */
                <div>
                  <label className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">
                    <span>Questions Solved in this session:</span>
                    <span className="text-medium-slate-blue dark:text-cyan-400 font-mono font-bold">{problemsCount} Questions</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="1"
                    value={problemsCount}
                    onChange={(e) => setProblemsCount(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-medium-slate-blue"
                  />
                </div>
              )}

              {/* Slider for struggles time */}
              <div>
                <label className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">
                  <span>Correct Attempt Duration:</span>
                  <span className="text-medium-slate-blue dark:text-cyan-400 font-mono font-bold bg-white dark:bg-[#1a1333] border border-slate-300 dark:border-pink-orchid/30 px-2 py-0.5 rounded">
                    {duration} minutes
                  </span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="180"
                  step="5"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-medium-slate-blue"
                />
              </div>

              {/* Scribble Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">
                  Scribbles / breakthroughs / lesson diary:
                </label>
                <textarea
                  placeholder="e.g., Solved with high efficiency, but watch out for boundary conditions next time!"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border-2 border-slate-300 dark:border-pink-orchid/20 rounded-2xl focus:outline-none focus:ring-1 focus:ring-medium-slate-blue bg-white dark:bg-[#150f2b] text-slate-900 dark:text-slate-100 placeholder-slate-400"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-white dark:bg-[#0c081f] border-2 border-slate-800 dark:border-pink-orchid/30 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-black rounded-full cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 text-xs font-extrabold text-slate-950 bg-amber-300 hover:bg-amber-400 dark:bg-[#dec0f1] dark:hover:bg-rose-350 dark:text-dark-amethyst border-2 border-slate-800 dark:border-pink-orchid/40 rounded-full transition shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] active:translate-y-px active:shadow-none cursor-pointer uppercase tracking-wider font-display"
                >
                  Save Corrections ✓
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
