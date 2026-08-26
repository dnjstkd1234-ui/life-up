import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  User, 
  Bot, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  BookMarked,
  PhoneCall
} from 'lucide-react';
import { COACH_LIST, COACHING_CATEGORIES } from '../data/marketingData';
import { CoachType, CoachingCategory, Message, UserProfile } from '../types';
import { saveGrowthDiary } from '../lib/firebase';

interface LiveCoachingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onOpenPricing: () => void;
}

export const LiveCoachingModal: React.FC<LiveCoachingModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenPricing
}) => {
  const [selectedCoach, setSelectedCoach] = useState<CoachType>('mindset');
  const [selectedCategory, setSelectedCategory] = useState<CoachingCategory>('daily_care');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-welcome',
      role: 'assistant',
      content: '안녕하세요! 라이프업 1:1 전담 코치입니다. 오늘 어떤 고민이나 목표에 대해 이야기 나누고 싶으신가요?',
      timestamp: Date.now(),
      actionItem: '현재 내 마음속 가장 큰 우선순위 1가지 적어보기',
      keyTakeaway: '변화는 나를 솔직하게 마주하는 작은 대화에서 시작됩니다.'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const currentCoach = COACH_LIST.find(c => c.id === selectedCoach) || COACH_LIST[0];

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: Date.now()
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat/coaching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          coach: selectedCoach,
          category: selectedCategory,
          userName: user?.displayName || '고객'
        })
      });

      const data = await res.json();
      
      const assistantMsg: Message = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: data.message || '소중한 고민을 나눠주셔서 감사합니다. 함께 구체적인 해결책을 만들어가요.',
        actionItem: data.actionItem,
        keyTakeaway: data.keyTakeaway,
        suggestedTopics: data.suggestedTopics,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      console.error('Coaching API error:', e);
      setMessages(prev => [
        ...prev,
        {
          id: `asst-err-${Date.now()}`,
          role: 'assistant',
          content: '훌륭한 고민입니다. 오늘 하루는 나를 위한 10분의 쉼을 먼저 가져보세요!',
          actionItem: '오늘 나에게 가장 편안한 10분의 휴식 선물하기',
          keyTakeaway: '나만의 속도로 나아가는 것이 가장 빠르고 확실한 길입니다.',
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToDiary = async (msg: Message) => {
    if (!user) return;
    try {
      await saveGrowthDiary(user.uid, {
        userId: user.uid,
        title: msg.keyTakeaway || '1:1 코칭 핵심 액션 플랜',
        summary: msg.content.substring(0, 80) + '...',
        actionGoal: msg.actionItem || '오늘 실천 미션 완료하기',
        category: selectedCategory,
        coachName: currentCoach.name,
        date: new Date().toLocaleDateString('ko-KR')
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (e) {
      console.error('Save diary error:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl text-stone-900 relative my-6 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <img
              src={currentCoach.avatar}
              alt={currentCoach.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-500 shadow-xs"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-stone-900 font-serif">
                  {currentCoach.name}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {currentCoach.role}
                </span>
              </div>
              <p className="text-xs text-stone-500">{currentCoach.specialty}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Coach Selector Tab Bar */}
        <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar border-b border-stone-100">
          <span className="text-xs font-bold text-stone-500 flex-shrink-0">코치 선택:</span>
          {COACH_LIST.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCoach(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                selectedCoach === c.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {c.name} ({c.id === 'mindset' ? '멘탈' : c.id === 'career' ? '커리어' : c.id === 'routine' ? '루틴' : '스트레스'})
            </button>
          ))}
        </div>

        {/* Chat Message Scroll Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none shadow-xs font-medium'
                    : 'bg-stone-100 text-stone-900 rounded-bl-none border border-stone-200/80 shadow-xs'
                }`}
              >
                <p className="whitespace-pre-line">{msg.content}</p>

                {/* Assistant Action Item & Takeaway Badge */}
                {msg.role === 'assistant' && msg.actionItem && (
                  <div className="mt-3 pt-3 border-t border-stone-200/70 space-y-2">
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs">
                      <div className="font-bold flex items-center gap-1 text-amber-800 mb-0.5">
                        <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>오늘의 5분 실천 미션:</span>
                      </div>
                      <p>{msg.actionItem}</p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-500">
                      <span className="font-medium text-blue-600">💡 {msg.keyTakeaway}</span>
                      <button
                        onClick={() => handleSaveToDiary(msg)}
                        className="font-bold text-blue-700 hover:underline flex items-center gap-1"
                      >
                        <BookMarked className="w-3.5 h-3.5" />
                        <span>성장 다이어리 저장</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-stone-100 rounded-2xl w-fit text-xs text-stone-500">
              <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>{currentCoach.name}가 맞춤형 답변을 준비하고 있습니다...</span>
            </div>
          )}
        </div>

        {savedSuccess && (
          <div className="py-2 px-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 text-center font-bold mb-2">
            ✓ 성장 다이어리에 성공적으로 저장되었습니다!
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 py-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-stone-400 flex-shrink-0">추천 질문:</span>
          {COACHING_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleSendMessage(cat.starterPrompt)}
              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-blue-50 hover:text-blue-700 text-stone-600 text-[11px] font-medium flex-shrink-0 transition-colors border border-stone-200"
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="pt-2 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="고민이나 질문을 편하게 입력해보세요 (예: 요즘 무기력한데 어떻게 시작할까요?)"
            className="flex-1 bg-stone-100 border border-stone-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-blue-600 font-medium"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputText.trim()}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md transition-colors flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span>전송</span>
          </button>
        </div>

      </div>
    </div>
  );
};
