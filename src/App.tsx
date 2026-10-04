import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Instructor } from './components/Instructor';
import { LessonsSection } from './components/LessonsSection';
import { EbookSection } from './components/EbookSection';
import { VideosSection } from './components/VideosSection';
import { MediaSection } from './components/MediaSection';
import { QuizSection } from './components/QuizSection';
import { GamesSection } from './components/GamesSection';
import { WorkshopSection } from './components/WorkshopSection';
import { BlogSection } from './components/BlogSection';
import { DashboardSection } from './components/DashboardSection';
import { ProfileSection } from './components/ProfileSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { Toast } from './components/Toast';
import { CertificateModal } from './components/CertificateModal';
import { CertificateVerificationModal } from './components/CertificateVerificationModal';
import { WorkshopFeedbackModal } from './components/WorkshopFeedbackModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { ControllerInquiriesModal } from './components/ControllerInquiriesModal';
import { UserState, Lesson, WorkshopSubmission, ContactMessage, GoogleAccountInfo, AppNotification } from './types';
import { LESSONS_DATA } from './data/masterclassData';
import { triggerLessonCompletionConfetti, triggerBadgeUnlockConfetti } from './utils/confetti';
import { calculateUpdatedStreak } from './utils/streak';
import { 
  subscribeToAuth, 
  signInWithGoogle, 
  signOutGoogle, 
  saveUserDataToCloud, 
  loadUserDataFromCloud,
  validateFirestoreConnection,
  isUserAdmin,
  subscribeToNotifications,
  markNotificationAsReadInFirestore,
  markAllNotificationsAsReadInFirestore,
  sendSystemNotification
} from './lib/firebase';

import { Bot, Keyboard, Award, Download } from 'lucide-react';

const THEME_KEY = 'premiere_masterclass_theme';
const GUEST_STORAGE_KEY = 'premiere_masterclass_guest_v3';
const LAST_AUTH_UID_KEY = 'premiere_masterclass_active_uid';

const DEFAULT_STATE: UserState = {
  completedLessons: [],
  favVideos: [],
  recentVideos: [],
  quizBest: null,
  quizHistory: [],
  gameScores: {},
  gamesPlayed: 0,
  studyMinutes: 0,
  points: 0,
  badges: [],
  profileName: 'นักตัดต่อฝึกหัด',
  recentLessons: [],
  bookmarks: [],
  notes: {},
  workshopSubmissions: {},
  contactMessages: [],
  avatarIcon: '🎬',
  joinedDate: 'กรกฎาคม 2569',
  dailyStreak: 1,
  maxStreak: 1,
  lastActiveDate: '',
  activityDates: [],
  streakClaimedToday: false
};

function getStorageKeyForUid(uid?: string | null): string {
  if (uid && uid.trim()) {
    return `premiere_masterclass_user_${uid.trim()}`;
  }
  return GUEST_STORAGE_KEY;
}

