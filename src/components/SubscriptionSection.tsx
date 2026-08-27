import React from 'react';
import { Sparkles, Check, ArrowRight, ShieldCheck, HeartHandshake, BellRing, BrainCircuit, Crown } from 'lucide-react';
import { UserProfile } from '../types';

interface SubscriptionSectionProps {
  user: UserProfile | null;
  onOpenPricing: () => void;
}

export const SubscriptionSection: React.FC<SubscriptionSectionProps> = ({
  user,
  onOpenPricing
}) => {
  const plan = user?.subscription?.plan;
  const isSubscribed = plan === 'basic' || plan === 'premium' || plan === 'subscribed';

  return (
    <section id="pricing" className="py-20 bg-white border-b border-stone-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
            2. 구독하기 (정기결제)
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-stone-900">
            내게 맞는 정기구독 플랜 선택
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            카카오 로그인 후 원클릭 정기결제로 24시간 언제 어디서나 1:1 맞춤 AI 계몽 멘토를 곁에 두세요.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* 1. Basic Plan (월 6,500원) */}
          <div className="bg-gradient-to-b from-blue-50/60 via-white to-sky-50/20 rounded-3xl p-6 sm:p-8 border-2 border-blue-500 shadow-xl relative flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-blue-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-100/80 px-2.5 py-0.5 rounded-full">
                    인기 플랜
                  </span>
                  <h3 className="text-xl font-extrabold text-stone-900 mt-1">베이직 멤버십</h3>
                  <p className="text-xs text-stone-500">1:1 맞춤 계몽 코칭 & 카카오톡 데일리 케어</p>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-extrabold text-blue-600 font-sans tracking-tight">
                    6,500<span className="text-base font-bold text-stone-800">원</span>
                  </div>
                  <span className="text-xs font-medium text-stone-500"> / 월 (정기결제)</span>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-stone-800 block">✨ 베이직 포함 혜택</span>
                
                <ul className="space-y-2.5 text-xs text-stone-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>1:1 맞춤 AI 계몽 멘토</strong> 24시간 무제한 상담</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>매일 아침 8시 카카오 알림톡</strong> 맞춤 발송</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>마이페이지 <strong>내면 상태 진단창</strong> 지원</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>메타인지 성장 다이어리</strong> 클라우드 저장</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenPricing}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
              >
                <span>{plan === 'basic' ? '현재 이용 중인 플랜' : '월 6,500원 베이직 구독하기'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* 2. Premium Plan (월 12,900원) */}
          <div className="bg-gradient-to-b from-amber-50/50 via-white to-orange-50/20 rounded-3xl p-6 sm:p-8 border-2 border-amber-500 shadow-xl relative flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-amber-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 w-max">
                    <Crown className="w-3 h-3 text-amber-600" />
                    <span>심층 멘토링</span>
                  </span>
                  <h3 className="text-xl font-extrabold text-stone-900 mt-1">프리미엄 멤버십</h3>
                  <p className="text-xs text-stone-500">심층 인지 왜곡 딥다이브 & 주간 심리 리포트</p>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-extrabold text-stone-900 font-sans tracking-tight">
                    12,900<span className="text-base font-bold text-stone-800">원</span>
                  </div>
                  <span className="text-xs font-medium text-stone-500"> / 월 (정기결제)</span>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-stone-800 block">👑 프리미엄 전용 혜택</span>
                
                <ul className="space-y-2.5 text-xs text-stone-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>베이직의 모든 혜택</strong> 기본 포함</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>심층 꼬리질문 딥다이브</strong> 무제한 분석 세션</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>주간 <strong>메타인지 심리 분석 리포트</strong> 발행</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>긴급 멘탈 회복 <strong>우선 응답 AI 채널</strong> 배정</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenPricing}
                className="w-full py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{plan === 'premium' ? '현재 이용 중인 플랜' : '월 12,900원 프리미엄 구독하기'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs text-stone-600 max-w-xl mx-auto flex items-center justify-center gap-2 text-center">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>모든 플랜은 약정 및 위약금 없이 마이페이지에서 원클릭으로 상시 해지할 수 있습니다.</span>
        </div>

      </div>
    </section>
  );
};
