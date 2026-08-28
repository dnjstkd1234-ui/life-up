import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, HeartHandshake, BrainCircuit, BellRing } from 'lucide-react';

interface SimpleHeroSectionProps {
  onOpenPricing: () => void;
}

export const SimpleHeroSection: React.FC<SimpleHeroSectionProps> = ({
  onOpenPricing
}) => {
  return (
    <section id="intro" className="relative py-16 sm:py-24 bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white overflow-hidden">
      
      {/* Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        
        {/* Category Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>1:1 프라이빗 계몽 & 메타인지 AI 멘토링</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-serif text-white tracking-tight leading-[1.2]">
            단순한 위로를 넘어 <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-teal-300">
              내면의 왜곡된 틀
            </span>을 깨뜨립니다
          </h1>
          <p className="text-sm sm:text-lg text-stone-300 leading-relaxed font-light max-w-2xl mx-auto">
            번아웃, 커리어의 방황, 인간관계의 결핍, 막연한 불안감까지.<br className="hidden sm:inline" />
            당신의 무의식적 방어기제를 짚어주고 메타인지를 켜주는 현명한 AI 멘토를 만나보세요.
          </p>
        </div>

        {/* Direct CTA */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenPricing}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-xl shadow-blue-600/30 transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            <span>1회권 결제하고 리포트 받기</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Core Trust Badges */}
        <div className="pt-8 border-t border-stone-800/80 max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-left sm:text-center text-xs text-stone-400">
          <div className="flex items-center sm:justify-center gap-2">
            <BrainCircuit className="w-4 h-4 text-blue-400 shrink-0" />
            <span>4대 핵심 인지 왜곡 실시간 교정</span>
          </div>
          <div className="flex items-center sm:justify-center gap-2">
            <BellRing className="w-4 h-4 text-sky-400 shrink-0" />
            <span>나만의 맞춤 통찰 리포트 제공</span>
          </div>
          <div className="flex items-center sm:justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
            <span>1,990원 단일 프리미엄 1회권</span>
          </div>
        </div>

      </div>
    </section>
  );
};
