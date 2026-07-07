import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, Award, Zap, HelpCircle, ArrowRight, Check, X, RefreshCw, Clock } from 'lucide-react';
import { Question } from '../types';
import { safeLocalStorage } from '../lib/storage';
import { getTodayDateString } from '../lib/gamification';

// 15 high-quality Bengal government exams questions
const questionsPool: Question[] = [
  {
    id: 'dq-1',
    questionText: 'ভারতের জাতীয় কংগ্রেসের প্রথম সভাপতি কে ছিলেন?',
    options: ['উমেশচন্দ্র বন্দ্যোপাধ্যায়', 'সুরেন্দ্রনাথ বন্দ্যোপাধ্যায়', 'দাদাভাই নওরোজী', 'মহাত্মা গান্ধী'],
    correctOptionIndex: 0,
    subject: 'ইতিহাস',
    explanation: '১৮৮৫ সালে বোম্বাইতে অনুষ্ঠিত ভারতের জাতীয় কংগ্রেসের প্রথম অধিবেশনে উমেশচন্দ্র বন্দ্যোপাধ্যায় সভাপতি নির্বাচিত হন।'
  },
  {
    id: 'dq-2',
    questionText: 'কোন ভিটামিন তাপে নষ্ট হয়ে যায়?',
    options: ['ভিটামিন A', 'ভিটামিন B', 'ভিটামিন C', 'ভিটামিন D'],
    correctOptionIndex: 2,
    subject: 'জীবন বিজ্ঞান',
    explanation: 'ভিটামিন C (অ্যাসকরবিক অ্যাসিড) তাপে সবচেয়ে বেশি সংবেদনশীল এবং রান্না করার সময় বা তাপে সহজেই নষ্ট হয়ে যায়।'
  },
  {
    id: 'dq-3',
    questionText: 'The antonym of "AMATEUR" is:',
    options: ['Novice', 'Professional', 'Learner', 'Beginner'],
    correctOptionIndex: 1,
    subject: 'English (Vocabulary)',
    explanation: 'Amateur শব্দের অর্থ অপেশাদার বা শৌখিন। এর বিপরীত শব্দ হল Professional (পেশাদার)।'
  },
  {
    id: 'dq-4',
    questionText: 'দুটি সংখ্যার অনুপাত ৩:৪ এবং তাদের গসাগু ৪ হলে, লসাগু কত?',
    options: ['১২', '২৪', '৩৬', '৪৮'],
    correctOptionIndex: 3,
    subject: 'গণিত (পাটিগণিত)',
    explanation: 'সংখ্যা দুটি হল ৩*৪ = ১২ এবং ৪*৪ = ১৬। ১২ এবং ১৬ এর লসাগু হল ৪৮ (অথবা লসাগু = ৩ * ৪ * গসাগু = ৩ * ৪ * ৪ = ৪৮)।'
  },
  {
    id: 'dq-5',
    questionText: 'মানবদেহের বৃহত্তম গ্রন্থি কোনটি?',
    options: ['অগ্ন্যাশয়', 'যকৃত (Liver)', 'থাইরয়েড', 'পিটুইটারি'],
    correctOptionIndex: 1,
    subject: 'জীবন বিজ্ঞান',
    explanation: 'মানবদেহের বৃহত্তম গ্রন্থি বা Largest Gland হল যকৃত (Liver)।'
  },
  {
    id: 'dq-6',
    questionText: 'কলকাতা বিশ্ববিদ্যালয় কত সালে প্রতিষ্ঠিত হয়?',
    options: ['১৮৫৭ সালে', '১৮৫৮ সালে', '১৮৬০ সালে', '১৮৬৫ সালে'],
    correctOptionIndex: 0,
    subject: 'ইতিহাস',
    explanation: '১৮৫৭ সালের ২৪শে জানুয়ারি কলকাতা বিশ্ববিদ্যালয় প্রতিষ্ঠিত হয়।'
  },
  {
    id: 'dq-7',
    questionText: 'কোন গ্রহকে "লাল গ্রহ" বলা হয়?',
    options: ['শুক্র', 'মঙ্গল', 'বৃহস্পতি', 'বুধ'],
    correctOptionIndex: 1,
    subject: 'ভূগোল',
    explanation: 'মঙ্গল গ্রহের পৃষ্ঠে প্রচুর আয়রন অক্সাইড থাকায় এটি লাল দেখায়, তাই একে লাল গ্রহ (Red Planet) বলা হয়।'
  },
  {
    id: 'dq-8',
    questionText: 'If in a code language, "CAT" is written as "3120", then how will "DOG" be written?',
    options: ['৪১৫৭', '৪১৫৮', '৫১৬৮', '৪০৫৭'],
    correctOptionIndex: 0,
    subject: 'Reasoning (Coding-Decoding)',
    explanation: 'এখানে প্রতিটি অক্ষরের ইংরেজি বর্ণমালার অবস্থান অনুযায়ী কোড করা হয়েছে। C=3, A=1, T=20। একইভাবে D=4, O=15, G=7। সুতরাং কোডটি হবে 4157 বা ৪১৫৭।'
  },
  {
    id: 'dq-9',
    questionText: 'পশ্চিমবঙ্গের সর্বোচ্চ শৃঙ্গ কোনটি?',
    options: ['সান্দাকফু', 'ফালুট', 'সবরগ্রাম', 'টাইগার হিল'],
    correctOptionIndex: 0,
    subject: 'পশ্চিমবঙ্গ ভূগোল',
    explanation: 'সান্দাকফু (৩৬৩৬ মিটার) হল পশ্চিমবঙ্গের সর্বোচ্চ পর্বতশৃঙ্গ।'
  },
  {
    id: 'dq-10',
    questionText: 'মানুষের রক্তে অক্সিজেন বহনকারী উপাদানটি কী?',
    options: ['হিমোগ্লোবিন', 'শ্বেতকণিকা', 'অণুচক্রিকা', 'প্লাজমা'],
    correctOptionIndex: 0,
    subject: 'জীবন বিজ্ঞান',
    explanation: 'লোহিত রক্তকণিকার হিমোগ্লোবিন ফুসফুস থেকে সারা শরীরে অক্সিজেন পরিবহন করে।'
  },
  {
    id: 'dq-11',
    questionText: 'পানিপথের প্রথম যুদ্ধ কত সালে হয়েছিল?',
    options: ['১৫২৬ সালে', '১৫৫৬ সালে', '১৭৬১ সালে', '১৫২৬ খ্রিস্টপূর্বাব্দে'],
    correctOptionIndex: 0,
    subject: 'ইতিহাস',
    explanation: '১৫২৬ সালে বাবর ও ইব্রাহিম লোদির মধ্যে পানিপথের প্রথম যুদ্ধ হয়েছিল।'
  },
  {
    id: 'dq-12',
    questionText: 'দুধের বিশুদ্ধতা পরিমাপ করতে কোন যন্ত্র ব্যবহার করা হয়?',
    options: ['হাইড্রোমিটার', 'ল্যাক্টোমিটার', 'ব্যারোমিটার', 'থার্মোমিটার'],
    correctOptionIndex: 1,
    subject: 'পদার্থ বিজ্ঞান',
    explanation: 'ল্যাক্টোমিটার (Lactometer) যন্ত্র দিয়ে দুধের ঘনত্ব ও বিশুদ্ধতা পরিমাপ করা হয়।'
  },
  {
    id: 'dq-13',
    questionText: 'একটি ট্রেন ১২০ মিটার লম্বা, একটি পোস্টকে ৯ সেকেন্ডে অতিক্রম করে। ট্রেনের গতিবেগ ঘণ্টায় কত কিমি?',
    options: ['৪০ কিমি', '৪৮ কিমি', '৫৪ কিমি', '৪৮ কিমি/ঘণ্টা'],
    correctOptionIndex: 3,
    subject: 'গণিত (পাটিগণিত)',
    explanation: 'গতিবেগ = (১২০ / ৯) মিটার/সেকেন্ড। কিমি/ঘণ্টায় রূপান্তর করতে ১৮/৫ দিয়ে গুণ করতে হবে: (১২০ / ৯) * (১৮ / ৫) = ৪০/৩ * ৬ = ৪৮ কিমি/ঘণ্টা।'
  },
  {
    id: 'dq-14',
    questionText: 'ভারতের সংবিধানের খসড়া কমিটির (Drafting Committee) সভাপতি কে ছিলেন?',
    options: ['ডঃ বি. আর. আম্বেদকর', 'ডঃ রাজেন্দ্র প্রসাদ', 'জওহরলাল নেহেরু', 'সর্দার বল্লভভাই প্যাটেল'],
    correctOptionIndex: 0,
    subject: 'রাষ্ট্রবিজ্ঞান',
    explanation: 'ডঃ বি. আর. আম্বেদকর ছিলেন ভারতীয় সংবিধানের খসড়া কমিটির সভাপতি, যাঁকে ভারতীয় সংবিধানের জনক বলা হয়।'
  },
  {
    id: 'dq-15',
    questionText: 'Select the correct spelling:',
    options: ['Comittee', 'Committee', 'Committe', 'Comite'],
    correctOptionIndex: 1,
    subject: 'English (Spelling)',
    explanation: 'সভিক বানানটি হল "Committee" (সি-ও-ডবল এম-আই-ডবল টি-ডবল ই)।'
  }
];

