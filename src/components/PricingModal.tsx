import React, { useState } from 'react';
import { X, Check, Sparkles, ShieldCheck, Zap, ArrowRight, HeartHandshake, BellRing, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onSelectPlan: (plan: 'subscribed') => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  user,
  onSelectPlan
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const isSubscribed = user?.subscription?.plan === 'subscribed';

  if (!isOpen) return null;

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      onSelectPlan('subscribed');
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl text-stone-900 relative my-6 max-h-[92vh] overflow-y-auto border border-stone-100">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-lg mx-auto mb-6 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>라이프업 구독 멤버십</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-900 leading-tight">
            하루 약 200원으로 누리는 <br />
            나만의 1:1 맞춤 AI 계몽 멘토
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            복잡한 조건 없이 오직 단 하나의 합리적인 구독 플랜으로 모든 서비스를 무제한 이용하세요.
          </p>
        </div>

        {/* Single Subscription Plan Card (월 6,500원) */}
        <div className="bg-gradient-to-b from-blue-50/70 via-white to-sky-50/40 rounded-3xl p-6 sm:p-7 border-2 border-blue-500 shadow-xl relative flex flex-col justify-between">
          
          <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-sky-500 text-white text-[11px] font-extrabold px-4 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>라이프업 올인원 정기 구독</span>
          </div>

          <div className="space-y-5 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-blue-100 pb-4">
              <div>
                <span className="text-xs font-bold text-blue-600">구독 플랜</span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-0.5">라이프업 월간 구독</h3>
                <p className="text-xs text-stone-500 mt-0.5">24시간 1:1 계몽 코칭 & 데일리 카톡 맞춤 케어</p>
              </div>

              <div className="text-right sm:text-right">
                <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 font-sans tracking-tight">
                  6,500<span className="text-lg font-bold text-stone-800">원</span>
                </div>
                <span className="text-xs font-medium text-stone-500"> / 월 (구독)</span>
              </div>
            </div>

            {/* Benefit List */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-stone-800 tracking-wide block">
                ✨ 구독 시 제공되는 전체 혜택
              </span>
              
              <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700">
                <li className="flex items-start gap-2.5 font-medium">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-stone-900">1:1 맞춤 AI 계몽 멘토 24시간 무제한 상담</strong>
                    <p className="text-[11px] text-stone-500 font-normal">번아웃, 커리어, 연애, 불안 등 4대 핵심 인지 왜곡 실시간 교정</p>
                  </div>
                </li>

                <li className="flex items-start gap-2.5 font-medium">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <BellRing className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-stone-900">매일 아침 카카오톡 맞춤 계몽 알림톡</strong>
                    <p className="text-[11px] text-stone-500 font-normal">전날 대화 기반 인지적 맹점을 찌르는 통찰 질문 & 1일 1미션 발송</p>
                  </div>
                </li>

                <li className="flex items-start gap-2.5 font-medium">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-stone-900">메타인지 성장 다이어리 클라우드 무제한 저장</strong>
                    <p className="text-[11px] text-stone-500 font-normal">사실과 해석 분리 노트, 패러다임 시프트 기록 및 분석</p>
                  </div>
                </li>

                <li className="flex items-start gap-2.5 font-medium">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <HeartHandshake className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-stone-900">약정 없는 자유로운 구독 및 상시 해지</strong>
                    <p className="text-[11px] text-stone-500 font-normal">위약금 없이 언제든 클릭 한 번으로 간편하게 해지 가능</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Safe Notice */}
            <div className="p-3 bg-stone-100/90 rounded-2xl border border-stone-200/80 text-[11px] text-stone-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>매월 6,500원이 정기 결제되며, 추가 숨은 비용은 일절 없습니다.</span>
            </div>

          </div>

          {/* Action Button */}
          <div className="pt-6">
            <button
              onClick={handleCheckout}
              disabled={isProcessing || isSubscribed}
              className={`w-full py-4 rounded-2xl font-bold text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2 ${
                isSubscribed
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white active:scale-98 shadow-blue-500/25'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>구독 처리 중...</span>
                </>
              ) : isSubscribed ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>현재 구독 중인 멤버십입니다</span>
                </>
              ) : (
                <>
                  <span>월 6,500원으로 구독 시작하기</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </div>

        {/* Footer info */}
        <div className="mt-5 text-center text-xs text-stone-400">
          안전한 암호화 결제 시스템 · 카카오페이 / 네이버페이 / 신용카드 지원
        </div>

      </div>
    </div>
  );
};
