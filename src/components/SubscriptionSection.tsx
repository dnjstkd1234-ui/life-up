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
            2. 프리미엄 리딩 (1회성)
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-stone-900">
            당신의 인지 왜곡을 깨부수는 통찰
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            가벼운 위로 대신 팩트로 뼈를 때리는 단 하나의 통찰 리포트를 받아보세요.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="max-w-xl mx-auto">
          
          {/* One-Time Plan */}
          <div className="bg-gradient-to-b from-blue-50/60 via-white to-sky-50/20 rounded-3xl p-6 sm:p-8 border-2 border-blue-500 shadow-xl relative flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-blue-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-100/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    <span>프리미엄 1회권</span>
                  </span>
                  <h3 className="text-xl font-extrabold text-stone-900 mt-1">운명 통찰 리포트</h3>
                  <p className="text-xs text-stone-500">영혼을 꿰뚫는 마스터의 맞춤형 심층 분석</p>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-extrabold text-blue-600 font-sans tracking-tight">
                    1,990<span className="text-base font-bold text-stone-800">원</span>
                  </div>
                  <span className="text-xs font-medium text-stone-500"> / 1회</span>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-stone-800 block">✨ 리포트 포함 내용</span>
                
                <ul className="space-y-2.5 text-xs text-stone-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>1:1 심층 심리 분석</strong> 및 숨겨진 결핍 진단</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>잘못된 믿음과 인지적 왜곡을 파괴하는 <strong>팩트 폭력</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>당장 실천해야 할 <strong>구체적 행동 지침</strong> 제공</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>마이페이지 내 <strong>무제한 영구 보관</strong></span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenPricing}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
              >
                <span>{plan === 'premium' ? '결제 완료 (리포트 열람 가능)' : '1,990원 결제하고 리포트 받기'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs text-stone-600 max-w-xl mx-auto flex items-center justify-center gap-2 text-center">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>결제 즉시 마이페이지에서 맞춤형 진단 및 리포트 생성이 활성화됩니다.</span>
        </div>

      </div>
    </section>
  );
};
