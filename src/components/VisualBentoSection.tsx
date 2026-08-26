import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Gift, 
  ChevronRight, 
  UserCheck, 
  Camera,
  Layers,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';
import { COACH_LIST, PHOTO_GALLERY } from '../data/marketingData';

interface VisualBentoSectionProps {
  onOpenCoachingModal: () => void;
  onOpenPricingModal: () => void;
  onOpenCoachDetail: (coachId: string) => void;
  onOpenGalleryModal: () => void;
}

export const VisualBentoSection: React.FC<VisualBentoSectionProps> = ({
  onOpenCoachingModal,
  onOpenPricingModal,
  onOpenCoachDetail,
  onOpenGalleryModal
}) => {
  const [masterSlide, setMasterSlide] = useState(0);

  const masterPrograms = [
    {
      tag: 'THE MASTERS PROGRAM',
      title: '체계적인 훈련과 심화 코칭으로\n최고의 성장 실력을 완성합니다.',
      desc: '1:1 전담 코치와 함께하는 8주 집중 마인드셋 & 커리어 액션 플랜',
      bgImg: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80',
    },
    {
      tag: 'EXECUTIVE LEADERSHIP',
      title: '흔들리지 않는 멘탈 관리와\n조직을 이끄는 리더십 설계',
      desc: '일과 삶의 균형을 유지하며 최고의 성과를 창출하는 전문 리더십 코칭',
      bgImg: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
    }
  ];

  const currentMaster = masterPrograms[masterSlide];
  const featuredCoach = COACH_LIST[0]; // 김서연 수석 코치

  return (
    <section id="programs" className="py-12 sm:py-16 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* 1. Large Left Card: THE MASTERS PROGRAM (5 cols) */}
          <div className="lg:col-span-6 relative rounded-3xl overflow-hidden shadow-md min-h-[460px] sm:min-h-[520px] flex flex-col justify-between p-6 sm:p-10 group text-white">
            {/* Background Image */}
            <img
              src={currentMaster.bgImg}
              alt={currentMaster.title}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-stone-900/30" />

            {/* Top Tag & Link */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider text-sky-400 bg-black/40 px-3 py-1 rounded-full backdrop-blur-xs">
                {currentMaster.tag}
              </span>
              <button
                onClick={onOpenPricingModal}
                className="text-xs font-semibold text-white/90 hover:text-white flex items-center gap-1 bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full backdrop-blur-md transition-all"
              >
                <span>VIEW MORE</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bottom Content & 01 - 02 pagination */}
            <div className="relative z-10 space-y-4">
              <h3 className="text-2xl sm:text-3xl font-extrabold font-serif leading-snug whitespace-pre-line text-white">
                {currentMaster.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 font-sans">
                {currentMaster.desc}
              </p>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={onOpenCoachingModal}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg transition-colors flex items-center gap-1.5"
                >
                  <span>마스터 코칭 신청하기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* 01 - 02 pagination */}
                <div className="flex items-center gap-2 text-xs font-mono text-stone-400 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-xs">
                  <button
                    onClick={() => setMasterSlide(0)}
                    className={`hover:text-white transition-colors ${masterSlide === 0 ? 'text-sky-400 font-bold' : ''}`}
                  >
                    01
                  </button>
                  <span>—</span>
                  <button
                    onClick={() => setMasterSlide(1)}
                    className={`hover:text-white transition-colors ${masterSlide === 1 ? 'text-sky-400 font-bold' : ''}`}
                  >
                    02
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sub-Grid (6 cols) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* 2. Event Card: Top Left */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5" />
                  <span>Event Promotion</span>
                </span>
                <h4 className="text-lg font-bold text-stone-900 font-serif leading-snug">
                  가장 확실한 선택, <br />
                  라이프업으로 오세요!
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed pt-1">
                  지금 등록하면 <strong>3일 전액 무료 체험</strong>과 함께 1:1 맞춤 웰컴 성장 진단 리포트를 증정합니다.
                </p>
              </div>

              <div className="pt-6">
                <button
                  onClick={onOpenPricingModal}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>EVENT CHECK</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3. Coach Intro Card: Top Right */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    ICF 인증 전문 코치진
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <div className="flex items-center gap-3.5 mb-3">
                  <img
                    src={featuredCoach.avatar}
                    alt={featuredCoach.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-200 shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h5 className="font-bold text-sm text-stone-900">{featuredCoach.name}</h5>
                    <p className="text-[11px] text-blue-600 font-medium">{featuredCoach.role}</p>
                    <p className="text-[10px] text-stone-600 mt-0.5">{featuredCoach.experience}</p>
                  </div>
                </div>

                <p className="text-xs text-stone-600 italic bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  "{featuredCoach.tagline}"
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onOpenCoachDetail(featuredCoach.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors flex items-center justify-between"
                >
                  <span>강사소개 바로가기</span>
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              </div>
            </div>

            {/* 4. Photo Gallery Card: Bottom Full Width of Right (2 cols on sm) */}
            <div className="sm:col-span-2 bg-gradient-to-r from-stone-900 to-blue-950 text-white rounded-3xl p-6 sm:p-7 shadow-md flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
              <div className="w-full sm:w-1/2 h-36 rounded-2xl overflow-hidden relative shadow-inner">
                <img
                  src={PHOTO_GALLERY[0].image}
                  alt="포토 갤러리"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-[10px] font-bold backdrop-blur-xs text-white">
                  커뮤니티 현장
                </div>
              </div>

              <div className="w-full sm:w-1/2 space-y-2">
                <span className="text-[10px] font-bold tracking-widest text-sky-400 uppercase flex items-center gap-1">
                  <Camera className="w-3 h-3" />
                  <span>Photo Gallery</span>
                </span>
                <h4 className="text-base sm:text-lg font-bold font-serif leading-snug">
                  한 컷 한 컷 담긴 성장의 즐거움, <br />
                  포토 갤러리에서 확인해보세요.
                </h4>
                <p className="text-[11px] text-stone-300">
                  실제 수강생들의 목표 달성과 멘탈 회복의 생생한 순간들
                </p>

                <div className="pt-1">
                  <button
                    onClick={onOpenGalleryModal}
                    className="text-xs font-bold text-sky-300 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>갤러리 전체보기</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
