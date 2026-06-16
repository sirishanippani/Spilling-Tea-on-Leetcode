import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StudyLog, UserStats, Badge, RoadmapDay } from './types';
import { DEFAULT_ROADMAP, DEFAULT_BADGES, getLevelForXp, getStickerForDay } from './data/roadmap';

// Subcomponents import
import Heatmap from './components/Heatmap';
import MissionCard from './components/MissionCard';
import RoadmapExplorer from './components/RoadmapExplorer';
import BadgeRack from './components/BadgeRack';
import LogSessionModal from './components/LogSessionModal';
import EditSessionModal from './components/EditSessionModal';
import ConfirmationModal from './components/ConfirmationModal';

// Lucide Icons
import {
  Sparkles,
  History,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  Moon,
  Sun,
  RefreshCw,
  Notebook,
  FileDown,
  FileUp,
  MapPin,
  Trophy,
  ExternalLink,
  BookOpen,
  Edit3
} from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('pivot_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [logs, setLogs] = useState<StudyLog[]>(() => {
    const saved = localStorage.getItem('pivot_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const completedDays = React.useMemo<number[]>(() => {
    const days = new Set<number>();
    logs.forEach(l => {
      if (l.dayNumber !== undefined) {
        days.add(l.dayNumber);
      }
    });
    return Array.from(days).sort((a, b) => a - b);
  }, [logs]);

  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem('pivot_badges');
    return saved ? JSON.parse(saved) : DEFAULT_BADGES;
  });

  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('pivot_xp');
    return saved ? Number(saved) : 0;
  });

  const [journalNote, setJournalNote] = useState(() => {
    return localStorage.getItem('pivot_journal_note') || '';
  });

  const [activeDayNumber, setActiveDayNumber] = useState<number>(1);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [modalPreSelectedDate, setModalPreSelectedDate] = useState<string | null>(null);
  const [toastNotification, setToastNotification] = useState<string | null>(null);
  const [editingLog, setEditingLog] = useState<StudyLog | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Safe custom confirm dialog state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {}
  });

  // Active Tab navigation state (three tabs: quests, journal, and backup settings)
  const [activeTab, setActiveTab] = useState<'quests' | 'journal' | 'backup'>('quests');

  // Stable coordinates for 15 beautiful glowing stars (placed in the margins to avoid colliding with text)
  const [stars, setStars] = useState<{ id: number; top: number; left: number; delay: number; size: number }[]>([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: 14 }).map((_, i) => {
      const isLeft = i % 2 === 0;
      // Force stars into the left (1.5% to 13%) or right (87% to 98.5%) margin zones
      const left = isLeft 
        ? 1.5 + (i * 4) % 11.5 
        : 87 + (i * 4) % 11.5;
      const top = 5 + (i * 13.5) % 88;
      const size = i % 3 === 0 ? 22 : i % 3 === 1 ? 16 : 10; // Varied pixel sizes for organic sketch feel
      return {
        id: i,
        top,
        left,
        delay: i * 0.5,
        size
      };
    });
    setStars(generatedStars);
  }, []);

  // Update theme class
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('pivot_theme', theme);
  }, [theme]);

  // Synchronize state values into localStorage
  useEffect(() => {
    localStorage.setItem('pivot_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('pivot_completed_days', JSON.stringify(completedDays));
  }, [completedDays]);

  useEffect(() => {
    localStorage.setItem('pivot_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('pivot_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('pivot_journal_note', journalNote);
  }, [journalNote]);

  // Default to first incomplete day
  useEffect(() => {
    const firstUncompleted = DEFAULT_ROADMAP.find(item => !completedDays.includes(item.day));
    if (firstUncompleted) {
      setActiveDayNumber(firstUncompleted.day);
    } else {
      setActiveDayNumber(1);
    }
  }, []);

  const formatDateStr = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const streakCount = React.useMemo(() => {
    if (logs.length === 0) return 0;
    
    const uniqueDates = new Set(logs.map(l => l.date));
    let streak = 0;
    const checkDate = new Date();
    const todayStr = formatDateStr(checkDate);
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDateStr(yesterday);

    if (!uniqueDates.has(todayStr) && !uniqueDates.has(yesterdayStr)) {
      return 0;
    }

    let activeDate = uniqueDates.has(todayStr) ? checkDate : yesterday;
    while (true) {
      const activeDateStr = formatDateStr(activeDate);
      if (uniqueDates.has(activeDateStr)) {
        streak++;
        activeDate.setDate(activeDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }, [logs]);

  const hasActivityInLast24Hours = React.useMemo(() => {
    if (logs.length === 0) return false;
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    return logs.some(l => {
      const ts = l.timestamp || new Date(l.date + 'T12:00:00').getTime();
      return ts >= twentyFourHoursAgo;
    });
  }, [logs]);

  const triggerToast = (msg: string) => {
    setToastNotification(msg);
    setTimeout(() => {
      setToastNotification(null);
    }, 4000);
  };

  const runBadgeEvaluation = (
    currentXp: number,
    currentLogs: StudyLog[],
    currentCompleted: number[]
  ) => {
    const totalProblems = currentLogs.reduce((acc, curr) => acc + curr.problemsCount, 0);
    const nowISO = new Date().toISOString();

    let unlockedAtLeastOne = false;

    const evaluatedBadges = badges.map(badge => {
      if (badge.unlockedAt !== null) return badge;

      let shouldUnlock = false;
      switch (badge.id) {
        case 'first_commit':
          shouldUnlock = currentLogs.length > 0;
          break;
        case 'determined_solver':
          const todayStr = formatDateStr(new Date());
          shouldUnlock = currentLogs.some(l => l.date < todayStr);
          break;
        case 'consistent_coder':
          shouldUnlock = streakCount >= 3;
          break;
        case 'unstoppable':
          shouldUnlock = streakCount >= 7;
          break;
        case 'pattern_master':
          shouldUnlock = totalProblems >= 10;
          break;
        case 'architecture_explorer':
          shouldUnlock = currentCompleted.includes(29) || currentCompleted.includes(30);
          break;
        case 'pivot_champion':
          shouldUnlock = currentCompleted.length >= 5;
          break;
        case 'supernova_spark':
          shouldUnlock = currentLogs.some(l => l.duration >= 60);
          break;
      }

      if (shouldUnlock) {
        unlockedAtLeastOne = true;
        triggerToast(`Medal earned: "${badge.title}"!`);
        return { ...badge, unlockedAt: nowISO };
      }
      return badge;
    });

    if (unlockedAtLeastOne) {
      setBadges(evaluatedBadges);
    }
  };

  const handleCompleteMission = (
    day: number,
    problemName: string,
    difficulty: 'Easy' | 'Medium' | 'Hard',
    duration: number,
    notesText: string
  ) => {
    const todayStr = formatDateStr(new Date());
    const matchedDay = DEFAULT_ROADMAP.find(item => item.day === day);
    if (!matchedDay) return;

    const difficultyXp = difficulty === 'Easy' ? 100 : difficulty === 'Medium' ? 120 : 150;
    const customXpEarned = difficultyXp;

    const newLog: StudyLog = {
      id: Date.now().toString(),
      date: todayStr,
      problemsCount: 1,
      duration: duration,
      notes: notesText || `Completed Day ${day}: ${problemName}`,
      journalEntry: notesText || `Practiced custom question for Day ${day}.`,
      conceptsMastered: [matchedDay.topic, matchedDay.pattern],
      xpEarned: customXpEarned,
      isTodayTarget: true,
      dayNumber: day,
      problemName: problemName,
      difficulty: difficulty,
      timestamp: Date.now()
    };

    setLogs(prevLogs => {
      const updatedLogs = [newLog, ...prevLogs];
      
      const newCompleted: number[] = [];
      updatedLogs.forEach(l => {
        if (l.dayNumber !== undefined && !newCompleted.includes(l.dayNumber)) {
          newCompleted.push(l.dayNumber);
        }
      });

      setXp(prev => {
        const updatedXp = prev + customXpEarned;
        runBadgeEvaluation(updatedXp, updatedLogs, newCompleted);
        return updatedXp;
      });

      return updatedLogs;
    });

    triggerToast(`Gained +${customXpEarned} XP for logging "${problemName}"!`);
  };

  const handleSaveQuickJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalNote.trim()) return;

    const todayStr = formatDateStr(new Date());
    const xpReward = 50;
    const newLog: StudyLog = {
      id: Date.now().toString(),
      date: todayStr,
      problemsCount: 0,
      duration: 15,
      notes: `Quick study journal note`,
      journalEntry: journalNote.trim(),
      conceptsMastered: ["Scribbled Insight"],
      xpEarned: xpReward,
      isTodayTarget: false,
      timestamp: Date.now()
    };

    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    setXp(prev => prev + xpReward);
    setJournalNote('');

    triggerToast(`Journal note filed! +50 XP.`);
    runBadgeEvaluation(xp + xpReward, updatedLogs, completedDays);
  };

  const handleAddBackdatedLog = (selectedDate: string, duration: number, problems: number, notesText: string) => {
    const xpReward = 50 + (problems - 1) * 20;
    const updatedXp = xp + xpReward;

    const newLog: StudyLog = {
      id: Date.now().toString(),
      date: selectedDate,
      problemsCount: problems,
      duration: duration,
      notes: notesText || 'Retrospective practice hour.',
      journalEntry: notesText || 'Retrospective record.',
      conceptsMastered: ['Manual Catchup'],
      xpEarned: xpReward,
      isTodayTarget: false,
      timestamp: new Date(selectedDate).getTime()
    };

    const updatedLogs = [newLog, ...logs].sort((a, b) => b.date.localeCompare(a.date));

    setXp(updatedXp);
    setLogs(updatedLogs);

    triggerToast(`Captured previous study for ${selectedDate}! +${xpReward} XP.`);
    runBadgeEvaluation(updatedXp, updatedLogs, completedDays);
  };

  const handleTriggerEditLog = (log: StudyLog) => {
    setEditingLog(log);
    setIsEditModalOpen(true);
  };

  const handleUpdateLog = (updatedLog: StudyLog) => {
    setLogs(prevLogs => {
      const oldLog = prevLogs.find(l => l.id === updatedLog.id);
      if (!oldLog) return prevLogs;

      // Recalculate individual log XP based on difficulty changes for quest checkpoints
      let newXpEarned = updatedLog.xpEarned;
      if (updatedLog.isTodayTarget && updatedLog.difficulty) {
        newXpEarned = updatedLog.difficulty === 'Easy' ? 100 : updatedLog.difficulty === 'Medium' ? 120 : 150;
      }
      updatedLog.xpEarned = newXpEarned;

      const updatedLogs = prevLogs.map(l => l.id === updatedLog.id ? updatedLog : l);

      // Recompute completedDays list
      const newCompletedDays: number[] = [];
      updatedLogs.forEach(l => {
        if (l.dayNumber !== undefined && !newCompletedDays.includes(l.dayNumber)) {
          newCompletedDays.push(l.dayNumber);
        }
      });

      // Sum exact logs XP to ensure consistent calculation
      const totalCollectedXp = updatedLogs.reduce((sum, current) => sum + current.xpEarned, 0);

      setXp(totalCollectedXp);
      runBadgeEvaluation(totalCollectedXp, updatedLogs, newCompletedDays);
      return updatedLogs;
    });

    triggerToast(`Log correction successfully committed! 🎀`);
  };

  const handleTriggerLogDate = (dateStr: string) => {
    const existingLog = logs.find(l => l.date === dateStr);
    if (existingLog) {
      triggerToast(`Already practiced on ${dateStr}: "${existingLog.notes}"`);
      return;
    }
    setModalPreSelectedDate(dateStr);
    setIsLogModalOpen(true);
  };

  const handleDeleteLog = (id: string, logXp: number, dayNumber?: number) => {
    setConfirmModal({
      isOpen: true,
      title: "Recycle Log Entry",
      message: "Are you sure you want to throw this study slot into the trash pile? XP and completed milestones will be adjusted accordingly.",
      confirmText: "Yes, Delete",
      cancelText: "Keep Entry",
      variant: "danger",
      onConfirm: () => {
        setLogs(prevLogs => {
          const updatedLogs = prevLogs.filter(l => l.id !== id);

          const newCompletedDays: number[] = [];
          updatedLogs.forEach(l => {
            if (l.dayNumber !== undefined && !newCompletedDays.includes(l.dayNumber)) {
              newCompletedDays.push(l.dayNumber);
            }
          });

          const totalCollectedXp = updatedLogs.reduce((sum, current) => sum + current.xpEarned, 0);

          setXp(totalCollectedXp);
          runBadgeEvaluation(totalCollectedXp, updatedLogs, newCompletedDays);
          return updatedLogs;
        });

        triggerToast("Entry recycled! Space dust has settled.");
      }
    });
  };

  const handleResetProgress = () => {
    setConfirmModal({
      isOpen: true,
      title: "Unlock All Checkpoints",
      message: "Are you sure? This will clear all 90 checklist checkpoints on your milestone register so you can start over.",
      confirmText: "Yes, Unlock All",
      cancelText: "Cancel",
      variant: "warning",
      onConfirm: () => {
        setLogs(prev => prev.map(l => ({ ...l, dayNumber: undefined })));
        triggerToast("All checkpoint checkboxes unlocked!");
      }
    });
  };

  const handleExportBackup = () => {
    const backupData = {
      pivot_logs: logs,
      pivot_completed_days: completedDays,
      pivot_badges: badges,
      pivot_xp: xp,
      version: '2.0'
    };
    const fileData = JSON.stringify(backupData, null, 2);
    const blob = new Blob([fileData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `my_study_journey_backup.json`;
    link.click();
    URL.revokeObjectURL(url);
    triggerToast("Progress download complete! Stash this json file safety.");
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.pivot_logs)) {
          setLogs(parsed.pivot_logs);
          if (parsed.pivot_badges) setBadges(parsed.pivot_badges);
          if (typeof parsed.pivot_xp === 'number') setXp(parsed.pivot_xp);
          triggerToast("Progress loaded! Journey successfully synchronized.");
        } else {
          alert("We didn't recognize that backup format.");
        }
      } catch (err) {
        alert("Oops! Could not decode that JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const handleFactoryReset = () => {
    setConfirmModal({
      isOpen: true,
      title: "WIPE OUT MY NOTEBOOK (IRREVERSIBLE)",
      message: "This will permanently delete all your offline notes, streaks, completed milestones, and earned medals forever. This cannot be undone!",
      confirmText: "Wipe everything",
      cancelText: "No, save it",
      variant: "danger",
      onConfirm: () => {
        localStorage.clear();
        setLogs([]);
        setXp(0);
        setBadges(DEFAULT_BADGES);
        setJournalNote('');
        setActiveDayNumber(1);
        triggerToast("All clean! You are a Recursive Rookie again.");
      }
    });
  };

  const userStats: UserStats = {
    xp: xp,
    currentLevel: getLevelForXp(xp).level,
    streak: streakCount,
    problemsSolved: logs.reduce((sum, l) => sum + l.problemsCount, 0),
    totalTimeMinutes: logs.reduce((sum, l) => sum + l.duration, 0),
    daysStudied: new Set(logs.map(l => l.date)).size
  };

  const currentLevelInfo = getLevelForXp(xp);
  const activeDayItem = DEFAULT_ROADMAP.find(i => i.day === activeDayNumber) || DEFAULT_ROADMAP[0];

  return (
    <div className={`min-h-screen transition-colors duration-300 relative overflow-hidden pb-16 selection:bg-pink-orchid selection:text-dark-amethyst bg-grid-paper ${
      theme === 'dark' ? 'dark bg-[#191939] text-slate-100' : 'bg-[#fffaef] text-dark-amethyst'
    } font-sans`}>
      
      {/* Soft Sparkling Twinkling Stars (Glowy, cute, and placed perfectly in side margins) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute transition-opacity duration-1000 animate-twinkle"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.id % 2 === 0 ? '4.5s' : '7s'}`,
            }}
          >
            <svg
              className="w-full h-full text-amber-400 dark:text-yellow-200 drop-shadow-[0_0_6px_rgba(245,158,11,0.95)] dark:drop-shadow-[0_0_10px_rgba(253,224,71,1)]"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 0c.15 3.5 1.5 5.5 5.5 5.65-3.5.15-5.35 1.5-5.5 5.5-.15-3.5-1.5-5.35-5.5-5.5 3.5-.15 5.35-1.5 5.5-5.65z" />
            </svg>
          </div>
        ))}
      </div>
      
      {/* Main Toast Notifications */}
      <AnimatePresence>
        {toastNotification && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-55 bg-amber-300 dark:bg-amber-400 text-slate-950 font-bold px-6 py-3 border-2 border-slate-950 rounded-full shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex items-center gap-2 max-w-sm"
          >
            <Sparkles className="w-4 h-4 text-indigo-700 shrink-0" />
            <span className="text-xs">{toastNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Layout Container */}
      <div className="max-w-6xl mx-auto px-4 pt-6 relative z-10">
        
        {/* Playful Sketch Header Accent */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b-2 border-slate-800 dark:border-pink-orchid/30">
          
          {/* Logo & Sarcastic subtitle */}
          <div className="text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl font-black tracking-wide font-display text-slate-900 dark:text-pink-orchid flex items-center justify-center md:justify-start gap-1.5 pt-1">
              Spilling Tea on LeetCode
            </h1>
            <p className="text-xs text-dusty-grape dark:text-pink-orchid/70 mt-2 font-medium">
              Staring at recursive stack overflows is better with a cozy 90-day sketchbook journal and zero pressure.
            </p>
          </div>

          {/* Quick Header Stats and Theme Toggles */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            
            {/* Real Stats Pill - Integrates the scribbly Sun/Moon theme button inside right next to the rank copier! */}
            <div className="bg-white dark:bg-[#140e28] border-2 border-slate-800 dark:border-pink-orchid/40 px-4 py-2.5 rounded-full flex items-center gap-3 text-xs font-bold shadow-[3px_3px_0px_0px_rgba(30,41,59,1)] dark:shadow-[3px_3px_0px_0px_rgba(224,177,203,0.15)] text-slate-800 dark:text-slate-200">
              <span 
                className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400"
                title={hasActivityInLast24Hours ? "Streak Secured! Active in the last 24 hours ✓" : "Solve any question to secure active streak!"}
              >
                Streak: {streakCount} Days {hasActivityInLast24Hours ? "🟢" : "⚡"}
              </span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="text-medium-slate-blue dark:text-[#cbb2fe] font-display">
                {currentLevelInfo.name} ({xp} XP)
              </span>
              
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-1 rounded-full border border-dashed border-slate-800 dark:border-pink-orchid/45 hover:bg-slate-50 dark:hover:bg-pink-orchid/15 transition-all cursor-pointer flex items-center justify-center"
                title="Toggle day/night cycle"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-300 stroke-[2.5]" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600 stroke-[2.5]" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* CURATED MINIMAL TABS (Fully responsive, organic layout) */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => setActiveTab('quests')}
            className={`px-5 py-2.5 rounded-full border-2 border-slate-800 dark:border-pink-orchid/40 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(30,41,59,1)] dark:shadow-[3px_3px_0px_0px_rgba(224,177,203,0.15)] active:translate-y-px ${
              activeTab === 'quests'
                ? 'bg-amber-300 text-slate-950 dark:bg-bright-lavender dark:text-dark-amethyst font-extrabold border-slate-800'
                : 'bg-white text-slate-800 hover:bg-slate-50 dark:bg-[#1f1a3a] dark:text-[#dec0f1] dark:hover:bg-[#2d224e] dark:border-pink-orchid/40'
            }`}
          >
            90 Checkpoint Quests
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`px-5 py-2.5 rounded-full border-2 border-slate-800 dark:border-pink-orchid/40 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(30,41,59,1)] dark:shadow-[3px_3px_0px_0px_rgba(224,177,203,0.15)] active:translate-y-px ${
              activeTab === 'journal'
                ? 'bg-amber-300 text-slate-950 dark:bg-bright-lavender dark:text-dark-amethyst font-extrabold border-slate-800'
                : 'bg-white text-slate-800 hover:bg-slate-50 dark:bg-[#1f1a3a] dark:text-[#dec0f1] dark:hover:bg-[#2d224e] dark:border-pink-orchid/40'
            }`}
          >
            Achievements & Past logs
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-5 py-2.5 rounded-full border-2 border-slate-800 dark:border-pink-orchid/40 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(30,41,59,1)] dark:shadow-[3px_3px_0px_0px_rgba(224,177,203,0.15)] active:translate-y-px ${
              activeTab === 'backup'
                ? 'bg-amber-300 text-slate-950 dark:bg-bright-lavender dark:text-dark-amethyst font-extrabold border-slate-800'
                : 'bg-white text-slate-800 hover:bg-slate-50 dark:bg-[#1f1a3a] dark:text-[#dec0f1] dark:hover:bg-[#2d224e] dark:border-pink-orchid/40'
            }`}
          >
            Backup & Storage
          </button>
        </div>

        {/* Tab 1: Quests (Daily checkpoints) */}
        {activeTab === 'quests' && (
          <div className="max-w-6xl mx-auto w-full px-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch w-full">
              
              {/* Left Column: Active Day Notebook Study Card */}
              <div className="flex flex-col h-full">
                <MissionCard
                  dayItem={activeDayItem}
                  dayLogs={logs.filter(l => l.dayNumber === activeDayItem.day)}
                  onComplete={handleCompleteMission}
                  onDeleteLog={handleDeleteLog}
                  onEditLog={handleTriggerEditLog}
                  isCompleted={completedDays.includes(activeDayItem.day)}
                />
              </div>

              {/* Right Column: Curriculum Quest Board */}
              <div className="flex flex-col h-full">
                <RoadmapExplorer
                  roadmap={DEFAULT_ROADMAP}
                  completedDays={completedDays}
                  activeDay={activeDayNumber}
                  onSelectDay={(day) => setActiveDayNumber(day)}
                />
              </div>

            </div>

            {/* Milestone Checkpoint Bubbles (Grid layout located nicely below both columns) */}
            <div className="bg-white dark:bg-[#140e28] border-2 border-slate-800 dark:border-pink-orchid/40 rounded-3xl p-5 mt-6 shadow-[5px_5px_0px_0px_rgba(30,41,59,1)] dark:shadow-[5px_5px_0px_0px_rgba(224,177,203,0.15)] text-left font-sans relative overflow-hidden">
              
              {/* Cute Scrapbook absolute decor elements */}
              <div className="absolute top-2.5 right-4 flex items-center gap-1.5 select-none pointer-events-none text-rose-500/30 dark:text-rose-450/40 font-display text-sm font-bold animate-bounce-subtle">
                🎀 Scrapbook mode ✨
              </div>
              <div className="absolute -bottom-4 -right-4 text-3xl opacity-[0.06] dark:opacity-[0.1] select-none pointer-events-none rotate-12">
                🌸🧸🍭🍪
              </div>
              <div className="absolute -top-3 left-4 text-2xl opacity-10 select-none pointer-events-none">
                🖇️
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 relative z-10">
                <div>
                  <h3 className="text-sm font-black font-display text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2 leading-none">
                    <span className="text-rose-500 dark:text-pink-300">🎀</span> 
                    Milestone Checkpoint Register 
                    <span className="text-rose-500 dark:text-pink-300">🎀</span>
                  </h3>
                  <p className="text-xs text-dusty-grape dark:text-slate-350 mt-1 leading-relaxed">
                    Collect a unique scrap sticker for each milestone you complete! Tap custom sticker tags to flip your notebook study guide:
                  </p>
                </div>
                <div className="text-[11px] font-bold bg-amber-50 dark:bg-dark-amethyst/30 rounded-md py-1 px-2.5 border border-slate-300 dark:border-pink-orchid/30 shrink-0 self-start sm:self-auto text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span>🍭 {completedDays.length}/90 Unlocked</span>
                </div>
              </div>

              {/* Gridded layout of all fixed 90 checkpoints */}
              <div className="grid gap-x-2 gap-y-3.5 mx-auto max-w-full justify-center grid-cols-6 sm:grid-cols-9 md:grid-cols-[repeat(15,minmax(0,1fr))] relative z-10 py-1">
                {DEFAULT_ROADMAP.map((item) => {
                  const isCompleted = completedDays.includes(item.day);
                  const isActive = activeDayNumber === item.day;
                  const sticker = getStickerForDay(item.day);

                  // Fun organic rotations for a realistic scrapbooking layout
                  const rotClass = item.day % 4 === 0 
                    ? 'rotate-3' 
                    : item.day % 4 === 1 
                    ? '-rotate-3' 
                    : item.day % 4 === 2 
                    ? 'rotate-[1.5deg]' 
                    : '-rotate-[1.5deg]';

                  return (
                    <button
                      key={item.day}
                      onClick={() => setActiveDayNumber(item.day)}
                      className={`w-12 h-12 rounded-2xl border-2 font-black transition-all relative cursor-pointer flex flex-col items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.06)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] hover:scale-110 active:translate-y-px active:shadow-none ${rotClass} ${
                        isActive
                          ? 'bg-amber-300 text-slate-950 border-slate-800 font-extrabold ring-3 ring-amber-100 dark:ring-pink-orchid/20 dark:bg-pink-orchid dark:text-dark-amethyst dark:border-pink-orchid'
                          : isCompleted
                          ? 'bg-amber-50/75 hover:bg-amber-100/90 text-emerald-800 border-slate-800 dark:bg-[#20173f] dark:border-pink-orchid/50 dark:text-pink-orchid'
                          : 'bg-white hover:bg-slate-50 text-slate-400 border-slate-300 dark:bg-[#1a1333] dark:text-slate-450 dark:border-pink-orchid/20 dark:hover:bg-[#201d44]'
                      }`}
                      title={`${item.problemName} (Day ${item.day})`}
                    >
                      {/* Realistic Washi Tape pinned look on Active items */}
                      {isActive && (
                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-7 h-2 bg-yellow-300/80 dark:bg-yellow-400/80 border border-dashed border-yellow-400/50 rotate-3 rounded-xs shadow-[1px_1px_1px_rgba(0,0,0,0.05)] pointer-events-none z-10" />
                      )}

                      {isCompleted ? (
                        <div className="flex flex-col items-center justify-center relative">
                          <span className="text-xl leading-none select-none drop-shadow-sm transform hover:scale-120 duration-200">
                            {sticker}
                          </span>
                          <span className="text-[8px] font-black tracking-tighter text-slate-600 dark:text-pink-orchid/70 mt-[1.5px] leading-none">
                            D{item.day}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center opacity-85 hover:opacity-100">
                          <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 leading-none">
                            {item.day}
                          </span>
                          <span className="text-[9px] text-slate-300 dark:text-pink-orchid/15 mt-[3px] select-none leading-none">
                            🎀
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Achievements, archives & stats */}
        {activeTab === 'journal' && (
          <div className="space-y-6">
            
            {/* Grid level info & Heatmap combo */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Level progress info */}
              <div className="lg:col-span-4">
                <BadgeRack stats={userStats} badges={badges} />
              </div>

              {/* Heatmap consistent logs */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* Micro consistent tracker */}
                <Heatmap
                  logs={logs}
                  onSelectDate={handleTriggerLogDate}
                  streak={streakCount}
                />

                {/* Scribble notepad section */}
                <div className="bg-[#fcfaf2] dark:bg-[#140e28] border-2 border-slate-800 dark:border-pink-orchid/40 rounded-[2rem] p-6 shadow-[5px_5px_0px_0px_rgba(30,41,59,1)] dark:shadow-[5px_5px_0px_0px_rgba(224,177,203,0.15)] text-left relative">
                  {/* binder accent */}
                  <div className="absolute top-2 right-6 font-display font-black text-rose-500/10 dark:text-[#dec0f1]/20 rotate-6 select-none uppercase tracking-wide text-2xl">Scribbles</div>
                  
                  <h3 className="text-xs font-black font-display text-slate-900 dark:text-slate-100 uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
                    Custom Brain Dump
                  </h3>
                  <p className="text-xs text-dusty-grape dark:text-slate-300 mb-4 leading-relaxed font-sans">
                    Scribble random thoughts, venting, or breakthroughs unrelated to the formal LeetCode questions. File them below.
                  </p>
                  
                  <form onSubmit={handleSaveQuickJournal} className="space-y-4">
                    <textarea
                      placeholder="e.g., Felt super unmotivated today but reviewed 10 minutes of sliding windows anyway. Better than absolute zero."
                      rows={3}
                      value={journalNote}
                      onChange={(e) => setJournalNote(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 border-2 border-slate-300 dark:border-pink-orchid/20 rounded-2xl bg-white dark:bg-[#150f2b] focus:outline-none focus:ring-1 focus:ring-medium-slate-blue text-slate-900 dark:text-slate-100 placeholder-slate-450"
                    />
                    <button
                      type="submit"
                      disabled={!journalNote.trim()}
                      className="py-2.5 px-5 bg-medium-slate-blue hover:bg-slate-800 disabled:opacity-40 text-xs font-bold text-white rounded-full border-2 border-slate-800 dark:border-pink-orchid/40 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] active:shadow-none translate-y-0 cursor-pointer uppercase tracking-wider font-extrabold font-display"
                    >
                      File this note (+50 XP)
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* List of past journal logs */}
            <div className="bg-[#fcfaf2] dark:bg-[#140e28] border-2 border-slate-800 dark:border-pink-orchid/40 rounded-[2rem] p-6 shadow-[5px_5px_0px_0px_rgba(30,41,59,1)] dark:shadow-[5px_5px_0px_0px_rgba(224,177,203,0.15)] text-left">
              <h3 className="text-sm font-black font-display text-slate-900 dark:text-slate-100 uppercase tracking-widest flex items-center gap-1.5 mb-4">
                Chronological Archive Entries ({logs.length})
              </h3>
              
              {logs.length > 0 ? (
                <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 rounded-2xl border-2 border-slate-300 dark:border-pink-orchid/20 hover:border-medium-slate-blue transition bg-white dark:bg-[#1a1333]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 overflow-hidden font-sans">
                        <div className="flex flex-wrap items-center gap-2">
                          {log.dayNumber !== undefined && (
                            <span className="text-xl select-none mr-0.5" title={`Day ${log.dayNumber} Sticker Reward`}>
                              {getStickerForDay(log.dayNumber)}
                            </span>
                          )}
                          <span className="text-[10px] font-bold font-mono text-slate-800 bg-slate-100 dark:bg-dark-amethyst px-2 py-0.5 rounded border border-slate-300 dark:border-pink-orchid/30 dark:text-slate-200">
                            {log.date}
                          </span>
                          {log.problemsCount > 0 && (
                            <span className="text-[10.5px] font-black text-rose-600 dark:text-rose-400">
                              practiced: {log.problemName || `${log.problemsCount} questions`}
                            </span>
                          )}
                          <span className="text-[10px] font-bold text-dusty-grape dark:text-slate-300">
                            {log.duration} mins
                          </span>
                          <span className="text-[10.5px] font-black text-medium-slate-blue dark:text-cyan-300">
                            +{log.xpEarned} XP
                          </span>
                        </div>
                        <p className="text-xs text-slate-900 dark:text-slate-200 font-sans italic mt-1 bg-slate-50 dark:bg-[#150f2b]/60 p-2.5 rounded-lg border border-dashed border-slate-300 dark:border-pink-orchid/15">
                          "{log.journalEntry || log.notes}"
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 self-center sm:self-auto">
                        <button
                          onClick={() => handleTriggerEditLog(log)}
                          className="p-2 text-indigo-650 hover:bg-slate-100 dark:text-[#dec0f1] dark:hover:bg-pink-orchid/15 rounded-xl transition cursor-pointer border-2 border-slate-800 dark:border-pink-orchid/40 bg-white dark:bg-[#150f2b] text-xs font-bold font-sans"
                          title="Correct log entry"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLog(log.id, log.xpEarned, log.dayNumber)}
                          className="p-2 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/20 rounded-xl transition cursor-pointer border-2 border-slate-800 dark:border-pink-orchid/40 bg-white dark:bg-[#150f2b] text-xs font-bold font-sans"
                          title="Delete log"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-xs text-dusty-grape dark:text-slate-400 flex flex-col items-center justify-center gap-2">
                  <Notebook className="w-8 h-8 text-dusty-grape/40" />
                  Your sketchbook diary pages are currently empty!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Backup & Storage */}
        {activeTab === 'backup' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-[#fcfaf2] dark:bg-[#140e28] border-2 border-slate-800 dark:border-pink-orchid/40 rounded-3xl p-6 sm:p-8 text-left text-xs text-slate-800 dark:text-slate-205 space-y-4 shadow-[5px_5px_0px_0px_rgba(30,41,59,1)] dark:shadow-[5px_5px_0px_0px_rgba(224,177,203,0.15)] font-sans">
              <h3 className="text-sm font-black font-display text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                Progress Storage & Backups
              </h3>
              <p className="leading-relaxed">
                <b>Absolutely!</b> Because this is a static site, <b>105% of your progress</b> (completed milestones, total XP, custom scribbles, and unlocked medals) is saved right inside your browser's local safety vaults (<code>localStorage</code>).
              </p>
              <p className="leading-relaxed">
                Since there is no complex cloud database tracking your passwords, your data remains fully private offline. Protect your progress using these backup tools below:
              </p>

              {/* Micro Backup buttons stack */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                
                {/* Export backup JSON */}
                <button
                  onClick={handleExportBackup}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-850 dark:text-slate-200 font-bold rounded-lg border-2 border-slate-800 dark:border-pink-orchid/40 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] dark:shadow-[2px_2px_0px_0px_rgba(224,177,203,0.15)] hover:translate-y-px active:shadow-none cursor-pointer text-xs font-sans"
                >
                  <FileDown className="w-4 h-4 text-medium-slate-blue shrink-0" />
                  Backup Progress file (.json)
                </button>

                {/* Export/Import triggers */}
                <label className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-850 dark:text-slate-200 font-bold rounded-lg border-2 border-slate-800 dark:border-pink-orchid/40 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] dark:shadow-[2px_2px_0px_0px_rgba(224,177,203,0.15)] hover:translate-y-px active:shadow-none cursor-pointer text-xs font-sans">
                  <FileUp className="w-4 h-4 text-emerald-600 shrink-0" />
                  Restore from file
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>

                {/* Full factory clean */}
                <button
                  onClick={handleFactoryReset}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-50 text-rose-800 hover:bg-rose-100 font-bold rounded-lg border-2 border-rose-450 dark:border-rose-500/50 cursor-pointer text-xs font-sans"
                >
                  Factory Wipe out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FACTUAL EXPLANATION & CHEAT CODES SAFE STORAGE (No unrequested Settings Tab) */}
        <footer className="mt-12 pt-8 border-t-2 border-slate-800 dark:border-pink-orchid/20 text-center">
          {/* Humble credits line */}
          <p className="text-[11px] text-dusty-grape dark:text-slate-400 font-mono">
            Lovingly hand-sketched. Offline, static, and private. Let's make it work!
          </p>
        </footer>

        {/* Modal for backdating logs */}
        <LogSessionModal
          isOpen={isLogModalOpen}
          onClose={() => setIsLogModalOpen(false)}
          onAddLog={handleAddBackdatedLog}
          preSelectedDate={modalPreSelectedDate}
        />

        {/* Modal for correcting logs */}
        <EditSessionModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingLog(null);
          }}
          log={editingLog}
          onUpdateLog={handleUpdateLog}
        />

        {/* Custom Confirmation Dialog */}
        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmText={confirmModal.confirmText}
          cancelText={confirmModal.cancelText}
          variant={confirmModal.variant}
          onConfirm={() => {
            confirmModal.onConfirm();
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
          }}
          onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        />
      </div>
    </div>
  );
}
