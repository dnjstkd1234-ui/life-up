import React from 'react';
import { Sparkles } from 'lucide-react';

export const HeaderNav: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur-md border-b border-stone-800 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16 sm:h-20">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 select-none">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-stone-800 to-stone-600 flex items-center justify-center text-white shadow-md shadow-stone-900/50 shrink-0">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-xl sm:text-2xl text-stone-100 tracking-tight font-serif">라이프업</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-stone-800 text-amber-400 border border-stone-700">VIP Lounge</span>
              </div>
              <p className="text-[10px] text-stone-400 tracking-wider font-sans font-medium mt-1 leading-none">운명 통찰 마스터룸</p>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
