import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Award, Zap, CheckCircle } from 'lucide-react';
import { ViewType } from '../types';
import { safeLocalStorage } from '../lib/storage';

interface HeroSliderProps {
  onCtaClick: (view: ViewType) => void;
  theme: 'light' | 'dark';
}

const defaultSlides = [
  {
    id: 1,
    title: 'পশ্চিমবঙ্গের সেরা মক টেস্ট প্ল্যাটফর্ম',
    subtitle: 'সফলতার পথে আপনার নির্ভরযোগ্য সঙ্গী',
    bengaliSubtitle: 'প্র্যাকটিস করুন, নিজেকে যাচাই করুন, সফলতা নিশ্চিত করুন। সম্পূর্ণ নতুন সিলেবাস ভিত্তিক লেটেস্ট মক টেস্ট।',
    ctaText: 'মক টেস্ট শুরু করুন',
    gradient: 'from-blue-600 via-indigo-600 to-purple-600',
    badge: 'সেরা EdTech প্ল্যাটফর্ম',
    destination: 'mock-tests' as ViewType,
    promoText: '১০,০০০+ ছাত্র-ছাত্রী দ্বারা প্রশংসিত'
  },
  {
    id: 2,
    title: 'পঞ্চায়েত ও ক্লার্কশিপ মেগা মক সিরিজ',
    subtitle: 'সম্পূর্ণ বাংলা ভাষায় স্পেশাল প্রশ্ন ব্যাংক',
    bengaliSubtitle: 'সরকারি সিলেবাস এবং বিগত ১০ বছরের কোশ্চেন প্যাটার্ন মিলিয়ে তৈরি সর্বাধিক কমনযোগ্য প্র্যাকটিস সেট।',
    ctaText: 'ফ্রি টেস্ট শুরু করুন',
    gradient: 'from-purple-600 via-pink-600 to-rose-600',
    badge: 'পরীক্ষা স্পেশাল ২০২৬',
    destination: 'mock-tests' as ViewType,
    promoText: '৫টি ফ্রি এবং ২৫টি প্রিমিয়াম মক টেস্ট'
  },
  {
    id: 3,
    title: 'বিস্তারিত রেজাল্ট ও র‍্যাঙ্ক বিশ্লেষণ',
    subtitle: 'নিজের দুর্বল এরিয়াগুলি চিহ্নিত করুন',
    bengaliSubtitle: 'পরীক্ষা শেষেই পেয়ে যান লিডারবোর্ড র‍্যাঙ্ক, সঠিক উত্তর এবং প্রতিটি সাজেস্টিভ প্রশ্নের নিখুঁত ও সহজ ব্যাখ্যা।',
    ctaText: 'রেজাল্ট ড্যাশবোর্ড',
    gradient: 'from-amber-500 via-orange-600 to-rose-600',
    badge: 'AI অ্যানালাইসিস',
    destination: 'results' as ViewType,
    promoText: '১০০% সঠিক ও বিশদ সমাধান'
  }
];

export default function HeroSlider({ onCtaClick, theme }: HeroSliderProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [slides, setSlides] = useState<any[]>(defaultSlides);

  useEffect(() => {
    try {
      const saved = safeLocalStorage.getItem('examBanglaSettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.dynamicSlides) && parsed.dynamicSlides.length > 0) {
          setSlides(parsed.dynamicSlides);
        }
      }
    } catch (e) {}

    // Attach custom event listener to reload when changed in Admin Panel
    const handleStorageUpdate = () => {
      try {
        const updated = safeLocalStorage.getItem('examBanglaSettings');
        if (updated) {
          const parsed = JSON.parse(updated);
          if (parsed && Array.isArray(parsed.dynamicSlides) && parsed.dynamicSlides.length > 0) {
            setSlides(parsed.dynamicSlides);
          } else {
            setSlides(defaultSlides);
          }
        }
      } catch (e) {}
    };

    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('examBanglaSettingsUpdated', handleStorageUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('examBanglaSettingsUpdated', handleStorageUpdate);
    };
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    if (slides.length === 0) return;
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    if (slides.length === 0) return;
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const current = slides[activeSlide] || slides[0] || defaultSlides[0];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-xl shadow-indigo-600/10 border border-white/10 select-none">
      {/* Slide Content */}
      <div className={`p-6 min-h-[220px] md:min-h-[260px] flex flex-col justify-between transition-all duration-700 bg-gradient-to-r ${current.gradient} text-white relative`}>
        {/* Glow decoration */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial-gradient from-white/20 to-transparent blur-3xl pointer-events-none" />

        <div className="z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] md:text-xs font-semibold tracking-widest uppercase bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-yellow-300">
              {current.badge}
            </span>
            <span className="text-[10px] font-mono text-white/70 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
              {current.promoText}
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight mb-1 font-sans">
            {current.title}
          </h2>
          <p className="text-xs text-white/90 mb-3 font-medium opacity-90">
            {current.subtitle}
          </p>
          <p className="text-[11px] md:text-xs text-indigo-50/90 leading-relaxed max-w-[90%] mb-4 line-clamp-2">
            {current.bengaliSubtitle}
          </p>
        </div>

        {/* CTA Button and Slide Navs */}
        <div className="z-10 flex items-center justify-between gap-2 mt-auto">
          <button
            onClick={() => onCtaClick(current.destination)}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-900 text-xs font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-yellow-500/20 active:scale-95 transition-all text-slate-900"
          >
            <Play className="w-3.5 h-3.5 fill-slate-900 stroke-slate-900" />
            <span>{current.ctaText}</span>
          </button>

          {/* Nav arrows with tiny styling */}
          <div className="flex items-center gap-1 bg-black/15 backdrop-blur-sm p-1 rounded-lg">
            <button 
              onClick={handlePrev} 
              className="p-1 hover:bg-white/25 active:scale-90 rounded transition-colors"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[9px] font-semibold w-6 text-center text-white/90 font-mono">
              {activeSlide + 1}/{slides.length}
            </span>
            <button 
              onClick={handleNext} 
              className="p-1 hover:bg-white/25 active:scale-90 rounded transition-colors"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Slim progress bar of currently active slide */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10">
        <div 
          className="h-full bg-yellow-400 transition-all duration-[6000ms] ease-linear"
          key={activeSlide} 
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}
