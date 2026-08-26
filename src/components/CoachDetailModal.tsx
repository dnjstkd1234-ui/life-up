import React from 'react';
import { X, Award, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';
import { COACH_LIST } from '../data/marketingData';

interface CoachDetailModalProps {
  coachId: string | null;
  onClose: () => void;
  onSelectCoachForChat: (coachId: string) => void;
}

export const CoachDetailModal: React.FC<CoachDetailModalProps> = ({
  coachId,
  onClose,
  onSelectCoachForChat
}) => {
  if (!coachId) return null;
  const coach = COACH_LIST.find(c => c.id === coachId) || COACH_LIST[0];

  const highlights = coach.highlights || [
    '국제코치연맹(ICF) 정회원 및 전문 코치 자격',
    '누적 3,000시간 이상의 1:1 맞춤형 세션 진행',
    '마인드셋 회복 및 행동 촉진 3단계 솔루션 제공',
    '정기 데일리 피드백 & 액션 과제 관리'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl text-stone-900 relative my-6 animate-fade-in">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Coach Profile */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6 text-center sm:text-left">
          <img
            src={coach.avatar}
            alt={coach.name}
            className="w-24 h-24 rounded-2xl object-cover border-4 border-blue-100 shadow-md"
            referrerPolicy="no-referrer"
          />
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
              {coach.role}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
              {coach.name} 코치
            </h3>
            <p className="text-xs text-stone-600">{coach.specialty}</p>
            <p className="text-xs font-medium text-stone-600">{coach.experience}</p>
          </div>
        </div>

        {/* Quote */}
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 mb-6 italic text-xs sm:text-sm text-stone-700">
          "{coach.tagline}"
        </div>

        {/* Highlights */}
        <div className="space-y-2.5 mb-6">
          <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-blue-600" />
            <span>전문 자격 및 코칭 커리큘럼</span>
          </h4>
          <div className="space-y-1.5 text-xs text-stone-600">
            {highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => {
            onClose();
            onSelectCoachForChat(coach.id);
          }}
          className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{coach.name} 코치와 1:1 코칭 시작하기</span>
        </button>

      </div>
    </div>
  );
};
