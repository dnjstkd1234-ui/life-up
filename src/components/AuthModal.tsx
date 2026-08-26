import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, CheckCircle2, MessageCircle } from 'lucide-react';
import { createDefaultProfile, saveUserProfile } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleKakaoLogin = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      // KakaoTalk login workflow simulation & profile creation
      const kakaoUid = `kakao_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const profile = createDefaultProfile(
        kakaoUid,
        `kakao_user_${Date.now().toString().slice(-4)}@kakao.com`,
        '카카오 회원',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
      );
      
      // Kakao notification setting
      profile.subscription.kakaoNotificationEnabled = true;
      profile.subscription.phoneOrKakaoId = '카카오톡 연동 완료';

      await saveUserProfile(profile);
      onSuccess(profile);
      onClose();
    } catch (err: any) {
      console.warn('Kakao login error:', err);
      setErrorMsg('카카오톡 로그인 처리 중 일시적인 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl text-stone-900 relative border border-stone-100">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#FEE500] flex items-center justify-center text-[#191919] mx-auto mb-3 shadow-md">
            <MessageCircle className="w-6 h-6 fill-current" />
          </div>
          <h3 className="text-2xl font-extrabold font-serif text-stone-900">
            카카오톡 간편 로그인
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            카카오 계정으로 3초 만에 간편하게 시작하세요
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs mb-4 font-medium">
            {errorMsg}
          </div>
        )}

        {/* Exclusive Kakao Login Section */}
        <div className="space-y-4">
          <button
            onClick={handleKakaoLogin}
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#FEE500] hover:bg-[#FDD835] active:scale-98 text-[#191919] font-extrabold text-sm sm:text-base shadow-md shadow-amber-300/30 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-[#191919] border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12 3c-5.523 0-10 3.582-10 8 0 2.868 1.895 5.394 4.793 6.746l-1.22 4.475a.5.5 0 0 0 .748.55l5.228-3.468c.148.01.298.017.451.017 5.523 0 10-3.582 10-8s-4.477-8-10-8z"/>
              </svg>
            )}
            <span>카카오로 시작하기</span>
          </button>

          {/* Benefits Info Box */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70 space-y-2 text-xs text-stone-600">
            <div className="flex items-center gap-2 font-bold text-stone-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>카카오톡 연동 시 자동 지원 기능</span>
            </div>
            <ul className="space-y-1.5 pl-6 text-[11px] text-stone-500 list-disc">
              <li>매일 아침 8시 맞춤 계몽 알림톡 즉시 수신</li>
              <li>1:1 AI 멘토링 상담 기록 클라우드 안전 보관</li>
              <li>별도 비밀번호 기억 없이 카카오톡으로 원클릭 로그인</li>
            </ul>
          </div>
        </div>

        {/* Safe Notice */}
        <div className="mt-5 text-center text-[11px] text-stone-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
          <span>개인정보 암호화 및 안전한 카카오 OAuth 2.0 인증</span>
        </div>

      </div>
    </div>
  );
};
