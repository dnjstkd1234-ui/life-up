import React, { useState } from 'react';
import { X, Check, Sparkles, ShieldCheck, ArrowRight, BellRing, BrainCircuit, Zap, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, PlanType } from '../types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onOpenAuth?: () => void;
  onSelectPlan: (plan: PlanType) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenAuth,
  onSelectPlan
}) => {
  const [selectedTier, setSelectedTier] = useState<'basic' | 'premium'>('basic');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const currentPlan = user?.subscription?.plan;
  const isSubscribed = currentPlan === 'basic' || currentPlan === 'premium' || currentPlan === 'subscribed';

  if (!isOpen) return null;

  const handleCheckout = (tier: 'basic' | 'premium') => {
    // If not logged in with Kakao (or still guest without email), prompt Kakao login first
    if (!user || user.uid === 'guest_marketing_user') {
      if (onOpenAuth) {
        onClose();
        onOpenAuth();
        return;
      }
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      onSelectPlan(tier);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-stone-900 relative my-6 max-h-[92vh] overflow-y-auto border border-stone-100">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-lg mx-auto mb-6 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 border border-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>라이프업 정기구독 멤버십</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-900 leading-tight">
            내 삶의 인지 왜곡을 깨부수는 <br />
            1:1 맞춤 AI 계몽 정기결제
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            카카오 로그인 후 원하시는 플랜을 선택하면 마이페이지 내면 진단 및 1:1 상담이 즉시 열립니다.
          </p>
        </div>

        {/* Two-Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          
          {/* 1. Basic Plan (월 6,500원) */}
          <div 
            onClick={() => setSelectedTier('basic')}
            className={`rounded-3xl p-5 sm:p-6 border-2 transition-all cursor-pointer flex flex-col justify-between relative ${
              selectedTier === 'basic'
                ? 'border-blue-500 bg-gradient-to-b from-blue-50/60 via-white to-sky-50/20 shadow-md ring-2 ring-blue-400/30'
                : 'border-stone-200 bg-white hover:border-stone-300'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 bg-blue-100/70 px-2.5 py-0.5 rounded-full">
                  추천 · 베이직
                </span>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-stone-900 font-sans">6,500</span>
                  <span className="text-xs text-stone-500 font-medium">원 / 월</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-stone-900">베이직 정기구독</h3>
                <p className="text-[11px] text-stone-500 mt-0.5">매일 아침 계몽 알림톡 & 1:1 AI 상담</p>
              </div>

              <ul className="space-y-2 text-xs text-stone-700 pt-2 border-t border-stone-100">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>1:1 맞춤 AI 계몽 멘토링</strong> 24시간 무제한</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>매일 아침 8시 카카오 알림톡</strong> 맞춤 발송</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>마이페이지 <strong>내면 상태 진단창</strong> 연동</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>언제든 위약금 없는 <strong>상시 원클릭 해지</strong></span>
                </li>
              </ul>
            </div>

            <div className="pt-5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCheckout('basic');
                }}
                disabled={isProcessing}
                className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                  currentPlan === 'basic'
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30 active:scale-98'
                }`}
              >
                {currentPlan === 'basic' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>현재 구독 중</span>
                  </>
                ) : (
                  <>
                    <span>베이직 구독 시작 (6,500원/월)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 2. Premium Plan (월 12,900원) */}
          <div 
            onClick={() => setSelectedTier('premium')}
            className={`rounded-3xl p-5 sm:p-6 border-2 transition-all cursor-pointer flex flex-col justify-between relative ${
              selectedTier === 'premium'
                ? 'border-amber-500 bg-gradient-to-b from-amber-50/50 via-white to-orange-50/20 shadow-md ring-2 ring-amber-400/30'
                : 'border-stone-200 bg-white hover:border-stone-300'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-600" />
                  <span>심층 케어 · 프리미엄</span>
                </span>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-stone-900 font-sans">12,900</span>
                  <span className="text-xs text-stone-500 font-medium">원 / 월</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-stone-900">프리미엄 정기구독</h3>
                <p className="text-[11px] text-stone-500 mt-0.5">심층 인지 분석 리포트 & 우선 대화</p>
              </div>

              <ul className="space-y-2 text-xs text-stone-700 pt-2 border-t border-stone-100">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>베이직의 모든 혜택</strong> 기본 포함</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>심층 꼬리질문 딥다이브</strong> 무제한 분석</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>주간 <strong>메타인지 심리 분석 리포트</strong> 제공</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>긴급 멘탈 회복 <strong>우선 응답 AI 채널</strong></span>
                </li>
              </ul>
            </div>

            <div className="pt-5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCheckout('premium');
                }}
                disabled={isProcessing}
                className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                  currentPlan === 'premium'
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-stone-900 hover:bg-stone-800 text-white shadow-sm active:scale-98'
                }`}
              >
                {currentPlan === 'premium' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>현재 구독 중</span>
                  </>
                ) : (
                  <>
                    <span>프리미엄 구독 시작 (12,900원/월)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Footer Guarantee */}
        <div className="mt-6 p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between text-[11px] text-stone-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>카카오페이 / 신용카드 정기결제 지원 · 언제든 위약금 없이 즉시 해지 가능</span>
          </div>
          <span className="text-stone-400 hidden sm:inline">256-bit SSL 암호화</span>
        </div>

      </div>
    </div>
  );
};
