import React from 'react';
import { X, MapPin, Phone, Mail, Clock, CheckCircle2 } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-stone-900 relative my-6">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-serif text-stone-900">
              오시는 길 및 상담실 안내
            </h3>
            <p className="text-xs text-stone-500">온/오프라인 하이브리드 코칭 센터</p>
          </div>
        </div>

        {/* Info card */}
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-3 text-xs text-stone-700 mb-6">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900">본사 및 VIP 상담 센터:</strong>
              <p>서울특별시 강남구 테헤란로 423 라이프업 빌딩 7층 (선릉역 10번 출구 도보 3분)</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900">운영 시간:</strong>
              <p>평일 09:00 ~ 21:00 / 토요일 10:00 ~ 17:00 (일요일 및 공휴일 휴무)</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Phone className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900">대표 전화:</strong>
              <p>1544-0124 (빠른 전화 상담)</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 mb-6">
          💡 <strong>온라인 상담:</strong> 지방 및 해외 거주 회원님들은 Zoom / 카카오 화상 상담을 통해 동일한 1:1 라이브 코칭을 받으실 수 있습니다.
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md transition-colors"
        >
          확인
        </button>

      </div>
    </div>
  );
};