// Seeded deterministic question selection based on date string
const getSeedForDate = (dateStr: string): number => {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = dateStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

const selectQuestionsForDate = (dateStr: string): Question[] => {
  const seed = getSeedForDate(dateStr);
  const selected: Question[] = [];
  const tempPool = [...questionsPool];
  
  let currentSeed = seed;
  const nextRandom = () => {
    currentSeed = (currentSeed * 1664525 + 1013904223) % 4294967296;
    return currentSeed / 4294967296;
  };

  // Pick exactly 3 unique questions deterministically
  for (let i = 0; i < 3; i++) {
    const r = nextRandom();
    const index = Math.floor(r * tempPool.length);
    selected.push(tempPool[index]);
    tempPool.splice(index, 1);
  }
  return selected;
};

const getBengaliDateString = (dateStr: string): string => {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];

  const banglaDigits: { [key: string]: string } = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
  };

  const banglaMonths: { [key: string]: string } = {
    '01': 'জানুয়ারি', '02': 'ফেব্রুয়ারি', '03': 'মার্চ', '04': 'এপ্রিল', '05': 'মে', '06': 'জুন',
    '07': 'জুলাই', '08': 'আগস্ট', '09': 'সেপ্টেম্বর', '10': 'অক্টোবর', '11': 'নভেম্বর', '12': 'ডিসেম্বর'
  };

  const convertDigits = (str: string) => {
    return str.split('').map(char => banglaDigits[char] || char).join('');
  };

  const bDay = convertDigits(parseInt(day, 10).toString());
  const bMonth = banglaMonths[month] || month;
  const bYear = convertDigits(year);

  return `${bDay} ${bMonth}, ${bYear}`;
};

