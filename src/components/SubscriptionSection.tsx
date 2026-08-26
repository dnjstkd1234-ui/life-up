import React from 'react';
import { Sparkles, Check, ArrowRight, ShieldCheck, HeartHandshake, BellRing, BrainCircuit } from 'lucide-react';
import { UserProfile } from '../types';

interface SubscriptionSectionProps {
  user: UserProfile | null;
  onOpenPricing: () => void;
}

export const SubscriptionSection: React.FC<SubscriptionSectionProps> = ({
  user,
  onOpenPricing
}) => {
  const isSubscribed = user?.subscription?.plan === 'subscribed';

  return (
    <section id="pricing" className="py-20 bg-stone-50 border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
            Membership Plan
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-stone-900">
            단 하나의 합리적인 구독 플랜
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            하루 약 200원으로 24시간 언제 어디서나 나만의 AI 계몽 멘토를 곁에 두세요.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="bg-gradient-to-b from-blue-50/70 via-white to-sky-50/30 rounded-3xl p-6 sm:p-10 border-2 border-blue-500 shadow-xl relative max-w-xl mx-auto space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-blue-100 pb-5">
            <div>
              <span className="text-xs font-bold text-blue-600">월간 정기 구독</span>
              <h3 className="text-2xl font-extrabold text-stone-900 mt-0.5">라이프업 멤버십</h3>
              <p className="text-xs text-stone-500 mt-0.5">1:1 맞춤 계몽 코칭 & 카카오톡 데일리 케어</p>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 font-sans tracking-tight">
                6,500<span className="text-lg font-bold text-stone-800">원</span>
              </div>
              <span className="text-xs font-medium text-stone-500"> / 월 (구독)</span>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-3.5">
            <span className="text-xs font-bold text-stone-800 block">✨ 포함된 모든 혜택</span>
            
            <ul className="space-y-3 text-xs sm:text-sm text-stone-700">
              <li className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-stone-900">1:1 맞춤 AI 계몽 멘토 24시간 무제한 상담</strong>
                  <p className="text-[11px] text-stone-500 font-normal">번아웃, 커리어, 연애, 불안 등 4대 핵심 인지 왜곡 실시간 교정</p>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <BellRing className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-stone-900">매일 아침 카카오톡 맞춤 계몽 알림톡</strong>
                  <p className="text-[11px] text-stone-500 font-normal">전날 상담 기반 인지적 맹점을 찌르는 통찰 질문 & 1일 1미션 발송</p>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <BrainCircuit className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-stone-900">메타인지 성장 다이어리 클라우드 저장</strong>
                  <p className="text-[11px] text-stone-500 font-normal">사실과 해석 분리 노트, 패러다임 시프트 기록 및 분석</p>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
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

          <div className="p-3 bg-stone-100/90 rounded-2xl border border-stone-200/80 text-[11px] text-stone-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>매월 6,500원이 정기 결제되며, 추가 숨은 비용은 없습니다.</span>
          </div>

          <button
            onClick={onOpenPricing}
            className={`w-full py-4 rounded-2xl font-bold text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2 ${
              isSubscribed
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white active:scale-98 shadow-blue-500/25'
            }`}
          >
            {isSubscribed ? (
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
    </section>
  );
};
