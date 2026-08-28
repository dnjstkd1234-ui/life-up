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
            <span>라이프업 1회성 리딩 결제</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-900 leading-tight">
            내 삶의 인지 왜곡을 깨부수는 <br />
            운명 통찰 리포트 1회권
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            카카오 로그인 후 결제하시면 영혼을 꿰뚫는 마스터의 맞춤형 심층 통찰 리포트가 1회 제공됩니다.
          </p>
        </div>

        {/* One-Time Plan Card */}
        <div className="max-w-md mx-auto">
          <div 
            onClick={() => setSelectedTier('premium')}
            className={`rounded-3xl p-5 sm:p-6 border-2 transition-all cursor-pointer flex flex-col justify-between relative ${
              selectedTier === 'premium'
                ? 'border-blue-500 bg-gradient-to-b from-blue-50/60 via-white to-sky-50/20 shadow-md ring-2 ring-blue-400/30'
                : 'border-stone-200 bg-white hover:border-stone-300'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 bg-blue-100/70 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  <span>프리미엄 1회권</span>
                </span>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-stone-900 font-sans">1,990</span>
                  <span className="text-xs text-stone-500 font-medium">원 / 1회</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-stone-900">운명 통찰 리포트 생성</h3>
                <p className="text-[11px] text-stone-500 mt-0.5">단 한 번의 강력한 통찰로 닫힌 시야를 깨워줍니다.</p>
              </div>

              <ul className="space-y-2 text-xs text-stone-700 pt-2 border-t border-stone-100">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>1:1 심층 심리 분석</strong> 및 숨겨진 결핍 진단</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>잘못된 믿음과 인지적 왜곡을 파괴하는 <strong>팩트 폭력</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>현실적인 행동 지침 <strong>(Mindset & Action)</strong> 제공</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>마이페이지 내 <strong>무제한 영구 보관</strong> 열람 가능</span>
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
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30 active:scale-98'
                }`}
              >
                {currentPlan === 'premium' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>결제 완료 (리포트 열람 가능)</span>
                  </>
                ) : (
                  <>
                    <span>1회권 결제하기 (1,990원)</span>
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
            <span>카카오페이 / 신용카드 결제 지원 · 안전한 결제 시스템</span>
          </div>
          <span className="text-stone-400 hidden sm:inline">256-bit SSL 암호화</span>
        </div>

      </div>
    </div>
  );
};