interface DailyQuizProps {
  onEarnPoints: (points: number) => void;
}

export default function DailyQuiz({ onEarnPoints }: DailyQuizProps) {
  const todayStr = getTodayDateString();
  const questions = selectQuestionsForDate(todayStr);

  const [gameState, setGameState] = useState<'idle' | 'playing' | 'completed'>('idle');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [pointsAwarded, setPointsAwarded] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<string>('');

  // Load existing daily state
  useEffect(() => {
    const savedStateRaw = safeLocalStorage.getItem(`daily_quiz_${todayStr}`);
    if (savedStateRaw) {
      try {
        const savedState = JSON.parse(savedStateRaw);
        setGameState('completed');
        setSelectedAnswers(savedState.selectedAnswers);
        setQuizScore(savedState.score);
        setPointsAwarded(savedState.pointsAwarded || 0);
      } catch (e) {
        console.error('Failed to load daily quiz state', e);
      }
    }
  }, [todayStr]);

  // Daily reset timer countdown
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diffMs = tomorrow.getTime() - now.getTime();
      
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      const formatBengaliDigits = (num: number): string => {
        const banglaDigits: { [key: string]: string } = {
          '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
        };
        const str = num.toString().padStart(2, '0');
        return str.split('').map(char => banglaDigits[char] || char).join('');
      };

      setTimeLeft(`${formatBengaliDigits(hours)} ঘণ্টা ${formatBengaliDigits(minutes)} মিনিট ${formatBengaliDigits(seconds)} সেকেন্ড`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleStart = () => {
    setGameState('playing');
    setCurrentIdx(0);
    setSelectedAnswers({});
  };

  const handleSelectOption = (optionIndex: number) => {
    if (selectedAnswers[currentIdx] !== undefined) return; // Answered already
    setSelectedAnswers(prev => ({ ...prev, [currentIdx]: optionIndex }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      // Calculate Score
      let score = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctOptionIndex) {
          score++;
        }
      });

      // Calculate Points: 10 per correct answer + 15 bonus for perfect score
      const basePoints = score * 10;
      const bonusPoints = score === questions.length ? 15 : 0;
      const totalPoints = basePoints + bonusPoints;

      setQuizScore(score);
      setPointsAwarded(totalPoints);
      setGameState('completed');

      // Persist locally
      const dailyStateToSave = {
        selectedAnswers,
        score,
        pointsAwarded: totalPoints,
        completedDate: todayStr
      };
      safeLocalStorage.setItem(`daily_quiz_${todayStr}`, JSON.stringify(dailyStateToSave));

      // Award points in global app gamification state
      if (totalPoints > 0) {
        onEarnPoints(totalPoints);
      }
    }
  };

  const formatBanglaNumber = (num: number): string => {
    const banglaDigits: { [key: string]: string } = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
    };
    return num.toString().split('').map(char => banglaDigits[char] || char).join('');
  };

  return (
    <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/40 dark:from-slate-900/60 dark:to-slate-900/20 border border-blue-100/60 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm relative overflow-hidden font-sans">
      
      {/* Visual background decorative dots */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none"></div>
      
      {/* HEADER ROW */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 pb-4 mb-4 border-b border-blue-100/40 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600/10 text-blue-600 rounded-xl dark:bg-blue-500/20 dark:text-blue-400">
            <Zap className="w-4 h-4 fill-blue-600/10" />
          </div>
          <div>
            <h3 className="text-[13px] font-black text-slate-900 dark:text-white flex items-center gap-1.5 leading-none">
              GK & Current Affairs (জিকে ও কারেন্ট অ্যাফেয়ার্স)
              <span className="bg-amber-400 text-slate-950 text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase leading-none font-sans">
                GK & CA
              </span>
            </h3>
            <p className="text-[10px] text-slate-400 font-bold dark:text-slate-500 mt-1">
              {getBengaliDateString(todayStr)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold text-[9px] px-2.5 py-1.5 rounded-full w-fit">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>পরবর্তী কুইজ:</span>
          <span className="text-blue-600 dark:text-blue-400 font-black font-sans">{timeLeft || '--:--:--'}</span>
        </div>
      </div>

      {/* GAMEPLAY STATES */}

      {/* STATE 1: IDLE / NOT STARTED */}
      {gameState === 'idle' && (
        <div className="py-4 text-center space-y-4">
          <div className="max-w-[340px] mx-auto text-center space-y-1.5">
            <h4 className="text-[13px] font-black text-slate-800 dark:text-slate-200">আজকের ডাবল পয়েন্ট কুইজ!</h4>
            <p className="text-[10.5px] text-slate-400 font-bold dark:text-slate-500 leading-relaxed">
              আজকের ৩টি কুইজের সঠিক উত্তর দিয়ে <span className="text-blue-600 dark:text-blue-400 font-black font-sans">+৪৫ WBMockTest</span> কয়েন পয়েন্ট জিতুন।
            </p>
          </div>

          <button
            onClick={handleStart}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-blue-500/15 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            id="start-daily-quiz-btn"
          >
            <span>কুইজ শুরু করুন</span>
            <Sparkles className="w-3.5 h-3.5 fill-white" />
          </button>
        </div>
      )}

      {/* STATE 2: PLAYING */}
      {gameState === 'playing' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500">
              <span className="text-blue-600 dark:text-blue-400 font-black">প্রশ্ন {formatBanglaNumber(currentIdx + 1)} / {formatBanglaNumber(questions.length)}</span>
              <span className="bg-blue-600/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 px-2 py-0.5 rounded-full text-[8.5px]">
                {questions[currentIdx].subject}
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Text */}
          <h4 className="text-[13.5px] font-black text-slate-900 dark:text-white leading-relaxed">
            {questions[currentIdx].questionText}
          </h4>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-2">
            {questions[currentIdx].options.map((option, optIdx) => {
              const hasAnswered = selectedAnswers[currentIdx] !== undefined;
              const isSelected = selectedAnswers[currentIdx] === optIdx;
              const isCorrect = optIdx === questions[currentIdx].correctOptionIndex;

              let btnStyle = "border-slate-150 hover:bg-blue-50/40 dark:border-slate-800 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 bg-white/60 dark:bg-slate-900/40";
              if (hasAnswered) {
                if (isCorrect) {
                  btnStyle = "bg-emerald-500/15 border-emerald-500/50 text-emerald-700 dark:text-emerald-400 font-bold";
                } else if (isSelected) {
                  btnStyle = "bg-rose-500/15 border-rose-500/50 text-rose-700 dark:text-rose-400 font-bold";
                } else {
                  btnStyle = "opacity-50 border-slate-150 dark:border-slate-800 text-slate-400 dark:text-slate-600 bg-white/30 dark:bg-slate-900/20";
                }
              }

              return (
                <button
                  key={optIdx}
                  disabled={hasAnswered}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-3 rounded-xl border text-[12px] font-black transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <span>{option}</span>
                  {hasAnswered && isCorrect && (
                    <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center p-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                  {hasAnswered && isSelected && !isCorrect && (
                    <div className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center p-0.5">
                      <X className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner when answered */}
          {selectedAnswers[currentIdx] !== undefined && questions[currentIdx].explanation && (
            <div className="p-3 bg-blue-50/50 dark:bg-slate-800/40 rounded-xl text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-bold border border-blue-100/20 dark:border-slate-800/20">
              💡 <span className="font-black text-blue-700 dark:text-blue-300">বিশ্লেষণ:</span> {questions[currentIdx].explanation}
            </div>
          )}

          {/* Action button */}
          {selectedAnswers[currentIdx] !== undefined && (
            <button
              onClick={handleNext}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>{currentIdx < questions.length - 1 ? 'পরবর্তী প্রশ্ন' : 'কুইজ সম্পন্ন করুন'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* STATE 3: COMPLETED / TODAY'S QUIZ DONE */}
      {gameState === 'completed' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Celebratory header banner */}
          <div className="p-4 bg-white/60 dark:bg-slate-900/60 border border-blue-100/40 dark:border-slate-800/50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-400/10 text-amber-500 rounded-xl dark:bg-amber-400/20">
                <Trophy className="w-5 h-5 fill-amber-500/10" />
              </div>
              <div>
                <h4 className="text-[13px] font-black text-slate-800 dark:text-white leading-none">
                  আজকের কুইজ সম্পন্ন হয়েছে!
                </h4>
                <p className="text-[10px] text-slate-400 font-bold dark:text-slate-500 mt-1.5">
                  আগামীকাল নতুন প্রশ্নের সাথে কুইজ রিসেট হবে।
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-left">
                <span className="text-[9px] text-slate-400 font-bold block">প্রাপ্ত স্কোর</span>
                <span className="text-base font-black text-slate-800 dark:text-white font-sans">
                  {formatBanglaNumber(quizScore || 0)} / {formatBanglaNumber(questions.length)}
                </span>
              </div>
              <div className="h-8 w-px bg-slate-100 dark:bg-slate-800"></div>
              <div className="text-left">
                <span className="text-[9px] text-slate-400 font-bold block">অর্জিত পয়েন্ট</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-sm font-black flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-emerald-600/10 stroke-[3]" />
                  <span>+{formatBanglaNumber(pointsAwarded)}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Collapsible/Instant review of questions for learning */}
          <div className="space-y-3 pt-2">
            <h5 className="text-[11px] font-black text-slate-700 dark:text-slate-300">প্রশ্নোত্তর ও বিশ্লেষণ রিভিউ করুন:</h5>
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const isUserCorrect = selectedAnswers[idx] === q.correctOptionIndex;
                const userChoice = q.options[selectedAnswers[idx] || 0];
                const correctChoice = q.options[q.correctOptionIndex];

                return (
                  <div 
                    key={q.id} 
                    className="p-3 bg-white/40 dark:bg-slate-900/30 rounded-xl border border-slate-150 dark:border-slate-800/60 text-left space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11.5px] font-black text-slate-800 dark:text-slate-200 leading-relaxed flex-1">
                        {formatBanglaNumber(idx + 1)}. {q.questionText}
                      </span>
                      {isUserCorrect ? (
                        <span className="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 text-[8.5px] font-extrabold px-1.5 py-0.5 rounded-full uppercase shrink-0 font-sans">সঠিক</span>
                      ) : (
                        <span className="bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 text-[8.5px] font-extrabold px-1.5 py-0.5 rounded-full uppercase shrink-0 font-sans">ভুল</span>
                      )}
                    </div>

                    <div className="text-[10.5px] space-y-0.5 font-bold text-slate-400 dark:text-slate-500">
                      <p>আপনার উত্তর: <span className={isUserCorrect ? "text-emerald-600 dark:text-emerald-400 font-extrabold" : "text-rose-600 dark:text-rose-400 font-extrabold"}>{userChoice || "উত্তর দেওয়া হয়নি"}</span></p>
                      {!isUserCorrect && <p>সঠিক উত্তর: <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{correctChoice}</span></p>}
                    </div>

                    {q.explanation && (
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed italic bg-slate-50/50 dark:bg-slate-800/10 p-2 rounded-lg border border-slate-100/30 dark:border-slate-800/10">
                        💡 {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
