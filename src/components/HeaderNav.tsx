import React, { useState } from 'react';
import { 
  Sparkles, 
  User, 
  LogOut, 
  Menu, 
  X, 
  PhoneCall, 
  CheckCircle2, 
  Calendar, 
  Award, 
  MessageSquareText, 
  BookOpen, 
  BellRing
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderNavProps {
  user: UserProfile | null;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenAuth: () => void;
  onOpenPricing: () => void;
  onOpenCoachingModal: () => void;
  onOpenKakaoModal: () => void;
  onLogout: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  user,
  activeSection,
  onNavigate,
  onOpenAuth,
  onOpenPricing,
  onOpenCoachingModal,
  onOpenKakaoModal,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'about', label: '서비스 소개' },
    { id: 'programs', label: '코칭 프로그램' },
    { id: 'calendar', label: '일정 및 예약' },
    { id: 'news', label: '알림마당' },
    { id: 'reviews', label: '성공후기' },
    { id: 'pricing', label: '멤버십 안내' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Banner (Optional subtle notice) */}
      <div className="bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 text-white text-[11px] sm:text-xs py-1.5 px-4 text-center font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <span className="bg-white/20 px-2 py-0.5 rounded-full font-bold">2025 신년 프로모션</span>
          <span>지금 1:1 무료 상담 신청 시 <strong>'3일 무료 체험 + 웰컴 리포트'</strong> 즉시 증정!</span>
        </div>
      </div>

      {/* Main GNB */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => onNavigate('hero')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl text-stone-900 tracking-tight font-serif">라이프업</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-blue-100 text-blue-700">LifeUp</span>
              </div>
              <p className="text-[10px] text-stone-600 tracking-wider font-sans font-medium">PREMIUM LIFE COACHING</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-sm font-semibold transition-colors relative py-1 ${
                  activeSection === item.id 
                    ? 'text-blue-600 font-bold' 
                    : 'text-stone-700 hover:text-blue-600'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* 1:1 AI 코칭 체험 버튼 */}
            <button
              onClick={onOpenCoachingModal}
              className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors flex items-center gap-1.5 border border-blue-200"
            >
              <MessageSquareText className="w-4 h-4 text-blue-600" />
              <span>1:1 AI 코칭 체험</span>
            </button>

            {/* 카카오 모닝케어 체험 */}
            <button
              onClick={onOpenKakaoModal}
              className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors flex items-center gap-1.5 border border-amber-200"
            >
              <BellRing className="w-4 h-4 text-amber-600" />
              <span>카톡 모닝케어</span>
            </button>

            {/* Auth or Profile */}
            {user && user.email ? (
              <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
                <span className="text-xs font-medium text-stone-700 max-w-[100px] truncate">
                  {user.displayName || '회원'}님
                </span>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition-colors"
                  title="로그아웃"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="text-xs font-semibold text-stone-700 hover:text-stone-900 px-3 py-2 rounded-lg hover:bg-stone-100 transition-colors"
              >
                로그인
              </button>
            )}

            {/* High-Converting CTA */}
            <button
              onClick={() => onNavigate('lead-form')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all transform active:scale-95 flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>무료 상담 신청</span>
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => onNavigate('lead-form')}
              className="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-xs"
            >
              상담신청
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 rounded-lg hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-stone-100">
            <button
              onClick={() => {
                onOpenCoachingModal();
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-3 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <MessageSquareText className="w-4 h-4" />
              <span>1:1 AI 코칭 체험</span>
            </button>
            <button
              onClick={() => {
                onOpenKakaoModal();
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-3 rounded-xl bg-amber-50 text-amber-900 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <BellRing className="w-4 h-4" />
              <span>카톡 모닝케어</span>
            </button>
          </div>

          <div className="space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-blue-600"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
            {user && user.email ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-medium text-stone-700">{user.displayName || user.email}님</span>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-600 font-bold"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold"
              >
                로그인 / 회원가입
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
