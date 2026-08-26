import React from 'react';
import { BellRing, ArrowRight } from 'lucide-react';

interface KakaoCareSectionProps {
  onOpenPricing: () => void;
}

export const KakaoCareSection: React.FC<KakaoCareSectionProps> = ({ onOpenPricing }) => {
  return (
    <section id="kakao" className="py-20 bg-white border-b border-stone-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-50 to-orange-50 rounded-3xl p-8 sm:p-12 border border-amber-200/80 shadow-sm flex flex-col md:flex-row items-center gap-8 justify-between">
          
          <div className="space-y-4 max-w-xl text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-200/60 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5">
              <BellRing className="w-3.5 h-3.5" />
              <span>4. 카카오톡 대화 & 데일리 알림</span>
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-900 leading-tight">
              매일 아침 8시, <br />
              당신의 인지적 맹점을 찌르는 질문 1개
            </h2>

            <p className="text-sm text-stone-600 leading-relaxed">
              단순한 복붙 응원 문자가 아닙니다. 전날 나눈 상담 기록과 나의 인지 왜곡 패턴을 분석하여, 아침마다 스스로 메타인지를 켜고 주체적으로 하루를 열 수 있도록 카카오톡으로 직접 대화와 통찰을 전합니다.
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenPricing}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-transform active:scale-95 flex items-center gap-2"
              >
                <span>월 6,500원으로 카카오 맞춤 대화 케어 받기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Kakao Preview Mockup */}
          <div className="w-full max-w-xs bg-amber-100/90 rounded-2xl p-4 border border-amber-300/80 shadow-md space-y-2.5 text-xs text-stone-800">
            <div className="flex items-center gap-2 pb-2 border-b border-amber-200">
              <div className="w-6 h-6 rounded-lg bg-amber-400 flex items-center justify-center font-bold text-[10px] text-stone-900">
                💬
              </div>
              <span className="font-bold text-stone-900 text-xs">라이프업 알림톡</span>
            </div>

            <div className="bg-white rounded-xl p-3.5 shadow-2xs space-y-2.5 leading-relaxed">
              <p className="font-bold text-stone-900 text-xs">[내일의 계몽 알림톡]</p>
              <div className="space-y-1.5 text-[11px] text-stone-700">
                <p>
                  <strong>문장:</strong> 내가 통제할 수 없는 타인의 기준을 내려놓을 때 진정한 내 삶이 시작됩니다.
                </p>
                <p className="text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200/60 text-[10.5px]">
                  <strong>질문:</strong> 내일 하루 동안, 남들의 시선이 아닌 온전한 나를 위한 단 하나의 선택은 무엇인가요?
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
