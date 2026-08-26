import React, { useState } from 'react';
import { X, Check, Sparkles, ShieldCheck, Zap, ArrowRight, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onSelectPlan: (plan: 'basic' | 'premium') => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  user,
  onSelectPlan
}) => {
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = (plan: 'basic' | 'premium') => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      confetti({ particleCount: 100, spread: 70 });
      onSelectPlan(plan);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl text-stone-900 relative my-6 max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Membership Plans
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-900">
            당신의 성장에 가장 알맞은 <br />
            멤버십 플랜을 선택해보세요
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            모든 플랜은 3일간 전액 무료로 체험하실 수 있으며, 언제든 자유롭게 해지 가능합니다.
          </p>

          {/* Billing Switch */}
          <div className="inline-flex items-center gap-2 p-1 bg-stone-100 rounded-2xl mt-4">
            <button
              onClick={() => setSelectedBilling('monthly')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedBilling === 'monthly' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
              }`}
            >
              월간 결제
            </button>
            <button
              onClick={() => setSelectedBilling('yearly')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedBilling === 'yearly' ? 'bg-blue-600 text-white shadow-xs' : 'text-stone-500'
              }`}
            >
              <span>연간 결제</span>
              <span className="text-[10px] bg-amber-400 text-stone-900 px-1.5 py-0.2 rounded-full font-extrabold">20% 할인</span>
            </button>
          </div>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* Plan 1: 3일 무료 체험 */}
          <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-stone-500">체험용</span>
                <h3 className="text-lg font-bold text-stone-900 mt-1">3일 무료 체험</h3>
                <p className="text-xs text-stone-500 mt-1">부담 없이 라이프업의 핵심 기능을 경험해보세요</p>
              </div>

              <div className="text-2xl font-extrabold text-stone-900">
                0원 <span className="text-xs font-normal text-stone-500">/ 3일간</span>
              </div>

              <ul className="space-y-2.5 text-xs text-stone-700 pt-2 border-t border-stone-200">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>1:1 AI 코칭 무제한 대화</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>카카오톡 모닝케어 3일 체험</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>라이프 밸런스 5대 지표 진단</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full py-3 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold transition-colors"
            >
              현재 이용 중 (무료)
            </button>
          </div>

          {/* Plan 2: 베이직 멤버십 (인기) */}
          <div className="bg-gradient-to-b from-blue-50 to-white rounded-3xl p-6 border-2 border-blue-500 shadow-md relative flex flex-col justify-between">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-sky-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
              가장 인기 있는 선택
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-blue-600">데일리 습관 & 멘탈</span>
                <h3 className="text-lg font-bold text-stone-900 mt-1">베이직 멤버십</h3>
                <p className="text-xs text-stone-500 mt-1">규칙적인 아침 루틴과 심리적 안정을 위한 플랜</p>
              </div>

              <div className="text-2xl font-extrabold text-blue-600">
                {selectedBilling === 'yearly' ? '15,900원' : '19,900원'}
                <span className="text-xs font-normal text-stone-500"> / 월</span>
              </div>

              <ul className="space-y-2.5 text-xs text-stone-700 pt-2 border-t border-blue-100">
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>매일 아침 카카오톡 1:1 모닝케어 발송</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>4대 전문 코치진 24시간 무제한 상담</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>성장 다이어리 & 액션 플랜 클라우드 저장</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>월간 성장 분석 리포트 발행</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleCheckout('basic')}
              disabled={isProcessing}
              className="mt-6 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-1.5"
            >
              {isProcessing ? '구독 신청 중...' : '베이직 멤버십 시작하기'}
            </button>
          </div>

          {/* Plan 3: 프리미엄 마스터 코칭 */}
          <div className="bg-stone-900 text-white rounded-3xl p-6 border border-stone-800 shadow-md flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-sky-400">커리어 & 리더십 심화</span>
                <h3 className="text-lg font-bold text-white mt-1">프리미엄 마스터</h3>
                <p className="text-xs text-stone-400 mt-1">커리어 도약과 집중 목표 달성을 위한 1:1 심화 코칭</p>
              </div>

              <div className="text-2xl font-extrabold text-white">
                {selectedBilling === 'yearly' ? '39,000원' : '49,000원'}
                <span className="text-xs font-normal text-stone-400"> / 월</span>
              </div>

              <ul className="space-y-2.5 text-xs text-stone-300 pt-2 border-t border-stone-800">
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span>베이직의 모든 혜택 포함</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span>월 1회 인간 전문 코치 1:1 라이브 세션</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span>이직/승진 맞춤 로드맵 & 포트폴리오 첨삭</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span>프리미엄 커뮤니티 전용 특강 무료 초대</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleCheckout('premium')}
              disabled={isProcessing}
              className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white text-xs font-bold shadow-md transition-colors"
            >
              {isProcessing ? '구독 신청 중...' : '프리미엄 멤버십 시작하기'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