function sanitizeUserState(raw: any): UserState {
  if (!raw || typeof raw !== 'object') {
    return { ...DEFAULT_STATE };
  }
  return {
    ...DEFAULT_STATE,
    ...raw,
    completedLessons: Array.isArray(raw.completedLessons) ? raw.completedLessons : [],
    favVideos: Array.isArray(raw.favVideos) ? raw.favVideos : [],
    recentVideos: Array.isArray(raw.recentVideos) ? raw.recentVideos : [],
    quizHistory: Array.isArray(raw.quizHistory) ? raw.quizHistory : [],
    gameScores: typeof raw.gameScores === 'object' && raw.gameScores ? raw.gameScores : {},
    gamesPlayed: typeof raw.gamesPlayed === 'number' ? raw.gamesPlayed : 0,
    studyMinutes: typeof raw.studyMinutes === 'number' ? raw.studyMinutes : 0,
    points: typeof raw.points === 'number' ? raw.points : 0,
    badges: Array.isArray(raw.badges) ? raw.badges : [],
    profileName: typeof raw.profileName === 'string' && raw.profileName ? raw.profileName : 'นักตัดต่อฝึกหัด',
    recentLessons: Array.isArray(raw.recentLessons) ? raw.recentLessons : [],
    bookmarks: Array.isArray(raw.bookmarks) ? raw.bookmarks : [],
    notes: typeof raw.notes === 'object' && raw.notes ? raw.notes : {},
    workshopSubmissions: typeof raw.workshopSubmissions === 'object' && raw.workshopSubmissions ? raw.workshopSubmissions : {},
    contactMessages: Array.isArray(raw.contactMessages) ? raw.contactMessages : [],
    avatarIcon: typeof raw.avatarIcon === 'string' ? raw.avatarIcon : '🎬',
    joinedDate: typeof raw.joinedDate === 'string' ? raw.joinedDate : 'กรกฎาคม 2569',
    dailyStreak: typeof raw.dailyStreak === 'number' ? raw.dailyStreak : 1,
    maxStreak: typeof raw.maxStreak === 'number' ? raw.maxStreak : 1,
    lastActiveDate: typeof raw.lastActiveDate === 'string' ? raw.lastActiveDate : '',
    activityDates: Array.isArray(raw.activityDates) ? raw.activityDates : [],
    streakClaimedToday: Boolean(raw.streakClaimedToday),
    quizBest: typeof raw.quizBest === 'number' ? raw.quizBest : null
  };
}

function loadLocalStateForUid(uid?: string | null): UserState {
  try {
    const key = getStorageKeyForUid(uid);
    const saved = localStorage.getItem(key);
    if (saved) {
      return sanitizeUserState(JSON.parse(saved));
    }
    // Backward compatibility for legacy single-user keys when guest starts
    if (!uid) {
      const legacyKey1 = localStorage.getItem('premiere_masterclass_state_v2');
      if (legacyKey1) return sanitizeUserState(JSON.parse(legacyKey1));
      const legacyKey2 = localStorage.getItem('premiere_masterclass_user_v2');
      if (legacyKey2) return sanitizeUserState(JSON.parse(legacyKey2));
    }
  } catch (e) {
    console.warn('Error loading local state:', e);
  }
  return { ...DEFAULT_STATE };
}

