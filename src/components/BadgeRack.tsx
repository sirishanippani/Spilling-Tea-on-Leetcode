import React from 'react';
import { motion } from 'motion/react';
import { Badge, UserStats } from '../types';
import { getLevelForXp } from '../data/roadmap';
import { Terminal, Clock, Zap, Flame, Shield, Cpu, Award, Trophy, Lock } from 'lucide-react';

interface BadgeRackProps {
  stats: UserStats;
  badges: Badge[];
}

export default function BadgeRack({ stats, badges }: BadgeRackProps) {
  const { level, name, nextXpRequired, prevXpLimit } = getLevelForXp(stats.xp);

  let levelPercentage = 100;
  let levelRatioStr = `${stats.xp} Total XP`;

  if (nextXpRequired !== null) {
    const range = nextXpRequired - prevXpLimit;
    const progress = stats.xp - prevXpLimit;
    levelPercentage = Math.min(Math.max(Math.round((progress / range) * 100), 0), 100);
    levelRatioStr = `${stats.xp} / ${nextXpRequired} XP`;
  }

  const renderBadgeIcon = (iconName: string, isUnlocked: boolean) => {
    const props = { className: `w-5 h-5 ${isUnlocked ? 'text-indigo-650 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-700'}` };
    switch (iconName) {
      case 'Terminal': return <Terminal {...props} />;
      case 'Clock': return <Clock {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'Shield': return <Shield {...props} />;
      case 'Cpu': return <Cpu {...props} />;
      case 'Award': return <Award {...props} />;
      default: return <Trophy {...props} />;
    }
  };

  const unlockedCount = badges.filter(b => b.unlockedAt !== null).length;

  return (
    <div className="bg-white/90 dark:bg-[#15122e] border-2 border-slate-900 rounded-[2rem] p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.08)] flex flex-col gap-6 font-sans text-left">
      
      {/* Playful level badge block */}
      <div className="bg-indigo-50/50 dark:bg-[#1a1738] p-5 rounded-3xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-amber-300 dark:bg-amber-400 text-slate-950 border-2 border-slate-900 flex items-center justify-center font-black text-2xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] shrink-0">
            {level}
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wide text-indigo-700 dark:text-indigo-350">
              My Level & Rank Title
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight font-display">
              {name}
            </h2>
          </div>
        </div>

        {/* Bubbly Level Progress Slider Gauge */}
        <div className="mt-4">
          <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-300 mb-1">
            <span>Stardust battery limits: {levelPercentage}% full</span>
            <span className="font-bold underline">{levelRatioStr}</span>
          </div>
          
          <div className="w-full bg-slate-100 dark:bg-[#1a182b] h-3.5 rounded-full border-2 border-slate-900 overflow-hidden p-[2px]">
            <motion.div
              className="h-full bg-indigo-500 dark:bg-cyan-400 rounded-full border border-slate-900"
              initial={{ width: 0 }}
              animate={{ width: `${levelPercentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          
          {nextXpRequired !== null && (
            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-2">
              Struggle for another <b>{nextXpRequired - stats.xp} XP</b> to upgrade to rank: <span className="font-bold text-slate-700 dark:text-indigo-300">{getLevelForXp(nextXpRequired).name}</span>.
            </p>
          )}
        </div>
      </div>

      {/* Badges system */}
      <div>
        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5 font-display mb-3">
          Handcrafted Medals Discovered ({unlockedCount}/{badges.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {badges.map((badge) => {
            const isUnlocked = badge.unlockedAt !== null;

            return (
              <div
                key={badge.id}
                className={`relative p-4 rounded-2xl border-2 border-slate-900 flex flex-col justify-between transition min-h-[110px] group ${
                  isUnlocked
                    ? 'bg-amber-50/20 dark:bg-[#1d1b3b] shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.04)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                    : 'bg-slate-100/45 dark:bg-[#121020]/50 opacity-40 select-none'
                }`}
              >
                {/* Upper line: icon */}
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-xl border-2 border-slate-900 ${isUnlocked ? 'bg-amber-300 dark:bg-amber-400' : 'bg-slate-200'}`}>
                    {renderBadgeIcon(badge.iconName, isUnlocked)}
                  </div>
                  
                  {!isUnlocked ? (
                    <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 font-bold px-2 py-0.5 rounded-full border border-slate-400/30">Locked</span>
                  ) : (
                    <span className="text-[9px] bg-indigo-100 text-indigo-700 dark:bg-[#1e2a47] dark:text-indigo-200 font-extrabold px-2 py-0.5 rounded-full border border-slate-700/30 font-display">
                      UNLOCKED!
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="mt-2.5">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 leading-tight text-xs font-display flex items-center gap-1">
                    {badge.title}
                  </h4>
                  <p className="text-[10.5px] text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
