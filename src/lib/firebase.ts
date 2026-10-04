import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';
import { 
  initializeFirestore,
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  getDocFromServer,
  Firestore
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { GoogleAccountInfo, UserState, ContactMessage, CertificateRecord, WorkshopSubmission, AppNotification } from '../types';

export const ADMIN_EMAIL = 'vorawutphetrai17@gmail.com';

export function isUserAdmin(email?: string | null): boolean {
  if (!email) return false;
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

// Initialize Firebase App instance
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Auth
export const auth = getAuth(app);

// Initialize Google Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Firestore with experimentalForceLongPolling to avoid stream drops in sandboxed iframes
let firestoreInstance: Firestore;
try {
  firestoreInstance = initializeFirestore(
    app,
    {
      experimentalForceLongPolling: true
    },
    firebaseConfig.firestoreDatabaseId || undefined
  );
} catch {
  // If already initialized (e.g. during Fast Refresh)
  firestoreInstance = firebaseConfig.firestoreDatabaseId 
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);
}

export const db = firestoreInstance;

// Error Handling Infrastructure as required by Firestore skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate Connection as mandated by Firestore guidelines
export async function validateFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error: any) {
    if (error?.code === 'unavailable' || error?.message?.includes('the client is offline') || error?.message?.includes('unavailable')) {
      console.info('Firestore is operating in offline/cached mode until a connection is available.');
      return false;
    }
    // permission-denied is expected when unauthenticated, and proves the server backend responded
    return true;
  }
}

// Convert Firebase User to GoogleAccountInfo
export function formatGoogleUser(user: FirebaseUser): GoogleAccountInfo {
  return {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || user.email?.split('@')[0] || 'User',
    photoURL: user.photoURL || undefined
  };
}

// Sign in with real Google Account
export async function signInWithGoogle(): Promise<GoogleAccountInfo> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return formatGoogleUser(result.user);
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
      console.warn('Google Sign-In was cancelled or popup closed by user');
      throw new Error('หน้าต่างลงชื่อเข้าใช้ถูกปิดก่อนทำรายการเสร็จ กรุณาลองใหม่อีกครั้ง');
    }
    console.error('Google Sign-In Error:', error);
    if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('การลงชื่อเข้าใช้ถูกยกเลิก');
    }
    if (error.code === 'auth/popup-blocked') {
      throw new Error('เบราว์เซอร์บล็อกหน้าต่างป๊อปอัป กรุณาอนุญาตป๊อปอัปหรือเปิดใช้งานในแท็บใหม่');
    }
    if (error.code === 'auth/unauthorized-domain') {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
      throw new Error(`UNAUTHORIZED_DOMAIN:${currentHost}`);
    }
    if (error.code === 'auth/network-request-failed') {
      throw new Error('ไม่สามารถเชื่อมต่อเครือข่ายได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
    }
    throw new Error(error.message || 'เกิดข้อผิดพลาดในการลงชื่อเข้าใช้');
  }
}

// Sign in with Email and Password
export async function signInWithEmail(email: string, password: string): Promise<GoogleAccountInfo> {
  try {
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      throw new Error('กรุณากรอกอีเมล');
    }
    if (!password) {
      throw new Error('กรุณากรอกรหัสผ่าน');
    }
    const result = await signInWithEmailAndPassword(auth, cleanEmail, password);
    return formatGoogleUser(result.user);
  } catch (error: any) {
    console.error('Email Sign-In Error:', error);
    const code = error?.code || '';
    if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
      throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง');
    }
    if (code === 'auth/invalid-email') {
      throw new Error('รูปแบบอีเมลไม่ถูกต้อง');
    }
    if (code === 'auth/too-many-requests') {
      throw new Error('มีการพยายามเข้าสู่ระบบไม่สำเร็จหลายครั้ง กรุณารอสักครู่แล้วลองใหม่');
    }
    if (code === 'auth/user-disabled') {
      throw new Error('บัญชีนี้ถูกปิดการใช้งานชั่วคราว กรุณาติดต่อผู้ดูแลระบบ');
    }
    if (code === 'auth/network-request-failed') {
      throw new Error('ไม่สามารถเชื่อมต่ออินเทอร์เน็ตได้ กรุณาตรวจสอบสัญญาณของคุณ');
    }
    throw new Error(error.message || 'ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่อีกครั้ง');
  }
}

