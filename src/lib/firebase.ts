import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  signInAnonymously
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  orderBy, 
  getDocs,
  addDoc,
  deleteDoc,
  Firestore
} from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';
import { 
  UserProfile, 
  FastLeadInquiry, 
  GrowthDiaryItem, 
  DailyMorningCare,
  LifeBalanceScores
} from '../types';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
};

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth = getAuth(app);
export const db: Firestore = (firebaseConfigJson as { firestoreDatabaseId?: string }).firestoreDatabaseId && 
  (firebaseConfigJson as { firestoreDatabaseId?: string }).firestoreDatabaseId !== '(default)'
  ? getFirestore(app, (firebaseConfigJson as { firestoreDatabaseId?: string }).firestoreDatabaseId)
  : getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Default user profile
export const createDefaultProfile = (uid: string, email?: string | null, displayName?: string | null, photoURL?: string | null): UserProfile => {
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  
  return {
    uid,
    email: email || null,
    displayName: displayName || (email ? email.split('@')[0] : '성장하는 라이프업 회원'),
    photoURL: photoURL || null,
    subscription: {
      plan: 'free',
      status: 'active',
      currentPeriodEnd: nextMonth.toISOString(),
      kakaoNotificationEnabled: true,
      notificationTime: '08:00',
      phoneOrKakaoId: '010-****-5678'
    },
    createdAt: Date.now(),
    lastLoginAt: Date.now()
  };
};

const LOCAL_STORAGE_PREFIX = 'lifeup_v2_';

export const getUserProfile = async (uid: string): Promise<UserProfile> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (err) {
    console.warn('Firestore fetch failed, checking local store:', err);
  }
  
  const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}profile_${uid}`);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {}
  }
  return createDefaultProfile(uid);
};

export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', profile.uid);
    await setDoc(userDocRef, profile, { merge: true });
  } catch (err) {
    console.warn('Firestore save failed, saving to local store:', err);
  }
  localStorage.setItem(`${LOCAL_STORAGE_PREFIX}profile_${profile.uid}`, JSON.stringify(profile));
};

// Fast Lead Inquiry save
export const submitFastInquiry = async (inquiry: Omit<FastLeadInquiry, 'id' | 'createdAt' | 'status'>): Promise<FastLeadInquiry> => {
  const newId = `inquiry_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const item: FastLeadInquiry = {
    ...inquiry,
    id: newId,
    createdAt: Date.now(),
    status: 'pending'
  };

  try {
    const docRef = doc(db, 'leads', newId);
    await setDoc(docRef, item);
  } catch (err) {
    console.warn('Firestore lead save error:', err);
  }

  const existingLeadsStr = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}leads`) || '[]';
  const existingLeads = JSON.parse(existingLeadsStr);
  localStorage.setItem(`${LOCAL_STORAGE_PREFIX}leads`, JSON.stringify([item, ...existingLeads]));

  return item;
};

// Growth Diary items
export const getGrowthDiaries = async (uid: string): Promise<GrowthDiaryItem[]> => {
  try {
    const collRef = collection(db, 'users', uid, 'diaries');
    const q = query(collRef, orderBy('timestamp', 'desc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as GrowthDiaryItem));
    }
  } catch (err) {
    console.warn('Firestore diary fetch error:', err);
  }

  const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}diaries_${uid}`);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {}
  }
  return [
    {
      id: 'd-1',
      userId: uid,
      title: '아침 10분 온전한 몰입의 힘',
      summary: '출근 직후 스마트폰 알림을 끄고 가장 중요한 1가지에 집중했더니 하루가 훨씬 여유로워졌다.',
      actionGoal: '내일도 오전 9시 25분 집중 블록 유지하기',
      category: 'daily_care',
      coachName: '김서연 코치',
      date: '2025.01.16',
      timestamp: Date.now() - 86400000 * 2,
      isFavorite: true
    },
    {
      id: 'd-2',
      userId: uid,
      title: '커리어 목표 3단계 로드맵 완성',
      summary: '막연했던 이직 준비를 포트폴리오 정리 -> 링크드인 업데이트 -> 지원서 제출로 세분화함.',
      actionGoal: '이번 주말까지 포트폴리오 핵심 성과 3가지 정리',
      category: 'career_boost',
      coachName: '박민우 마스터 코치',
      date: '2025.01.14',
      timestamp: Date.now() - 86400000 * 4,
      isFavorite: true
    }
  ];
};

export const saveGrowthDiary = async (uid: string, item: Omit<GrowthDiaryItem, 'id' | 'timestamp'>): Promise<GrowthDiaryItem> => {
  const newId = `diary_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const fullItem: GrowthDiaryItem = {
    ...item,
    id: newId,
    timestamp: Date.now()
  };

  try {
    const docRef = doc(db, 'users', uid, 'diaries', newId);
    await setDoc(docRef, fullItem);
  } catch (err) {
    console.warn('Firestore save diary error:', err);
  }

  const current = await getGrowthDiaries(uid);
  const updated = [fullItem, ...current.filter(d => d.id !== newId)];
  localStorage.setItem(`${LOCAL_STORAGE_PREFIX}diaries_${uid}`, JSON.stringify(updated));
  return fullItem;
};

export const deleteGrowthDiary = async (uid: string, id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'users', uid, 'diaries', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Firestore delete diary error:', err);
  }
  const current = await getGrowthDiaries(uid);
  const updated = current.filter(d => d.id !== id);
  localStorage.setItem(`${LOCAL_STORAGE_PREFIX}diaries_${uid}`, JSON.stringify(updated));
};
