import React from 'react';
import { CheckCircle2, Sparkles, Phone, ArrowRight, Gift, Calendar, X } from 'lucide-react';

interface LeadSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadName: string;
  leadPhone: string;
  onOpenCoachingModal: () => void;
}

export const LeadSuccessModal: React.FC<LeadSuccessModalProps> = ({
  isOpen,
  onClose,
  leadName,
  leadPhone,
  onOpenCoachingModal
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl text-center relative animate-fade-in">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 mx-auto mb-4 shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
          상담 신청 접수 완료
        </span>

        <h3 className="text-xl sm:text-2xl font-extrabold font-serif text-stone-900 mt-2 mb-1">
          {leadName}님, 환영합니다!
        </h3>

        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
          기재해주신 연락처(<strong>{leadPhone}</strong>)로 라이프업 전문 코칭팀이 1시간 이내에 맞춤 안내 연락을 드립니다.
        </p>

        {/* Benefits Box */}
        <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 text-left space-y-2 mb-6 text-xs text-stone-700">
          <div className="font-bold text-blue-800 flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-blue-600" />
            <span>신청 즉시 제공되는 VIP 혜택</span>
          </div>
          <div className="space-y-1 text-[11px]">
            <p>✓ 1:1 라이프 밸런스 진단 및 맞춤 솔루션 리포트 무료 제공</p>
            <p>✓ 라이프업 AI 전담 코칭 3일 무료 체험 권한 자동 활성화</p>
            <p>✓ 매일 아침 카카오톡 모닝케어 알림톡 무료 구독</p>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => {
              onClose();
              onOpenCoachingModal();
            }}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <span>지금 바로 1:1 AI 코칭 체험하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors"
          >
            확인
          </button>
        </div>

      </div>
    </div>
  );
};
