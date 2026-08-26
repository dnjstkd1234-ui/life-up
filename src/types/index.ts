export type CoachType = 'mindset' | 'career' | 'routine' | 'burnout';

export interface CoachInfo {
  id: CoachType;
  name: string;
  role: string;
  specialty: string;
  tagline: string;
  avatar: string;
  experience: string;
  accentColor: string;
  highlights?: string[];
}

export type CoachingCategory = 
  | 'daily_care' 
  | 'career_boost' 
  | 'mindset_recovery' 
  | 'habit_routine' 
  | 'relationship' 
  | 'general';

export interface CoachingCategoryInfo {
  id: CoachingCategory;
  name: string;
  badge: string;
  description: string;
  targetAudience: string;
  starterPrompt: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  actionItem?: string;
  keyTakeaway?: string;
  suggestedTopics?: string[];
}

export interface FastLeadInquiry {
  id: string;
  name: string;
  phone: string;
  content: string;
  programType?: string;
  privacyAgreed: boolean;
  createdAt: number;
  status: 'pending' | 'contacted' | 'completed';
}

export interface GrowthDiaryItem {
  id: string;
  userId: string;
  title: string;
  summary: string;
  actionGoal: string;
  category: CoachingCategory;
  coachName: string;
  date: string;
  timestamp: number;
  isFavorite?: boolean;
}

export interface DailyMorningCare {
  id: string;
  userId: string;
  date: string;
  sendTime: string;
  topic: string;
  morningMessage: string;
  actionChallenge: string;
  isAnswered: boolean;
  userNote?: string;
  isDelivered: boolean;
}

export interface LifeBalanceScores {
  mindset: number;      // 멘탈 회복력
  productivity: number; // 실행력 & 몰입도
  clarity: number;      // 비전 & 목표 명확성
  routine: number;      // 루틴 & 건강 습관
  relationships: number;// 인간관계 & 대화
}

export type PlanType = 'free_trial' | 'basic' | 'premium';

export interface SubscriptionInfo {
  plan: PlanType;
  status: 'active' | 'expired' | 'canceled';
  trialDaysLeft: number;
  trialEndsAt: string;
  currentPeriodEnd: string;
  kakaoNotificationEnabled: boolean;
  notificationTime: string; // e.g. "08:00"
  phoneOrKakaoId?: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  subscription: SubscriptionInfo;
  createdAt: number;
  lastLoginAt: number;
}

export interface EventCalendarItem {
  id: string;
  day: number;
  month: number;
  year: number;
  title: string;
  dateStr: string;
  category: '모집' | '특강' | '이벤트' | '체험';
  badgeColor: string;
  linkText: string;
}

export interface NewsNoticeItem {
  id: string;
  category: '공지사항' | '수강모집' | '언론보도';
  title: string;
  summary: string;
  date: string;
  isNew?: boolean;
}

export interface UserReviewItem {
  id: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  program: string;
}
