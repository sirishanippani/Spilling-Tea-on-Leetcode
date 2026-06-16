import React from 'react';
import { motion } from 'motion/react';
import { StudyLog } from '../types';
import { Calendar, Flame, Clock, Code, ChevronRight } from 'lucide-react';

interface HeatmapProps {
  logs: StudyLog[];
  onSelectDate: (dateStr: string) => void;
  streak: number;
}

export default function Heatmap({ logs, onSelectDate, streak }: HeatmapProps) {
  // Let's generate a list of dates for the last 16 weeks (112 days)
  // Aligned to start on a Sunday
  const getHeatmapGrid = () => {
    const grid: Date[][] = Array.from({ length: 7 }, () => []);
    const today = new Date();
    
    // Find the Sunday of 15 weeks ago
    const startOffset = 15 * 7 + today.getDay();
    const startDate = new Date();
    startDate.setDate(today.getDate() - startOffset);
    
    // Generate exactly 16 weeks of dates (112 days)
    for (let c = 0; c < 16; c++) {
      for (let r = 0; r < 7; r++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (c * 7 + r));
        grid[r].push(currentDate);
      }
    }
    return { grid, startDate };
  };

  const { grid } = getHeatmapGrid();

  // Helper to format date as YYYY-MM-DD
  const formatDateString = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper to retrieve log representation for a given date, rolling up multiple sessions
  const getLogForDate = (d: Date): StudyLog | undefined => {
    const dateStr = formatDateString(d);
    const dayLogs = logs.filter(log => log.date === dateStr);
    if (dayLogs.length === 0) return undefined;

    return {
      id: dateStr,
      date: dateStr,
      problemsCount: dayLogs.reduce((acc, curr) => acc + curr.problemsCount, 0),
      duration: dayLogs.reduce((acc, curr) => acc + curr.duration, 0),
      notes: dayLogs.map(l => l.notes).join('; '),
      xpEarned: dayLogs.reduce((acc, curr) => acc + curr.xpEarned, 0),
      isTodayTarget: dayLogs.some(l => l.isTodayTarget)
    };
  };

  // Calculate stats
  const totalSolved = logs.reduce((acc, curr) => acc + curr.problemsCount, 0);
  const totalDuration = logs.reduce((acc, curr) => acc + curr.duration, 0);
  const daysActiveCount = Array.from(new Set(logs.map(l => l.date))).length;

  // Render coloring style for a log cell (cosmic starlight magnitudes)
  const getCellColorClass = (log: StudyLog | undefined, isFuture: boolean) => {
    if (isFuture) return 'bg-[#0b0c10]/40 dark:bg-slate-900/10 cursor-not-allowed border border-transparent';
    if (!log) return 'bg-slate-100 hover:bg-slate-200 dark:bg-[#0c0f1d] dark:hover:bg-[#12162b] border border-slate-200/40 dark:border-[#1e233d]';
    
    const minutes = log.duration;
    const count = log.problemsCount;
    
    // Gradient levels based on intensity (cosmic blue-violet-cyan twilight spectrum)
    if (minutes >= 60 || count >= 4) {
      return 'bg-cyan-450 dark:bg-cyan-400 border border-cyan-300 text-slate-950 shadow-[0_0_8px_rgba(34,211,238,0.5)]'; // Supergiant radiant
    } else if (minutes >= 30 || count >= 2) {
      return 'bg-indigo-500 dark:bg-indigo-600 border border-indigo-400 text-white'; // Indigo main sequence
    } else {
      return 'bg-purple-300 dark:bg-[#34245c] border border-purple-400/30 dark:border-purple-650 text-indigo-950 dark:text-purple-200'; // Violet dwarf stardust
    }
  };

  // Days of week short labels
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Identify months spanning across the columns to show as headers
  const getMonthHeaders = () => {
    const headers: { month: string; index: number }[] = [];
    let lastMonth = -1;
    
    // Scan columns (weeks) via row 0 (Sunday) to find when we change month
    grid[0].forEach((dateObj, weekIdx) => {
      const m = dateObj.getMonth();
      if (m !== lastMonth) {
        headers.push({ month: monthNames[m], index: weekIdx });
        lastMonth = m;
      }
    });

    return headers;
  };

  const monthHeaders = getMonthHeaders();
  const todayStr = formatDateString(new Date());

  return (
    <div className="bg-slate-50/50 dark:bg-[#080a15]/60 border border-slate-200/50 dark:border-[#1b203a] rounded-3xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-base font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            Celestial Coordinate Log & Orbital Consistency
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            Every star represents a study coordinate locked. Click cells to calibrate or backdate deep-space observations.
          </p>
        </div>

        {/* Core dynamic summary metrics */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-indigo-50/30 dark:bg-[#12132a] px-3 py-1.5 rounded-xl border border-indigo-100/40 dark:border-[#20224e]">
            <Flame className="w-4 h-4 text-indigo-400" />
            <div className="text-left font-display">
              <div className="text-[9px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold leading-none">Orbital Streak</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1 leading-none">{streak} {streak === 1 ? 'Orbit' : 'Orbits'}</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-cyan-50/20 dark:bg-[#071926] px-3 py-1.5 rounded-xl border border-cyan-100/30 dark:border-[#10324c]">
            <Code className="w-4 h-4 text-cyan-400" />
            <div className="text-left font-display">
              <div className="text-[9px] uppercase tracking-wider text-cyan-600 dark:text-cyan-300 font-bold leading-none">Stars Logged</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1 leading-none">{totalSolved} Qs</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-purple-50/20 dark:bg-[#160d29] px-3 py-1.5 rounded-xl border border-purple-100/30 dark:border-[#301b54]">
            <Clock className="w-4 h-4 text-purple-400" />
            <div className="text-left font-display">
              <div className="text-[9px] uppercase tracking-wider text-purple-600 dark:text-purple-300 font-bold leading-none">Astro Space-Time</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1 leading-none">{Math.round(totalDuration / 60 * 10) / 10} Hrs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid container */}
      <div className="overflow-x-auto pb-2 scrollbar-thin">
        <div className="min-w-[580px]">
          {/* Month labels header row */}
          <div className="relative h-6 text-xs text-slate-400 dark:text-slate-500 flex items-end mb-2">
            {/* Indent month labels to align to grid columns */}
            <div className="w-6 shrink-0"></div>
            <div className="relative w-full flex font-display">
              {monthHeaders.map((header, idx) => {
                const leftPos = `${(header.index / 16) * 100}%`;
                // Calculate next month's index or pad bounds
                const nextHeaderIndex = monthHeaders[idx + 1]?.index ?? 16;
                const widthBound = `${((nextHeaderIndex - header.index) / 16) * 100}%`;
                return (
                  <div
                    key={idx}
                    className="absolute text-[11px] font-medium truncate"
                    style={{ left: leftPos, width: widthBound }}
                  >
                    {header.month}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2">
            {/* Days of week indices */}
            <div className="flex flex-col justify-between text-[10px] text-slate-400 dark:text-slate-600 w-4 font-mono select-none h-[112px] py-0.5">
              {daysOfWeek.map((dayName, idx) => (
                <div key={idx} className="h-3 flex items-center justify-center">
                  {idx % 2 === 1 ? dayName : ''}
                </div>
              ))}
            </div>

            {/* Matrix elements */}
            <div className="w-full flex justify-between gap-1">
              {Array.from({ length: 16 }).map((_, colIdx) => (
                <div key={colIdx} className="flex flex-col justify-between gap-1 w-full h-[112px]">
                  {Array.from({ length: 7 }).map((_, rowIdx) => {
                    const dateObj = grid[rowIdx][colIdx];
                    const dateStr = formatDateString(dateObj);
                    const log = getLogForDate(dateObj);
                    const isFuture = dateObj > new Date();
                    const isToday = dateStr === todayStr;

                    return (
                      <motion.button
                        key={rowIdx}
                        id={`heatmap-cell-${dateStr}`}
                        onClick={() => !isFuture && onSelectDate(dateStr)}
                        disabled={isFuture}
                        whileHover={!isFuture ? { scale: 1.25, zIndex: 10 } : {}}
                        className={`h-3 w-full rounded-sm aspect-square relative focus:outline-none transition-colors duration-150 ${getCellColorClass(
                          log,
                          isFuture
                        )} ${isToday ? 'outline-2 outline-offset-1 outline-cyan-400 dark:outline-cyan-500' : ''}`}
                        title={`${dateObj.toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}: ${
                          log
                            ? `${log.problemsCount} completed, ${log.duration} mins`
                            : '0 completed, 0 mins'
                        }`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Legend summary */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-4 border-t border-slate-200/50 dark:border-[#1e233d] pt-3 font-display">
        <div className="flex items-center gap-2">
          <span>Stellar days: <b className="text-slate-800 dark:text-slate-200 font-sans font-bold">{daysActiveCount}</b></span>
          <span className="text-slate-350 dark:text-slate-750">|</span>
          <span>Avg orbit session: <b className="text-slate-800 dark:text-slate-200 font-sans font-bold">{daysActiveCount ? Math.round(totalDuration / daysActiveCount) : 0} min</b></span>
        </div>
        <div className="flex items-center gap-1 font-mono text-[10px]">
          <span className="text-[10px] text-slate-400">Dim Dust</span>
          <div className="w-2.5 h-2.5 rounded-sm bg-slate-100 dark:bg-[#0c0f1d] border border-slate-200/40 dark:border-[#1e233d]"></div>
          <div className="w-2.5 h-2.5 rounded-sm bg-purple-350 dark:bg-[#34245c] border border-purple-400/30"></div>
          <div className="w-2.5 h-2.5 rounded-sm bg-indigo-500 border border-indigo-400"></div>
          <div className="w-2.5 h-2.5 rounded-sm bg-cyan-400 border border-cyan-300 shadow-[0_0_4px_rgba(34,211,238,0.5)]"></div>
          <span className="text-[10px] text-slate-400">Radiant</span>
        </div>
      </div>
    </div>
  );
}
