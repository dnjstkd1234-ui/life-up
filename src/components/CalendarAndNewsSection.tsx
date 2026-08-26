import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Bell, 
  ArrowRight, 
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { CALENDAR_EVENTS, NEWS_AND_NOTICES } from '../data/marketingData';
import { EventCalendarItem } from '../types';

interface CalendarAndNewsSectionProps {
  onSelectEvent: (event: EventCalendarItem) => void;
  onOpenCoachingModal: () => void;
}

export const CalendarAndNewsSection: React.FC<CalendarAndNewsSectionProps> = ({
  onSelectEvent,
  onOpenCoachingModal
}) => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'recruitment' | 'notice'>('all');
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonth, setCurrentMonth] = useState(1);
  const [selectedDay, setSelectedDay] = useState<number | null>(16);

  // 2025 January calendar days (31 days, starts on Wednesday = 3 empty slots)
  const daysInMonth = 31;
  const startDayOffset = 3; // Wednesday (0=Sun, 1=Mon, 2=Tue, 3=Wed...)

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptySlots = Array.from({ length: startDayOffset }, (_, i) => i);

  // Filtered news items
  const filteredNews = NEWS_AND_NOTICES.filter(n => {
    if (selectedTab === 'recruitment') return n.category === '수강모집';
    if (selectedTab === 'notice') return n.category === '공지사항';
    return true;
  });

  return (
    <section id="calendar" className="py-12 sm:py-16 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Calendar Widget & Upcoming Schedule (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
                <CalendarIcon className="w-4 h-4" />
                <span>Schedule & Events</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
                  라이프업 일정표
                </h3>
                <span className="text-xs text-stone-600">
                  코칭 등록 기간 및 라이브 특강 일정을 확인해 보세요.
                </span>
              </div>
            </div>

            {/* Calendar & Event List Sub-Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
              
              {/* Mini Calendar (6 cols) */}
              <div className="md:col-span-6 bg-stone-50/80 p-4 rounded-2xl border border-stone-200/70">
                {/* Month Selector */}
                <div className="flex items-center justify-between mb-3 text-stone-800">
                  <button
                    onClick={() => setCurrentMonth(prev => prev > 1 ? prev - 1 : 12)}
                    className="p-1 hover:bg-stone-200 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-sm font-sans">
                    {currentYear}년 {String(currentMonth).padStart(2, '0')}월
                  </span>
                  <button
                    onClick={() => setCurrentMonth(prev => prev < 12 ? prev + 1 : 1)}
                    className="p-1 hover:bg-stone-200 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Day Header */}
                <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-stone-600 mb-2">
                  <span className="text-rose-500">일</span>
                  <span>월</span>
                  <span>화</span>
                  <span>수</span>
                  <span>목</span>
                  <span>금</span>
                  <span className="text-blue-500">토</span>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {emptySlots.map(s => (
                    <div key={`empty-${s}`} className="h-7" />
                  ))}

                  {calendarDays.map(day => {
                    const hasEvent = CALENDAR_EVENTS.some(e => e.day === day);
                    const isSelected = selectedDay === day;

                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`h-7 w-full rounded-lg flex items-center justify-center font-medium transition-all relative ${
                          isSelected
                            ? 'bg-blue-600 text-white font-bold shadow-xs'
                            : hasEvent
                            ? 'bg-blue-50 text-blue-700 font-bold hover:bg-blue-100'
                            : 'text-stone-700 hover:bg-stone-200/60'
                        }`}
                      >
                        <span>{day}</span>
                        {hasEvent && !isSelected && (
                          <span className="absolute bottom-1 w-1 h-1 rounded-full bg-blue-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Event Cards on Right (6 cols) */}
              <div className="md:col-span-6 space-y-3 flex flex-col justify-between">
                {CALENDAR_EVENTS.map(event => (
                  <div
                    key={event.id}
                    onClick={() => onSelectEvent(event)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      selectedDay === event.day
                        ? 'bg-blue-50/80 border-blue-300 shadow-xs'
                        : 'bg-stone-50/60 border-stone-200/80 hover:bg-stone-100'
                    }`}
                  >
                    {/* Big Day Badge */}
                    <div className="w-11 h-11 rounded-xl bg-white border border-stone-200 shadow-xs flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-sm font-extrabold text-blue-600 leading-none">{String(event.day).padStart(2, '0')}</span>
                      <span className="text-[9px] font-mono text-stone-600">25.01</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-xs ${event.badgeColor}`}>
                          {event.category}
                        </span>
                        <span className="text-[10px] text-stone-600 font-mono">{event.dateStr}</span>
                      </div>
                      <h4 className="text-xs font-bold text-stone-900 truncate">
                        {event.title}
                      </h4>
                    </div>
                  </div>
                ))}

                <button
                  onClick={onOpenCoachingModal}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  월간 전체 일정 상세 보기
                </button>
              </div>

            </div>

          </div>

          {/* Right Column: Latest News & Notice Board (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            
            {/* Header & Tabs */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-xl font-bold font-serif text-stone-900">
                  최신뉴스
                </h3>
              </div>

              {/* Sub tabs */}
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setSelectedTab('all')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                    selectedTab === 'all' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  전체
                </button>
                <button
                  onClick={() => setSelectedTab('recruitment')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                    selectedTab === 'recruitment' ? 'bg-blue-600 text-white' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  수강모집
                </button>
                <button
                  onClick={() => setSelectedTab('notice')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                    selectedTab === 'notice' ? 'bg-blue-600 text-white' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  공지사항
                </button>
              </div>
            </div>

            {/* News List */}
            <div className="space-y-4">
              {filteredNews.map(item => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-stone-50 hover:bg-blue-50/50 border border-stone-200/80 hover:border-blue-200 transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-100/70 px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-stone-600 font-mono">{item.date}</span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-1 text-center">
              <button
                onClick={onOpenCoachingModal}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
              >
                <span>공지사항 더보기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
