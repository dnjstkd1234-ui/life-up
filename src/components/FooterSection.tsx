import React from 'react';
import { Sparkles, Phone, Mail, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';

interface FooterSectionProps {
  onScrollToLeadForm: () => void;
  onNavigate: (sectionId: string) => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  onScrollToLeadForm,
  onNavigate
}) => {
  return (
    <footer className="bg-stone-950 text-stone-400 text-xs border-t border-stone-800">
      
      {/* Sub Footer Nav Bar with Direct Registration CTA Button */}
      <div className="border-b border-stone-800/80 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Quick Nav Links */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 text-stone-300 font-medium">
            <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">회사소개</button>
            <button onClick={() => onNavigate('programs')} className="hover:text-white transition-colors">코칭프로그램</button>
            <button onClick={() => onNavigate('calendar')} className="hover:text-white transition-colors">일정 및 예약</button>
            <button onClick={() => onNavigate('news')} className="hover:text-white transition-colors">알림마당</button>
            <button onClick={() => onNavigate('reviews')} className="hover:text-white transition-colors">성공후기</button>
            <button onClick={() => onNavigate('pricing')} className="hover:text-white transition-colors">멤버십 안내</button>
          </div>

          {/* Registration Inquiry Button matching image */}
          <button
            onClick={onScrollToLeadForm}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>등록 문의</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

        </div>
      </div>

      {/* Main Footer Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        
        {/* Brand & Contact */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-850">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-serif font-bold text-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-extrabold text-white font-serif">라이프업 LifeUp</div>
              <p className="text-[11px] text-stone-500">1:1 맞춤 AI 라이프 코칭 & 데일리 성장 플랫폼</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-400">
            <div className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-blue-400" />
              <span>고객센터: <strong>1544-0124</strong> (평일 09:00 - 18:00)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>제휴 및 수강 문의: <strong>contact@lifeup.kr</strong></span>
            </div>
          </div>

        </div>

        {/* Business Registration Details */}
        <div className="space-y-1.5 text-[11px] text-stone-500 leading-relaxed">
          <p>
            (주)라이프업 | 대표이사: 김성장 | 사업자등록번호: 214-88-01924 | 통신판매업신고: 제2025-서울강남-0142호
          </p>
          <p>
            본사: 서울특별시 강남구 테헤란로 423 라이프업 빌딩 7층 | 온라인 상담 센터: support@lifeup.kr
          </p>
          <p className="pt-2 text-stone-600">
            Copyright © 2025 LifeUp Inc. All Rights Reserved. 본 사이트의 모든 콘텐츠는 저작권법의 보호를 받습니다.
          </p>
        </div>

      </div>
    </footer>
  );
};
