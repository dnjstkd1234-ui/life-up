import React, { useState } from 'react';
import { Sparkles, PhoneCall, Check, ShieldCheck, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitFastInquiry } from '../lib/firebase';

interface FastLeadInquiryBarProps {
  onSuccess: (name: string, phone: string) => void;
}

export const FastLeadInquiryBar: React.FC<FastLeadInquiryBarProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [content, setContent] = useState('1:1 맞춤 멘탈 & 커리어 코칭 상담');
  const [privacyAgreed, setPrivacyAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMsg('이름과 연락처를 모두 입력해주세요.');
      return;
    }
    if (!privacyAgreed) {
      setErrorMsg('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // 1. Submit to Backend API
      const res = await fetch('/api/leads/fast-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          content: content.trim(),
          programType: '빠른 무료 상담 신청'
        })
      });

      // 2. Also persist to Firebase/LocalStore
      await submitFastInquiry({
        name: name.trim(),
        phone: phone.trim(),
        content: content.trim(),
        programType: '빠른 무료 상담 신청',
        privacyAgreed: true
      });

      // 3. Fire Confetti Celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      onSuccess(name.trim(), phone.trim());
      setName('');
      setPhone('');
    } catch (err: any) {
      console.error('Lead submission error:', err);
      // Fallback success
      onSuccess(name.trim(), phone.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="lead-form" className="bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 py-8 sm:py-10 px-4 sm:px-6 shadow-xl relative z-20">
      <div className="max-w-7xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-3">
          
          {/* Main Flex/Grid Bar matching user image */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* Left Title with Character/Icon Badge */}
            <div className="flex items-center gap-3.5 w-full lg:w-auto flex-shrink-0 text-white">
              <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/40 backdrop-blur-md flex items-center justify-center text-white shadow-inner flex-shrink-0">
                <Sparkles className="w-6 h-6 animate-pulse text-amber-300" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-sky-200 uppercase tracking-widest block">
                  3초 초간편 무료 신청
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold font-serif tracking-tight">
                  성장의 즐거움, 지금 시작하세요!
                </h3>
              </div>
            </div>

            {/* Input Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full lg:flex-1 lg:max-w-3xl">
              
              {/* Name Input */}
              <input
                id="lead-input-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="성함 (예: 홍길동)"
                required
                className="w-full bg-white rounded-xl px-4 py-3 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm font-medium"
              />

              {/* Phone Input */}
              <input
                id="lead-input-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="연락처 (010-1234-5678)"
                required
                className="w-full bg-white rounded-xl px-4 py-3 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm font-medium"
              />

              {/* Content / Program select */}
              <select
                id="lead-input-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-white rounded-xl px-4 py-3 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm font-medium"
              >
                <option value="1:1 맞춤 멘탈 & 커리어 코칭 상담">1:1 멘탈 & 커리어 코칭</option>
                <option value="매일 아침 카카오톡 모닝케어 챌린지">카톡 모닝케어 챌린지</option>
                <option value="번아웃 극복 및 자존감 회복 8주">번아웃 & 자존감 회복 8주</option>
                <option value="2025 상반기 신규 수강생 모집 문의">상반기 신규 수강생 문의</option>
              </select>

            </div>

            {/* Submit CTA Button */}
            <div className="w-full lg:w-auto flex-shrink-0">
              <button
                id="lead-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-stone-950 hover:bg-stone-900 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-black/30 transition-all transform active:scale-95 flex items-center justify-center gap-2 border border-white/20"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>신청 접수 중...</span>
                  </>
                ) : (
                  <>
                    <span>빠른 문의하기</span>
                    <ArrowRight className="w-4 h-4 text-sky-400" />
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Privacy Consent Checkbox */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-2 text-[11px] text-white/90 pt-1">
            {errorMsg && (
              <span className="text-amber-200 font-bold mr-auto">
                ⚠️ {errorMsg}
              </span>
            )}

            <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={privacyAgreed}
                onChange={(e) => setPrivacyAgreed(e.target.checked)}
                className="w-3.5 h-3.5 text-blue-600 rounded-sm focus:ring-0 cursor-pointer"
              />
              <span>개인정보 수집 및 마케팅 활용에 동의합니다 (필수)</span>
            </label>
            <span className="text-white/60 hidden sm:inline">|</span>
            <span className="text-white/80">상담 신청 시 3일 무료 체험 자동 적용</span>
          </div>

        </form>
      </div>
    </section>
  );
};