function saveLocalStateForUid(uid: string | null | undefined, state: UserState) {
  try {
    const key = getStorageKeyForUid(uid);
    localStorage.setItem(key, JSON.stringify(state));
  } catch (e) {
    console.warn('Error saving local state:', e);
  }
}

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem(THEME_KEY) as 'dark' | 'light') || 'dark';
  });

  // Active account UID reference to prevent race conditions during account transitions
  const activeUidRef = useRef<string | null | undefined>(
    localStorage.getItem(LAST_AUTH_UID_KEY) || null
  );

  // User persistent state per account
  const [userState, setUserState] = useState<UserState>(() => {
    try {
      const lastUid = localStorage.getItem(LAST_AUTH_UID_KEY);
      return loadLocalStateForUid(lastUid);
    } catch (e) {}
    return { ...DEFAULT_STATE };
  });

  // UI Modals & Feedback
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verificationCertId, setVerificationCertId] = useState('');
  const [selectedFeedbackSubmission, setSelectedFeedbackSubmission] = useState<WorkshopSubmission | null>(null);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isGoogleAuthModalOpen, setIsGoogleAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'student' | 'controller'>('student');
  const [isControllerInboxOpen, setIsControllerInboxOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<GoogleAccountInfo | null>(null);

  // Real-time Firestore notifications state
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Subscribe to real-time notifications from Cloud Firestore
  useEffect(() => {
    const unsub = subscribeToNotifications(
      currentUser?.uid,
      currentUser?.email,
      (newNotifs) => {
        setNotifications(newNotifs);
      },
      (err) => {
        console.warn('Notification stream warning:', err?.message || err);
      }
    );
    return () => {
      unsub();
    };
  }, [currentUser?.uid, currentUser?.email]);

  // Handler to mark single notification as read
  const handleMarkNotificationAsRead = async (notifId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notifId ? { ...n, read: true } : n)
    );
    await markNotificationAsReadInFirestore(notifId, currentUser?.uid);
  };

  // Handler to mark all notifications as read
  const handleMarkAllNotificationsAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    await markAllNotificationsAsReadInFirestore(notifications, currentUser?.uid);
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // URL deep link listener for ?cert= or ?verify=
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const certParam = urlParams.get('cert') || urlParams.get('verify');
      if (certParam) {
        setVerificationCertId(certParam.trim().toUpperCase());
        setIsVerificationModalOpen(true);
      }
    } catch (err) {
      // Ignore URL parsing errors
    }
  }, []);

  const handleOpenAuthModal = (tab: 'student' | 'controller' = 'student') => {
    if (tab === 'controller' && isUserAdmin(currentUser?.email)) {
      setIsControllerInboxOpen(true);
      return;
    }
    setAuthModalTab(tab);
    setIsGoogleAuthModalOpen(true);
  };
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeModalLessonId, setActiveModalLessonId] = useState<number | null>(null);

  // Initialize Firebase Firestore & Subscribe to real-time Google Auth state
  useEffect(() => {
    validateFirestoreConnection();

    const unsubscribe = subscribeToAuth(async (user) => {
      if (user) {
        const googleInfo: GoogleAccountInfo = {
          uid: user.uid,
          displayName: user.displayName || 'Google User',
          email: user.email || '',
          photoURL: user.photoURL || undefined
        };

        const isSwitchingAccount = activeUidRef.current !== user.uid;
        activeUidRef.current = user.uid;
        localStorage.setItem(LAST_AUTH_UID_KEY, user.uid);
        setCurrentUser(googleInfo);

        // Load existing local cache for THIS specific account first
        const localCache = loadLocalStateForUid(user.uid);

        // Load cloud data for THIS specific user from Firestore
        try {
          const cloudData = await loadUserDataFromCloud(user.uid);
          if (cloudData) {
            // Restore from cloud merged ONLY with this account's local cache
            const restoredState = sanitizeUserState({
              ...localCache,
              ...cloudData,
              googleAccount: googleInfo,
              profileName: (cloudData.profileName && cloudData.profileName !== 'นักตัดต่อฝึกหัด')
                ? cloudData.profileName
                : (user.displayName || localCache.profileName || 'นักตัดต่อฝึกหัด')
            });
            setUserState(restoredState);
            saveLocalStateForUid(user.uid, restoredState);
          } else {
            // First time Google sign-in for this specific email:
            // Crucial: do NOT copy previous user's or guest's progress!
            // Start fresh for this new user account:
            const freshAccountState: UserState = sanitizeUserState({
              googleAccount: googleInfo,
              profileName: user.displayName || 'นักตัดต่อฝึกหัด',
              joinedDate: new Date().toLocaleDateString('th-TH', { month: 'long', year: 'numeric' }),
              dailyStreak: 1,
              maxStreak: 1
            });
            setUserState(freshAccountState);
            saveLocalStateForUid(user.uid, freshAccountState);
            await saveUserDataToCloud(user.uid, freshAccountState);
          }

          if (isSwitchingAccount) {
            setToastMessage(`🎉 เข้าสู่ระบบด้วย ${user.email || user.displayName} สำเร็จ (โหลดข้อมูลเฉพาะบัญชีเรียบร้อย)`);
          }
        } catch (e) {
          console.error("Error syncing cloud data on auth:", e);
        }
      } else {
        // User logged out / Guest mode
        const wasLoggedIn = activeUidRef.current !== null;
        activeUidRef.current = null;
        localStorage.removeItem(LAST_AUTH_UID_KEY);
        setCurrentUser(null);

        // Load Guest state (completely isolated from any signed-in user!)
        const guestState = loadLocalStateForUid(null);
        setUserState({
          ...guestState,
          googleAccount: undefined
        });

        if (wasLoggedIn) {
          setToastMessage('ออกจากระบบเรียบร้อยแล้ว (สลับสู่บัญชี Guest แยกต่างหาก)');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Continuous auto-save to Firestore and LocalStorage whenever userState updates
  useEffect(() => {
    const currentUid = currentUser?.uid || null;

    // Safety guard: only persist if userState is synced with active account
    if (activeUidRef.current !== currentUid) {
      return;
    }

    // Save to account-specific LocalStorage
    saveLocalStateForUid(currentUid, userState);

    // If signed into account, debounce save to Firestore for this specific account
    if (currentUid) {
      const timer = setTimeout(async () => {
        try {
          await saveUserDataToCloud(currentUid, userState);
        } catch (err) {
          console.warn('Auto-save sync note:', err);
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [userState, currentUser?.uid]);

  // Sync theme
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      document.body.classList.add('light-mode');
      document.documentElement.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
      document.documentElement.classList.remove('dark-mode');
    } else {
      document.body.classList.add('dark-mode');
      document.documentElement.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      document.documentElement.classList.remove('light-mode');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Study timer (increments every minute of active tab)
  useEffect(() => {
    const interval = setInterval(() => {
      setUserState(prev => ({
        ...prev,
        studyMinutes: prev.studyMinutes + 1
      }));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Check and update daily streak on app engagement
  useEffect(() => {
    setUserState(prev => {
      const streakUpdate = calculateUpdatedStreak(prev);
      const nextState: UserState = {
        ...prev,
        ...streakUpdate
      };
      const badges = checkAndAwardBadges(nextState);
      return {
        ...nextState,
        badges
      };
    });
  }, []);

  // Global Keyboard listener for Ctrl+K, Ctrl+/, Ctrl+Shift+C
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3500);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Badge check helper
  const checkAndAwardBadges = (state: UserState) => {
    const updatedBadges = [...state.badges];
    let newBadgeAwarded = false;

    if (state.completedLessons.length >= 1 && !updatedBadges.includes('first-lesson')) {
      updatedBadges.push('first-lesson');
      newBadgeAwarded = true;
    }
    if (state.completedLessons.length >= 5 && !updatedBadges.includes('five-lessons')) {
      updatedBadges.push('five-lessons');
      newBadgeAwarded = true;
    }
    if (state.completedLessons.length >= 15 && !updatedBadges.includes('all-lessons')) {
      updatedBadges.push('all-lessons');
      newBadgeAwarded = true;
    }
    if (state.quizHistory.some(s => s >= 18) && !updatedBadges.includes('quiz-master')) {
      updatedBadges.push('quiz-master');
      newBadgeAwarded = true;
    }
    if (state.gamesPlayed >= 3 && !updatedBadges.includes('gamer')) {
      updatedBadges.push('gamer');
      newBadgeAwarded = true;
    }
    if (
      Object.values(state.gameScores).some(records => records.some(r => r.score >= 100)) &&
      !updatedBadges.includes('speed-demon')
    ) {
      updatedBadges.push('speed-demon');
      newBadgeAwarded = true;
    }
    if ((state.dailyStreak || 0) >= 3 && !updatedBadges.includes('daily-streak-3')) {
      updatedBadges.push('daily-streak-3');
      newBadgeAwarded = true;
    }
    if ((state.dailyStreak || 0) >= 7 && !updatedBadges.includes('daily-streak-7')) {
      updatedBadges.push('daily-streak-7');
      newBadgeAwarded = true;
    }

    if (newBadgeAwarded) {
      triggerToast('🎉 คุณปลดล็อก Badge ความสำเร็จใหม่!');
      triggerBadgeUnlockConfetti();
    }

    return updatedBadges;
  };

  // Daily Streak Claim Handler
  const handleClaimDailyStreak = () => {
    if (userState.streakClaimedToday) {
      triggerToast('คุณได้รับโบนัส Daily Streak ของวันนี้เรียบร้อยแล้ว');
      return;
    }

    setUserState(prev => {
      const nextState = {
        ...prev,
        points: prev.points + 10,
        streakClaimedToday: true
      };
      return nextState;
    });

    triggerLessonCompletionConfetti();
    triggerToast(`🔥 รับโบนัส Streak วันนี้สำเร็จ! (+10 XP) ต่อเนื่อง ${userState.dailyStreak || 1} วันแล้ว`);
  };

  // Lesson Handlers
  const handleCompleteLesson = (id: number) => {
    setUserState(prev => {
      if (prev.completedLessons.includes(id)) return prev;
      const newCompleted = [...prev.completedLessons, id];
      const newPoints = prev.points + 20;
      triggerToast('บันทึกความคืบหน้าแล้ว! +20 XP');
      triggerLessonCompletionConfetti();

      const nextState: UserState = {
        ...prev,
        completedLessons: newCompleted,
        points: newPoints
      };
      nextState.badges = checkAndAwardBadges(nextState);
      return nextState;
    });
  };

  const handleOpenLesson = (lesson: Lesson) => {
    setUserState(prev => ({
      ...prev,
      recentLessons: [lesson.title, ...prev.recentLessons.filter(t => t !== lesson.title)].slice(0, 5)
    }));
  };

  const handleToggleBookmark = (lessonId: number) => {
    setUserState(prev => {
      const current = prev.bookmarks || [];
      const isBookmarked = current.includes(lessonId);
      const newBookmarks = isBookmarked 
        ? current.filter(id => id !== lessonId)
        : [...current, lessonId];
      triggerToast(isBookmarked ? 'ยกเลิกการคั่นหน้าแล้ว' : 'คั่นหน้าบทเรียนนี้แล้ว (ดูได้ในโปรไฟล์)');
      return {
        ...prev,
        bookmarks: newBookmarks
      };
    });
  };

  const handleSaveNote = (lessonId: number, noteText: string) => {
    setUserState(prev => ({
      ...prev,
      notes: {
        ...(prev.notes || {}),
        [lessonId]: noteText
      }
    }));
    triggerToast('บันทึกสมุดโน้ตประจำบทเรียนแล้ว');
  };

  // Video Handlers
  const handleToggleFavVideo = (id: number) => {
    setUserState(prev => {
      const isFav = prev.favVideos.includes(id);
      const newFavs = isFav
        ? prev.favVideos.filter(x => x !== id)
        : [...prev.favVideos, id];
      triggerToast(isFav ? 'ลบออกจากรายการโปรดแล้ว' : 'เพิ่มในรายการโปรดแล้ว');
      return { ...prev, favVideos: newFavs };
    });
  };

  const handleWatchVideo = (id: number) => {
    setUserState(prev => ({
      ...prev,
      recentVideos: [id, ...prev.recentVideos.filter(x => x !== id)].slice(0, 6)
    }));
  };

  // Quiz Handlers
  const handleFinishQuiz = (score: number) => {
    setUserState(prev => {
      const newBest = prev.quizBest === null ? score : Math.max(prev.quizBest, score);
      const newHistory = [...prev.quizHistory, score];
      const newPoints = prev.points + score * 5;
      triggerToast(`ทำแบบทดสอบเสร็จแล้ว! ได้ ${score}/20 (+${score * 5} XP)`);

      if (score >= 16) {
        triggerLessonCompletionConfetti();
      }

      const nextState: UserState = {
        ...prev,
        quizBest: newBest,
        quizHistory: newHistory,
        points: newPoints
      };
      nextState.badges = checkAndAwardBadges(nextState);
      return nextState;
    });
  };

  // Game Handlers
  const handleFinishGame = (gameId: string, score: number, timeSec: number) => {
    setUserState(prev => {
      const existingScores = prev.gameScores[gameId] || [];
      const newRecords = [
        { score, time: timeSec, date: new Date().toLocaleDateString('th-TH') },
        ...existingScores
      ]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      const nextState: UserState = {
        ...prev,
        gameScores: {
          ...prev.gameScores,
          [gameId]: newRecords
        },
        gamesPlayed: prev.gamesPlayed + 1,
        points: prev.points + score
      };
      nextState.badges = checkAndAwardBadges(nextState);
      return nextState;
    });
  };

  // Workshop Submission Handler
  const handleSubmitProject = (submission: WorkshopSubmission) => {
    setUserState(prev => {
      const newSubmissions = {
        ...(prev.workshopSubmissions || {}),
        [submission.projectId]: submission
      };
      const newPoints = prev.points + 50;
      const nextState: UserState = {
        ...prev,
        workshopSubmissions: newSubmissions,
        points: newPoints
      };
      nextState.badges = checkAndAwardBadges(nextState);
      if (currentUser?.uid) {
        saveUserDataToCloud(currentUser.uid, nextState);
      }
      return nextState;
    });
    triggerBadgeUnlockConfetti();
  };

  // Contact Message Handler
  const handleSendMessage = (msg: ContactMessage) => {
    setUserState(prev => ({
      ...prev,
      contactMessages: [msg, ...(prev.contactMessages || [])]
    }));
  };

  // Profile Handlers
  const handleUpdateName = (newName: string) => {
    setUserState(prev => {
      const next = {
        ...prev,
        profileName: newName
      };
      if (currentUser?.uid) {
        saveUserDataToCloud(currentUser.uid, next);
      }
      return next;
    });
    triggerToast('อัปเดตชื่อโปรไฟล์เรียบร้อยแล้ว');
  };

  const handleUpdateAvatar = (avatar: string) => {
    setUserState(prev => {
      const next = {
        ...prev,
        avatarIcon: avatar,
        avatarType: 'emoji' as const
      };
      if (currentUser?.uid) {
        saveUserDataToCloud(currentUser.uid, next);
      }
      return next;
    });
    triggerToast(`เปลี่ยนรูปอวตารเป็น ${avatar} เรียบร้อยแล้ว`);
  };

  const handleUpdateProfile = (updatedFields: Partial<UserState>) => {
    setUserState(prev => {
      const next: UserState = {
        ...prev,
        ...updatedFields
      };
      if (currentUser?.uid) {
        saveUserDataToCloud(currentUser.uid, next);
      }
      return next;
    });
    triggerToast('บันทึกข้อมูลโปรไฟล์และอวตารเรียบร้อยแล้ว');
  };

  const handleSignInGoogle = async () => {
    await signInWithGoogle();
  };

  const handleSignOutGoogle = async () => {
    if (currentUser?.uid) {
      await saveUserDataToCloud(currentUser.uid, userState);
      saveLocalStateForUid(currentUser.uid, userState);
    }
    await signOutGoogle();
    activeUidRef.current = null;
    localStorage.removeItem(LAST_AUTH_UID_KEY);
    setCurrentUser(null);
    const guestState = loadLocalStateForUid(null);
    setUserState({
      ...guestState,
      googleAccount: undefined
    });
    setToastMessage('ออกจากระบบเรียบร้อยแล้ว (สลับสู่บัญชี Guest)');
  };

  const handleResetProgress = () => {
    const currentUid = currentUser?.uid || null;
    const freshState: UserState = {
      ...DEFAULT_STATE,
      googleAccount: currentUser ? { ...currentUser } : undefined,
      profileName: currentUser?.displayName || 'นักตัดต่อฝึกหัด'
    };
    setUserState(freshState);
    saveLocalStateForUid(currentUid, freshState);
    if (currentUid) {
      saveUserDataToCloud(currentUid, freshState);
    }
    triggerToast(
      currentUid
        ? `รีเซ็ตข้อมูลเฉพาะบัญชี ${currentUser?.email} เรียบร้อยแล้ว`
        : 'รีเซ็ตข้อมูลบัญชี Guest เรียบร้อยแล้ว'
    );
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300 font-sans selection:bg-[#8B5CF6] selection:text-white relative w-full overflow-x-hidden">
      {/* Global Toast */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Main Navbar */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        openSearch={() => setIsSearchOpen(true)}
        notifications={notifications}
        unreadNotificationsCount={unreadNotificationsCount}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
        onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
        currentUser={currentUser}
        userState={userState}
        onOpenAuthModal={() => handleOpenAuthModal('student')}
        onOpenControllerInbox={() => setIsControllerInboxOpen(true)}
      />


      {/* Hero Section */}
      <Hero
        onStartLearning={() => scrollToSection('lessons')}
        onPreviewLesson={() => scrollToSection('videos')}
      />

      {/* Instructor Section */}
      <Instructor />

      {/* Lessons Section (15 Chapters + Bookmarks + Notes + AI + Shortcuts) */}
      <LessonsSection
        completedLessons={userState.completedLessons}
        bookmarks={userState.bookmarks || []}
        notes={userState.notes || {}}
        onCompleteLesson={handleCompleteLesson}
        onToggleBookmark={handleToggleBookmark}
        onSaveNote={handleSaveNote}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenLessonCallback={handleOpenLesson}
        onTriggerToast={triggerToast}
        preselectedLessonId={activeModalLessonId}
      />

      {/* Premiere Pro Interactive E-Book Section */}
      <EbookSection onTriggerToast={triggerToast} />

      {/* Videos Vault Section */}
      <VideosSection
        favVideos={userState.favVideos}
        recentVideos={userState.recentVideos}
        onToggleFav={handleToggleFavVideo}
        onWatchVideo={handleWatchVideo}
      />

      {/* Downloadable Media & Assets Section */}
      <MediaSection onTriggerToast={triggerToast} />

      {/* Certification Quiz Section */}
      <QuizSection
        quizBest={userState.quizBest}
        onFinishQuiz={handleFinishQuiz}
      />

      {/* Interactive Minigames Section (8 games) */}
      <GamesSection
        gameScores={userState.gameScores}
        onFinishGame={handleFinishGame}
        onTriggerToast={triggerToast}
      />

      {/* Hands-on Workshop Projects Section */}
      <WorkshopSection
        submissions={userState.workshopSubmissions || {}}
        onSubmitProject={handleSubmitProject}
        onTriggerToast={triggerToast}
      />

      {/* Editor's Notes & Blog Section */}
      <BlogSection />

      {/* Dashboard Analytics & Achievements */}
      <DashboardSection 
        userState={userState}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onClaimDailyStreak={handleClaimDailyStreak}
        onNavigateToSection={scrollToSection}
        onOpenWorkshopFeedback={(sub) => setSelectedFeedbackSubmission(sub)}
        onOpenVerification={() => setIsVerificationModalOpen(true)}
        onOpenNextLesson={() => {
          const nextLesson = LESSONS_DATA.find(l => !userState.completedLessons.includes(l.id)) || LESSONS_DATA[0];
          scrollToSection('lessons');
          setActiveModalLessonId(nextLesson.id);
          handleOpenLesson(nextLesson);
        }}
      />

      {/* Profile ID & Badges Showcase */}
      <ProfileSection
        userState={userState}
        onUpdateName={handleUpdateName}
        onUpdateAvatar={handleUpdateAvatar}
        onUpdateProfile={handleUpdateProfile}
        onResetProgress={handleResetProgress}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onOpenAuthModal={() => handleOpenAuthModal('student')}
        onTriggerToast={triggerToast}
        onSelectLesson={(lessonId) => {
          scrollToSection('lessons');
          setActiveModalLessonId(lessonId);
          const lesson = LESSONS_DATA.find(l => l.id === lessonId);
          if (lesson) handleOpenLesson(lesson);
        }}
      />

      {/* Contact, FAQ & Support Section */}
      <ContactSection 
        messages={userState.contactMessages || []}
        onSendMessage={handleSendMessage}
        onTriggerToast={triggerToast}
        currentUserEmail={currentUser?.email}
        currentUserId={currentUser?.uid}
        onOpenControllerLogin={() => handleOpenAuthModal('controller')}
      />

      {/* Footer */}
      <Footer 
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
        onOpenControllerLogin={() => handleOpenAuthModal('controller')}
        onOpenVerificationModal={() => setIsVerificationModalOpen(true)}
        isAdmin={isUserAdmin(currentUser?.email)}
      />

      {/* Floating Action Controls */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-2.5">
        <button
          onClick={() => setIsAiAssistantOpen(true)}
          id="floating-ai-assistant-btn"
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#3B82F6] text-white shadow-xl hover:shadow-purple-500/30 flex items-center justify-center cursor-pointer transition-transform hover:scale-105 group"
          title="ปรึกษา AI Assistant ด้าน Premiere Pro"
        >
          <Bot className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={() => setIsShortcutsOpen(true)}
          id="floating-shortcuts-btn"
          className="w-12 h-12 rounded-full glass-panel-strong border border-white/20 text-[#EDEDF4] hover:text-white shadow-xl flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
          title="แผ่นรวมคีย์ลัด Premiere Pro (Ctrl + /)"
        >
          <Keyboard className="w-5 h-5" />
        </button>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectLesson={(id) => {
          scrollToSection('lessons');
          setActiveModalLessonId(id);
          const lesson = LESSONS_DATA.find(l => l.id === id);
          if (lesson) handleOpenLesson(lesson);
        }}
        onSelectVideo={(id) => {
          scrollToSection('videos');
          handleWatchVideo(id);
        }}
        onSelectBlog={() => {
          scrollToSection('blog');
        }}
      />

      {/* Official Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        userState={userState}
        onOpenVerification={(id) => {
          setVerificationCertId(id || '');
          setIsVerificationModalOpen(true);
        }}
      />

      {/* Online Certificate Verification Modal (Shareable / Public) */}
      <CertificateVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        initialCertId={verificationCertId}
        onOpenCertificateModal={() => {
          setIsVerificationModalOpen(false);
          setIsCertificateOpen(true);
        }}
        onTriggerToast={triggerToast}
      />

      {/* Workshop Feedback Review Modal */}
      <WorkshopFeedbackModal
        submission={selectedFeedbackSubmission}
        onClose={() => setSelectedFeedbackSubmission(null)}
      />

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
      />

      {/* Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Google Authentication Modal */}
      <GoogleAuthModal
        isOpen={isGoogleAuthModalOpen}
        onClose={() => setIsGoogleAuthModalOpen(false)}
        currentUser={currentUser}
        onSignInWithGoogle={handleSignInGoogle}
        onSignOut={handleSignOutGoogle}
        onOpenControllerInbox={() => setIsControllerInboxOpen(true)}
        initialTab={authModalTab}
      />

      {/* Controller / Admin Inquiries Database Modal */}
      <ControllerInquiriesModal
        isOpen={isControllerInboxOpen}
        onClose={() => setIsControllerInboxOpen(false)}
        currentUserEmail={currentUser?.email}
        onTriggerToast={triggerToast}
        onOpenAuthModal={() => {
          setIsControllerInboxOpen(false);
          handleOpenAuthModal('controller');
        }}
      />
    </div>
  );
}
