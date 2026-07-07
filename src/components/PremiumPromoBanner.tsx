import React from 'react';
import { Crown, Sparkles, ChevronRight } from 'lucide-react';

interface PremiumPromoBannerProps {
  onUpgradeClick: () => void;
}

export default function PremiumPromoBanner({ onUpgradeClick }: PremiumPromoBannerProps) {
  return (
    <div 
      onClick={onUpgradeClick}
      className="cursor-pointer bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 rounded-[24px] p-4 md:p-5 text-white shadow-xl relative overflow-hidden transform transition-all active:scale-[0.98] border border-blue-500/30 group animate-fadeIn flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
    >
      <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform duration-500">
        <Sparkles className="w-32 h-32 text-indigo-200" />
      </div>

      <div className="flex items-center gap-3.5 relative z-10">
        <div className="w-12 h-12 shrink-0 rounded-[14px] bg-gradient-to-br from-yellow-300 to-amber-500 flex items-center justify-center shadow-lg border border-yellow-200/50">
          <Crown className="w-6 h-6 text-yellow-900" />
        </div>

        <div>
          <h3 className="text-sm md:text-base font-black tracking-tight flex items-center gap-2">
            Premium Mock Test
            <span className="bg-amber-400 text-yellow-950 text-[9px] px-1.5 py-0.5 rounded uppercase font-black tracking-wider shadow-sm">Pro</span>
          </h3>
          <p className="text-[11px] md:text-xs font-medium text-blue-100 mt-0.5 leading-tight opacity-90">
            ৪৫+ Mock Test, All India Rank, Detailed Solution
          </p>
        </div>
      </div>

      <div className="shrink-0 flex items-center w-full md:w-auto relative z-10 border-t border-white/10 md:border-t-0 pt-3 md:pt-0 mt-1 md:mt-0">
        <button className="w-full md:w-auto flex items-center justify-between md:justify-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-md px-4 py-2.5 md:py-2 rounded-xl text-xs md:text-sm font-bold transition-all shadow-sm">
          <span>এখনই Premium নিন</span>
          <ChevronRight className="w-4 h-4 md:stroke-[3]" />
        </button>
      </div>
    </div>
  );
}
