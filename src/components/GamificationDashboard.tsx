import React from 'react';
import { 
  Trophy, Flame, Award, ShieldAlert, Sparkles, Star, Target, 
  ChevronRight, Calendar, User, Zap, Lock, CheckCircle2, History 
} from 'lucide-react';
import { TestResult } from '../types';

interface GamificationDashboardProps {
  points: number;
  streakCount: number;
  resultsLog: TestResult[];
  profileName: string;
}

// Pre-defined West Bengal Leaderboard candidates
const WB_LEADERBOARD_MOCKS = [
  { id: '1', name: 'সুদীপ সেনগুপ্ত', district: 'কলকাতা', points: 1850, rank: 1, avatarColor: 'from-amber-500 to-yellow-500' },
  { id: '2', name: 'অনন্যা মুখার্জী', district: 'নদীয়া', points: 1540, rank: 2, avatarColor: 'from-slate-400 to-slate-500' },
  { id: '3', name: 'প্রশান্ত পাত্র', district: 'পূর্ব মেদিনীপুর', points: 1390, rank: 3, avatarColor: 'from-amber-600 to-orange-700' },
  { id: '4', name: 'সোমা ঘোষ', district: 'হাওড়া', points: 1120, rank: 4, avatarColor: 'from-indigo-400 to-purple-600' },
  { id: '5', name: 'রাজেশ চক্রবর্তী', district: 'উত্তর ২৪ পরগনা', points: 950, rank: 5, avatarColor: 'from-teal-400 to-emerald-600' },
];

