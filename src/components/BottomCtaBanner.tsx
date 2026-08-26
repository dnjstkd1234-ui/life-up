import React from 'react';
import { ChevronRight, Sparkles, MessageSquare, PhoneCall } from 'lucide-react';

interface BottomCtaBannerProps {
  onScrollToLeadForm: () => void;
  onOpenCoachingModal: () => void;
}

export const BottomCtaBanner: React.FC<BottomCtaBannerProps> = ({
  onScrollToLeadForm,
  onOpenCoachingModal
}) => {
  return (
    <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 text-white py-12 sm:py-16 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
        
        {/* Left Headline */}
        <div className="space-y-3 text-center lg:text-left max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-sky-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>맞춤형 라이프 솔루션</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif leading-tight">
            1:1 개인 코칭과 데일리 루틴 챌린지, <br />
            당신의 성장에 꼭 맞춰 준비했습니다.
          </h2>
          <p className="text-xs sm:text-sm text-stone-300">
            지금 시작하면 3일간 모든 프리미엄 기능을 무료로 체험하실 수 있습니다.
          </p>
        </div>

        {/* Right CTA Action Buttons matching user image */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto flex-shrink-0">
          <button
            onClick={onScrollToLeadForm}
            className="w-full sm:w-auto lg:w-80 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-between group shadow-md"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>데일리 모닝케어 & 습관 챌린지 문의하기</span>
            </div>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onOpenCoachingModal}
            className="w-full sm:w-auto lg:w-80 px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-400 hover:to-sky-400 text-white font-extrabold text-xs sm:text-sm transition-all flex items-center justify-between group shadow-lg shadow-blue-500/30"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-white" />
              <span>1:1 마스터 코칭 & 커리어 설계 체험하기</span>
            </div>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};
