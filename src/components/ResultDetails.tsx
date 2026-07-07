import React, { useState } from 'react';
import { 
  Award, CheckCircle, XCircle, AlertCircle, Clock, Zap, Download, 
  RefreshCw, ChevronRight, Check, Sparkles, TrendingUp, Compass, 
  Clipboard, Calendar, Flame 
} from 'lucide-react';
import { TestResult, MockTest } from '../types';

interface ResultDetailsProps {
  result: TestResult;
  onRetake: () => void;
  onGoHome: () => void;
  onGoToStudyPlan?: () => void; // Link to smart advisor
}

export default function ResultDetails({
  result,
  onRetake,
  onGoHome,
  onGoToStudyPlan
}: ResultDetailsProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const triggerDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
      alert(`সাফল্যের সাথে PDF রিপোর্ট ডাউনলোড হয়েছে!\nর‍্যাঙ্ক: # ${result.rank}\nমোট স্কোর: ${result.score} / ${result.totalMarks}`);
    }, 1500);
  };

  const scoreRatingText = () => {
    if (result.accuracy >= 80) return 'দুর্দান্ত পারফরম্যান্স! আপনি প্রিপারেশনে অনেক এগিয়ে আছেন।';
    if (result.accuracy >= 50) return 'ভালো চেষ্টা! দুর্বল বিষয়গুলি রিভিশন দিলে আরও উন্নতি সম্ভব।';
    return 'আরও বেশি অনুশীলনের প্রয়োজন আছে। সমাধানপত্র ভালো করে দেখুন।';
  };

  // --- DYNAMIC AI ANALYTICS CALCULATIONS ---
  // Identify the weakest subject based on lowest percentage score
  const getWeakestSubjectDetails = () => {
    if (!result.subjectWise || result.subjectWise.length === 0) {
      return { name: 'পাটিগণিত ও সাধারণ জ্ঞান', percentage: 50 };
    }
    
    let weakestSub = result.subjectWise[0];
    let minPct = 101;

    result.subjectWise.forEach(sub => {
      const pct = sub.total > 0 ? (sub.correct / sub.total) * 100 : 0;
      if (pct < minPct) {
        minPct = pct;
        weakestSub = sub;
      }
    });

    return {
      name: weakestSub.subject,
      percentage: Math.round(minPct)
    };
  };

  const weakestSubject = getWeakestSubjectDetails();

  // Map subjects to high-yield focus topics & custom study advice
  const getSubjectFocusTopics = (subName: string) => {
    const topicDictionary: { [key: string]: { description: string; topics: string[]; actionPlan: string } } = {
      'গণিত': {
        description: 'ফর্মুলা স্পিড ও সলভ স্ট্র্যাটেজিতে দুর্বলতা রয়েছে।',
        topics: ['শতকরা ও গড়ের শর্টকাট সূত্র', 'অনুপাত ও সময়-দূরত্ব গতিবেগ', 'সরল ও চক্রবৃদ্ধি জটিল সুদ'],
        actionPlan: 'প্রতিদিন সকালে ৩০ মিনিট ফর্মুলা খাতা রিভিশন দিন ও মক টেস্ট প্র্যাকটিস করুন।'
      },
      'পাটিগণিত': {
        description: 'ফর্মুলা স্পিড ও সলভ স্ট্র্যাটেজিতে দুর্বলতা রয়েছে।',
        topics: ['শতকরা ও গড়ের শর্টকাট সূত্র', 'অনুপাত ও সময়-দূরত্ব গতিবেগ', 'সরল ও চক্রবৃদ্ধি জটিল সুদ'],
        actionPlan: 'প্রতিদিন সকালে ৩০ মিনিট ফর্মুলা খাতা রিভিশন দিন ও মক টেস্ট প্র্যাকটিস করুন।'
      },
      'ইতিহাস': {
        description: 'ঐতিহাসিক গুরুত্বপূর্ণ সাল ও বিশেষ চুক্তিনামায় রিভিশন প্রয়োজন।',
        topics: ['ভারতের স্বাধীনতা সংগ্রামের চরমপন্থী পর্যায়', 'মুঘল ও সুলতানি শাসনকাল', 'গুরুত্বপূর্ণ যুদ্ধ ও ভাইসরয়দের অবদান'],
        actionPlan: 'ইতিহাসের ম্যাপ চার্ট বানিয়ে পড়ার টেবিলে রাখুন ও ক্রনোলজিক্যাল চার্ট পড়ুন।'
      },
      'ভূগোল': {
        description: 'পশ্চিমবঙ্গের ভৌগোলিক বৈশিষ্ট্য এবং নদ-নদীর উৎপত্তিস্থল সংক্রান্ত প্রিপারেশন দুর্বল।',
        topics: ['পশ্চিমবঙ্গের নদী ও বাঁধ প্রকল্পের অবস্থান', 'ভারতের জলবায়ু ও প্রধান কৃষিজ ফসল', 'বায়ুমণ্ডলীয় স্তর ও সরণ'],
        actionPlan: 'পশ্চিমবঙ্গ ও ভারতের ম্যাপে গুরুত্বপূর্ণ অববাহিকাগুলো চিহ্নিত করে অনুশীলন করুন।'
      },
      'সংবিধান': {
        description: 'সংविधानের মৌলিক ধারা ও সংশোধনীর রেকর্ডগুলোতে ফোকাস কম।',
        topics: ['মৌলিক অধিকার ও রাষ্ট্র পরিচালনার নির্দেশমূলক নীতি', 'রাষ্ট্রপতি ও সুপ্রিম কোর্টের বিশেষ ক্ষমতা', 'গুরুত্বপূর্ণ সংশোধনসমূহ (৪২তম ও ৪৪তম)'],
        actionPlan: 'ধারা মনে রাখতে প্রতিদিন ২০টি সংবিধিবদ্ধ কুইজ অনুশীলন করুন।'
      },
      'ইংরেজি': {
        description: 'ভুল উত্তরের অনুপাত প্রিপোজিশন ও বাগধারা সেকশনে সবচেয়ে বেশি।',
        topics: ['Appropriate Prepositions', 'Synonyms & Antonyms', 'Error Spotting & Sub-Verb Agreement'],
        actionPlan: 'ইংরেজি প্রিপারেশন শক্ত করতে পূর্ববর্তী ৫ বছরের পিএসসি সমাধান ডায়েরি রিভিউ করুন।'
      },
      'বাংলা': {
        description: 'সন্ধি বিচ্ছেদ ও সমাসের নিয়মে সূক্ষ্ম ভুল হচ্ছে।',
        topics: ['সন্ধি বিচ্ছেদ ও সমাস নির্ণয়', 'বানান শুদ্ধিকরণ ও বাগধারা', 'কারক ও বিভক্তি নির্ণয়'],
        actionPlan: 'বাংলা ব্যাকরণ বইয়ের উদাহরণগুলো পুনরায় পুঙ্খানুপুঙ্খ পড়ুন।'
      },
      'বিজ্ঞান': {
        description: 'পদার্থবিদ্যা ও জীববিদ্যার প্রায়োগিক সমীকরণে ফোকাস দরকার।',
        topics: ['কোষ বিভাজন ও গ্রন্থিসমূহ', 'আলো ও শব্দ বিজ্ঞানের মৌলিক সূত্রাবলি', 'তরল পদার্থের সান্দ্রতা ও পরিমাপ'],
        actionPlan: 'সায়েন্সের মূল কনসেপ্ট বুঝতে বাংলা নোট বা ক্রাশ সেশন রিভিশন করুন।'
      },
      'জিকে': {
        description: 'সাম্প্রতিক নোবেল, ক্রীড়া বিষয়ক পুরস্কার ও পশ্চিমবঙ্গের স্কিমসমূহ খতিয়ে দেখা দরকার।',
        topics: ['২০২৫-২৬ সালের জাতীয় ও আন্তর্জাতিক অ্যাওয়ার্ডস', 'পশ্চিমবঙ্গের সরকারি স্কিম ও পলিসি', 'গুরুত্বপূর্ণ জাতীয় দিবস ও থিম'],
        actionPlan: 'প্রতি সপ্তাহের কারেন্ট অ্যাফেয়ার্স বুস্টার পিডিএফ গুলো নিয়ম মাফিক রিভিশন দিন।'
      }
    };

    // Safe fallback matching
    const match = Object.keys(topicDictionary).find(key => subName.includes(key) || key.includes(subName));
    return match ? topicDictionary[match] : {
      description: 'নির্দিষ্ট কিছু সাব-টপিকে সূক্ষ্ম বিশ্লেষণ প্রয়োজন।',
      topics: ['বিগত বছরগুলোর প্রশ্নাবলি', 'সাম্প্রতিক ট্রেন্ডিং MCQ', 'সবচেয়ে গুরুত্বপূর্ণ রিভিশন নোট'],
      actionPlan: 'নিয়মিত কুইজ সেশন দিয়ে দুর্বল অধ্যায় চিহ্নিত করে রিভিশন দিন।'
    };
  };

  const focusData = getSubjectFocusTopics(weakestSubject.name);

  // Dynamic Rank Predictor Model
  const calculatePotentialRank = () => {
    const current = result.rank;
    const accuracyScale = result.accuracy / 100;

    // Potential rank after consistent 2-week revision of weak topics
    const bestPotential = Math.max(1, Math.round(current * (1 - accuracyScale * 0.72)));
    const moderatePotential = Math.max(3, Math.round(current * (1 - accuracyScale * 0.45)));

    return {
      best: bestPotential,
      moderate: moderatePotential
    };
  };

  const predictions = calculatePotentialRank();

  return (
    <div className="space-y-4 font-sans max-w-md mx-auto pb-16">
      {/* 1. Super Award Card Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-950 to-indigo-950 text-white rounded-3xl p-5 border border-slate-800 text-center relative overflow-hidden">
        {/* Glow blur decoration */}
        <div className="absolute top-0 left-0 w-full h-full bg-radial-gradient from-indigo-500/10 to-transparent pointer-events-none" />

        <div className="w-12 h-12 bg-amber-400 text-slate-900 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/20">
          <Award className="w-6 h-6 fill-slate-900" />
        </div>

        <h2 className="text-base font-black text-white leading-tight">
          মক টেস্টের ফলাফল!
        </h2>
        <span className="text-[10px] text-indigo-300 font-bold tracking-wider uppercase block mt-0.5">
          {result.testTitle}
        </span>

        {/* Rating text */}
        <p className="text-xs text-slate-300 px-4 mt-3 leading-relaxed">
          {scoreRatingText()}
        </p>

        {/* Action button row */}
        <div className="flex gap-2.5 mt-5">
          <button
            onClick={triggerDownload}
            disabled={downloading}
            className="flex-1 flex items-center justify-center gap-1 bg-white hover:bg-slate-100 text-slate-900 py-3 rounded-2xl text-xs font-extrabold shadow-md active:scale-95 disabled:opacity-80 transition-all cursor-pointer"
          >
            {downloading ? (
              <div className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            ) : downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-600">ডাউনলোড সমাপ্ত</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>রিপোর্ট কার্ড (PDF)</span>
              </>
            )}
          </button>

          <button
            onClick={onRetake}
            className="p-3 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
            title="পুনরায় চেষ্টা করুন"
          >
            <RefreshCw className="w-4 h-4" />
            <span>আবার দিন</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Row Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* RANK MEDAL CARD */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm text-center relative overflow-hidden">
          <div className="absolute top-2 right-2">
            <span className="text-[9px] font-black text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full uppercase">
              STATE
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-bold block mb-1">আপনার স্টেট র‍্যাঙ্ক</span>
          <span className="text-xl font-black text-indigo-650 dark:text-blue-400 tracking-tight font-sans">
            # {result.rank}
          </span>
          <span className="text-[9px] text-slate-400 block mt-0.5">মোট {result.totalParticipants} জনের মধ্যে</span>
        </div>

        {/* SCORE CARD */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm text-center">
          <span className="text-[10px] text-slate-400 font-bold block mb-1">মোট প্রাপ্ত নম্বর</span>
          <span className="text-xl font-black text-emerald-500 tracking-tight font-sans">
            {result.score} / {result.totalMarks}
          </span>
          <span className="text-[9px] text-slate-400 block mt-0.5">১০০% কাঠিন্য অনুপাত</span>
        </div>

        {/* ACCURACY CARD */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm text-center">
          <span className="text-[10px] text-slate-400 font-bold block mb-1 font-sans">সঠিকতার হার (Accuracy)</span>
          <div className="flex items-center justify-center gap-1">
            <span className="text-xl font-black text-amber-500 tracking-tight font-sans">
              {result.accuracy}%
            </span>
            <Flame className="w-4.5 h-4.5 text-orange-500 fill-orange-50" />
          </div>
          <span className="text-[9px] text-slate-400 block mt-0.5">অ্যাসাইনমেন্ট কোয়ালিটি</span>
        </div>

        {/* TIME TAKEN */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm text-center">
          <span className="text-[10px] text-slate-400 font-bold block mb-1">ব্যয়িত মোট সময়</span>
          <span className="text-xl font-black text-teal-500 tracking-tight font-sans">
            {result.timeTakenMinutes} মিনিট
          </span>
          <span className="text-[9px] text-slate-400 block mt-0.5">নির্দিষ্ট সময়ের ১০%</span>
        </div>
      </div>

      {/* 3. NEW: DYNAMIC AI-POWERED ANALYSIS & INTERACTIVE RANK PREDICTOR */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-4.5 border border-indigo-500/25 shadow-xl space-y-4 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
            <h3 className="text-xs font-black tracking-wider uppercase font-sans">
              এআই পারফরম্যান্স মেন্টর ডায়াগনস্টিকস
            </h3>
          </div>
          <span className="bg-indigo-500/20 text-indigo-200 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
            AI Mentor
          </span>
        </div>

        {/* Identified Weak Topic Box */}
        <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-rose-500/10 rounded-lg flex items-center justify-center shrink-0 border border-rose-500/15">
              <AlertCircle className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-black block">চিহ্নিত দুর্বল বিষয় (Primary Weakness)</span>
              <h4 className="text-[11px] font-black text-rose-300">{weakestSubject.name} — <span className="font-mono text-xs">{weakestSubject.percentage}% Score</span></h4>
            </div>
          </div>
          
          <p className="text-[10.5px] text-indigo-150 leading-relaxed font-sans">
            আপনার ভুল উত্তরের অনুপাত <span className="text-white font-extrabold">{weakestSubject.name}</span> অধ্যায়ে বেশি ছিল। {focusData.description}
          </p>
        </div>

        {/* Suggestive Focus Topics */}
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-[10px] font-black text-indigo-305">
            <Compass className="w-3.5 h-3.5 text-indigo-300" />
            <span>সাজেস্টিভ সাব-টপিকসমূহ (Topics to Master)</span>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {focusData.topics.map((topic, i) => (
              <div key={i} className="flex items-center gap-2 bg-slate-950/40 px-3 py-2 rounded-xl text-[10px] font-sans text-slate-250 border border-white/5">
                <span className="w-4 h-4 bg-indigo-500/30 text-indigo-200 flex items-center justify-center rounded-md font-mono font-bold text-[9px]">{i+1}</span>
                <span className="font-bold">{topic}</span>
              </div>
            ))}
          </div>

          <div className="bg-indigo-900/40 p-2.5 rounded-xl border border-indigo-500/20 text-[10px] text-indigo-150 flex gap-2">
            <Clipboard className="w-4 h-4 text-amber-300 shrink-0" />
            <div>
              <span className="font-black text-white block">দৈনিক কাজের গাইডলাইন:</span>
              <p className="mt-0.5 leading-relaxed font-semibold">{focusData.actionPlan}</p>
            </div>
          </div>
        </div>

        {/* Rank Predictor Section */}
        <div className="border-t border-white/5 pt-3.5 space-y-2.5">
          <div className="flex items-center gap-1.5 text-[10px] font-black text-indigo-300">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>পশ্চিমবঙ্গ রাজ্য স্তরের র‍্যাঙ্ক প্রেডিকশন (Rank Prediction)</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-white/5 flex items-center justify-between">
            <div className="text-center shrink-0 border-r border-white/10 pr-4">
              <span className="text-[8px] text-slate-500 block font-bold leading-none">বর্তমান র‍্যাঙ্ক</span>
              <span className="text-sm font-black text-slate-350 font-mono mt-1.5 block">#{result.rank}</span>
            </div>

            <div className="flex-1 pl-4 space-y-0.5">
              <span className="text-[8px] text-amber-400 block font-black uppercase tracking-wider leading-none">৩ সপ্তাহ সক্রিয় স্টাডি প্ল্যান অনুসরণের পর</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-350 font-sans">
                  #{predictions.best} - #{predictions.moderate}
                </span>
                <span className="text-[8px] text-emerald-400 font-bold block">মেধাতালিকায় অগ্রসর</span>
              </div>
              <p className="text-[8px] text-slate-500 leading-tight">সহজ ও ধারাবাহিক রিভিশনে এই উন্নতি সম্ভব।</p>
            </div>
          </div>

          {/* CTA Link to load Weak topics automatically in study planner */}
          {onGoToStudyPlan && (
            <button
              onClick={onGoToStudyPlan}
              className="w-full py-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:opacity-95 text-slate-950 font-black text-[10px] rounded-xl transition-all duration-300 uppercase tracking-widest flex items-center justify-center gap-2 shadow shadow-amber-500/10 active:scale-98 cursor-pointer mt-1"
            >
              <Calendar className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>এই সাজেশনের উপর ভিত্তি করে স্টাডি প্ল্যানার খুলুন</span>
            </button>
          )}
        </div>

      </div>

      {/* 4. Detailed Stats Analysis Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm space-y-3.5">
        <h3 className="text-xs font-black text-slate-850 dark:text-slate-100 uppercase tracking-wider font-sans border-b border-slate-50 dark:border-slate-800/60 pb-2">
          প্রশ্নের বিস্তারিত ডায়াগনস্টিকস
        </h3>

        <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold font-sans">
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-2xl p-2.5">
            <span className="block text-[10px] text-slate-400 mb-0.5">সঠিক উত্তর</span>
            <span className="text-sm font-black text-emerald-600">{result.correctAnswers} টি</span>
          </div>
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl p-2.5">
            <span className="block text-[10px] text-slate-400 mb-0.5">ভুল উত্তর</span>
            <span className="text-sm font-black text-rose-500">{result.wrongAnswers} টি</span>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl p-2.5">
            <span className="block text-[10px] text-slate-400 mb-0.5">বিনা উত্তর</span>
            <span className="text-sm font-black">{result.unanswered} টি</span>
          </div>
        </div>
      </div>

      {/* 5. Subject-wise correctness progress list */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm space-y-3">
        <h3 className="text-xs font-black text-slate-850 dark:text-slate-100 uppercase tracking-wider font-sans border-b border-slate-50 dark:border-slate-800/60 pb-2">
          বিষয়ভিত্তিক অ্যানালিসিস (Subject wise Analysis)
        </h3>

        <div className="space-y-3">
          {result.subjectWise.map((sub, i) => {
            const pct = Math.round((sub.correct / sub.total) * 100) || 0;
            return (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-baseline text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="font-sans">{sub.subject}</span>
                  <span className="font-mono">{sub.correct} / {sub.total} ({pct}%)</span>
                </div>
                {/* Horizontal status indicators */}
                <div className="w-full bg-slate-100 dark:bg-slate-850 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Go back CTA */}
      <button
        onClick={onGoHome}
        className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold py-3.5 rounded-2xl shadow-lg shadow-blue-500/10 cursor-pointer transition-all active:scale-95"
      >
        <span>প্রধান ড্যাশবোর্ডে ফিরে যান</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
