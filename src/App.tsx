import React, { useState, useEffect } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { SimpleHeroSection } from './components/SimpleHeroSection';
import { AwakeningThemesSection } from './components/AwakeningThemesSection';
import { KakaoCareSection } from './components/KakaoCareSection';
import { SubscriptionSection } from './components/SubscriptionSection';
import { FooterSection } from './components/FooterSection';

import { PricingModal } from './components/PricingModal';
import { AuthModal } from './components/AuthModal';

import { UserProfile } from './types';
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
    if (sectionId === 'pricing') {
      const elem = document.getElementById('pricing');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      } else {
        setIsPricingModalOpen(true);
      }
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectPlan = async (plan: 'subscribed') => {
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
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* 1. Simple, Clean Header */}
      <HeaderNav
        user={user}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenPricing={() => setIsPricingModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* 2. Hero Section */}
        <SimpleHeroSection
          onOpenPricing={() => setIsPricingModalOpen(true)}
        />

        {/* 3. 4 Core Awakening Themes */}
        <AwakeningThemesSection />

        {/* 4. Daily Kakao Care Alert Section */}
        <KakaoCareSection
          onOpenPricing={() => setIsPricingModalOpen(true)}
        />

        {/* 5. Subscription Plan Section (월 6,500원) */}
        <SubscriptionSection
          user={user}
          onOpenPricing={() => setIsPricingModalOpen(true)}
        />

      </main>

      {/* 6. Clean Footer */}
      <FooterSection
        onNavigate={handleNavigate}
        onOpenPricing={() => setIsPricingModalOpen(true)}
      />

      {/* --- Essential Modals --- */}
      
      {/* Membership Pricing Modal */}
      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        user={user}
        onSelectPlan={handleSelectPlan}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(u) => setUser(u)}
      />

    </div>
  );
}
