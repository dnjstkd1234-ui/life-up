import React from 'react';
import { Sparkles } from 'lucide-react';

export const MainSloganBanner: React.FC = () => {
  return (
    <section className="py-14 sm:py-20 bg-stone-100 text-center relative overflow-hidden border-b border-stone-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-3">
        <p className="text-xs sm:text-sm font-semibold text-stone-600 tracking-wider">
          매일 새로운 성장이 있는 라이프업, 여러분을 초대합니다
        </p>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-blue-700 tracking-tight font-sans drop-shadow-xs">
          LET'S MAKE SOME <br className="sm:hidden" />
          <span className="text-stone-900">LIFE-CHANGING MEMORIES!</span>
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-sky-400 mx-auto rounded-full mt-4" />
      </div>
    </section>
  );
};
