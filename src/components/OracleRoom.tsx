import React, { useState, useRef } from 'react';
import { Sparkles, Flame, Quote, Download, RotateCcw } from 'lucide-react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

interface OracleReport {
  section1_insight: string;
  section2_fact_violence: string;
  section3_action_plan: string;
  master_final_quote: string;
}

export const OracleRoom: React.FC = () => {
  const [userStory, setUserStory] = useState('');
  const [isDiagnosing, setIsDiagnosing] = useState(false);
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
        fetch('/api/oracle/reading', {
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
          master_final_quote: extractString(rawJson, 'master_final_quote')
        });
      }
    } catch (err: any) {
      setError(err.message || '알 수 없는 오류가 발생했습니다.');
      setIsDiagnosing(false);
    }
  };

  const handleDownloadPdf = async () => {
    const pages = document.querySelectorAll('.pdf-page');
    if (pages.length === 0) {
      alert('리포트 영역을 찾을 수 없습니다.');
      return;
    }
    
    try {
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      for (let i = 0; i < pages.length; i++) {
        const pageElement = pages[i] as HTMLElement;
        const imgData = await toPng(pageElement, { 
          pixelRatio: 2,
          backgroundColor: '#1c1917',
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left'
          }
        });

        if (imgData === 'data:,') {
          throw new Error('리포트 화면을 캡처하는 데 실패했습니다. 내용이 너무 길어 브라우저 렌더링에 문제가 생겼을 수 있습니다.');
        }
        
        if (i > 0) pdf.addPage();
        
        const imgProps = pdf.getImageProperties(imgData);
        const ratio = imgProps.width / imgProps.height;
        const pdfHeight = pdfWidth / ratio;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }
      
      pdf.save('진단_리포트.pdf');
    } catch (err) {
      console.error('PDF 다운로드 실패:', err);
      alert('PDF 생성 중 오류가 발생했습니다.');
    }
  };

  const handleReset = () => {
    setReport(null);
    setUserStory('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 flex flex-col items-center">
      {!isDiagnosing && !report && (
        <div className="w-full max-w-3xl space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-stone-100 tracking-tight">
              무엇이 당신을 옭아매고 있습니까?
            </h2>
            <p className="text-stone-400 text-sm sm:text-base">
              꾸미거나 포장하지 마십시오. 당신의 뼈아픈 현실과 두려움을 날것 그대로 적어내십시오.
            </p>
          </div>

          <div className="w-full relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-amber-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
            <div className="relative">
              <textarea
                rows={8}
                value={userStory}
                onChange={(e) => setUserStory(e.target.value)}
                placeholder="당신을 괴롭히는 근본적인 불안이나 고민을 날것 그대로 적어주세요."
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
          
          <div 
            id="report-container" 
            ref={reportRef}
            className="space-y-12 flex flex-col items-center w-full"
          >
            {/* Page 1: Cover & Intro */}
            <div className="pdf-page w-full bg-stone-900 border border-stone-800 rounded-3xl p-12 sm:p-16 shadow-2xl text-stone-200 relative overflow-visible flex flex-col justify-center h-auto min-h-[600px] break-inside-avoid">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
              
              <div className="text-center border-b border-stone-800 pb-12 mb-12 relative z-10">
                <h2 className="text-4xl sm:text-5xl font-extrabold font-serif text-stone-100 mb-6 tracking-tight">운명 통찰 리포트</h2>
                <p className="text-stone-500 text-lg sm:text-xl tracking-widest uppercase">Life Oracle Master Reading</p>
              </div>

              <div className="relative z-10 flex flex-col items-center justify-center space-y-8 text-center flex-grow">
                <Quote className="w-16 h-16 text-amber-500/20 mb-4" />
                <p className="text-2xl sm:text-3xl font-serif font-medium leading-loose text-stone-300">
                  당신의 무의식을 관통하는<br />냉철하고 가차없는 팩트체크
                </p>
              </div>
            </div>

            {/* Page 2: Section 1 */}
            <div className="pdf-page w-full bg-stone-900 border border-stone-800 rounded-3xl p-12 sm:p-16 shadow-2xl space-y-12 text-stone-200 relative overflow-visible break-inside-avoid h-auto min-h-[600px] flex flex-col">
              <h4 className="text-3xl font-extrabold font-serif text-amber-500 border-l-4 border-amber-500 pl-6 shrink-0">
                I. 통찰 (문제의 본질)
              </h4>
              <div className="text-lg sm:text-xl leading-[2.2] text-stone-300 whitespace-pre-wrap pl-6 flex-grow">
                {report.section1_insight}
              </div>
            </div>

            {/* Page 3: Section 2 */}
            <div className="pdf-page w-full bg-stone-950 p-12 sm:p-16 rounded-3xl border border-red-900/40 shadow-inner relative z-10 break-inside-avoid h-auto min-h-[600px] overflow-visible flex flex-col">
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-900/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
              <h4 className="text-3xl font-extrabold font-serif text-red-500 flex items-center gap-4 shrink-0 mb-12">
                <Flame className="w-10 h-10" />
                <span>II. 인지 왜곡 팩트체크 (냉정한 분석)</span>
              </h4>
              <div className="text-lg sm:text-xl leading-[2.2] text-stone-300 whitespace-pre-wrap font-medium flex-grow">
                {report.section2_fact_violence}
              </div>
            </div>

            {/* Page 4: Section 3 */}
            <div className="pdf-page w-full bg-stone-900 border border-stone-800 rounded-3xl p-12 sm:p-16 shadow-2xl space-y-12 text-stone-200 relative overflow-visible break-inside-avoid h-auto min-h-[600px] flex flex-col">
              <h4 className="text-3xl font-extrabold font-serif text-blue-400 border-l-4 border-blue-400 pl-6 shrink-0">
                III. 액션 플랜 (행동 지침)
              </h4>
              <div className="text-lg sm:text-xl leading-[2.2] text-stone-300 whitespace-pre-wrap pl-6 flex-grow">
                {report.section3_action_plan}
              </div>
            </div>

            {/* Page 5: Master Quote */}
            <div className="pdf-page w-full p-12 sm:p-24 bg-black/60 text-stone-100 rounded-3xl text-center border border-stone-800 relative z-10 flex flex-col items-center justify-center break-inside-avoid h-auto min-h-[600px] overflow-visible">
              <Quote className="w-32 h-32 absolute -top-8 -left-8 text-stone-800/40 -rotate-12 pointer-events-none" />
              <p className="text-3xl sm:text-5xl font-serif font-extrabold leading-[1.8] italic max-w-4xl text-stone-100 relative z-10">
                "{report.master_final_quote}"
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-8 border-t border-stone-800">
            <button
              onClick={handleDownloadPdf}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-extrabold text-sm sm:text-base shadow-[0_0_15px_rgba(217,119,6,0.3)] transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span>진단 리포트 PDF로 평생 소장하기</span>
            </button>
            
            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-sm sm:text-base transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>상담 종료하기</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