// Sign up / Register with Email, Password and Display Name
export async function signUpWithEmail(email: string, password: string, displayName: string): Promise<GoogleAccountInfo> {
  try {
    const cleanEmail = email.trim();
    const cleanName = displayName.trim();
    if (!cleanName) {
      throw new Error('กรุณากรอกชื่อ-นามสกุล หรือชื่อที่ต้องการให้แสดง');
    }
    if (!cleanEmail) {
      throw new Error('กรุณากรอกอีเมล');
    }
    if (!password || password.length < 6) {
      throw new Error('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
    }
    const result = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    if (cleanName && result.user) {
      try {
        await updateProfile(result.user, { displayName: cleanName });
      } catch (profileErr) {
        console.warn('Profile name update warning:', profileErr);
      }
    }
    return formatGoogleUser(result.user);
  } catch (error: any) {
    console.error('Email Sign-Up Error:', error);
    const code = error?.code || '';
    if (code === 'auth/email-already-in-use') {
      throw new Error('อีเมลนี้ถูกลงทะเบียนไว้แล้ว กรุณาเข้าสู่ระบบด้วยอีเมลนี้');
    }
    if (code === 'auth/weak-password') {
      throw new Error('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
    }
    if (code === 'auth/invalid-email') {
      throw new Error('รูปแบบอีเมลไม่ถูกต้อง');
    }
    if (code === 'auth/network-request-failed') {
      throw new Error('ไม่สามารถเชื่อมต่ออินเทอร์เน็ตได้ กรุณาตรวจสอบสัญญาณของคุณ');
    }
    throw new Error(error.message || 'ไม่สามารถลงทะเบียนได้ กรุณาลองใหม่อีกครั้ง');
  }
}

// Send Password Reset Email
export async function resetPasswordEmail(email: string): Promise<void> {
  try {
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      throw new Error('กรุณากรอกอีเมลที่ใช้ลงทะเบียน');
    }
    await sendPasswordResetEmail(auth, cleanEmail);
  } catch (error: any) {
    console.error('Password Reset Error:', error);
    const code = error?.code || '';
    if (code === 'auth/user-not-found') {
      throw new Error('ไม่พบบัญชีผู้ใช้ที่ลงทะเบียนด้วยอีเมลนี้');
    }
    if (code === 'auth/invalid-email') {
      throw new Error('รูปแบบอีเมลไม่ถูกต้อง');
    }
    if (code === 'auth/network-request-failed') {
      throw new Error('ไม่สามารถเชื่อมต่ออินเทอร์เน็ตได้ กรุณาตรวจสอบสัญญาณของคุณ');
    }
    throw new Error(error.message || 'ไม่สามารถส่งอีเมลรีเซ็ตรหัสผ่านได้ กรุณาลองใหม่อีกครั้ง');
  }
}

// Sign out
export async function signOutGoogle(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Google Sign-Out Error:', error);
    throw new Error('ไม่สามารถออกจากระบบได้ในขณะนี้');
  }
}

// Listen to Auth State
export function subscribeToAuth(callback: (user: GoogleAccountInfo | null) => void) {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(formatGoogleUser(user));
    } else {
      callback(null);
    }
  });
}

// Save User Profile and Progress to Firestore
export async function saveUserDataToCloud(uid: string, state: UserState): Promise<void> {
  if (!uid) return;
  const pathForWrite = `users/${uid}`;
  try {
    const userDocRef = doc(db, 'users', uid);
    const dataToSave = {
      email: state.googleAccount?.email || '',
      displayName: state.googleAccount?.displayName || state.profileName,
      photoURL: state.googleAccount?.photoURL || '',
      profileName: state.profileName,
      bio: state.bio || '',
      skillLevel: state.skillLevel || 'Beginner',
      learningGoal: state.learningGoal || '',
      portfolioUrl: state.portfolioUrl || '',
      customAvatarUrl: state.customAvatarUrl || '',
      avatarType: state.avatarType || 'emoji',
      avatarIcon: state.avatarIcon || '🎬',
      points: state.points || 0,
      completedLessons: state.completedLessons || [],
      badges: state.badges || [],
      dailyStreak: state.dailyStreak || 1,
      maxStreak: state.maxStreak || 1,
      studyMinutes: state.studyMinutes || 0,
      quizBest: state.quizBest ?? null,
      quizHistory: state.quizHistory || [],
      bookmarks: state.bookmarks || [],
      notes: state.notes || {},
      workshopSubmissions: state.workshopSubmissions || {},
      favVideos: state.favVideos || [],
      recentVideos: state.recentVideos || [],
      recentLessons: state.recentLessons || [],
      gameScores: state.gameScores || {},
      gamesPlayed: state.gamesPlayed || 0,
      contactMessages: state.contactMessages || [],
      activityDates: state.activityDates || [],
      streakClaimedToday: Boolean(state.streakClaimedToday),
      lastActiveDate: state.lastActiveDate || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(userDocRef, dataToSave, { merge: true });
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      try {
        handleFirestoreError(error, OperationType.WRITE, pathForWrite);
      } catch (errLog) {
        console.warn('Cloud sync permission notice (data persisted locally):', errLog);
      }
    } else {
      console.warn('Firestore sync note (saved locally):', error?.message || error);
    }
  }
}

