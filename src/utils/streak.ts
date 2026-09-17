import { UserState } from '../types';

export const getLocalDateString = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getYesterdayDateString = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getLocalDateString(d);
};

export interface DayStreakStatus {
  dateStr: string;
  dayNum: number;
  dayName: string;
  fullDateLabel: string;
  isToday: boolean;
  isEngaged: boolean;
}

export const getStreakMilestones = (currentStreak: number) => {
  const milestones = [3, 7, 14, 30, 60, 100];
  const next = milestones.find(m => m > currentStreak) || (currentStreak + 10);
  const prev = [...milestones].reverse().find(m => m <= currentStreak) || 0;
  const progressPercent = Math.min(100, Math.round(((currentStreak - prev) / (next - prev)) * 100));
  return {
    currentStreak,
    nextMilestone: next,
    prevMilestone: prev,
    daysRemaining: Math.max(0, next - currentStreak),
    progressPercent: Math.max(5, progressPercent)
  };
};

export const getLast7DaysStreak = (activityDates: string[] = []): DayStreakStatus[] => {
  const todayStr = getLocalDateString();
  const thaiDays = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
  
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = getLocalDateString(d);
    const dayName = thaiDays[d.getDay()];
    const isToday = dateStr === todayStr;
    const isEngaged = activityDates.includes(dateStr) || isToday;
    
    return {
      dateStr,
      dayNum: d.getDate(),
      dayName,
      fullDateLabel: `${d.getDate()}/${d.getMonth() + 1}`,
      isToday,
      isEngaged
    };
  });
};

export const calculateUpdatedStreak = (prevState: UserState): Partial<UserState> => {
  const today = getLocalDateString();
  const yesterday = getYesterdayDateString();

  const lastDate = prevState.lastActiveDate;
  const currentStreak = prevState.dailyStreak ?? 1;
  const currentMax = prevState.maxStreak ?? currentStreak;
  const prevActivity = prevState.activityDates ?? [];

  let newStreak = currentStreak;
  let newMax = currentMax;
  let streakClaimedToday = prevState.streakClaimedToday ?? false;

  const activityDates = prevActivity.includes(today) 
    ? prevActivity 
    : [...prevActivity, today];

  if (!lastDate) {
    // First active session
    newStreak = 1;
    newMax = Math.max(1, newMax);
    streakClaimedToday = false;
  } else if (lastDate === today) {
    // Already active today
    newStreak = Math.max(1, currentStreak);
  } else if (lastDate === yesterday) {
    // Consecutive active day!
    newStreak = currentStreak + 1;
    newMax = Math.max(newMax, newStreak);
    streakClaimedToday = false; // reset claim for new day
  } else {
    // Missed one or more days - reset streak to 1
    newStreak = 1;
    streakClaimedToday = false;
  }

  return {
    dailyStreak: newStreak,
    maxStreak: newMax,
    lastActiveDate: today,
    activityDates,
    streakClaimedToday
  };
};
