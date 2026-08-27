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

  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'session' | 'history' | 'subscription'>('session');

  // Daily Nudge Preview State
  const [dailyNudge, setDailyNudge] = useState<{ sentence: string; homeworkQuestion: string } | null>(null);
  const [sessionEnded, setSessionEnded] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Load existing diagnosis if available
  useEffect(() => {
    if (user?.innerDiagnosis) {
      setSelectedEmotion(user.innerDiagnosis.emotion as InnerEmotion || '조급함');
      setSelectedCategory(user.innerDiagnosis.category || '번아웃');
      setTroublingSentence(user.innerDiagnosis.troublingSentence || '');
    }
  }, [user]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

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
    setSessionEnded(false);
    setDailyNudge(null);
    setMessages([]);
    setIsLoading(true);

    try {
      // Call Backend API with initial context
      const res = await fetch('/api/chat/coaching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [],
          userEmotion: selectedEmotion,
          userCategory: selectedCategory,
          userSituation: troublingSentence.trim(),
          userName: user?.displayName || '내담자',
          category: selectedCategory
        })
      });

      const data = await res.json();

      const initialAiMsg: Message = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: data.message,
        timestamp: Date.now(),
        identifiedDistortion: data.identifiedDistortion,
        factVsInterpretation: data.factVsInterpretation,
        sharpQuestion: data.sharpQuestion,
        awakeningQuote: data.dailyNudge?.sentence
      };

      setMessages([initialAiMsg]);
      if (data.dailyNudge) {
        setDailyNudge(data.dailyNudge);
      }
    } catch (err) {
      console.warn('Initial session load error:', err);
      setMessages([
        {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          content: `${selectedEmotion} 감정과 "${troublingSentence}"라는 마음에 가려진 인지적 전제를 함께 깨부숴보겠습니다. 그 생각이 실제로 일어난 '객관적 사실'인가요, 아니면 머릿속이 쓴 '시나리오'인가요?`,
          timestamp: Date.now(),
          identifiedDistortion: '당위적 사고 및 인지 왜곡',
          sharpQuestion: '이 상황에서 내가 100% 통제할 수 있는 단 하나의 행동은 무엇인가요?'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Send follow-up message in Socratic Dialogue
  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isLoading) return;

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: Date.now()
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    const isEndingReq = textToSend.includes('오늘 상담 종료') || textToSend.includes('상담 종료');

    try {
      const res = await fetch('/api/chat/coaching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          userEmotion: selectedEmotion,
          userCategory: selectedCategory,
          userSituation: troublingSentence,
          userName: user?.displayName || '내담자',
          category: selectedCategory,
          isEndingSession: isEndingReq
        })
      });

      const data = await res.json();

      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: data.message,
        timestamp: Date.now(),
        identifiedDistortion: data.identifiedDistortion,
        factVsInterpretation: data.factVsInterpretation,
        sharpQuestion: data.sharpQuestion,
        awakeningQuote: data.dailyNudge?.sentence
      };

      setMessages([...newMessages, aiMsg]);

      if (data.dailyNudge) {
        setDailyNudge(data.dailyNudge);
      }
      if (data.isSessionEnded || isEndingReq) {
        setSessionEnded(true);
      }
    } catch (err) {
      console.warn('Chat send error:', err);
      const fallbackAiMsg: Message = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: isEndingReq 
          ? `[내일의 계몽 알림톡]\n문장: 내가 통제할 수 없는 것을 내려놓을 때 온전한 자유가 시작됩니다.\n질문: 내일 하루 동안 남들의 시선이 아닌 온전한 나를 위한 단 하나의 선택은 무엇인가요?`
          : '말씀하신 답변 속에서 당신이 당연하다고 여겼던 전제는 무엇인가요? 그 전제가 정말 사실인지 다시 한번 깊이 바라보세요.',
        timestamp: Date.now()
      };
      setMessages([...newMessages, fallbackAiMsg]);
      if (isEndingReq) setSessionEnded(true);
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

  // 2. If not subscribed -> Prompt Subscription (Basic / Premium)
  if (!isSubscribed) {
    return (
      <div className="min-h-[80vh] py-16 px-4 max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-xl space-y-8 text-center max-w-xl mx-auto">
          
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
              구독 멤버십 필요
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-900">
              정기구독 후 내면 진단 및 1:1 상담이 시작됩니다
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              월 6,500원(하루 약 200원)으로 내 인지 왜곡을 깨부수는 1:1 AI 멘토와 매일 아침 카카오톡 맞춤 알림톡을 받아보세요.
            </p>
          </div>

          {/* Plan Options Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700">베이직</span>
                <span className="text-sm font-extrabold text-stone-900">6,500원/월</span>
              </div>
              <p className="text-[11px] text-stone-600">1:1 AI 상담 무제한 + 데일리 카톡 알림톡</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800">프리미엄</span>
                <span className="text-sm font-extrabold text-stone-900">12,900원/월</span>
              </div>
              <p className="text-[11px] text-stone-600">심층 딥다이브 + 주간 메타인지 리포트</p>
            </div>
          </div>

          <button
            onClick={onOpenPricing}
            className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-blue-500/25 transition-transform active:scale-98 flex items-center justify-center gap-2"
          >
            <span>정기구독 플랜 선택하고 바로 시작하기</span>
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

  // 3. Subscribed User -> Main My Page & Diagnosis & 1:1 Awakening Chat Dashboard
  return (
    <div className="min-h-screen bg-stone-100/60 pb-20 pt-6 px-3 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{plan === 'premium' ? '프리미엄 정기구독 중' : '베이직 정기구독 중'}</span>
              </span>
              <span className="text-xs text-stone-400">·</span>
              <span className="text-xs font-medium text-stone-500">
                카카오톡 알림톡 연동 완료
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
                setMessages([]);
                setDailyNudge(null);
                setSessionEnded(false);
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
                  <span>1:1 맞춤 AI 계몽 멘토링 시작하기</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>

          </div>
        ) : (
          /* --- [1:1 AI 계몽 멘토링 실시간 대화창] --- */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left Col: Context & Daily Nudge Status */}
            <div className="space-y-5 lg:col-span-1">
              
              {/* Active Context Card */}
              <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                    <Compass className="w-4 h-4 text-blue-600" />
                    <span>현재 내면 진단 컨텍스트</span>
                  </div>
                  <button
                    onClick={() => setIsDiagnosed(false)}
                    className="text-[11px] text-blue-600 hover:underline font-semibold"
                  >
                    수정
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">현재 감정:</span>
                    <span className="font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded-md">
                      {selectedEmotion}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">고민 영역:</span>
                    <span className="font-bold text-stone-900 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                      [{selectedCategory}]
                    </span>
                  </div>
                  <div className="pt-2 border-t border-stone-100">
                    <span className="text-[11px] text-stone-500 block mb-1">괴롭히는 문장:</span>
                    <p className="p-2.5 bg-stone-50 rounded-xl text-[11px] text-stone-700 italic border border-stone-200/60 leading-relaxed">
                      "{troublingSentence}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Daily Nudge Card */}
              {dailyNudge && (
                <div className="bg-gradient-to-br from-amber-500/10 via-amber-50 to-orange-50 rounded-3xl p-5 border border-amber-200 shadow-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-400 text-stone-900 flex items-center justify-center font-bold text-xs">
                      💬
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-stone-900">[내일의 계몽 알림톡]</span>
                      <span className="text-[10px] text-amber-800 block">내일 오전 8시 카카오톡 발송 예약</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-3.5 shadow-2xs space-y-2 text-xs border border-amber-200/60">
                    <div>
                      <strong className="text-stone-900 text-[11px] block">문장:</strong>
                      <p className="text-stone-700 text-[11.5px] leading-relaxed mt-0.5">
                        {dailyNudge.sentence}
                      </p>
                    </div>
                    <div className="p-2 bg-amber-50 rounded-xl border border-amber-100">
                      <strong className="text-amber-900 text-[10.5px] block">질문 (내일의 숙제):</strong>
                      <p className="text-amber-950 text-[11px] leading-relaxed mt-0.5">
                        {dailyNudge.homeworkQuestion}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* End Session Button */}
              {!sessionEnded ? (
                <button
                  type="button"
                  onClick={() => handleSendMessage('오늘 상담 종료')}
                  className="w-full py-3 px-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>오늘 상담 종료 (알림톡 요약 생성)</span>
                </button>
              ) : (
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 text-center font-bold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>오늘 상담이 성공적으로 완료되었습니다</span>
                </div>
              )}

            </div>

            {/* Right Col: Interactive Socratic Chat */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200 shadow-md flex flex-col h-[650px] overflow-hidden">
              
              {/* Chat Header */}
              <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center font-serif font-bold text-sm shadow-xs">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-stone-900">1:1 맞춤 AI 계몽 멘토</div>
                    <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>소크라테스식 인지 왜곡 교정 세션 진행 중</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                    {selectedCategory}
                  </span>
                </div>
              </div>

              {/* Chat Message List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {messages.map((m) => {
                  const isAi = m.role === 'assistant';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold text-stone-500">
                          {isAi ? '라이프업 계몽 멘토' : user?.displayName || '나'}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div
                        className={`max-w-xl rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                          isAi
                            ? 'bg-stone-50 border border-stone-200 text-stone-800 space-y-3.5 shadow-2xs'
                            : 'bg-blue-600 text-white shadow-xs'
                        }`}
                      >
                        <p className="whitespace-pre-line">{m.content}</p>

                        {/* Cognitive Distortion Badge */}
                        {m.identifiedDistortion && (
                          <div className="pt-2 border-t border-stone-200/80 flex items-center gap-2 text-[11px]">
                            <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60">
                              포착된 인지 왜곡: {m.identifiedDistortion}
                            </span>
                          </div>
                        )}

                        {/* Fact vs Interpretation Split */}
                        {m.factVsInterpretation && (
                          <div className="p-3 bg-white rounded-xl border border-stone-200/80 space-y-1.5 text-[11.5px]">
                            <div className="text-emerald-700 font-semibold">
                              ✓ <strong>객관적 사실 (Fact):</strong> {m.factVsInterpretation.fact}
                            </div>
                            <div className="text-rose-700 font-semibold">
                              ✗ <strong>머릿속 해석 (Illusion):</strong> {m.factVsInterpretation.interpretation}
                            </div>
                          </div>
                        )}

                        {/* Sharp Question Highlight */}
                        {m.sharpQuestion && (
                          <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-[11.5px] text-blue-950 font-medium">
                            ⚡ <strong>계몽 질문:</strong> {m.sharpQuestion}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex items-center gap-2 text-xs text-stone-400 p-3 bg-stone-50 rounded-2xl w-max">
                    <div className="w-4 h-4 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
                    <span>인지 왜곡의 전제를 분석하고 질문을 다듬는 중...</span>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-4 border-t border-stone-200 bg-white">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="생각을 가감 없이 솔직하게 적어보세요..."
                    className="flex-1 px-4 py-3 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-stone-50/40"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
                  >
                    <span>답변하기</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