// Load User Profile and Progress from Firestore
export async function loadUserDataFromCloud(uid: string): Promise<Partial<UserState> | null> {
  if (!uid) return null;
  const pathForGet = `users/${uid}`;
  try {
    const userDocRef = doc(db, 'users', uid);
    const snapshot = await getDoc(userDocRef);
    if (snapshot.exists()) {
      return snapshot.data() as Partial<UserState>;
    }
    return null;
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.GET, pathForGet);
    } else {
      console.warn('Firestore read note (using local cache):', error?.message || error);
      return null;
    }
  }
}

// -------------------------------------------------------------
// Inquiries & Contact Messages (Sent to Database for Controller/Admin)
// -------------------------------------------------------------

export async function submitInquiryToFirestore(
  inquiryData: {
    name: string;
    email: string;
    message: string;
    topic?: string;
    senderUid?: string;
  }
): Promise<ContactMessage> {
  const pathForWrite = 'inquiries';
  const inquiryId = 'inq_' + Date.now().toString() + '_' + Math.random().toString(36).substring(2, 7);
  const ticketId = 'INQ-' + Math.floor(100000 + Math.random() * 900000).toString();
  const nowIso = new Date().toISOString();
  const formattedDate = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) + ' ' + new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

  const record: ContactMessage = {
    id: inquiryId,
    ticketId,
    name: inquiryData.name.trim().substring(0, 100),
    email: inquiryData.email.trim().toLowerCase().substring(0, 150),
    message: inquiryData.message.trim().substring(0, 3000),
    topic: inquiryData.topic || 'ทั่วไป / สอบถามบทเรียน',
    senderUid: inquiryData.senderUid || auth.currentUser?.uid || 'guest',
    status: 'pending',
    createdAt: nowIso,
    updatedAt: nowIso,
    timestamp: formattedDate
  };

  try {
    const docRef = doc(db, 'inquiries', inquiryId);
    await setDoc(docRef, record);
    return record;
  } catch (error: any) {
    console.error('Error writing inquiry to Firestore:', error);
    if (error?.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.WRITE, `${pathForWrite}/${inquiryId}`);
    }
    return record;
  }
}

export async function fetchInquiriesFromFirestore(): Promise<ContactMessage[]> {
  const user = auth.currentUser;
  if (!user) {
    return [];
  }
  const pathForList = 'inquiries';
  try {
    const isAdmin = isUserAdmin(user.email);
    const q = isAdmin
      ? query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'), limit(100))
      : query(collection(db, 'inquiries'), where('senderUid', '==', user.uid), orderBy('createdAt', 'desc'), limit(100));

    const snapshot = await getDocs(q);
    const items: ContactMessage[] = [];
    snapshot.forEach(docSnap => {
      items.push({ id: docSnap.id, ...(docSnap.data() as any) });
    });
    return items;
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.LIST, pathForList);
    } else {
      console.warn('Could not fetch inquiries:', error);
    }
    return [];
  }
}

