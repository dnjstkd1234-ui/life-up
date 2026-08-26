import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck,
  MessageCircle,
  PhoneCall
} from 'lucide-react';
import { HERO_SLIDES } from '../data/marketingData';

interface HeroSliderProps {
  onOpenCoachingModal: () => void;
  onOpenPricingModal: () => void;
  onScrollToLeadForm: () => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  onOpenCoachingModal,
  onOpenPricingModal,
  onScrollToLeadForm
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const totalSlides = HERO_SLIDES.length;

  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlay, totalSlides]);

  const prevSlide = () => {
    setIsAutoPlay(false);
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  const nextSlide = () => {
    setIsAutoPlay(false);
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section 
      id="hero" 
      className="relative w-full overflow-hidden bg-stone-900 text-white min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] flex items-center"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Background Image with Deep Blue / Dark Overlay */}
      {HERO_SLIDES.map((s, idx) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <img
            src={s.bgImage}
            alt={s.title}
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000"
            referrerPolicy="no-referrer"
          />
          {/* Layered Gradient Overlays for High Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-900/75 to-blue-950/60" />
          <div className="absolute inset-0 bg-radial from-transparent via-stone-950/40 to-stone-950/80" />
        </div>
      ))}

      {/* Main Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 z-10 w-full">
        <div className="max-w-2xl space-y-6">
          
          {/* Tag & Highlight Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/40 backdrop-blur-md text-blue-300 text-xs sm:text-sm font-semibold animate-fade-in">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>{slide.tag}</span>
            <span className="w-1 h-1 rounded-full bg-blue-400" />
            <span className="text-white font-normal">{slide.highlightBadge}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-white leading-tight font-serif tracking-tight drop-shadow-md whitespace-pre-line">
            {slide.title}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-sans max-w-xl drop-shadow">
            {slide.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <button
              onClick={onScrollToLeadForm}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/30 transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{slide.primaryCta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenCoachingModal}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-sky-300" />
              <span>1:1 AI 코칭 맛보기</span>
            </button>
          </div>

          {/* Trust points */}
          <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-stone-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-sky-400" />
              <span>3일 무료 체험 (결제정보 불필요)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-sky-400" />
              <span>ICF 전문 코치진 검증 커리큘럼</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-sky-400" />
              <span>매일 아침 카카오톡 1:1 케어</span>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Slider Controller < 1 / 3 > exactly as in user image */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-4 bg-stone-950/70 border border-white/15 px-4 py-2 rounded-full backdrop-blur-md text-xs font-semibold text-white shadow-xl">
        <button
          onClick={prevSlide}
          className="p-1 hover:text-sky-400 text-stone-300 transition-colors"
          aria-label="이전 슬라이드"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-mono tracking-widest text-xs">
          <strong className="text-sky-400">{currentSlide + 1}</strong> / {totalSlides}
        </span>
        <button
          onClick={nextSlide}
          className="p-1 hover:text-sky-400 text-stone-300 transition-colors"
          aria-label="다음 슬라이드"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
