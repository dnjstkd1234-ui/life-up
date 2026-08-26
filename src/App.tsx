import React, { useState, useEffect } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { HeroSlider } from './components/HeroSlider';
import { AboutQuickLinks } from './components/AboutQuickLinks';
import { VisualBentoSection } from './components/VisualBentoSection';
import { MainSloganBanner } from './components/MainSloganBanner';
import { CalendarAndNewsSection } from './components/CalendarAndNewsSection';
import { FastLeadInquiryBar } from './components/FastLeadInquiryBar';
import { UserReviewSection } from './components/UserReviewSection';
import { BottomCtaBanner } from './components/BottomCtaBanner';
import { FooterSection } from './components/FooterSection';

import { LiveCoachingModal } from './components/LiveCoachingModal';
import { KakaoMorningCareModal } from './components/KakaoMorningCareModal';
import { LeadSuccessModal } from './components/LeadSuccessModal';
import { PricingModal } from './components/PricingModal';
import { CoachDetailModal } from './components/CoachDetailModal';
import { GalleryModal } from './components/GalleryModal';
import { LocationModal } from './components/LocationModal';
import { AuthModal } from './components/AuthModal';

import { UserProfile, EventCalendarItem } from './types';
import { auth, getUserProfile, saveUserProfile, createDefaultProfile } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Modal States
  const [isCoachingModalOpen, setIsCoachingModalOpen] = useState(false);
  const [isKakaoModalOpen, setIsKakaoModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);

  // Fast Lead Capture Success State
  const [leadSuccessInfo, setLeadSuccessInfo] = useState<{ name: string; phone: string } | null>(null);

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
      setIsPricingModalOpen(true);
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToLeadForm = () => {
    const elem = document.getElementById('lead-form');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
      // Focus on input
      setTimeout(() => {
        const input = document.getElementById('lead-input-name');
        if (input) input.focus();
      }, 500);
    }
  };

  const handleLeadSuccess = (name: string, phone: string) => {
    setLeadSuccessInfo({ name, phone });
  };

  const handleUpdateNotificationTime = async (time: string, enabled: boolean) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      subscription: {
        ...user.subscription,
        notificationTime: time,
        kakaoNotificationEnabled: enabled
      }
    };
    await saveUserProfile(updated);
    setUser(updated);
  };

  const handleSelectPlan = async (plan: 'basic' | 'premium') => {
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
    const guestProf = createDefaultProfile(guestUid, null, '체험 회원');
    setUser(guestProf);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* 1. Header Global Navigation Bar */}
      <HeaderNav
        user={user}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenPricing={() => setIsPricingModalOpen(true)}
        onOpenCoachingModal={() => setIsCoachingModalOpen(true)}
        onOpenKakaoModal={() => setIsKakaoModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* 2. Hero Visual Slider with < 1 / 3 > pagination */}
        <HeroSlider
          onOpenCoachingModal={() => setIsCoachingModalOpen(true)}
          onOpenPricingModal={() => setIsPricingModalOpen(true)}
          onScrollToLeadForm={handleScrollToLeadForm}
        />

        {/* 3. About Us & 3 Quick Links */}
        <AboutQuickLinks
          onNavigateCalendar={() => handleNavigate('calendar')}
          onNavigatePrograms={() => handleNavigate('programs')}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
        />

        {/* 4. Visual Bento Section (The Masters Program, Event Promo, Coach Intro, Photo Gallery) */}
        <VisualBentoSection
          onOpenCoachingModal={() => setIsCoachingModalOpen(true)}
          onOpenPricingModal={() => setIsPricingModalOpen(true)}
          onOpenCoachDetail={(coachId) => setSelectedCoachId(coachId)}
          onOpenGalleryModal={() => setIsGalleryModalOpen(true)}
        />

        {/* 5. Main English/Korean Slogan Banner */}
        <MainSloganBanner />

        {/* 6. Calendar Schedule & Latest News Notice Board */}
        <CalendarAndNewsSection
          onSelectEvent={(event: EventCalendarItem) => {
            setSelectedCoachId('mindset');
          }}
          onOpenCoachingModal={() => setIsCoachingModalOpen(true)}
        />

        {/* 7. High-Converting Fast Lead Inquiry Blue Bar */}
        <FastLeadInquiryBar
          onSuccess={handleLeadSuccess}
        />

        {/* 8. User Honest Reviews Carousel & Stats */}
        <UserReviewSection />

        {/* 9. Bottom CTA Conversion Banner */}
        <BottomCtaBanner
          onScrollToLeadForm={handleScrollToLeadForm}
          onOpenCoachingModal={() => setIsCoachingModalOpen(true)}
        />

      </main>

      {/* 10. Comprehensive Footer */}
      <FooterSection
        onScrollToLeadForm={handleScrollToLeadForm}
        onNavigate={handleNavigate}
      />

      {/* --- Interactive Modals --- */}
      
      {/* 1:1 Live AI Coaching Modal */}
      <LiveCoachingModal
        isOpen={isCoachingModalOpen}
        onClose={() => setIsCoachingModalOpen(false)}
        user={user}
        onOpenPricing={() => {
          setIsCoachingModalOpen(false);
          setIsPricingModalOpen(true);
        }}
      />

      {/* KakaoTalk Morning Care Simulator Modal */}
      <KakaoMorningCareModal
        isOpen={isKakaoModalOpen}
        onClose={() => setIsKakaoModalOpen(false)}
        user={user}
        onUpdateNotificationTime={handleUpdateNotificationTime}
      />

      {/* Fast Lead Submit Success Celebration Modal */}
      <LeadSuccessModal
        isOpen={!!leadSuccessInfo}
        onClose={() => setLeadSuccessInfo(null)}
        leadName={leadSuccessInfo?.name || '고객'}
        leadPhone={leadSuccessInfo?.phone || ''}
        onOpenCoachingModal={() => {
          setLeadSuccessInfo(null);
          setIsCoachingModalOpen(true);
        }}
      />

      {/* Membership Pricing Modal */}
      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        user={user}
        onSelectPlan={handleSelectPlan}
      />

      {/* Coach Detail Curriculum Modal */}
      <CoachDetailModal
        coachId={selectedCoachId}
        onClose={() => setSelectedCoachId(null)}
        onSelectCoachForChat={(coachId) => {
          setSelectedCoachId(null);
          setIsCoachingModalOpen(true);
        }}
      />

      {/* Photo Gallery Modal */}
      <GalleryModal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
      />

      {/* Location / Center Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />

      {/* Social Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(u) => setUser(u)}
      />

    </div>
  );
}