export function subscribeToInquiries(
  onUpdate: (inquiries: ContactMessage[]) => void,
  onError?: (err: any) => void
) {
  const user = auth.currentUser;
  // Per React Firebase Setup guideline: Only attach onSnapshot listeners if auth is ready and user is authenticated
  if (!user) {
    onUpdate([]);
    return () => {};
  }

  const pathForSnapshot = 'inquiries';
  try {
    const isAdmin = isUserAdmin(user.email);
    const q = isAdmin
      ? query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'), limit(100))
      : query(collection(db, 'inquiries'), where('senderUid', '==', user.uid), limit(100));

    return onSnapshot(q, (snapshot) => {
      const items: ContactMessage[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      onUpdate(items);
    }, (error) => {
      console.warn('Inquiries snapshot notice:', error?.message || error);
      if (onError) onError(error);
    });
  } catch (error) {
    if (onError) onError(error);
    return () => {};
  }
}

export async function updateInquiryStatusInFirestore(
  inquiryId: string,
  status: 'pending' | 'in_review' | 'resolved',
  adminNotes?: string
): Promise<void> {
  const pathForUpdate = `inquiries/${inquiryId}`;
  try {
    const docRef = doc(db, 'inquiries', inquiryId);
    await setDoc(docRef, {
      status,
      adminNotes: adminNotes ?? '',
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.UPDATE, pathForUpdate);
    } else {
      throw error;
    }
  }
}

export async function deleteInquiryFromFirestore(inquiryId: string): Promise<void> {
  const pathForDelete = `inquiries/${inquiryId}`;
  try {
    const docRef = doc(db, 'inquiries', inquiryId);
    await deleteDoc(docRef);
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.DELETE, pathForDelete);
    } else {
      throw error;
    }
  }
}

// Save Certificate to Cloud Firestore
export async function saveCertificateToFirestore(cert: CertificateRecord): Promise<void> {
  const pathForWrite = `certificates/${cert.certId}`;
  try {
    const docRef = doc(db, 'certificates', cert.certId);
    await setDoc(docRef, {
      ...cert,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.WRITE, pathForWrite);
    } else {
      console.warn('Certificate Firestore save notice:', error);
    }
  }
}

// Get and Verify Certificate from Cloud Firestore
export async function getCertificateFromFirestore(certId: string): Promise<CertificateRecord | null> {
  const pathForGet = `certificates/${certId}`;
  try {
    const docRef = doc(db, 'certificates', certId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as CertificateRecord;
    }
    return null;
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.GET, pathForGet);
    }
    return null;
  }
}

// Save Workshop Submission to Cloud Firestore
export async function saveWorkshopSubmissionToFirestore(
  submission: WorkshopSubmission & { 
    senderUid?: string; 
    senderEmail?: string; 
    senderName?: string;
  }
): Promise<string> {
  const docId = `WS-${submission.projectId}-${Date.now().toString(36)}`;
  const pathForWrite = `workshop_submissions/${docId}`;
  try {
    const docRef = doc(db, 'workshop_submissions', docId);
    const payload = {
      ...submission,
      submissionId: docId,
      submittedAt: submission.submittedAt || new Date().toISOString(),
      senderUid: submission.senderUid || auth.currentUser?.uid || 'guest',
      senderEmail: submission.senderEmail || auth.currentUser?.email || '',
      senderName: submission.senderName || auth.currentUser?.displayName || 'Student'
    };
    await setDoc(docRef, payload, { merge: true });
    return docId;
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.CREATE, pathForWrite);
    }
    console.warn('Workshop submission Firestore note:', error);
    return docId;
  }
}

// Real-time subscribe to Workshop Submissions (for Controller/Instructor)
export function subscribeToWorkshopSubmissions(
  onUpdate: (submissions: any[]) => void,
  onError?: (err: any) => void
) {
  const user = auth.currentUser;
  // Per React Firebase Setup guideline: Only attach onSnapshot listeners if auth is ready and user is authenticated
  if (!user) {
    onUpdate([]);
    return () => {};
  }

  const pathForSnapshot = 'workshop_submissions';
  try {
    const isAdmin = isUserAdmin(user.email);
    const q = isAdmin
      ? query(collection(db, 'workshop_submissions'), orderBy('submittedAt', 'desc'), limit(100))
      : query(collection(db, 'workshop_submissions'), where('senderUid', '==', user.uid), limit(100));

    return onSnapshot(q, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach(d => {
        list.push({ id: d.id, ...d.data() });
      });
      list.sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime());
      onUpdate(list);
    }, (error) => {
      console.warn('Workshop submissions subscription notice:', error?.message || error);
      if (onError) onError(error);
    });
  } catch (error) {
    if (onError) onError(error);
    return () => {};
  }
}

