export interface Lesson {
  id: number;
  title: string;
  dur: string;
  desc: string;
  learn: string[];
  exercise: string;
  youtubeId?: string;
  videoSimulatorUrl?: string;
  category?: string;
  instructor?: string;
}

export interface VideoItem {
  id: number;
  title: string;
  cat: string;
  dur: string;
  youtubeId?: string;
  previewColor?: string;
  description?: string;
  views?: string;
  instructor?: string;
}

export interface MediaCategory {
  id: string;
  icon: string;
  name: string;
  count: number;
  ext: string;
  desc: string;
  size: string;
}

export interface QuizQuestion {
  q: string;
  o: string[];
  a: number;
  explanation?: string;
}

export interface MinigameInfo {
  id: string;
  icon: string;
  name: string;
  desc: string;
  difficulty: 'ง่าย' | 'ปานกลาง' | 'ท้าทาย';
  coverImage?: string;
  themeGradient?: string;
  badgeText?: string;
}

export interface WorkshopProject {
  id: number;
  title: string;
  desc: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  deliverable: string;
  tags: string[];
  youtubeId?: string;
  instructor?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  cat: string;
  readTime: string;
  date: string;
  content: string;
  highlight: string;
  coverImage: string;
  author?: string;
  tags?: string[];
  practicalFormula?: { label: string; value: string; note: string }[];
  keySteps?: { stepNumber: number; title: string; detail: string; shortcut?: string }[];
  proTips?: string[];
  mistakesToAvoid?: string[];
}

export interface AchievementBadge {
  id: string;
  icon: string;
  name: string;
  desc: string;
  condition: string;
}

export interface GameScoreRecord {
  score: number;
  time: number;
  date: string;
}

export interface WorkshopSubmission {
  projectId: number;
  projectTitle: string;
  projectUrl?: string;
  submissionType?: 'file' | 'link' | 'both';
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  fileDataUrl?: string;
  notes: string;
  submittedAt: string;
  grade: string;
  score: number;
  feedback: string;
  softwareVersion?: string;
  keyTechniques?: string[];
  techniquesUsed?: string[];
  criteriaScores?: {
    pacing: number;
    color: number;
    audio: number;
    creativity: number;
    creative?: number;
  };
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  topic?: string;
  senderUid?: string;
  createdAt?: string;
  updatedAt?: string;
  timestamp?: string;
  status?: 'pending' | 'in_review' | 'resolved' | 'ได้รับแล้ว' | 'กำลังตรวจสอบ' | 'ตอบกลับแล้ว';
  adminNotes?: string;
  ticketId?: string;
}

export interface ShortcutItem {
  id: string;
  name: string;
  description: string;
  category: 'Tools' | 'Timeline' | 'Playback' | 'Audio' | 'Export';
  windowsKey: string;
  macKey: string;
}

export interface GoogleAccountInfo {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export interface UserState {
  googleAccount?: GoogleAccountInfo | null;
  completedLessons: number[];
  bookmarks?: number[];
  bookmarkedLessons?: number[];
  notes?: Record<number, string>;
  lessonNotes?: Record<number, string>;
  favVideos: number[];
  recentVideos: number[];
  quizBest: number | null;
  quizHistory: number[];
  gameScores: Record<string, GameScoreRecord[]>;
  gamesPlayed: number;
  studyMinutes: number;
  points: number;
  badges: string[];
  profileName: string;
  bio?: string;
  skillLevel?: 'Beginner' | 'Intermediate' | 'Professional' | string;
  learningGoal?: string;
  portfolioUrl?: string;
  customAvatarUrl?: string;
  avatarType?: 'emoji' | 'custom' | 'google';
  avatarIcon?: string;
  avatarId?: string;
  joinedDate?: string;
  recentLessons: string[];
  dailyStreak?: number;
  maxStreak?: number;
  lastActiveDate?: string;
  activityDates?: string[];
  streakClaimedToday?: boolean;
  workshopSubmissions?: Record<number, WorkshopSubmission>;
  contactMessages?: ContactMessage[];
}

export interface CertificateRecord {
  certId: string;
  studentName: string;
  studentEmail?: string;
  studentUid?: string;
  issueDate: string;
  issueDateEn?: string;
  score?: number;
  totalXp?: number;
  courseTitle: string;
  verified: boolean;
  createdAt: string;
  instructorName?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'inquiry' | 'workshop' | 'system' | 'badge' | 'quiz';
  targetUid?: string; // specific user UID, or 'admin', or undefined for broadcast
  recipientEmail?: string;
  read: boolean;
  readBy?: string[]; // user UIDs who have marked it as read
  link?: string;
  createdAt: string;
}

