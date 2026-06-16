export interface StudyLog {
  id: string;
  date: string; // YYYY-MM-DD
  problemsCount: number;
  duration: number; // in minutes
  notes: string;
  journalEntry?: string; // rich retrospective diary paragraph
  conceptsMastered?: string[]; // tags like "HashMaps", "Pointers"
  xpEarned: number;
  isTodayTarget: boolean;
  dayNumber?: number; // corresponding roadmap day, if any
  problemName?: string;
  difficulty?: ProblemDifficulty;
  timestamp?: number; // millisecond epoch timestamp of when custom entry was filed
}

export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard';
export type DayType = 'coding' | 'system-design' | 'behavioral';

export interface RoadmapDay {
  day: number;
  topic: string;
  pattern: string;
  problemName: string;
  difficulty: ProblemDifficulty;
  link: string;
  type: DayType;
  xpReward: number;
  tips: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'streak' | 'problems' | 'levels' | 'accountability' | 'special';
  unlockedAt: string | null; // ISO Date String when unlocked
}

export interface UserStats {
  xp: number;
  currentLevel: number;
  streak: number;
  problemsSolved: number;
  totalTimeMinutes: number;
  daysStudied: number;
}

export interface PartnerState {
  name: string;
  email: string;
  studyTarget: number; // e.g., 5 days/week
  streak: number;
  logs: { id: string; date: string; completed: boolean; note: string }[];
}

export interface RivalState {
  name: string;
  level: number;
  xp: number;
  streak: number;
  problemsSolved: number;
  avatarUrl: string;
  statusQuote: string;
  lastActive: string;
  logs: { id: string; date: string; problemsCount: number; phrase: string }[];
}