// Update Workshop Submission Grade / Feedback by Instructor
export async function updateWorkshopSubmissionGradeInFirestore(
  submissionId: string,
  updates: {
    grade?: string;
    score?: number;
    feedback?: string;
    instructorRemarks?: string;
    status?: 'submitted' | 'reviewed' | 'graded';
    criteriaScores?: {
      pacing?: number;
      color?: number;
      audio?: number;
      creativity?: number;
    };
  }
): Promise<void> {
  const pathForUpdate = `workshop_submissions/${submissionId}`;
  try {
    const docRef = doc(db, 'workshop_submissions', submissionId);
    await setDoc(docRef, {
      ...updates,
      reviewedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.UPDATE, pathForUpdate);
    } else {
      throw error;
    }
  }
}

// -------------------------------------------------------------
// Real-Time System Notifications
// -------------------------------------------------------------

export async function sendSystemNotification(notification: {
  title: string;
  message: string;
  type?: 'inquiry' | 'workshop' | 'system' | 'badge' | 'quiz' | 'lesson';
  targetUid?: string;
  recipientEmail?: string;
  link?: string;
}): Promise<string> {
  const notifId = 'notif_' + Date.now().toString() + '_' + Math.random().toString(36).substring(2, 7);
  const nowIso = new Date().toISOString();

  const record: AppNotification = {
    id: notifId,
    title: notification.title.trim(),
    message: notification.message.trim(),
    type: notification.type || 'system',
    targetUid: notification.targetUid || 'all',
    recipientEmail: notification.recipientEmail || '',
    read: false,
    readBy: [],
    link: notification.link || '',
    createdAt: nowIso
  };

  try {
    const docRef = doc(db, 'notifications', notifId);
    await setDoc(docRef, record);
    return notifId;
  } catch (err: any) {
    console.warn('Could not post real-time notification:', err?.message || err);
    return notifId;
  }
}

export function subscribeToNotifications(
  userUid: string | null | undefined,
  userEmail: string | null | undefined,
  onUpdate: (notifications: AppNotification[]) => void,
  onError?: (err: any) => void
) {
  const pathForSnapshot = 'notifications';
  try {
    const q = query(
      collection(db, 'notifications'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const list: AppNotification[] = [];
        const isAdmin = isUserAdmin(userEmail);

        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as any;
          const notif: AppNotification = {
            id: docSnap.id,
            title: data.title || '',
            message: data.message || '',
            type: data.type || 'system',
            targetUid: data.targetUid,
            recipientEmail: data.recipientEmail,
            read: Boolean(data.read),
            readBy: Array.isArray(data.readBy) ? data.readBy : [],
            link: data.link || '',
            createdAt: data.createdAt || new Date().toISOString()
          };

          // Filter by audience:
          // 1. Broadcasts (targetUid === 'all' or not set)
          // 2. Targeted to this user's UID
          // 3. Targeted to 'admin' if current user is admin
          const isBroadcast = !notif.targetUid || notif.targetUid === 'all';
          const isForUser = userUid && notif.targetUid === userUid;
          const isForAdmin = isAdmin && notif.targetUid === 'admin';

          if (isBroadcast || isForUser || isForAdmin) {
            // Determine user-specific read status
            const isReadByUser = userUid
              ? notif.readBy?.includes(userUid) || (notif.targetUid === userUid && notif.read)
              : notif.read;

            list.push({
              ...notif,
              read: Boolean(isReadByUser)
            });
          }
        });

        onUpdate(list);
      },
      (error) => {
        console.warn('Notifications onSnapshot notice:', error?.message || error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    if (onError) onError(error);
    return () => {};
  }
}

export async function markNotificationAsReadInFirestore(
  notifId: string,
  userUid?: string | null
): Promise<void> {
  try {
    const docRef = doc(db, 'notifications', notifId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      const currentReadBy: string[] = Array.isArray(data.readBy) ? data.readBy : [];
      const updates: any = { read: true };
      if (userUid && !currentReadBy.includes(userUid)) {
        updates.readBy = [...currentReadBy, userUid];
      }
      await setDoc(docRef, updates, { merge: true });
    }
  } catch (err: any) {
    console.warn('Could not mark notification as read in Firestore:', err?.message || err);
  }
}

export async function markAllNotificationsAsReadInFirestore(
  notifications: AppNotification[],
  userUid?: string | null
): Promise<void> {
  try {
    const promises = notifications.map(n => markNotificationAsReadInFirestore(n.id, userUid));
    await Promise.all(promises);
  } catch (err) {
    console.warn('Error marking all notifications as read:', err);
  }
}