export default function GamificationDashboard({
  points,
  streakCount,
  resultsLog,
  profileName
}: GamificationDashboardProps) {

  // Calculate dynamic badges based on user performance logic
  const badgesList = [
    {
      id: 'first_step',
      name: 'প্রথম উড্ডয়ন',
      description: 'কমপক্ষে ১টি মক টেস্ট সফলভাবে সম্পন্ন করেছেন।',
      icon: Target,
      color: 'bg-indigo-500 text-white',
      glowColor: 'shadow-indigo-550/20',
      unlocked: resultsLog.length >= 1
    },
    {
      id: 'high_score',
      name: 'অনন্য মেধাবী',
      description: 'একটি টেস্টে ৯০% এর বেশি সঠিক সঠিকতার হার (Accuracy) পেয়েছেন।',
      icon: Award,
      color: 'bg-amber-550 text-white',
      glowColor: 'shadow-amber-500/20',
      unlocked: resultsLog.some(r => r.accuracy >= 90)
    },
    {
      id: 'badge_speed',
      name: 'ঝড়ের গতি',
      description: '১৫ মিনিটের চেয়ে কম সময়ে পরীক্ষা সম্পন্ন করেছেন।',
      icon: Zap,
      color: 'bg-rose-500 text-white',
      glowColor: 'shadow-rose-500/20',
      unlocked: resultsLog.some(r => r.timeTakenMinutes > 0 && r.timeTakenMinutes < 15)
    },
    {
      id: 'daily_streak',
      name: 'অদম্য লড়াকু',
      description: 'টানা ৩ দিনের বেশি পড়াশোনা ও ধারাবাহিক রেকার্ড বজায় রেখেছেন।',
      icon: Flame,
      color: 'bg-orange-550 text-white',
      glowColor: 'shadow-orange-500/20',
      unlocked: streakCount >= 3
    },
    {
      id: 'scholar',
      name: 'জ্ঞান সিন্ধু',
      description: '৩০০ এর বেশি কাস্টম এক্সপেরিযেন্স পয়েন্ট (XP) অর্জন করেছেন।',
      icon: Sparkles,
      color: 'bg-purple-600 text-white',
      glowColor: 'shadow-purple-500/20',
      unlocked: points >= 300
    },
    {
      id: 'test_master',
      name: 'পরীক্ষা সম্রাট',
      description: '৩ বা তার অধিক মক টেস্ট সফলভাবে পূর্ণ করেছেন।',
      icon: Star,
      color: 'bg-emerald-500 text-white',
      glowColor: 'shadow-emerald-500/20',
      unlocked: resultsLog.length >= 3
    }
  ];

  // Dynamically insert the user into the West Bengal Leaderboard based on current points scale
  const getDynamicLeaderboard = () => {
    const userRow = {
      id: 'user',
      name: profileName,
      district: 'আপনার জেলা',
      points: points,
      rank: 999, // placeholder, will calculate below
      avatarColor: 'from-blue-600 to-indigo-650 animate-pulse'
    };

    // Combine and sort descending by points
    const combined = [...WB_LEADERBOARD_MOCKS, userRow];
    combined.sort((a, b) => b.points - a.points);

    // Apply ranking order
    return combined.map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));
  };

  const dynamicLeaderboard = getDynamicLeaderboard();
  const userRankInWB = dynamicLeaderboard.find(x => x.id === 'user')?.rank || 6;
  const unlockedBadgesCount = badgesList.filter(b => b.unlocked).length;

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. HERO XP STATS BENTO BOX */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-950 to-slate-900 border border-slate-800 text-white p-5 rounded-3xl relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-300">স্টুডেন্ট প্রগ্রেস স্কোর</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black font-sans text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400">
                {points.toLocaleString()}
              </span>
              <span className="text-xs font-black text-slate-350">XP</span>
            </div>
            <p className="text-[10px] text-slate-300 max-w-xs pt-1">
              সঠিক উত্তরের মাধ্যমে পয়েন্ট অর্জন করেছেন। প্রতি সঠিক উত্তরে <span className="text-emerald-400 font-extrabold">+১০ XP</span> যোগ হচ্ছে!
            </p>
          </div>

          <div className="text-center bg-white/5 border border-white/10 rounded-2xl p-3 shrink-0">
            <Flame className="w-9 h-9 text-orange-500 animate-pulse mx-auto" />
            <span className="text-xs font-black block text-orange-400 mt-1">{streakCount} দিন স্ট্রিক</span>
            <span className="text-[8px] text-slate-400 font-bold block">ধারাবাহিক পড়াশোনা</span>
          </div>
        </div>

        {/* Dynamic XP Progress slider to next tier */}
        <div className="mt-5 space-y-1.5 border-t border-white/5 pt-4">
          <div className="flex justify-between items-baseline text-[9px] text-slate-400 font-bold">
            <span>ক্যাডেট স্তর (০ XP)</span>
            <span className="text-amber-300 font-black">মাস্টার প্রিপারেশন স্তর (১৫০০ XP)</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min((points / 1500) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-bold text-slate-300">
            <span>লেভেল {Math.floor(points / 300) + 1}</span>
            <span className="font-mono">পরবর্তী মাইলস্টোন: {Math.max(1500 - points, 0)} XP বাকি</span>
          </div>
        </div>
      </div>

      {/* 2. DAILY STREAKS ENGAGEMENT TRACKER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4.5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-orange-500" />
            <span>দৈনিক কনসিস্টেন্সি স্ট্রিক ক্যালেন্ডার</span>
          </h3>
          <span className="bg-orange-100 dark:bg-orange-950/40 text-orange-600 px-2 py-0.5 rounded-lg text-[9px] font-black">
            🔥 ৫ দিন একটিভ
          </span>
        </div>

        <p className="text-[10px] text-slate-400 leading-normal">
          রোজ মক টেস্ট দিয়ে ধারাবাহিকতার ফায়ার স্ট্রিক সচল রাখুন এবং এক্সট্রা +৫০ XP রিওয়ার্ড পান।
        </p>

        {/* 7 Days of the week indicators */}
        <div className="grid grid-cols-7 gap-2 pt-2 text-center text-[10px] font-bold">
          {['সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র', 'শনি', 'রবি'].map((day, i) => {
            // Mocking active streak for visual feedback
            const isCompleted = i < streakCount || i === 4;
            return (
              <div key={i} className="space-y-1.5 select-none">
                <span className="text-slate-400 dark:text-slate-500 block text-[9px]">{day}</span>
                <div className={`w-full aspect-square rounded-xl border flex items-center justify-center transition-all ${
                  isCompleted 
                    ? 'bg-gradient-to-tr from-orange-400 to-amber-500 border-orange-500 text-white shadow-sm shadow-orange-500/10' 
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-850 text-slate-350'
                }`}>
                  <Flame className={`w-4.5 h-4.5 ${isCompleted ? 'stroke-[2.5]' : 'opacity-40'}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. LEADERBOARD SYSTEM */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800/80 pb-2.5">
          <div>
            <h3 className="text-xs font-black text-slate-850 dark:text-slate-100 uppercase tracking-widest flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>পশ্চিমবঙ্গ লাইভ মেধাতালিকা (State Leaderboard)</span>
            </h3>
            <p className="text-[9px] text-slate-400 mt-0.5 font-bold">পুরো পশ্চিমবঙ্গের সক্রিয় পরীক্ষার্থীদের সাথে প্রতিযোগিতা</p>
          </div>
          <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-black px-2.5 py-0.5 rounded-full">
            র‍্যাঙ্ক: #{userRankInWB}
          </span>
        </div>

        <div className="space-y-2 max-h-[310px] overflow-y-auto pr-1">
          {dynamicLeaderboard.map((row) => {
            const isUser = row.id === 'user';
            const topThree = row.rank <= 3;
            
            return (
              <div 
                key={row.id}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                  isUser 
                    ? 'bg-blue-50/70 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-900/50 shadow-sm' 
                    : 'bg-slate-50/40 border-slate-100/50 dark:bg-slate-950/30 dark:border-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Position Medal Badge */}
                  <div className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    row.rank === 1 ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/40' :
                    row.rank === 2 ? 'bg-slate-200 text-slate-600 dark:bg-slate-800' :
                    row.rank === 3 ? 'bg-orange-100 text-orange-600 dark:bg-orange-950/30' :
                    'text-slate-400 font-sans'
                  }`}>
                    {row.rank}
                  </div>

                  {/* Student profile snapshot */}
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black text-slate-805 dark:text-slate-100 leading-none">
                      {row.name} {isUser && <span className="text-[9px] text-blue-500 bg-blue-100/40 px-1 py-0.25 rounded ml-1 font-bold">আপনি</span>}
                    </h4>
                    <span className="text-[9px] text-slate-400 font-black block">{row.district}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-black text-slate-805 dark:text-slate-100 block">
                    {row.points}
                  </span>
                  <span className="text-[8px] uppercase tracking-wider text-slate-400 font-black">XP</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. ACHIEVEMENTS & MILESTONE BADGES */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800/80 pb-2">
          <h3 className="text-xs font-black text-slate-850 dark:text-slate-100 uppercase tracking-widest flex items-center gap-1.5">
            <Award className="w-4 h-4 text-purple-500" />
            <span>অর্জিত মেডেল ও ব্যাজস ({unlockedBadgesCount} / {badgesList.length})</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3.5 pt-1.5">
          {badgesList.map((badge) => {
            const BadgeIcon = badge.icon;
            return (
              <div 
                key={badge.id}
                className={`p-3 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col items-center text-center space-y-2 ${
                  badge.unlocked 
                    ? 'border-indigo-100 bg-indigo-50/10 dark:border-indigo-950/40 dark:bg-indigo-950/15 shadow-sm' 
                    : 'border-slate-100 opacity-55 saturate-50 dark:border-slate-850'
                }`}
              >
                {/* Locked / Unlocked Status Badge Icon Top Right */}
                {!badge.unlocked && (
                  <div className="absolute top-1.5 right-1.5 text-slate-400">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${badge.glowColor} ${badge.color}`}>
                  <BadgeIcon className="w-5.5 h-5.5 stroke-[2.25]" />
                </div>

                <div>
                  <h4 className="text-[11px] font-black text-slate-800 dark:text-white leading-tight">
                    {badge.name}
                  </h4>
                  <p className="text-[9px] text-slate-405 leading-normal mt-0.5 max-w-[120px] mx-auto">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
