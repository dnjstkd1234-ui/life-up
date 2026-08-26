import React, { useState } from 'react';
import { Sparkles, LogOut, Menu, X, CreditCard } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderNavProps {
  user: UserProfile | null;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenAuth: () => void;
  onOpenPricing: () => void;
  onLogout: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  user,
  activeSection,
  onNavigate,
  onOpenAuth,
  onOpenPricing,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exact requested order: 서비스소개 -> 구독하기 -> 상담설명 -> 카카오톡 대화
  const navItems = [
    { id: 'intro', label: '서비스 소개' },
    { id: 'pricing', label: '구독하기' },
    { id: 'consulting', label: '상담 설명' },
    { id: 'kakao', label: '카카오톡 대화' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => onNavigate('intro')}
            className="flex items-center gap-3 cursor-pointer group shrink-0 select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-xl sm:text-2xl text-stone-900 tracking-tight font-serif">라이프업</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-blue-100 text-blue-700">LifeUp</span>
              </div>
              <p className="text-[10px] text-stone-500 tracking-wider font-sans font-medium mt-1 leading-none">1:1 맞춤 AI 계몽 멘토링</p>
            </div>
          </div>

          {/* Desktop Nav Links in Exact Sequence */}
          <nav className="hidden md:flex items-center gap-8 h-full">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-sm font-semibold transition-colors relative py-2 flex items-center justify-center ${
                  activeSection === item.id 
                    ? 'text-blue-600 font-bold' 
                    : 'text-stone-600 hover:text-blue-600'
                }`}
              >
                <span>{item.label}</span>
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* Auth or Profile */}
            {user && user.email ? (
              <div className="flex items-center gap-2 pr-2 border-r border-stone-200 h-8">
                <span className="text-xs font-medium text-stone-700 max-w-[120px] truncate leading-none">
                  {user.displayName || '회원'}님
                </span>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors flex items-center justify-center"
                  title="로그아웃"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="h-10 text-xs font-bold text-[#191919] bg-[#FEE500] hover:bg-[#FDD835] px-3.5 rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12 3c-5.523 0-10 3.582-10 8 0 2.868 1.895 5.394 4.793 6.746l-1.22 4.475a.5.5 0 0 0 .748.55l5.228-3.468c.148.01.298.017.451.017 5.523 0 10-3.582 10-8s-4.477-8-10-8z"/>
                </svg>
                <span>카카오 로그인</span>
              </button>
            )}

            {/* Subscribe Action Button */}
            <button
              onClick={onOpenPricing}
              className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>구독하기 (월 6,500원)</span>
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenPricing}
              className="h-9 px-3 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1"
            >
              <span>구독하기</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-9 w-9 flex items-center justify-center text-stone-700 rounded-lg hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <div className="space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-blue-600"
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
                className="w-full py-2.5 rounded-xl bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] text-xs font-bold flex items-center justify-center gap-2 shadow-2xs"
              >
                <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12 3c-5.523 0-10 3.582-10 8 0 2.868 1.895 5.394 4.793 6.746l-1.22 4.475a.5.5 0 0 0 .748.55l5.228-3.468c.148.01.298.017.451.017 5.523 0 10-3.582 10-8s-4.477-8-10-8z"/>
                </svg>
                <span>카카오톡으로 시작하기</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
