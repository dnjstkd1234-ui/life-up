import React from 'react';
import { Flame, Briefcase, Heart, AlertCircle, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const AwakeningThemesSection: React.FC = () => {
  const themes = [
    {
      id: 'burnout',
      icon: Flame,
      iconBg: 'bg-rose-50 text-rose-600 border-rose-200',
      tag: '소진과 무기력',
      title: '1. 번아웃 (Burnout)',
      slogan: '"쉬면서도 불안해하는 죄책감 깨기"',
      distortion: '흑백논리 및 당위적 사고 ("쉬면 영원히 도태될 거야")',
      solution: '‘휴식은 도태’라는 강박을 깨고, 통제할 수 없는 것들을 내려놓는 연습을 돕습니다.',
      sharpQuote: '“지금의 무기력함은 체력 부족일까요, 남들의 기준에 맞추려다 고갈된 것일까요?”'
    },
    {
      id: 'career',
      icon: Briefcase,
      iconBg: 'bg-blue-50 text-blue-600 border-blue-200',
      tag: '진로와 성장',
      title: '2. 취업/커리어 (Career)',
      slogan: '"사회적 트랙에서 나의 트랙으로"',
      distortion: '비교 강박과 실패 공포 ("남들보다 늦으면 끝장이다")',
      solution: '‘정답인 삶’이라는 착각에서 벗어나, 직업을 나의 가치를 실현하는 수단으로 재정의합니다.',
      sharpQuote: '“취업하지 못하면 실패한다는 그 기준은, 대체 누가 만든 것인가요?”'
    },
    {
      id: 'romance',
      icon: Heart,
      iconBg: 'bg-pink-50 text-pink-600 border-pink-200',
      tag: '인간관계와 애착',
      title: '3. 연애/관계 (Romance)',
      slogan: '"타인을 통한 존재 인정 결핍 멈추기"',
      distortion: '의존적 애착과 인정 추구 ("상대가 날 사랑하지 않으면 무가치해")',
      solution: '타인에게서 자신의 존재 가치를 증명받으려는 태도를 직면하고 온전한 자기 자립을 유도합니다.',
      sharpQuote: '“연락이 안 될 때 화가 나는 건, 그 사람이 미워서인가요 존중받지 못할까 두려워서인가요?”'
    },
    {
      id: 'anxiety',
      icon: AlertCircle,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
      tag: '미래와 감정 통제',
      title: '4. 불안 (Anxiety)',
      slogan: '"사실(Fact)과 감정/해석의 분리"',
      distortion: '파국화 시나리오 ("일어나지도 않은 최악을 확신함")',
      solution: '불안을 억지로 통제하려 하지 않고 객관적 사실과 머릿속의 과장된 해석을 명확히 분리합니다.',
      sharpQuote: '“그 불안은 실제로 일어난 \'사실\'인가요, 머릿속이 쓴 \'시나리오\'인가요?”'
    }
  ];

  return (
    <section id="themes" className="py-20 bg-stone-50 border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
            4 Core Pillars
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-stone-900 leading-snug">
            당신이 갇혀 있는 왜곡된 생각의 굴레를 <br className="hidden sm:inline" />
            명쾌하게 깨뜨려 드립니다
          </h2>
          <p className="text-sm text-stone-600">
            어떤 고민이든 본질은 동일합니다. 무의식적 인지 왜곡을 짚어내어 스스로 답을 찾게 돕습니다.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {themes.map(theme => {
            const Icon = theme.icon;
            return (
              <div
                key={theme.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  
                  {/* Card Top */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${theme.iconBg}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">{theme.tag}</span>
                        <h3 className="text-lg font-bold text-stone-900">{theme.title}</h3>
                      </div>
                    </div>
                  </div>

                  {/* Slogan */}
                  <p className="text-base font-bold text-blue-700 font-serif">
                    {theme.slogan}
                  </p>

                  {/* Distortion & Solution */}
                  <div className="space-y-2 text-xs sm:text-sm text-stone-600">
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                      <span className="font-bold text-stone-900 block text-xs mb-0.5">⚠️ 마주할 인지 왜곡</span>
                      <p className="text-xs text-stone-600">{theme.distortion}</p>
                    </div>
                    <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/60">
                      <span className="font-bold text-blue-900 block text-xs mb-0.5">✨ 계몽 솔루션</span>
                      <p className="text-xs text-stone-700">{theme.solution}</p>
                    </div>
                  </div>

                </div>

                {/* Sharp Mentor Question */}
                <div className="pt-3 border-t border-stone-100">
                  <p className="text-xs italic text-stone-500 font-medium leading-relaxed">
                    {theme.sharpQuote}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
