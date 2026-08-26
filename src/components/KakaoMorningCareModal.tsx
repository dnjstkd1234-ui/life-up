import React, { useState } from 'react';
import { 
  X, 
  BellRing, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Smartphone, 
  Send,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';

interface KakaoMorningCareModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onUpdateNotificationTime: (time: string, enabled: boolean) => void;
}

export const KakaoMorningCareModal: React.FC<KakaoMorningCareModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateNotificationTime
}) => {
  const [selectedTime, setSelectedTime] = useState(user?.subscription.notificationTime || '08:00');
  const [isEnabled, setIsEnabled] = useState(user?.subscription.kakaoNotificationEnabled ?? true);
  const [topic, setTopic] = useState('오늘의 에너지와 몰입');
  const [isGenerating, setIsGenerating] = useState(false);
  const [testNotification, setTestNotification] = useState<{
    topic: string;
    morningMessage: string;
    actionChallenge: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleGenerateTestMessage = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/notifications/morning-care', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          userName: user?.displayName || '회원',
          coach: 'mindset'
        })
      });
      const data = await res.json();
      setTestNotification(data);
      confetti({ particleCount: 80, spread: 60 });
    } catch (e) {
      console.error(e);
      setTestNotification({
        topic: '오늘의 활력 충전',
        morningMessage: '어제보다 더 빛날 당신의 하루를 진심으로 응원합니다. 나만의 속도로 당당하게 나아가세요!',
        actionChallenge: '오늘 가장 중요한 일 1가지에 25분간 온전히 몰입하기'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveSettings = () => {
    onUpdateNotificationTime(selectedTime, isEnabled);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl text-stone-900 relative my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-600 shadow-xs">
            <BellRing className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold font-serif text-stone-900">
                카카오톡 1:1 모닝케어
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                수강생 만족도 98%
              </span>
            </div>
            <p className="text-xs text-stone-500">
              매일 아침 원하는 시간에 카카오톡 알림톡으로 하루를 깨우는 맞춤 질문과 미션을 보내드립니다.
            </p>
          </div>
        </div>

        {/* Time Setting Grid */}
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>알림톡 수신 시간 설정</span>
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
              <span className="ml-2 text-xs font-medium text-stone-700">
                {isEnabled ? '수신 중' : '수신 거부'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {['07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '21:00'].map(t => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                  selectedTime === t
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* KakaoTalk Preview Box */}
        <div className="bg-[#FAE100]/20 border border-yellow-300 rounded-2xl p-4 sm:p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#3C1E1E]">
              <Smartphone className="w-4 h-4" />
              <span>카카오톡 알림톡 수신 미리보기</span>
            </div>
            <button
              onClick={handleGenerateTestMessage}
              disabled={isGenerating}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#FAE100] text-[#3C1E1E] border border-yellow-400 hover:bg-yellow-300 transition-colors shadow-2xs"
            >
              {isGenerating ? '생성 중...' : '새로운 알림톡 생성해보기'}
            </button>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-xs border border-yellow-200/80 text-xs text-stone-800 space-y-2">
            <div className="font-bold text-stone-900 flex items-center gap-1">
              <span>[라이프업 🌅 오늘의 모닝 코칭]</span>
            </div>
            <p className="text-stone-700 leading-relaxed">
              안녕하세요 <strong>{user?.displayName || '회원'}</strong>님! 활기찬 아침입니다.
            </p>
            <p className="text-stone-800 italic bg-amber-50 p-2.5 rounded-lg border border-amber-100">
              "{testNotification?.morningMessage || '오늘 하루 가장 나다운 속도로 한 걸음씩 나아가세요. 당신의 잠재력은 생각보다 훨씬 큽니다!'}"
            </p>
            <div className="pt-1">
              <span className="font-bold text-blue-700">⚡ 오늘의 실천 챌린지: </span>
              <span>{testNotification?.actionChallenge || '출근 후 10분간 스마트폰 없이 오늘의 우선순위 1가지 적어보기'}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
          >
            닫기
          </button>
          <button
            onClick={handleSaveSettings}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-colors"
          >
            설정 저장하고 모닝케어 등록
          </button>
        </div>

      </div>
    </div>
  );
};
