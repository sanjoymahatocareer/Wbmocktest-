import React, { useEffect, useState } from 'react';
import { Crown, CheckCircle2, ChevronRight, X } from 'lucide-react';

interface PremiumPopupProps {
  onClose: () => void;
  onUpgrade: () => void;
}

export default function PremiumPopup({ onClose, onUpgrade }: PremiumPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Slight delay to trigger the scale/fade animation when mounted
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for transition before unmounting
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-colors duration-300 ${isVisible ? 'bg-black/60 backdrop-blur-sm' : 'bg-transparent point-events-none'}`}>
      <div 
        className={`bg-white dark:bg-slate-900 rounded-[24px] w-full max-w-[320px] overflow-hidden shadow-2xl relative font-sans transition-all duration-300 transform mx-auto ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-8'}`}
      >
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-black/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header - Glassmorphism style with blue gradient */}
        <div className="relative bg-gradient-to-br from-blue-700 via-indigo-600 to-indigo-800 p-5 pb-5 overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-400/20 rounded-full blur-xl -ml-5 -mb-5" />
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center mt-1">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-2 shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-white/20">
              <Crown className="w-6 h-6 text-yellow-300 drop-shadow-md" />
            </div>
            <h2 className="text-[17px] font-black text-white mb-1 tracking-wide drop-shadow-sm">👑 WBMockTest Premium</h2>
            <div className="inline-block bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm mb-2">
              🔥 মাত্র ₹99
            </div>
            <p className="text-blue-100 text-[12px] font-medium leading-relaxed max-w-[240px]">
              ৪৫+ Premium Mock Test<br/>
              All India Rank, Detailed Solution &<br/>
              Performance Analytics
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-white/10">
          <div className="space-y-2 mb-5">
            {[
              'Unlimited Practice',
              'Real Exam Experience',
              'Detailed Solution',
              'All India Ranking',
              'Performance Analysis'
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <button 
              onClick={() => {
                onUpgrade();
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(79,70,229,0.3)] transition-all active:scale-[0.98] text-[14px]"
            >
              🚀 এখনই Premium নিন <ChevronRight className="w-4 h-4 -mr-1" />
            </button>
            <button 
              onClick={handleClose}
              className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-bold py-2.5 px-4 rounded-xl transition-colors active:scale-[0.98] text-[13px]"
            >
              পরে দেখবো
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
