import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Trash2, RotateCcw, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Yes, Continue",
  cancelText = "Cancel",
  variant = 'warning'
}: ConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-md z-60 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            className="bg-[#fcfaf2] dark:bg-[#16142c] border-4 border-slate-900 dark:border-pink-orchid/50 rounded-[2rem] w-full max-w-md overflow-hidden shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.08)] text-left"
          >
            {/* Upper Cute Tape Sticker Accent */}
            <div className="absolute -top-1 left-1/4 w-32 h-6 bg-yellow-200/40 border-l border-r border-dashed border-yellow-300 rotate-[-4deg] opacity-75 pointer-events-none select-none z-10" />

            {/* Header banner */}
            <div className="px-6 py-4 border-b-2 border-slate-900 dark:border-pink-orchid/30 flex items-center gap-3 bg-amber-50 dark:bg-[#1c183a]">
              <div className={`p-2 rounded-xl border border-slate-900 ${
                variant === 'danger'
                  ? 'bg-rose-100 text-rose-600'
                  : variant === 'warning'
                  ? 'bg-amber-100 text-amber-600'
                  : 'bg-indigo-100 text-[#7161ef]'
              }`}>
                {variant === 'danger' ? (
                  <Trash2 className="w-4 h-4 shrink-0" />
                ) : variant === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                ) : (
                  <RotateCcw className="w-4 h-4 shrink-0" />
                )}
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 font-display">
                {title}
              </h3>
            </div>

            {/* Message Body */}
            <div className="p-6">
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-medium">
                {message}
              </p>

              {/* Action buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 bg-white dark:bg-[#0c081f] border-2 border-slate-800 dark:border-pink-orchid/30 hover:bg-slate-150 text-xs font-black rounded-full cursor-pointer text-center text-slate-800 dark:text-slate-200 transition"
                >
                  {cancelText}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`flex-1 py-2.5 px-4 text-xs font-extrabold border-2 border-slate-800 dark:border-pink-orchid/40 rounded-full transition shadow-[2.5px_2.5px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] active:translate-y-px active:shadow-none cursor-pointer uppercase font-display ${
                    variant === 'danger'
                      ? 'bg-rose-450 hover:bg-rose-500 text-white'
                      : variant === 'warning'
                      ? 'bg-amber-300 hover:bg-amber-400 text-slate-950'
                      : 'bg-indigo-300 hover:bg-indigo-400 text-white'
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
