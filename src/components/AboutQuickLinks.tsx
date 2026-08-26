import React from 'react';
import { Calendar, FileText, MapPin, ArrowRight } from 'lucide-react';
import { QUICK_LINKS } from '../data/marketingData';

interface AboutQuickLinksProps {
  onNavigateCalendar: () => void;
  onNavigatePrograms: () => void;
  onOpenLocationModal: () => void;
}

export const AboutQuickLinks: React.FC<AboutQuickLinksProps> = ({
  onNavigateCalendar,
  onNavigatePrograms,
  onOpenLocationModal
}) => {
  return (
    <section id="about" className="bg-white py-12 sm:py-16 border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 sm:gap-12">
          
          {/* Left Text */}
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">About Us</span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-stone-900 font-serif leading-snug">
              라이프업은 일상의 스트레스 케어부터 커리어 성공까지 <br className="hidden sm:inline" />
              모든 수준의 성장을 체계적으로 제공합니다.
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 pt-1 font-sans">
              심리학 기반의 1:1 맞춤 AI 코칭과 24시간 언제 어디서나 접속할 수 있는 데일리 루틴 환경을 통해 건강하고 주체적인 삶의 변화를 만듭니다.
            </p>
          </div>

          {/* Right 3 Quick Links - Exact layout as image */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full lg:w-auto">
            {/* Quick 1: 코칭 일정표 */}
            <button
              onClick={onNavigateCalendar}
              className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-stone-50 hover:bg-blue-50/80 border border-stone-200/80 hover:border-blue-300 transition-all text-center group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all shadow-xs mb-2 sm:mb-3">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-stone-800 group-hover:text-blue-700">행사/코칭일정</span>
              <span className="text-[10px] text-stone-600 hidden sm:inline mt-0.5">실시간 일정 안내</span>
            </button>

            {/* Quick 2: 프로그램/지원안내 */}
            <button
              onClick={onNavigatePrograms}
              className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-stone-50 hover:bg-blue-50/80 border border-stone-200/80 hover:border-blue-300 transition-all text-center group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all shadow-xs mb-2 sm:mb-3">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-stone-800 group-hover:text-blue-700">지원/수강안내</span>
              <span className="text-[10px] text-stone-600 hidden sm:inline mt-0.5">맞춤형 코칭 설계</span>
            </button>

            {/* Quick 3: 오시는 길 & 상담실 */}
            <button
              onClick={onOpenLocationModal}
              className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-stone-50 hover:bg-blue-50/80 border border-stone-200/80 hover:border-blue-300 transition-all text-center group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all shadow-xs mb-2 sm:mb-3">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-stone-800 group-hover:text-blue-700">오시는 길</span>
              <span className="text-[10px] text-stone-600 hidden sm:inline mt-0.5">강남 센터 & 온라인</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
