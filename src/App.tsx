import React, { useState, useEffect } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { SimpleHeroSection } from './components/SimpleHeroSection';
import { SubscriptionSection } from './components/SubscriptionSection';
import { AwakeningThemesSection } from './components/AwakeningThemesSection';
import { KakaoCareSection } from './components/KakaoCareSection';
import { FooterSection } from './components/FooterSection';
import { MyPageDashboard } from './components/MyPageDashboard';

import { PricingModal } from './components/PricingModal';
import { AuthModal } from './components/AuthModal';

import { UserProfile, PlanType } from './types';
import { auth, getUserProfile, saveUserProfile, createDefaultProfile } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeSection, setActiveSection] = useState<string>('intro');

  // Modals
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Initialize Firebase Auth & Guest Profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const profile = await getUserProfile(fbUser.uid);
        setUser(profile);
      } else {
        const guestUid = 'guest_marketing_user';
        const defaultProf = await getUserProfile(guestUid);
        setUser(defaultProf);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'mypage') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'pricing') {
      setIsPricingModalOpen(true);
    }
  };

  const handleSelectPlan = async (plan: PlanType) => {
    if (!user) return;
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    const updated: UserProfile = {
      ...user,
      subscription: {
        ...user.subscription,
        plan,
        status: 'active',
        currentPeriodEnd: periodEnd.toISOString()
      }
    };
    await saveUserProfile(updated);
    setUser(updated);
    
    // Automatically navigate to MyPage diagnosis upon subscription
    setActiveSection('mypage');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Signout failed:', e);
    }
    const guestUid = 'guest_marketing_user';
    const guestProf = createDefaultProfile(guestUid, null, '회원');
    setUser(guestProf);
    setActiveSection('intro');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* 1. Header Navigation (서비스소개 -> 구독하기 -> 상담설명 -> 카카오톡 대화 + 마이페이지) */}
      <HeaderNav
        user={user}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenPricing={() => setIsPricingModalOpen(true)}
        onOpenMyPage={() => handleNavigate('mypage')}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeSection === 'mypage' ? (
          /* 마이페이지 & 내면 상태 진단창 & 1:1 맞춤 AI 계몽 대시보드 */
          <MyPageDashboard
            user={user}
            onOpenPricing={() => setIsPricingModalOpen(true)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onBackToHome={() => handleNavigate('intro')}
          />
        ) : (
          /* 랜딩 페이지 (서비스 소개 -> 구독하기 -> 상담 설명 -> 카카오톡 대화) */
          <>
            {/* 1. 서비스 소개 (Intro & Hero) */}
            <SimpleHeroSection
              onOpenPricing={() => setIsPricingModalOpen(true)}
            />

            {/* 2. 구독하기 (Membership Subscription - 정기결제) */}
            <SubscriptionSection
              user={user}
              onOpenPricing={() => setIsPricingModalOpen(true)}
            />

            {/* 3. 상담 설명 (4대 핵심 계몽 테마 & 1:1 코칭 솔루션) */}
            <AwakeningThemesSection />

            {/* 4. 카카오톡 대화 (데일리 맞춤 알림 및 1:1 대화 케어) */}
            <KakaoCareSection
              onOpenPricing={() => setIsPricingModalOpen(true)}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <FooterSection
        onNavigate={handleNavigate}
        onOpenPricing={() => setIsPricingModalOpen(true)}
      />

      {/* --- Essential Modals --- */}
      
      {/* Membership Pricing Modal (베이직 / 프리미엄 정기결제) */}
      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSelectPlan={handleSelectPlan}
      />

      {/* Kakao Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(u) => {
          setUser(u);
          // If subscribed, go to mypage; otherwise keep on current section
          if (u.subscription.plan === 'basic' || u.subscription.plan === 'premium') {
            setActiveSection('mypage');
          }
        }}
      />

    </div>
  );
}
