import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RoadmapDay } from '../types';
import { Search, CheckCircle2, Circle, BookOpen, Layers } from 'lucide-react';
import { getStickerForDay } from '../data/roadmap';

interface RoadmapExplorerProps {
  roadmap: RoadmapDay[];
  completedDays: number[];
  activeDay: number;
  onSelectDay: (day: number) => void;
}

export default function RoadmapExplorer({ roadmap, completedDays, activeDay, onSelectDay }: RoadmapExplorerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'coding' | 'system-design' | 'behavioral'>('all');
  const [activeDifficulty, setActiveDifficulty] = useState<'all' | 'Easy' | 'Medium' | 'Hard'>('all');

  const filteredRoadmap = roadmap.filter((item) => {
    const matchesSearch =
      item.problemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pattern.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = activeFilter === 'all' || item.type === activeFilter;
    const matchesDifficulty = activeDifficulty === 'all' || item.difficulty === activeDifficulty;
    
    return matchesSearch && matchesType && matchesDifficulty;
  });

  const getDifficultyStyles = (diff: 'Easy' | 'Medium' | 'Hard') => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/20 dark:text-emerald-300';
      case 'Medium':
        return 'bg-amber-50 text-amber-805 border-amber-300 dark:bg-amber-950/20 dark:text-amber-300';
      case 'Hard':
        return 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/20 dark:text-rose-300';
    }
  };

  const completedPercentage = Math.round((completedDays.length / roadmap.length) * 100);

  return (
    <div className="bg-[#fcfaf2] dark:bg-[#140e28] border-2 border-slate-800 dark:border-pink-orchid/40 rounded-[2rem] p-6 shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] dark:shadow-[6px_6px_0px_0px_rgba(224,177,203,0.15)] flex flex-col h-full font-sans text-left text-slate-900 dark:text-slate-100 relative overflow-hidden">
      
      {/* Pinned Scrapbook tape styling on top edge */}
      <div className="absolute -top-1.5 left-1/3 w-28 h-5 bg-yellow-200/45 dark:bg-yellow-400/20 border border-dashed border-yellow-300/60 dark:border-yellow-400/30 rotate-[2deg] opacity-80 pointer-events-none z-10" />
      <div className="absolute top-2.5 right-4 text-xs select-none opacity-20 pointer-events-none">✨🧸</div>

      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 font-display">
            <span className="text-rose-500 dark:text-pink-350">⭐️</span>
            Curriculum Quest Log
          </h2>
          <div className="text-[11px] font-bold text-medium-slate-blue dark:text-sky-blue-light font-mono">
            {completedDays.length}/{roadmap.length} Solved ({completedPercentage}%)
          </div>
        </div>
        
        {/* Playful progress gauge */}
        <div className="w-full bg-slate-100 dark:bg-dark-amethyst/60 h-3.5 rounded-full border-2 border-slate-850 dark:border-pink-orchid/30 overflow-hidden mt-3 p-[2px]">
          <motion.div
            className="h-full bg-pink-orchid dark:bg-bright-lavender rounded-full border border-slate-800 dark:border-pink-orchid/40"
            initial={{ width: 0 }}
            animate={{ width: `${completedPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Filter and Searching panel */}
      <div className="space-y-3 mb-4">
        {/* Elegant minimal search inputs */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-dusty-grape dark:text-slate-400" />
          <input
            type="text"
            placeholder="Search patterns or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 bg-white dark:bg-[#150f2b] border-2 border-slate-300 dark:border-pink-orchid/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-medium-slate-blue text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-2">
          {/* Main Filter categories */}
          <div className="flex flex-wrap gap-1 bg-slate-50 dark:bg-[#1c1439] p-1 rounded-xl border-2 border-slate-300 dark:border-pink-orchid/20 select-none">
            {[
              { id: 'all', label: 'All Quests' },
              { id: 'coding', label: 'Coding' },
              { id: 'system-design', label: 'System Design' },
              { id: 'behavioral', label: 'Prep' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`py-1 px-2.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-medium-slate-blue text-white dark:bg-bright-lavender dark:text-dark-amethyst'
                    : 'text-dusty-grape dark:text-slate-400 hover:text-slate-950 font-sans'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Difficulty options */}
          <div className="flex flex-wrap gap-1 bg-slate-50 dark:bg-[#1c1439] p-1 rounded-xl border-2 border-slate-300 dark:border-pink-orchid/20 select-none">
            {[
              { id: 'all', label: 'Any Level' },
              { id: 'Easy', label: 'Easy' },
              { id: 'Medium', label: 'Medium' },
              { id: 'Hard', label: 'Hard' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveDifficulty(tab.id as any)}
                className={`py-1 px-3 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                  activeDifficulty === tab.id
                    ? 'bg-pink-orchid text-dark-amethyst font-extrabold border-slate-800'
                    : 'text-dusty-grape dark:text-slate-400 hover:text-slate-950 font-sans'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid items (Multi-column list structured vertically for beautiful notebook aesthetic) */}
      <div className="flex-1 overflow-y-auto max-h-[420px] pr-1.5 scrollbar-thin">
        {filteredRoadmap.length > 0 ? (
          <div className="flex flex-col gap-3 p-1">
            {filteredRoadmap.map((item) => {
              const isCompleted = completedDays.includes(item.day);
              const isSelected = activeDay === item.day;

              return (
                <motion.button
                  key={item.day}
                  id={`roadmap-item-${item.day}`}
                  onClick={() => onSelectDay(item.day)}
                  className={`w-full text-left p-4 rounded-2xl border-2 flex items-center justify-between gap-4 transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-amber-100/70 dark:bg-[#20153f] border-indigo-600 dark:border-pink-orchid shadow-[3px_3px_0px_0px_rgba(30,41,59,1)] dark:shadow-[3px_3px_0px_0px_rgba(224,177,203,0.15)] rotate-[-0.5deg]'
                      : 'bg-white hover:bg-slate-50 dark:bg-[#1a1333] dark:hover:bg-[#211942] border-slate-300 dark:border-pink-orchid/20 shadow-[2px_2px_0px_0px_rgba(30,41,59,0.06)] hover:rotate-[0.5deg]'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.15 }}
                >
                  {/* Cute hand-drawn notebook tape strip on active days */}
                  {isSelected && (
                    <div className="absolute -top-2.5 left-1/3 w-12 h-4 bg-indigo-650/15 dark:bg-[#dec0f1]/20 border border-dashed border-indigo-300 dark:border-pink-orchid/30 rotate-2 opacity-80 backdrop-blur-xs pointer-events-none" />
                  )}

                  <div className="flex items-center gap-3 overflow-hidden">
                    {/* Complete / Incomplete icon indicator */}
                    {isCompleted ? (
                      <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-[#34275f] border-2 border-slate-900 dark:border-pink-300 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(15,23,42,0.15)] relative rotate-[-4deg]">
                        <span className="text-lg select-none filter drop-shadow-[1px_1px_0px_rgba(0,0,0,0.15)]">{getStickerForDay(item.day)}</span>
                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px] font-black border-2 border-slate-900 shadow-[1px_1px_0px_rgba(0,0,0,0.1)] leading-none select-none">
                          ✓
                        </div>
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-400 dark:border-pink-orchid/40 flex items-center justify-center shrink-0 select-none bg-slate-50 dark:bg-dark-amethyst/30 relative" title={`Day ${item.day} - Locked Reward`}>
                        <span className="text-base select-none filter saturate-[0.7]">{getStickerForDay(item.day)}</span>
                        <div className="absolute -bottom-1 -right-1 bg-slate-200 dark:bg-[#20153f] border border-slate-400 dark:border-pink-orchid/40 rounded-full w-4.5 h-4.5 flex items-center justify-center text-[8px] leading-none select-none" title="Locked">
                          🔒
                        </div>
                      </div>
                    )}

                    {/* Descriptions */}
                    <div className="font-sans">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[9.5px] font-black tracking-wider text-slate-800 dark:text-[#dec0f1] bg-slate-100 dark:bg-[#7161ef]/10 px-2 py-0.5 rounded-md border border-slate-300 dark:border-pink-orchid/25">
                          Day {item.day < 10 ? `0${item.day}` : item.day}
                        </span>
                        <span className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded border-2 border-slate-800 dark:border-pink-orchid/40 ${getDifficultyStyles(item.difficulty)}`}>
                          {item.difficulty}
                        </span>
                      </div>

                      <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 mt-1 leading-tight font-display">
                        {item.problemName}
                      </div>

                      <div className="text-[10px] text-slate-600 dark:text-slate-300 mt-1.5 font-semibold">
                        {item.topic} • <span className="font-mono text-[9px] text-[#7161ef] dark:text-[#72ddf7]">{item.pattern}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div className="text-[9.5px] font-black font-semibold text-[#7161ef] dark:text-sky-blue-light bg-slate-50 dark:bg-[#1a1333] border border-slate-300 dark:border-pink-orchid/30 px-1.5 py-0.5 rounded">
                      +{item.xpReward} XP
                    </div>
                    {item.type === 'system-design' && (
                      <span className="text-[8px] font-extrabold bg-[#72ddf7]/15 border border-slate-800 text-teal-800 px-1 py-0.2 rounded dark:bg-[#201d44] dark:text-[#72ddf7] uppercase tracking-wider">
                        System
                      </span>
                    )}
                    {item.type === 'behavioral' && (
                      <span className="text-[8px] font-extrabold bg-amber-100/25 border border-slate-800 text-amber-900 px-1 py-0.2 rounded dark:bg-[#201d44] dark:text-[#dec0f1] uppercase tracking-wider">
                        Prep
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 text-xs text-slate-400 dark:text-slate-550 flex flex-col items-center justify-center gap-2">
            <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-705" />
            No checkpoints found matching that query.
          </div>
        )}
      </div>
    </div>
  );
}
