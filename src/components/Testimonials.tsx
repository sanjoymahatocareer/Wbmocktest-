import React, { useState } from 'react';
import { Quote, MessageSquare, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { SuccessStory } from '../types';

interface TestimonialsProps {
  stories: SuccessStory[];
}

export default function Testimonials({ stories }: TestimonialsProps) {
  const [index, setIndex] = useState(0);

  const prev = () => {
    setIndex((prevIndex) => (prevIndex - 1 + stories.length) % stories.length);
  };

  const next = () => {
    setIndex((prevIndex) => (prevIndex + 1) % stories.length);
  };

  const current = stories[index];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm md:text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5 font-sans">
          <Award className="w-4.5 h-4.5 text-amber-500 fill-amber-500" />
          <span>আমাদের সফল শিক্ষার্থীদের গল্প</span>
        </h3>
        <span className="text-[10px] font-bold text-slate-400 font-sans">সেরা অনুপ্রেরণা</span>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-900/60 dark:to-slate-850/40 p-4 border border-slate-100 dark:border-slate-800 rounded-3xl relative overflow-hidden select-none">
        
        {/* Quote decorative icon */}
        <div className="absolute right-3 top-3 text-indigo-200/40 dark:text-slate-800/80">
          <Quote className="w-16 h-16 transform rotate-180" />
        </div>

        <div className="z-10 relative flex flex-col justify-between min-h-[140px]">
          <div>
            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed font-medium mb-4 pr-6">
              "{current.quote}"
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 mt-auto pt-2 border-t border-indigo-100/60 dark:border-slate-800/60">
            <div className="flex items-center gap-2.5">
              <img 
                src={current.avatarUrl} 
                alt={current.name}
                width={40}
                height={40}
                loading="lazy"
                className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                  {current.bengaliName}
                </h4>
                <p className="text-[10px] font-bold text-indigo-650 dark:text-indigo-400 mt-0.5 font-sans">
                  {current.examCleared}
                </p>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              <button 
                onClick={prev}
                className="p-1 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-90 transition-all cursor-pointer"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={next}
                className="p-1 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-90 transition-all cursor-pointer"
                aria-label="Next Testimonial"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
