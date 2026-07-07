import React from 'react';
import { Play, Lock, Award, BookOpen, Clock, Zap, Star } from 'lucide-react';
import { MockTest } from '../types';

interface TestCardProps {
  key?: React.Key;
  test: MockTest;
  onStartTest: (test: MockTest) => void;
  isPremiumUser: boolean;
  onReqPremiumUpgrade: () => void;
  purchasedSeries?: string[];
}

export default function TestCard({
  test,
  onStartTest,
  isPremiumUser,
  onReqPremiumUpgrade,
  purchasedSeries = []
}: TestCardProps) {
  // A test is locked if it is marked premium and user doesn't have site-wide premium membership,
  // AND the user hasn't purchased the specific series that this test belongs to.
  const isLocked = test.isPremium && !isPremiumUser && !(test.postId && purchasedSeries.includes(test.postId));

  const handleAction = () => {
    if (isLocked) {
      onReqPremiumUpgrade();
    } else {
      onStartTest(test);
    }
  };

  // Select stylized avatars or gradients based on test type
  const getExamColor = (type: string) => {
    switch (type) {
      case 'panchayat': return 'from-teal-500 to-emerald-600';
      case 'groupd': return 'from-indigo-500 to-blue-600';
      case 'clerkship': return 'from-violet-500 to-purple-600';
      default: return 'from-rose-500 to-orange-500';
    }
  };

  const difficultyBg = {
    'সহজ': 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400',
    'মাঝারি': 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400',
    'কঠিন': 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400',
    'Easy': 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400',
    'Medium': 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400',
    'Hard': 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'
  }[test.difficulty] || 'bg-slate-50 text-slate-600';

  if (isLocked) {
    return (
      <div 
        onClick={handleAction}
        className="cursor-pointer group relative bg-gradient-to-br from-slate-950 via-[#1e150a] to-[#0f0b05] border-2 border-amber-400/80 rounded-3xl p-5 shadow-[0_0_20px_rgba(245,158,11,0.22)] hover:shadow-[0_0_30px_rgba(245,158,11,0.38)] hover:border-amber-400 transition-all duration-300 overflow-hidden flex flex-col justify-between"
      >
        {/* Decorative shine vectors */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-400/15 transition-all duration-500" />
        <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/15 transition-all duration-500" />

        <div>
          {/* Badge and Tagline */}
          <div className="flex justify-between items-center mb-3">
            <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-md shadow-amber-500/20 animate-pulse">
              👑 PREMIUM EXCLUSIVE
            </span>
            <span className="text-[10px] text-amber-400/90 font-bold font-mono tracking-tight bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
              ₹49/মাস
            </span>
          </div>

          {/* Test Main Info */}
          <div className="flex gap-3 items-start mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 text-slate-950 flex items-center justify-center font-black text-[11px] shadow-sm">
              MOCK
            </div>
            <div className="flex-1">
              <h4 className="text-[10px] font-bold text-amber-400 tracking-wide uppercase font-sans mb-0.5">
                {test.examTypeBengali}
              </h4>
              <h3 className="text-[13px] font-black text-white leading-tight">
                {test.bengaliTitle}
              </h3>
            </div>
          </div>

          {/* Eye catching slogan banner */}
          <div className="bg-amber-400/5 rounded-xl border border-amber-400/10 p-2.5 mb-3.5 text-center">
            <p className="text-[10.5px] font-extrabold text-amber-300 leading-snug">
              ⚡ "আজই Premium নিন, পরীক্ষায় এগিয়ে থাকুন!"
            </p>
          </div>

          {/* Features and Benefits List */}
          <div className="space-y-2 mb-4 text-[11px] font-bold text-amber-100/90 pl-1">
            <div className="flex items-start gap-2">
              <span className="text-red-500 font-sans">🔥</span>
              <span className="leading-tight">মাত্র ₹49-এ আনলক করুন সকল Mock Test</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-400">✅</span>
              <span className="leading-tight">All India Rank & AI Performance Analysis</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-400">✅</span>
              <span className="leading-tight">বিস্তারিত Solution & Previous Year Questions</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-400">✅</span>
              <span className="leading-tight">Premium Question Bank + 10X বেশি Practice</span>
            </div>
            <div className="pt-1.5 border-t border-white/5 flex items-center gap-1.5 text-[9.5px] text-amber-400/80 font-bold italic">
              <span>🚀 গত মাসে ৫,০০০+ শিক্ষার্থী Premium ব্যবহার করেছে</span>
            </div>
          </div>
        </div>

        {/* CTA button with Orange → Yellow Gradient */}
        <div className="pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAction();
            }}
            className="w-full flex items-center justify-center gap-2 text-xs font-black py-2.5 px-4 rounded-xl text-slate-950 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 hover:from-orange-400 hover:to-yellow-300 transition-all duration-300 shadow-[0_0_15px_rgba(249,115,22,0.4)] active:scale-95 transform font-sans cursor-pointer"
          >
            <span>👑</span>
            <span>এখনই আনলক করুন</span>
            <span className="text-[10px] bg-slate-950/15 px-1.5 py-0.5 rounded-md font-sans">₹49</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-md hover:shadow-lg dark:shadow-none hover:border-blue-100 dark:hover:border-slate-700 transition-all duration-300 relative overflow-hidden">
      


      {/* Main info row */}
      <div className="flex gap-3 items-start">
        {/* Exam avatar insignia */}
        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${getExamColor(test.examType)} text-white flex items-center justify-center font-bold text-center text-xs shadow-md shadow-slate-100/10`}>
          {test.examType.toUpperCase().substring(0, 3)}
        </div>

        <div className="flex-1 pr-12">
          <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase font-sans mb-0.5">
            {test.examTypeBengali}
          </h4>
          <h3 className="text-[13px] md:text-sm font-extrabold text-slate-800 dark:text-slate-100 leading-snug">
            {test.bengaliTitle}
          </h3>
        </div>
      </div>

      {/* Numerical specifications parameters */}
      <div className="grid grid-cols-3 gap-1 bg-slate-50 dark:bg-slate-950/50 p-2.5 rounded-2xl mt-3.5 border border-slate-100/50 dark:border-slate-800/40 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
        <div className="flex flex-col items-center justify-center border-r border-slate-200/50 dark:border-slate-800/60 pb-0.5">
          <span className="text-[10px] text-slate-400 mb-0.5 flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-indigo-500" /> প্রশ্ন সংখ্যা
          </span>
          <span className="text-slate-800 dark:text-slate-200 font-bold">{test.totalQuestions} টি</span>
        </div>
        <div className="flex flex-col items-center justify-center border-r border-slate-200/50 dark:border-slate-800/60 pb-0.5">
          <span className="text-[10px] text-slate-400 mb-0.5 flex items-center gap-1">
            <Award className="w-3 h-3 text-orange-500" /> মোট নম্বর
          </span>
          <span className="text-slate-800 dark:text-slate-200 font-bold">{test.totalMarks} নম্বর</span>
        </div>
        <div className="flex flex-col items-center justify-center pb-0.5">
          <span className="text-[10px] text-slate-400 mb-0.5 flex items-center gap-1">
            <Clock className="w-3 h-3 text-teal-500" /> মোট সময়
          </span>
          <span className="text-slate-800 dark:text-slate-200 font-bold">{test.durationMinutes} মিনিট</span>
        </div>
      </div>

      {/* Button and difficulty rating bar */}
      <div className="flex items-center justify-between gap-3 mt-4">
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${difficultyBg}`}>
          কাঠিন্য: {test.difficulty}
        </span>

        <button
          onClick={handleAction}
          className={`flex items-center gap-2 text-xs font-extrabold py-2 px-4 rounded-xl transition-all duration-300 active:scale-95 ${
            isLocked
              ? 'bg-amber-100 hover:bg-amber-200 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 dark:hover:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/15'
          }`}
        >
          {isLocked ? (
            <>
              <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>আনলক করুন</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-white" />
              <span>টেস্ট দিন</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
