import React from 'react';
import { Sparkles, Phone, Mail, ShieldCheck } from 'lucide-react';

interface FooterSectionProps {
  onNavigate: (sectionId: string) => void;
  onOpenPricing: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  onNavigate,
  onOpenPricing
}) => {
  return (
    <footer className="bg-stone-950 text-stone-400 text-xs border-t border-stone-800">
      
      {/* Sub Footer Nav Bar */}
      <div className="border-b border-stone-800/80 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Quick Nav Links */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 text-stone-300 font-medium">
            <button onClick={() => onNavigate('intro')} className="hover:text-white transition-colors">서비스 소개</button>
            <button onClick={() => onNavigate('themes')} className="hover:text-white transition-colors">4대 계몽 테마</button>
            <button onClick={() => onNavigate('kakao')} className="hover:text-white transition-colors">카카오톡 맞춤 알림</button>
            <button onClick={onOpenPricing} className="hover:text-white transition-colors">구독 안내 (월 6,500원)</button>
          </div>

          <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>개인정보 암호화 및 비공개 보장</span>
          </div>

        </div>
      </div>

      {/* Main Footer Details */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        
        {/* Brand & Contact */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-850">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-serif font-bold text-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-base font-extrabold text-white font-serif">라이프업 LifeUp</div>
              <p className="text-[11px] text-stone-500">1:1 맞춤 AI 계몽 & 메타인지 멘토링</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-400">
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>문의: <strong>contact@lifeup.kr</strong></span>
            </div>
          </div>

        </div>

        {/* Business Details */}
        <div className="space-y-1.5 text-[11px] text-stone-500 leading-relaxed">
          <p>
            (주)라이프업 | 대표: 김성장 | 사업자등록번호: 214-88-01924 | 통신판매업신고: 제2025-서울강남-0142호
          </p>
          <p>
            본사: 서울특별시 강남구 테헤란로 423 라이프업 빌딩 7층 | 고객 지원: support@lifeup.kr
          </p>
          <p className="pt-2 text-stone-600">
            Copyright © 2025 LifeUp Inc. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};
