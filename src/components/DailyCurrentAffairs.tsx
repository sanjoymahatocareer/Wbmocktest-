import React, { useState } from 'react';
import { Newspaper, Calendar, Sparkles, Zap, ChevronRight, Share2, Award, Clock, ArrowLeft, ArrowRight, BookOpen, Globe } from 'lucide-react';
import DailyQuiz from './DailyQuiz';

interface DailyCurrentAffairsProps {
  onEarnPoints: (points: number) => void;
}

interface BulletPoint {
  category: string;
  text: string;
  tag: string;
}

interface CAEntry {
  dateString: string;
  bengaliDate: string;
  points: BulletPoint[];
}

export default function DailyCurrentAffairs({ onEarnPoints }: DailyCurrentAffairsProps) {
  const [activeTab, setActiveTab] = useState<'bulletins' | 'quiz'>('bulletins');
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  const currentAffairsData: CAEntry[] = [
    {
      dateString: '2026-07-07',
      bengaliDate: '০৭ জুলাই, ২০২৬',
      points: [
        {
          category: 'পশ্চিমবঙ্গ স্পেশাল',
          tag: 'WB Special',
          text: 'পশ্চিমবঙ্গ সরকার প্রতিটি জেলায় "কর্মসাথী স্কিম"-এর অধীনে আরও ৫০,০০০ বেকার যুবক-যুবতীকে স্বনির্ভর ঋণের সুবিধা প্রদানের ঘোষণা করল।'
        },
        {
          category: 'জাতীয় বিষয়াবলী',
          tag: 'National',
          text: 'ভারতীয় মহাকাশ গবেষণা সংস্থা (ISRO) তাদের পরবর্তী সৌর মিশন "আদিত্য-L2" এর সফল উৎক্ষেপণের চূড়ান্ত প্রস্তুতি সম্পন্ন করেছে।'
        },
        {
          category: 'খেলাধুলা',
          tag: 'Sports',
          text: 'ভারতের তরুণ দাবাড়ু বিশ্ব মঞ্চে গ্র্যান্ডমাস্টার খেতাব অর্জন করে আন্তর্জাতিক র্যাঙ্কিংয়ে প্রথম দশে জায়গা করে নিয়েছেন।'
        },
        {
          category: 'অর্থনীতি ও ব্যবসা',
          tag: 'Economy',
          text: 'রিজার্ভ ব্যাঙ্ক অফ ইন্ডিয়া (RBI) ডিজিটাল রুপির (e-Rupee) ব্যবহার বাড়াতে এবং গ্রামীণ এলাকায় অফলাইন পেমেন্ট সহজ করতে নতুন ফিচার চালু করেছে।'
        }
      ]
    },
    {
      dateString: '2026-07-06',
      bengaliDate: '০৬ জুলাই, ২০২৬',
      points: [
        {
          category: 'আন্তর্জাতিক বিষয়াবলী',
          tag: 'International',
          text: 'জাতিসংঘের পরিবেশ কর্মসূচি (UNEP) বিশ্বব্যাপী প্লাস্টিক দূষণ রোধে নতুন এক ঐতিহাসিক চুক্তির খসড়া অনুমোদন করেছে।'
        },
        {
          category: 'পশ্চিমবঙ্গ স্পেশাল',
          tag: 'WB Special',
          text: 'কলকাতার রবীন্দ্রভারতী বিশ্ববিদ্যালয়ে নতুন উপাচার্য হিসেবে নিযুক্ত হলেন বিশিষ্ট শিক্ষাবিদ ডঃ অমিয় কুমার সেন।'
        },
        {
          category: 'বিজ্ঞান ও প্রযুক্তি',
          tag: 'Science',
          text: 'গুগলের নতুন কোয়ান্টাম সুপারকম্পিউটার জটিল গাণিতিক সমস্যার সমাধান করতে বিশ্ব রেকর্ড গড়েছে।'
        },
        {
          category: 'পুরস্কার ও সম্মাননা',
          tag: 'Awards',
          text: 'সাহিত্য ক্ষেত্রে অসামান্য অবদানের জন্য এ বছরের মর্যাদাপূর্ণ "জ্ঞানপীঠ পুরস্কার" ঘোষণা করা হল।'
        }
      ]
    },
    {
      dateString: '2026-07-05',
      bengaliDate: '০৫ জুলাই, ২০২৬',
      points: [
        {
          category: 'জাতীয় বিষয়াবলী',
          tag: 'National',
          text: 'ভারতের নতুন সবুজ হাইওয়ে করিডোর দিল্লি-মুম্বাই এক্সপ্রেসওয়ের শেষ ধাপের কাজ সম্পন্ন হয়েছে, যার ফলে যাত্রা সময় ১২ ঘণ্টায় নেমে আসবে।'
        },
        {
          category: 'খেলাধুলা',
          tag: 'Sports',
          text: 'উইম্বলডন টেনিস ২০২৬-এর পুরুষদের একক ফাইনালে শীর্ষ বাছাই খেলোয়াড় জয়লাভ করেছেন।'
        },
        {
          category: 'পশ্চিমবঙ্গ স্পেশাল',
          tag: 'WB Special',
          text: 'সুন্দরবনের ম্যানগ্রোভ সংরক্ষণের জন্য বিশ্ব ব্যাংকের আর্থিক সহায়তায় পশ্চিমবঙ্গ সরকার এক বিশেষ পরিবেশবান্ধব প্রকল্প হাতে নিয়েছে।'
        }
      ]
    }
  ];

  const handleShare = (bengaliDate: string, text: string) => {
    if (navigator.share) {
      navigator.share({
        title: `কারেন্ট অ্যাফেয়ার্স - ${bengaliDate}`,
        text: text,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(`${bengaliDate} এর গুরুত্বপূর্ণ কারেন্ট অ্যাফেয়ার্স:\n${text}`);
      alert('সফলভাবে ক্লিপবোর্ডে কপি করা হয়েছে!');
    }
  };

  const activeEntry = currentAffairsData[selectedDateIndex] || currentAffairsData[0];

  return (
    <div className="max-w-xl mx-auto space-y-5 pb-24 font-sans animate-fadeIn">
      {/* HEADER HERO CARD */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-800 text-white rounded-3xl p-5 shadow-lg shadow-blue-500/10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] bg-white/20 text-white font-extrabold px-2.5 py-1 rounded-full uppercase leading-none inline-block">
              Daily Updates
            </span>
            <h2 className="text-xl md:text-2xl font-black tracking-tight mt-1">
              ডেইলি কারেন্ট অ্যাফেয়ার্স
            </h2>
            <p className="text-[11px] text-blue-100 font-bold leading-normal">
              পশ্চিমবঙ্গ চাকরি পরীক্ষার সাম্প্রতিক খবরাখবর ও প্রস্তুতি গাইড
            </p>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl">
            <Newspaper className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* TABS SELECTOR */}
        <div className="flex bg-black/15 rounded-2xl p-1 mt-5 gap-1">
          <button
            onClick={() => setActiveTab('bulletins')}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'bulletins'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>আজকের গুরুত্বপূর্ণ খবর</span>
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-white hover:bg-white/5'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>ডেইলি জিকে ও কারেন্ট কুইজ</span>
          </button>
        </div>
      </div>

      {activeTab === 'bulletins' ? (
        <div className="space-y-4">
          {/* DATE NAVIGATION ROW */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3.5 rounded-2xl shadow-sm">
            <button
              onClick={() => setSelectedDateIndex(prev => Math.min(prev + 1, currentAffairsData.length - 1))}
              disabled={selectedDateIndex === currentAffairsData.length - 1}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="text-center">
              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">সিলেক্টেড আপডেট</span>
              <span className="text-sm font-black text-slate-800 dark:text-white">{activeEntry.bengaliDate}</span>
            </div>
            <button
              onClick={() => setSelectedDateIndex(prev => Math.max(prev - 1, 0))}
              disabled={selectedDateIndex === 0}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-all"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* BULLETINS LIST */}
          <div className="space-y-3.5 animate-fadeIn">
            {activeEntry.points.map((point, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-3xl shadow-sm hover:border-blue-500/35 dark:hover:border-blue-500/25 transition-all relative overflow-hidden group"
              >
                {/* Accent marker on hover */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-blue-600 transition-all" />

                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-[9.5px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 px-2 py-0.5 rounded-md leading-none">
                    {point.category}
                  </span>
                  <button
                    onClick={() => handleShare(activeEntry.bengaliDate, point.text)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    title="শেয়ার করুন"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-slate-700 dark:text-slate-200 text-xs md:text-[13px] leading-relaxed font-semibold">
                  {point.text}
                </p>
              </div>
            ))}
          </div>

          {/* PRACTICE INVITATION BANNER */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-100/40 dark:border-slate-800/80 p-4 rounded-3xl flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[9px] bg-amber-400 text-slate-900 font-extrabold px-1.5 py-0.5 rounded-full uppercase leading-none inline-block">
                Quiz Time
              </span>
              <h4 className="text-xs font-black text-slate-850 dark:text-white">আজকের কারেন্ট অ্যাফেয়ার্স প্র্যাকটিস করতে চান?</h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">৫টি গুরুত্বপূর্ণ কুইজ খেলে দ্বিগুণ এক্সপি (XP) লাভ করুন!</p>
            </div>
            <button
              onClick={() => setActiveTab('quiz')}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-black px-3.5 py-2 rounded-xl transition-all shadow-sm shrink-0 cursor-pointer active:scale-95"
            >
              কুইজ শুরু করুন
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-fadeIn">
          {/* RENDER THE HIGH-QUALITY BUILT-IN DAILY QUIZ WIDGET */}
          <DailyQuiz onEarnPoints={onEarnPoints} />
        </div>
      )}
    </div>
  );
}
