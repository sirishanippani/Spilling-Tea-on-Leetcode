import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, CheckSquare, X, Info } from 'lucide-react';

interface LogSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLog: (date: string, duration: number, problems: number, notes: string) => void;
  preSelectedDate?: string | null;
}

export default function LogSessionModal({ isOpen, onClose, onAddLog, preSelectedDate }: LogSessionModalProps) {
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState(45);
  const [problems, setProblems] = useState(2);
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Update date state if preSelectedDate is supplied or changed
  useEffect(() => {
    if (preSelectedDate) {
      setDate(preSelectedDate);
    } else {
      const todayStr = new Date().toISOString().split('T')[0];
      setDate(todayStr);
    }
    setErrorMsg('');
  }, [preSelectedDate, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      setErrorMsg('Please pick a real calendar date.');
      return;
    }

    const selectedDateObj = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (selectedDateObj > today) {
      setErrorMsg('You cannot backdate a study log into the future! Are you a time traveller?');
      return;
    }

    onAddLog(date, duration, problems, notes || 'Completed retro offline practice session.');
    setNotes('');
    setDuration(45);
    setProblems(2);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="bg-amber-50 dark:bg-[#16142c] border-4 border-slate-900 rounded-[2rem] w-full max-w-md overflow-hidden shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.08)] text-left"
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b-2 border-slate-900 flex items-center justify-between bg-amber-100 dark:bg-[#1e1a3b]">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 font-display">
                  Log Retro Space-Time
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Protect consistency stats and backdate offline study days.</p>
              </div>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-slate-900 dark:text-slate-405 dark:hover:text-slate-100 p-1.5 rounded-full border-2 border-slate-900 bg-white hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4 shrink-0" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 font-sans">
              {errorMsg && (
                <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-3 text-xs text-rose-700 flex items-start gap-1.5 font-bold">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Day selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 dark:text-slate-300">Which date did you practice on?</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setErrorMsg('');
                  }}
                  className="w-full text-xs px-3.5 py-2 border-2 border-slate-900 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-300 dark:bg-[#1d193d] text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              {/* Slider inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Struggle time</span>
                    <span className="text-indigo-650 dark:text-cyan-400 font-mono font-bold bg-white dark:bg-[#1d193d] px-1.5 py-0.2 rounded border border-slate-300/40">{duration}m</span>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="180"
                    step="5"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-550"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-[11px] font-bold text-slate-705 dark:text-slate-300 mb-1">
                    <span>Qs completed</span>
                    <span className="text-indigo-650 dark:text-cyan-400 font-mono font-bold bg-white dark:bg-[#1d193d] px-1.5 py-0.2 rounded border border-slate-300/40">{problems} Qs</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="1"
                    value={problems}
                    onChange={(e) => setProblems(Number(e.target.value))}
                    className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-550"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">Memory journal / scribbled insights</label>
                <textarea
                  placeholder="e.g., Practiced hashmap duplicates. Kept failing on empty array checks."
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 border-2 border-slate-900 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-[#1d193d] text-slate-900 dark:text-slate-100 placeholder-slate-400"
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 px-3 bg-white hover:bg-slate-50 border-2 border-slate-900 text-xs font-bold text-slate-700 rounded-xl transition cursor-pointer text-center"
                >
                  Go Back
                </button>
                <button
                  type="submit"
                  id="submit-backdated-session"
                  className="flex-1 py-2.5 px-3.5 text-xs font-extrabold text-slate-950 bg-amber-300 hover:bg-amber-400 border-2 border-slate-900 rounded-xl transition shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] active:translate-y-px active:shadow-none cursor-pointer"
                >
                  Commit Log!
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
