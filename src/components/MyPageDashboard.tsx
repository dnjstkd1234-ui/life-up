import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  RefreshCw, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  BellRing, 
  Flame, 
  Briefcase, 
  Heart, 
  AlertCircle, 
  MessageCircle, 
  Compass, 
  Clock, 
  Lock, 
  Calendar,
  Check,
  ChevronRight,
  HelpCircle,
  Brain,
  Quote
} from 'lucide-react';
import { UserProfile, InnerEmotion, InnerCategory, InnerStateDiagnosis, Message } from '../types';
import { saveUserProfile } from '../lib/firebase';

interface OracleReport {
  section1_insight: string;
  section2_fact_violence: string;
  section3_action_plan: string;
  master_final_quote: string;
}

interface MyPageDashboardProps {
  user: UserProfile | null;
  onOpenPricing: () => void;
  onOpenAuth: () => void;
  onBackToHome: () => void;
}

const EMOTION_OPTIONS: { label: InnerEmotion; emoji: string; desc: string }[] = [
  { label: '무기력함', emoji: '🪫', desc: '아무것도 할 힘이 안 나고 지쳐요' },
  { label: '억울함', emoji: '😤', desc: '노력한 만큼 인정받지 못해 분해요' },
  { label: '두려움', emoji: '😨', desc: '미래가 불투명하고 실패할까 겁나요' },
  { label: '공허함', emoji: '🕳️', desc: '열심히 사는데 아무 의미가 없어요' },
  { label: '조급함', emoji: '⏳', desc: '남들은 앞서가는데 나만 늦은 것 같아요' },
  { label: '답답함', emoji: '🧱', desc: '막다른 골목에 갇혀 있는 기분이에요' },
  { label: '분노', emoji: '🔥', desc: '상황이나 사람에 대해 화가 치밀어요' },
  { label: '죄책감', emoji: '😔', desc: '잠시 쉬거나 나를 챙기면 죄스러워요' },
];

const CATEGORY_OPTIONS: { 
  label: InnerCategory; 
  icon: any; 
  badge: string; 
  desc: string; 
  targetDistortion: string 
}[] = [
  { 
    label: '번아웃', 
    icon: Flame, 
    badge: '완벽주의 & 휴식 강박', 
    desc: '쉬면 도태된다는 공포, 인정 욕구 고갈',
    targetDistortion: '완벽주의·흑백논리'
  },
  { 
    label: '취업·진로', 
    icon: Briefcase, 
    badge: '사회적 기준 & 비교', 
    desc: '남들과의 스펙 비교, 정답 인생의 착각',
    targetDistortion: '사회적 트랙 의존'
  },
  { 
    label: '연애·관계', 
    icon: Heart, 
    badge: '의존성 & 결핍 충족', 
    desc: '상대방의 반응에 휘둘리는 자존감',
    targetDistortion: '타인 인정 의존'
  },
  { 
    label: '불안·강박', 
    icon: AlertCircle, 
    badge: '통제 불가능한 미래', 
    desc: '일어나지 않은 일에 대한 파국화 시나리오',
    targetDistortion: '파국화 & 과도한 일반화'
  },
];

