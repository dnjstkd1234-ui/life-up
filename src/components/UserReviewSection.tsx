import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote, Sparkles } from 'lucide-react';
import { USER_REVIEWS } from '../data/marketingData';

export const UserReviewSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevReview = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : USER_REVIEWS.length - 1));
  };

  const nextReview = () => {
    setCurrentIndex(prev => (prev < USER_REVIEWS.length - 1 ? prev + 1 : 0));
  };

  return (
    <section id="reviews" className="py-14 sm:py-20 bg-stone-50 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">User review</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-900 mt-1">
              라이프업을 경험한 회원님들이 남긴 <br className="hidden sm:inline" />
              따뜻하고 솔직한 이야기들을 모았습니다.
            </h2>
          </div>

          {/* Navigation Arrows matching user image */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={prevReview}
              className="w-10 h-10 rounded-full bg-white border border-stone-200 hover:bg-stone-100 flex items-center justify-center text-stone-700 hover:text-blue-600 transition-colors shadow-xs"
              aria-label="이전 후기"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextReview}
              className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white transition-colors shadow-xs"
              aria-label="다음 후기"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {USER_REVIEWS.map((rev, idx) => (
            <div
              key={rev.id}
              className={`bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group ${
                idx === currentIndex ? 'ring-2 ring-blue-500/50' : ''
              }`}
            >
              <div>
                {/* User avatar & Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.avatar}
                      alt={rev.author}
                      className="w-11 h-11 rounded-full object-cover border border-stone-200 shadow-2xs"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{rev.author}</h4>
                      <p className="text-[10px] text-stone-600">{rev.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Review Title & Program badge */}
                <div className="mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                    {rev.program}
                  </span>
                  <h3 className="text-sm font-bold text-stone-900 mt-2 line-clamp-1 group-hover:text-blue-700 transition-colors">
                    {rev.title}
                  </h3>
                </div>

                {/* Review Body */}
                <p className="text-xs text-stone-600 leading-relaxed line-clamp-4">
                  {rev.content}
                </p>
              </div>

              {/* Date */}
              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-600 font-mono">
                <span>인증된 실제 수강생</span>
                <span>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Summary Bar */}
        <div className="mt-10 bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 flex flex-wrap items-center justify-around gap-6 text-center shadow-xs">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-serif">98.6%</div>
            <div className="text-xs text-stone-600 mt-0.5">수강생 만족도</div>
          </div>
          <div className="w-px h-8 bg-stone-200 hidden sm:block" />
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-serif">12,400+</div>
            <div className="text-xs text-stone-600 mt-0.5">누적 1:1 코칭 진행</div>
          </div>
          <div className="w-px h-8 bg-stone-200 hidden sm:block" />
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-serif">94.2%</div>
            <div className="text-xs text-stone-600 mt-0.5">목표 달성 및 루틴 성공률</div>
          </div>
          <div className="w-px h-8 bg-stone-200 hidden sm:block" />
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-serif">4.9 / 5.0</div>
            <div className="text-xs text-stone-600 mt-0.5">카카오톡 모닝케어 평점</div>
          </div>
        </div>

      </div>
    </section>
  );
};
