import React, { useState, useRef } from 'react';
import { Sparkles, Flame, Quote, Download, RotateCcw } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface OracleReport {
  section1_insight: string;
  section2_fact_violence: string;
  section3_action_plan: string;
  section4_future_prophecy: string;
  master_final_quote: string;
}

export const OracleRoom: React.FC = () => {
  const [userStory, setUserStory] = useState('');
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [report, setReport] = useState<OracleReport | null>(null);
  const [error, setError] = useState('');
  const reportRef = useRef<HTMLDivElement>(null);

  const handleStartDiagnosis = async () => {
    if (!userStory.trim()) return;

    setIsDiagnosing(true);
    setError('');
    setReport(null);

    // Simulate immersive loading time
    const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 4000));

    try {
      const [res] = await Promise.all([
        fetch('/.netlify/functions/generateReport', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userStory }),
        }),
        minLoadingTime,
      ]);

      if (!res.ok) {
        let errData;
        try {
          errData = await res.json();
        } catch {
          errData = null;
        }
        if (errData && errData.error) {
          throw new Error(errData.error);
        }
        throw new Error('진단 중 오류가 발생했습니다.');
      }
      
      const reader = res.body?.getReader();
      if (!reader) throw new Error('스트림을 읽을 수 없습니다.');
      
      const decoder = new TextDecoder('utf-8');
      let rawJson = '';
      
      // Stop spinner and initialize empty report to show the typing effect immediately
      setIsDiagnosing(false);
      setReport({
        section1_insight: '',
        section2_fact_violence: '',
        section3_action_plan: '',
        section4_future_prophecy: '',
        master_final_quote: ''
      });

      const extractString = (raw: string, key: string) => {
        // Find the key in the raw string and capture everything after it until the next key or end of string.
        // It's a rough regex but works for streamed JSON.
        const regex = new RegExp(`"${key}"\\s*:\\s*"([^]*?)(?:",\\s*"[a-zA-Z0-9_]+"\\s*:|"}$|$)`);
        const match = raw.match(regex);
        if (match) {
          // Unescape newlines and quotes
          let text = match[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
          // Sanitize trailing JSON parsing artifacts (like `"}` or `}`)
          text = text.replace(/(?:\\n)*["}]+$/, '');
          return text;
        }
        return '';
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        rawJson += decoder.decode(value, { stream: true });
        
        setReport({
          section1_insight: extractString(rawJson, 'section1_insight'),
          section2_fact_violence: extractString(rawJson, 'section2_fact_violence'),
          section3_action_plan: extractString(rawJson, 'section3_action_plan'),
          section4_future_prophecy: extractString(rawJson, 'section4_future_prophecy'),
          master_final_quote: extractString(rawJson, 'master_final_quote')
        });
      }

    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes('진단 중 오류가 발생했습니다.')) {
        setError(err.message);
      } else {
        setError('AI 서버가 일시적으로 혼잡합니다. 잠시 후 다시 시도해 주세요.');
      }
      setIsDiagnosing(false);
    }
  };

  const handleDownloadPdf = () => {
    // 1. 상태 전환으로 UI 스위칭
    setIsExporting(true);

    // 2. DOM이 완전히 렌더링되도록 1500ms 대기
    setTimeout(() => {
      const element = document.getElementById('pdf-export-container');
      if (!element) {
        setIsExporting(false);
        return;
      }

      const opt = {
        margin: 0, // 이미 CSS에서 padding을 줬으므로 여기선 0
        filename: '운명_통찰_리포트.pdf',
        image: { type: 'jpeg' as const, quality: 1 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true, scrollY: 0, windowWidth: 1122 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' as const },
        pagebreak: { mode: ['css', 'legacy'], avoid: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', '.pdf-page', '.pdf-paragraph', '.break-inside-avoid'] } // 내용이 길면 자동으로 페이지를 나눔
      };
      
      // html2canvas oklch crash workaround
      const originalGetComputedStyle = window.getComputedStyle;
      window.getComputedStyle = function(elt, pseudoElt) {
        const style = originalGetComputedStyle(elt, pseudoElt);
        return new Proxy(style, {
          get(target, prop) {
            const val = target[prop as keyof CSSStyleDeclaration];
            if (typeof val === 'string' && (val.includes('oklch') || val.includes('oklab'))) {
              return val.replace(/(oklch|oklab)\([^)]+\)/g, 'rgba(0, 0, 0, 0.1)');
            }
            if (typeof val === 'function') {
              return (val as Function).bind(target);
            }
            return val;
          }
        });
      };

      html2pdf().set(opt).from(element).save().finally(() => {
        window.getComputedStyle = originalGetComputedStyle;
        setIsExporting(false); // 다시 원래 프리뷰 화면으로 복구
      });
    }, 1500);
  };

  const handleReset = () => {
    setReport(null);
    setUserStory('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const splitIntoParagraphs = (text: string) => {
    if (!text) return [];
    return text.split(/\n+/).filter(p => p.trim() !== '');
  };

  const renderBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 flex flex-col items-center">
      <style>{`
        #pdf-export-container * {
          max-width: 100% !important; /* 부모 너비 초과 절대 금지 */
          text-align: center !important; /* 텍스트 자체 중앙 정렬 */
          word-break: keep-all !important; /* 단어 찢어짐 방지 */
          overflow-wrap: break-word !important; /* 영역 끝에 닿으면 강제 줄바꿈 */
          box-sizing: border-box !important;
          line-height: 2.0 !important;
          color: #ffffff !important;
        }
        .pdf-page, .pdf-paragraph, h1, h2, h3, h4, h5, h6, p, ul, ol, li, #pdf-export-container div {
          break-inside: avoid !important;
          page-break-inside: avoid !important;
        }
        .break-before-page {
          break-before: page !important;
          page-break-before: always !important;
        }
        .break-after-page {
          break-after: page !important;
          page-break-after: always !important;
        }
        #pdf-export-container {
          display: block !important;
          
          /* align-items: center !important; */ /* 완벽한 가로 중앙 정렬 */
          width: 1122px !important; /* A4 가로 픽셀 절대치 */
          min-height: 794px !important; /* A4 세로 픽셀 절대치 */
          height: auto !important;
          box-sizing: border-box !important;
          padding: 80px 120px !important; /* 좌우 120px의 거대한 철벽 여백 */
          margin: 0 auto !important;
          background-color: #1a1a1a !important;
        }
        .pdf-page h2, .pdf-page h3, .pdf-page h4 {
          margin-top: 40px !important;
          margin-bottom: 30px !important;
          padding-top: 10px !important;
          padding-bottom: 10px !important;
          display: block !important;
          position: relative !important;
          z-index: 10 !important;
        }
        .pdf-cover {
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          align-items: center !important;
          min-height: 210mm !important;
        }
        .pdf-page {
          width: 297mm !important; /* A4 가로 */
          height: auto !important;
          box-sizing: border-box !important;
          padding: 40px 50px !important;
          margin: 0 auto !important;
          background-color: #1a1a1a !important;
          position: relative !important;
          display: block !important;
          
          justify-content: center !important;
        }
        .pdf-paragraph, .pdf-page p, .pdf-page li, .pdf-page ul, .pdf-page ol {
          position: relative !important;
          margin-top: 15px !important;
          margin-bottom: 25px !important;
          padding-top: 10px !important;
          padding-bottom: 10px !important;
          color: rgba(255, 255, 255, 0.9) !important;
          font-size: 16px !important;
          z-index: 10 !important;
        }
      `}</style>
      {!isDiagnosing && !report && (
        <div className="w-full max-w-3xl space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="text-center space-y-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-serif text-stone-100 tracking-tight whitespace-nowrap sm:whitespace-normal">
              지금 당신이 직면한 가장 뼈아픈 문제는 무엇입니까?
            </h2>
            <p className="text-stone-400 text-sm sm:text-base">
              자신을 속이지 마십시오. 가장 내밀한 고민부터 현재의 문제점까지, 숨김없이 최대한 구체적으로 작성해야 완벽한 해체가 가능합니다.
            </p>
          </div>

          <div className="w-full relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-amber-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
            <div className="relative">
              <textarea
                rows={8}
                value={userStory}
                onChange={(e) => setUserStory(e.target.value)}
                placeholder="당신을 괴롭히는 근본적인 불안이나 고민을 날것 그대로 적어주세요. (최대한 자세히 적어주세요.)"
                className="w-full p-6 rounded-2xl bg-stone-900 border border-stone-800 text-stone-200 text-sm sm:text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all resize-none placeholder:text-stone-600 shadow-xl"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-950/50 border border-red-900/50 text-red-400 text-sm text-center font-bold">
              {error}
            </div>
          )}

          <button
            onClick={handleStartDiagnosis}
            disabled={!userStory.trim()}
            className="w-full py-5 rounded-2xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-lg sm:text-xl shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <Flame className="w-6 h-6" />
            <span>나의 왜곡된 틀 깨부수기 (AI 진단 시작)</span>
          </button>
        </div>
      )}

      {isDiagnosing && (
        <div className="w-full flex flex-col items-center justify-center py-32 space-y-8 animate-in fade-in duration-1000">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-32 h-32 border border-red-500/30 rounded-full animate-ping" />
            <div className="absolute w-24 h-24 border border-amber-500/50 rounded-full animate-pulse" />
            <div className="w-16 h-16 bg-gradient-to-tr from-red-600 to-amber-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.6)] z-10">
              <Sparkles className="w-8 h-8 text-white animate-spin-slow" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-extrabold font-serif text-stone-200 tracking-widest animate-pulse">
              운명의 장막을 걷어내는 중입니다...
            </h3>
            <p className="text-stone-500 text-sm">마스터가 당신의 무의식을 읽고 있습니다.</p>
          </div>
        </div>
      )}

      {report && !isDiagnosing && (
        <div className="w-full max-w-5xl mx-auto animate-in slide-in-from-bottom-8 fade-in duration-700 space-y-12">
          
          {/* VISIBLE UI FOR BROWSER PREVIEW */}
          {!isExporting && (
            <>
              <div id="report-preview" className="w-full block space-y-12 relative z-10 bg-[#1a1a1a]">
                {/* Page 1: Cover & Intro */}
                <div className="w-full bg-stone-900 border border-stone-800 rounded-3xl p-12 sm:p-16 shadow-2xl text-stone-200 relative overflow-hidden h-auto min-h-[600px] flex flex-col justify-center">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                  
                  <div className="text-center border-b border-stone-800 pb-12 mb-12 relative z-10">
                    <h2 className="text-4xl sm:text-5xl font-extrabold font-serif text-stone-100 mb-6 tracking-tight">운명 통찰 리포트</h2>
                    <p className="text-stone-500 text-lg sm:text-xl tracking-widest uppercase">Life Oracle Master Reading</p>
                  </div>

                  <div className="relative z-10 block text-center">
                    <Quote className="w-16 h-16 text-amber-500/20 mx-auto mb-4" />
                    <p className="text-2xl sm:text-3xl font-serif font-medium leading-loose text-stone-300">
                      당신의 무의식을 관통하는<br />냉철하고 가차없는 팩트체크
                    </p>
                  </div>
                </div>

                {/* Section 1 */}
                <div className="w-full bg-stone-900 border border-stone-800 rounded-3xl p-12 sm:p-16 shadow-2xl text-stone-200 relative overflow-hidden h-auto flex flex-col justify-center">
                  <h4 className="break-inside-avoid text-3xl font-extrabold font-serif text-amber-500 border-l-4 border-amber-500 pl-6 mb-8 block">
                    I. 통찰 (문제의 본질)
                  </h4>
                  <div className="pl-6 block space-y-6 text-lg sm:text-xl leading-[2.2] text-stone-300">
                    {splitIntoParagraphs(report.section1_insight).map((p, idx) => (
                      <p key={idx} className="break-inside-avoid">{renderBold(p)}</p>
                    ))}
                  </div>
                </div>

                {/* Section 2 */}
                <div className="w-full bg-stone-950 p-12 sm:p-16 rounded-3xl border border-red-900/40 shadow-inner relative overflow-hidden h-auto text-stone-200 flex flex-col justify-center">
                  <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-900/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
                  <h4 className="break-inside-avoid text-3xl font-extrabold font-serif text-red-500 mb-12 block">
                    <Flame className="w-10 h-10 inline-block mr-4 align-middle" />
                    <span className="align-middle">II. 인지 왜곡 팩트체크 (냉정한 분석)</span>
                  </h4>
                  <div className="font-medium block space-y-6 text-lg sm:text-xl leading-[2.2] text-stone-300 relative z-10">
                    {splitIntoParagraphs(report.section2_fact_violence).map((p, idx) => (
                      <p key={idx} className="break-inside-avoid">{renderBold(p)}</p>
                    ))}
                  </div>
                </div>

                {/* Section 3 */}
                <div className="w-full bg-stone-900 border border-stone-800 rounded-3xl p-12 sm:p-16 shadow-2xl text-stone-200 relative overflow-hidden h-auto flex flex-col justify-center">
                  <h4 className="break-inside-avoid text-3xl font-extrabold font-serif text-blue-400 border-l-4 border-blue-400 pl-6 mb-8 block">
                    III. 액션 플랜 (행동 지침)
                  </h4>
                  <div className="pl-6 block space-y-6 text-lg sm:text-xl leading-[2.2] text-stone-300">
                    {splitIntoParagraphs(report.section3_action_plan).map((p, idx) => (
                      <p key={idx} className="break-inside-avoid">{renderBold(p)}</p>
                    ))}
                  </div>
                </div>

                {/* Section 4 */}
                <div className="w-full bg-stone-950 border border-indigo-900/40 rounded-3xl p-12 sm:p-16 shadow-inner text-stone-200 relative overflow-hidden h-auto flex flex-col justify-center">
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-900/10 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
                  <h4 className="break-inside-avoid text-3xl font-extrabold font-serif text-indigo-400 border-l-4 border-indigo-400 pl-6 mb-8 block relative z-10">
                    IV. 운명의 심판 (미래 예언 🔮)
                  </h4>
                  <div className="pl-6 block space-y-6 text-lg sm:text-xl leading-[2.2] text-stone-300 relative z-10">
                    {splitIntoParagraphs(report.section4_future_prophecy).map((p, idx) => (
                      <p key={idx} className="break-inside-avoid">{renderBold(p)}</p>
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <div className="w-full p-12 sm:p-24 bg-black/60 text-stone-100 rounded-3xl border border-stone-800 relative h-auto overflow-hidden flex flex-col items-center justify-center text-center min-h-[400px]">
                  <Quote className="w-32 h-32 absolute -top-8 -left-8 text-stone-800/40 -rotate-12 pointer-events-none" />
                  <div className="text-3xl sm:text-5xl font-serif font-extrabold leading-[1.8] italic text-stone-100 relative z-10 space-y-6">
                    {splitIntoParagraphs(report.master_final_quote).map((p, idx) => (
                      <p key={idx} className="break-inside-avoid">{renderBold(p)}</p>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-8 border-t border-stone-800">
                <button
                  onClick={handleDownloadPdf}
                  disabled={isExporting}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 text-white font-extrabold text-sm sm:text-base shadow-[0_0_15px_rgba(217,119,6,0.3)] transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  <span>{isExporting ? "생성 중..." : "진단 리포트 PDF로 평생 소장하기"}</span>
                </button>
                
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-sm sm:text-base transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>상담 종료하기</span>
                </button>
              </div>
            </>
          )}
          
          {/* HIDDEN PDF EXPORT UI (Manual Pagination) */}
          {isExporting && (
            <div id="pdf-export-container">
              {/* Page 1: Cover & Intro */}
              <div className="pdf-page pdf-cover break-inside-avoid break-after-page">
              <div className="text-center border-b border-stone-800 pb-12 mb-12 relative z-10">
                <h2 className="text-4xl sm:text-5xl font-extrabold font-serif text-stone-100 mb-6 tracking-tight">운명 통찰 리포트</h2>
                <p className="text-stone-500 text-lg sm:text-xl tracking-widest uppercase">Life Oracle Master Reading</p>
              </div>

              <div className="relative z-10 block text-center">
                <p className="text-2xl sm:text-3xl font-serif font-medium leading-loose text-stone-300">
                  당신의 무의식을 관통하는<br />냉철하고 가차없는 팩트체크
                </p>
              </div>
            </div>

            {/* Section 1 */}
            {splitIntoParagraphs(report.section1_insight).map((p, idx) => (
              <div key={`s1-${idx}`} className="pdf-page break-inside-avoid">
                {idx === 0 && (
                  <h4 className="break-inside-avoid text-3xl font-extrabold font-serif text-amber-500 border-l-4 border-amber-500 pl-6 mb-8 block">
                    I. 통찰 (문제의 본질)
                  </h4>
                )}
                <div className="pdf-paragraph break-inside-avoid pl-6 block">
                  {renderBold(p)}
                </div>
              </div>
            ))}

            {/* Section 2 */}
            {splitIntoParagraphs(report.section2_fact_violence).map((p, idx) => (
              <div key={`s2-${idx}`} className={`pdf-page break-inside-avoid bg-stone-950 border-red-900/40 ${idx === 0 ? 'break-before-page' : ''}`}>
                {idx === 0 && (
                  <h4 className="break-inside-avoid text-3xl font-extrabold font-serif text-red-500 mb-12 block">
                    II. 인지 왜곡 팩트체크 (냉정한 분석)
                  </h4>
                )}
                <div className="pdf-paragraph break-inside-avoid font-medium block">
                  {renderBold(p)}
                </div>
              </div>
            ))}

            {/* Section 3 */}
            {splitIntoParagraphs(report.section3_action_plan).map((p, idx) => (
              <div key={`s3-${idx}`} className={`pdf-page break-inside-avoid ${idx === 0 ? 'break-before-page' : ''}`}>
                {idx === 0 && (
                  <h4 className="break-inside-avoid text-3xl font-extrabold font-serif text-blue-400 border-l-4 border-blue-400 pl-6 mb-8 block">
                    III. 액션 플랜 (행동 지침)
                  </h4>
                )}
                <div className="pdf-paragraph break-inside-avoid pl-6 block">
                  {renderBold(p)}
                </div>
              </div>
            ))}

            {/* Section 4 */}
            {splitIntoParagraphs(report.section4_future_prophecy).map((p, idx) => (
              <div key={`s4-${idx}`} className={`pdf-page break-inside-avoid bg-stone-950 border-indigo-900/40 ${idx === 0 ? 'break-before-page' : ''}`}>
                {idx === 0 && (
                  <h4 className="break-inside-avoid text-3xl font-extrabold font-serif text-indigo-400 border-l-4 border-indigo-400 pl-6 mb-8 block">
                    IV. 운명의 심판 (미래 예언 🔮)
                  </h4>
                )}
                <div className="pdf-paragraph break-inside-avoid pl-6 block">
                  {renderBold(p)}
                </div>
              </div>
            ))}

            {/* Master Quote */}
            {splitIntoParagraphs(report.master_final_quote).map((p, idx) => (
              <div key={`quote-${idx}`} className={`pdf-page break-inside-avoid text-center ${idx === 0 ? 'break-before-page' : ''}`}>
                <div className="pdf-paragraph break-inside-avoid text-3xl sm:text-5xl font-serif font-extrabold leading-[1.8] italic text-stone-100 relative z-10 block">
                  {renderBold(p)}
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