export const MyPageDashboard: React.FC<MyPageDashboardProps> = ({
  user,
  onOpenPricing,
  onOpenAuth,
  onBackToHome
}) => {
  // Subscription check
  const plan = user?.subscription?.plan;
  const isSubscribed = plan === 'basic' || plan === 'premium' || plan === 'subscribed';
  const isLoggedIn = user && user.uid !== 'guest_marketing_user';

  // Diagnosis State
  const [selectedEmotion, setSelectedEmotion] = useState<InnerEmotion>('조급함');
  const [selectedCategory, setSelectedCategory] = useState<InnerCategory>('번아웃');
  const [troublingSentence, setTroublingSentence] = useState<string>('');
  const [isDiagnosed, setIsDiagnosed] = useState<boolean>(false);

  // Oracle Reading State
  const [reportContent, setReportContent] = useState<OracleReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load existing diagnosis if available
  useEffect(() => {
    if (user?.innerDiagnosis) {
      setSelectedEmotion(user.innerDiagnosis.emotion as InnerEmotion || '조급함');
      setSelectedCategory(user.innerDiagnosis.category || '번아웃');
      setTroublingSentence(user.innerDiagnosis.troublingSentence || '');
    }
  }, [user]);

  // Handle Diagnosis Submit -> Trigger Initial AI Awakening Session
  const handleStartCoaching = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!troublingSentence.trim()) return;

    // Save diagnosis to user profile
    const diagnosisData: InnerStateDiagnosis = {
      emotion: selectedEmotion,
      category: selectedCategory,
      troublingSentence: troublingSentence.trim(),
      updatedAt: Date.now()
    };

    if (user) {
      const updatedProfile: UserProfile = {
        ...user,
        innerDiagnosis: diagnosisData
      };
      saveUserProfile(updatedProfile);
    }

    setIsDiagnosed(true);
    setReportContent(null);
    setIsLoading(true);

    try {
      // Call Backend API with initial context
      const res = await fetch('/api/oracle/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmotion: selectedEmotion,
          userCategory: selectedCategory,
          userSituation: troublingSentence.trim(),
          userName: user?.displayName || '내담자'
        })
      });

      const data = await res.json();
      setReportContent(data);
    } catch (err) {
      console.warn('Initial session load error:', err);
      // We will handle error in rendering or add a specific error state if needed
    } finally {
      setIsLoading(false);
    }
  };

  // 1. If not logged in -> Prompt Kakao Login
  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] py-16 px-4 max-w-4xl mx-auto flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-xl text-center max-w-md w-full space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-[#FEE500] text-[#191919] flex items-center justify-center mx-auto shadow-md">
            <MessageCircle className="w-7 h-7 fill-current" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold font-serif text-stone-900">
              마이페이지 접속 안내
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              카카오 계정으로 간편 로그인하시면 내면 상태 진단 및 1:1 맞춤 AI 계몽 멘토링을 이용하실 수 있습니다.
            </p>
          </div>

          <button
            onClick={onOpenAuth}
            className="w-full py-4 px-6 rounded-2xl bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] font-extrabold text-sm sm:text-base shadow-md transition-transform active:scale-98 flex items-center justify-center gap-3 cursor-pointer"
          >
            <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12 3c-5.523 0-10 3.582-10 8 0 2.868 1.895 5.394 4.793 6.746l-1.22 4.475a.5.5 0 0 0 .748.55l5.228-3.468c.148.01.298.017.451.017 5.523 0 10-3.582 10-8s-4.477-8-10-8z"/>
            </svg>
            <span>카카오톡으로 로그인하기</span>
          </button>

          <button
            onClick={onBackToHome}
            className="text-xs text-stone-400 hover:text-stone-700 underline"
          >
            메인 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 2. If not subscribed (has not paid premium) -> Prompt Payment
  if (plan !== 'premium') {
    return (
      <div className="min-h-[80vh] py-16 px-4 max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-xl space-y-8 text-center max-w-xl mx-auto">
          
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
              프리미엄 1회권 필요
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-900">
              결제 후 운명 통찰 리포트 생성이 가능합니다
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              1,990원(1회성)으로 내 인지 왜곡을 깨부수는 영혼의 심층 진단 리포트를 받아보세요.
            </p>
          </div>

          <button
            onClick={onOpenPricing}
            className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-blue-500/25 transition-transform active:scale-98 flex items-center justify-center gap-2"
          >
            <span>1회권 결제하고 리포트 생성하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onBackToHome}
            className="text-xs text-stone-400 hover:text-stone-700 underline block mx-auto"
          >
            메인 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 3. Paid User -> Main My Page & Diagnosis
  return (
    <div className="min-h-screen bg-stone-100/60 pb-20 pt-6 px-3 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>프리미엄 리딩 결제 완료</span>
              </span>
              <span className="text-xs text-stone-400">·</span>
              <span className="text-xs font-medium text-stone-500">
                무제한 열람 가능
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-900">
              {user?.displayName || '회원'}님의 메타인지 계몽 마이페이지
            </h1>
            <p className="text-xs sm:text-sm text-stone-500">
              내면 상태를 진단하고, 1:1 맞춤 소크라테스식 문답을 통해 닫힌 사고방식을 깨부수세요.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsDiagnosed(false);
                setReportContent(null);
              }}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>상태 재진단하기</span>
            </button>

            <button
              onClick={onBackToHome}
              className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors"
            >
              서비스 홈
            </button>
          </div>
        </div>

        {/* --- [핵심] 내면 상태 진단창 UI (If not started or diagnosing) --- */}
        {!isDiagnosed ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-md space-y-8">
            
            <div className="border-b border-stone-100 pb-5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-extrabold">
                  1
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold font-serif text-stone-900">
                  내면 상태 진단 (State Diagnosis)
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-500">
                AI 멘토가 당신의 인지 왜곡의 급소를 찌르는 첫 질문을 구성하기 위해 현재 심정과 상황을 파악합니다.
              </p>
            </div>

            <form onSubmit={handleStartCoaching} className="space-y-8">
              
              {/* 1) 현재 감정 선택 */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-bold text-stone-800">
                  1. 지금 가장 강하게 느껴지는 감정은 무엇인가요? (택 1)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                  {EMOTION_OPTIONS.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setSelectedEmotion(item.label)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        selectedEmotion === item.label
                          ? 'border-blue-600 bg-blue-50/90 ring-2 ring-blue-500/30 text-blue-900 shadow-xs'
                          : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100/80 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg">{item.emoji}</span>
                        {selectedEmotion === item.label && (
                          <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                            ✓
                          </div>
                        )}
                      </div>
                      <div className="mt-2">
                        <div className="font-extrabold text-xs sm:text-sm">{item.label}</div>
                        <p className="text-[10.5px] text-stone-500 line-clamp-1 mt-0.5">{item.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2) 핵심 고민 카테고리 */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-bold text-stone-800">
                  2. 어떤 영역의 인지 왜곡을 깨부수고 싶으신가요?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {CATEGORY_OPTIONS.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.label}
                        type="button"
                        onClick={() => setSelectedCategory(cat.label)}
                        className={`p-4 rounded-2xl border text-left transition-all space-y-2 ${
                          selectedCategory === cat.label
                            ? 'border-stone-900 bg-stone-900 text-white shadow-md ring-2 ring-stone-900/30'
                            : 'border-stone-200 bg-white hover:border-stone-300 text-stone-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            selectedCategory === cat.label ? 'bg-white/10 text-white' : 'bg-stone-100 text-stone-700'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            selectedCategory === cat.label ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                          }`}>
                            {cat.badge}
                          </span>
                        </div>
                        <div>
                          <div className="font-extrabold text-sm">[{cat.label}]</div>
                          <p className={`text-[11px] mt-0.5 ${
                            selectedCategory === cat.label ? 'text-stone-300' : 'text-stone-500'
                          }`}>
                            {cat.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3) 상황 단답형 입력 */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-bold text-stone-800">
                  3. 지금 당신을 가장 괴롭히는 한 문장은 무엇인가요?
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={troublingSentence}
                    onChange={(e) => setTroublingSentence(e.target.value)}
                    placeholder="예: 남들은 다 취업하고 앞서가는데 나만 영원히 뒤처지고 도태될 것 같아요."
                    className="w-full p-4 rounded-2xl border border-stone-300 bg-stone-50/50 text-stone-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none placeholder:text-stone-400"
                    required
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-stone-400">
                  <span>💡 솔직하고 날것의 문장일수록 AI 멘토가 더 날카로운 질문을 던집니다.</span>
                  <span>{troublingSentence.length}자</span>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!troublingSentence.trim()}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 disabled:opacity-50 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-blue-500/25 transition-transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>운명 통찰 리포트 생성하기</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>

          </div>
        ) : (
          /* --- [운명 통찰 리포트 뷰어] --- */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xl max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between border-b border-stone-100 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-stone-900 text-white flex items-center justify-center font-serif font-bold shadow-md">
                  <Sparkles className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-stone-900 font-serif">당신의 운명 통찰 리포트</h3>
                  <div className="text-[11px] sm:text-xs text-stone-500 flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span>영혼을 꿰뚫는 철학적 통찰이 담겨있습니다</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setIsDiagnosed(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors"
              >
                다시 진단하기
              </button>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-8 h-8 border-4 border-stone-200 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-sm font-bold text-stone-500 animate-pulse">운명의 흐름을 읽는 중입니다...</p>
              </div>
            ) : reportContent ? (
              <div className="space-y-12 pb-8">
                {/* Section 1 */}
                <div className="space-y-4">
                  <h4 className="text-xl font-extrabold font-serif text-stone-900 border-b-2 border-stone-900 pb-2 inline-block">
                    1. 꿰뚫어보기
                  </h4>
                  <p className="text-sm sm:text-base leading-loose text-stone-700 whitespace-pre-wrap">
                    {reportContent.section1_insight}
                  </p>
                </div>

                {/* Section 2 */}
                <div className="space-y-4 bg-stone-50 p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                  <h4 className="text-xl font-extrabold font-serif text-stone-900 flex items-center gap-2 relative z-10">
                    <Flame className="w-5 h-5 text-red-500" />
                    <span>2. 허상의 파괴</span>
                  </h4>
                  <p className="text-sm sm:text-base leading-loose text-stone-800 whitespace-pre-wrap relative z-10 font-medium">
                    {reportContent.section2_fact_violence}
                  </p>
                </div>

                {/* Section 3 */}
                <div className="space-y-4">
                  <h4 className="text-xl font-extrabold font-serif text-stone-900 border-b-2 border-stone-900 pb-2 inline-block">
                    3. 운명의 전환점
                  </h4>
                  <p className="text-sm sm:text-base leading-loose text-stone-700 whitespace-pre-wrap">
                    {reportContent.section3_action_plan}
                  </p>
                </div>

                {/* Section 4 / Master Quote */}
                <div className="mt-12 p-8 sm:p-12 bg-stone-900 text-stone-100 rounded-3xl text-center shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[200px]">
                  <Quote className="w-32 h-32 absolute -top-6 -left-6 text-stone-800/80 -rotate-12 pointer-events-none" />
                  <p className="text-lg sm:text-2xl font-serif font-extrabold leading-snug relative z-10 italic max-w-2xl text-stone-50">
                    "{reportContent.master_final_quote}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-stone-500 text-sm">
                리포트를 불러올 수 없습니다. 다시 시도해주세요.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
