import React, { useState, useEffect } from 'react';
import { 
  Crown, User, BookOpen, Award, Trophy, Play, CheckCircle2, 
  Lock, Unlock, ArrowRight, BarChart2, Settings, ChevronRight, 
  RefreshCw, LogOut, Check, Sparkles, Star, AlertCircle, Bookmark, Zap, BookOpenCheck, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MockTest, TestResult } from '../types';
import { safeLocalStorage } from '../lib/storage';

interface UserDashboardProps {
  firebaseUser: any | null;
  profileName: string;
  profilePhone: string;
  resultsLog: TestResult[];
  onStartTest: (test: MockTest) => void;
  onSignOut: () => void;
  isPremiumUser: boolean;
  setIsPremiumUser: (val: boolean) => void;
  setView: (view: string) => void;
  onSelectResult: (result: TestResult) => void;
  activeTab?: 'home' | 'my-tests' | 'results' | 'performance' | 'profile';
}

export default function UserDashboard({
  firebaseUser,
  profileName,
  profilePhone,
  resultsLog,
  onStartTest,
  onSignOut,
  isPremiumUser,
  setIsPremiumUser,
  setView,
  onSelectResult,
  activeTab: propActiveTab
}: UserDashboardProps) {
  // Current active sub-tab inside the Dashboard
  const [activeTab, setActiveTab] = useState<'home' | 'my-tests' | 'results' | 'performance' | 'profile'>(propActiveTab || 'home');

  useEffect(() => {
    if (propActiveTab) {
      setActiveTab(propActiveTab);
    }
  }, [propActiveTab]);
  
  // Package purchase simulation state (persisted locally)
  const [hasPurchasedPanchayat, setHasPurchasedPanchayat] = useState<boolean>(() => {
    const saved = safeLocalStorage.getItem('wbm_purchased_panchayat');
    return saved === 'true' || isPremiumUser;
  });

  // Keep in sync with general premium state
  useEffect(() => {
    if (isPremiumUser) {
      setHasPurchasedPanchayat(true);
      safeLocalStorage.setItem('wbm_purchased_panchayat', 'true');
    }
  }, [isPremiumUser]);

  const handleTogglePanchayatPurchase = (purchased: boolean) => {
    setHasPurchasedPanchayat(purchased);
    safeLocalStorage.setItem('wbm_purchased_panchayat', purchased ? 'true' : 'false');
    if (purchased) {
      setIsPremiumUser(true);
    }
  };

  // Simulated unfinished test resume state
  const [hasIncompleteTest, setHasIncompleteTest] = useState<boolean>(true);

  // Simulated Panchayat tests (Mock Tests 1-6)
  const panchayatTestsList = [
    {
      id: 'panchayat-1',
      testNumber: 1,
      title: 'Mock Test 1',
      bengaliTitle: 'মক টেস্ট ১',
      totalQuestions: 100,
      totalMarks: 100,
      durationMinutes: 90,
      difficulty: 'Easy',
      isPremium: false,
      completed: true,
      score: 72,
      rank: 184,
      date: '02 July, 2026'
    },
    {
      id: 'panchayat-2',
      testNumber: 2,
      title: 'Mock Test 2',
      bengaliTitle: 'মক টেস্ট ২',
      totalQuestions: 100,
      totalMarks: 100,
      durationMinutes: 90,
      difficulty: 'Medium',
      isPremium: false,
      completed: false,
      available: true
    },
    {
      id: 'panchayat-3',
      testNumber: 3,
      title: 'Mock Test 3',
      bengaliTitle: 'মক টেস্ট ৩',
      totalQuestions: 100,
      totalMarks: 100,
      durationMinutes: 90,
      difficulty: 'Medium',
      isPremium: false,
      completed: false,
      available: true
    },
    {
      id: 'panchayat-4',
      testNumber: 4,
      title: 'Mock Test 4',
      bengaliTitle: 'মক টেস্ট ৪',
      totalQuestions: 100,
      totalMarks: 100,
      durationMinutes: 90,
      difficulty: 'Hard',
      isPremium: false,
      completed: false,
      available: false
    },
    {
      id: 'panchayat-5',
      testNumber: 5,
      title: 'Mock Test 5',
      bengaliTitle: 'মক টেস্ট ৫',
      totalQuestions: 100,
      totalMarks: 100,
      durationMinutes: 90,
      difficulty: 'Hard',
      isPremium: false,
      completed: false,
      available: false
    },
    {
      id: 'panchayat-6',
      testNumber: 6,
      title: 'Mock Test 6',
      bengaliTitle: 'মক টেস্ট ৬',
      totalQuestions: 100,
      totalMarks: 100,
      durationMinutes: 90,
      difficulty: 'Hard',
      isPremium: false,
      completed: false,
      available: false
    }
  ];

  // Simulated Leaderboard Data
  const leaderboardData = [
    { rank: 1, name: 'সন্দীপ পাল', score: '৯২/১০০', xp: '১৫৪০ XP', isCurrentUser: false },
    { rank: 2, name: 'তনুশ্রী রায়', score: '৮৯/১০০', xp: '১৪২০ XP', isCurrentUser: false },
    { rank: 3, name: 'অভিষেক দাস', score: '৮৭/১০০', xp: '১৩৮০ XP', isCurrentUser: false },
    { rank: 4, name: 'সুস্মিতা মণ্ডল', score: '৮৬/১০০', xp: '১২৯০ XP', isCurrentUser: false },
    { rank: 42, name: profileName + ' (আপনি)', score: '৭২/১০০', xp: '৭৮০ XP', isCurrentUser: true },
    { rank: 43, name: 'দীপক কুমার', score: '৭১/১০০', xp: '৭৬০ XP', isCurrentUser: false }
  ];

  // Subject performance analysis data
  const performanceData = [
    { subject: 'Bengali (বাংলা)', percentage: 85, status: 'শক্তিশালী (Strong)', color: 'bg-emerald-500', textColor: 'text-emerald-600 dark:text-emerald-400' },
    { subject: 'Math (গণিত)', percentage: 72, status: 'মাঝারি (Average)', color: 'bg-amber-500', textColor: 'text-amber-600 dark:text-amber-400' },
    { subject: 'GK (সাধারণ জ্ঞান)', percentage: 60, status: 'দুর্বল (Weak)', color: 'bg-rose-500', textColor: 'text-rose-600 dark:text-rose-400' },
    { subject: 'English (ইংরেজি)', percentage: 78, status: 'শক্তিশালী (Strong)', color: 'bg-emerald-500', textColor: 'text-emerald-600 dark:text-emerald-400' }
  ];

  // Simulated test start triggering
  const triggerStartTestSimulation = (testNum: number) => {
    // Generate a basic MockTest object to load into the existing mock test interface
    const mockTestObj: MockTest = {
      id: `panchayat-sim-${testNum}`,
      title: `WB Panchayat Mock Test ${testNum}`,
      bengaliTitle: `পশ্চিমবঙ্গ পঞ্চায়েত মক টেস্ট ০${testNum}`,
      examType: 'panchayat',
      examTypeBengali: 'Panchayat Recruitment',
      totalQuestions: 5,
      totalMarks: 5,
      durationMinutes: 5,
      difficulty: testNum <= 2 ? 'Easy' : testNum <= 4 ? 'Medium' : 'Hard',
      isPremium: false,
      questions: [
        {
          id: `panchayat-q-${testNum}-1`,
          questionText: 'পশ্চিমবঙ্গ পঞ্চায়েত ব্যবস্থা কয়টি স্তরে বিভক্ত?',
          options: ['১টি স্তর', '২টি স্তর', '৩টি স্তর', '৪টি স্তর'],
          correctOptionIndex: 2,
          subject: 'সাধারণ জ্ঞান',
          explanation: 'পশ্চিমবঙ্গে ত্রিস্তর পঞ্চায়েত ব্যবস্থা চালু আছে: গ্রাম পঞ্চায়েত, পঞ্চায়েত সমিতি ও জেলা পরিষদ।'
        },
        {
          id: `panchayat-q-${testNum}-2`,
          questionText: 'গ্রাম পঞ্চায়েত প্রধান কার দ্বারা নির্বাচিত হন?',
          options: ['জনগণের সরাসরি ভোটে', 'বিডিও (BDO) দ্বারা', 'গ্রাম পঞ্চায়েতের সদস্যদের দ্বারা', 'জেলা শাসক দ্বারা'],
          correctOptionIndex: 2,
          subject: 'সাধারণ জ্ঞান',
          explanation: 'গ্রাম পঞ্চায়েতের নির্বাচিত সদস্যরা নিজেদের মধ্য থেকে একজনকে প্রধান ও একজনকে উপপ্রধান নির্বাচন করেন।'
        },
        {
          id: `panchayat-q-${testNum}-3`,
          questionText: 'একটি পঞ্চায়েতের সাধারণ কার্যকাল কত বছর?',
          options: ['৩ বছর', '৪ বছর', '৫ বছর', '৬ বছর'],
          correctOptionIndex: 2,
          subject: 'সাধারণ জ্ঞান'
        },
        {
          id: `panchayat-q-${testNum}-4`,
          questionText: 'পঞ্চায়েত সমিতি পঞ্চায়েত ব্যবস্থার কোন স্তরে অবস্থিত?',
          options: ['নিম্ন স্তর', 'মধ্য স্তর', 'উচ্চ স্তর', 'কোনোটিই নয়'],
          correctOptionIndex: 1,
          subject: 'সাধারণ জ্ঞান'
        },
        {
          id: `panchayat-q-${testNum}-5`,
          questionText: 'জেলা পরিষদের প্রশাসনিক প্রধান কে?',
          options: ['সভাধিপতি', 'জেলা শাসক (DM)', 'মহকুমা শাসক (SDO)', 'মুখ্যমন্ত্রী'],
          correctOptionIndex: 0,
          subject: 'সাধারণ জ্ঞান'
        }
      ]
    };

    onStartTest(mockTestObj);
  };

  // Handle buy simulation
  const [showBuyModal, setShowBuyModal] = useState(false);
  const triggerBuySimulation = () => {
    setShowBuyModal(true);
  };

  const confirmBuySimulation = () => {
    handleTogglePanchayatPurchase(true);
    setShowBuyModal(false);
    alert('অভিনন্দন! আপনি সফলভাবে "WB Panchayat Mock Test Series" কিনেছেন। মক টেস্ট ২-৬ এর লক খুলে গেছে!');
  };

  return (
    <div className="space-y-4 pb-20 font-sans">
      
      {/* 1. Header (উপরে থাকবে: “স্বাগতম, [User Name]” এবং পাশে Profile icon) */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-3xl shadow-sm transition-colors duration-300">
        <div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider block">আমার ড্যাশবোর্ড</span>
          <h2 className="text-sm font-black text-slate-900 dark:text-white mt-0.5 flex items-center gap-1.5">
            <span>স্বাগতম, {profileName}</span>
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
          </h2>
        </div>
        
        <button 
          onClick={() => setActiveTab('profile')}
          className="w-10 h-10 rounded-full border-2 border-blue-500/20 hover:border-blue-500 p-0.5 overflow-hidden transition-all relative shrink-0 cursor-pointer"
        >
          {firebaseUser?.photoURL ? (
            <img 
              src={firebaseUser.photoURL} 
              alt={profileName} 
              className="w-full h-full rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center text-xs uppercase">
              {profileName.substring(0, 2)}
            </div>
          )}
        </button>
      </div>

      {/* 2. Premium Membership Card (আপনার প্ল্যান: Premium, Valid, Expiry Date, Upgrade/Renew) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#1e293b] to-[#0f172a] text-white border border-slate-850 p-5 rounded-[28px] shadow-lg">
        {/* Glow decoration */}
        <div className="absolute top-[-40px] right-[-40px] w-32 h-32 bg-blue-600/25 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-[-30px] left-[-30px] w-24 h-24 bg-indigo-600/20 rounded-full blur-xl pointer-events-none" />

        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] bg-blue-500/10 border border-blue-500/25 text-blue-400 font-black tracking-wider px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                <Crown className="w-3 h-3 fill-blue-400" /> WBMockTest Elite
              </span>
            </div>
            <h3 className="text-base font-black text-white mt-2 leading-none">
              আপনার প্ল্যান: <span className="text-emerald-400">অল-অ্যাক্সেস এলিট পাস (ফ্রি)</span>
            </h3>
          </div>
          
          <div className="text-right">
            <span className="text-[9px] bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 font-extrabold px-2 py-0.5 rounded-full uppercase">
              Active (সব উন্মুক্ত)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 mt-4 text-[11px] text-slate-400">
          <div>
            <span className="text-[9px] text-slate-500 block uppercase font-bold">কতদিন Valid (Validity)</span>
            <span className="font-extrabold text-white text-xs mt-0.5 block">
              আজীবন (Lifetime)
            </span>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 block uppercase font-bold">Expiry Date (মেয়াদ শেষের তারিখ)</span>
            <span className="font-extrabold text-white text-xs mt-0.5 block">
              কখনো শেষ হবে না (Unlimited)
            </span>
          </div>
        </div>
      </div>

      {/* SUB-TABS SELECTOR CONTAINER */}
      <div className="flex border-b border-slate-150 dark:border-slate-800 pb-px gap-1 font-sans text-xs">
        {[
          { id: 'home', label: 'ড্যাশবোর্ড', icon: Trophy },
          { id: 'my-tests', label: 'আমার টেস্ট', icon: BookOpen },
          { id: 'results', label: 'ফলাফল', icon: Award },
          { id: 'performance', label: 'পারফরম্যান্স', icon: BarChart2 },
          { id: 'profile', label: 'প্রোফাইল', icon: User }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setView(tab.id);
              }}
              className={`flex-1 py-2 flex flex-col items-center gap-1 relative border-b-2 transition-all cursor-pointer ${
                isActive 
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-black' 
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB CONTENTS RENDERING */}
      <div className="space-y-4">
        
        {/* TAB 1: HOME/MAIN DASHBOARD */}
        {activeTab === 'home' && (
          <div className="space-y-4 animate-fadeIn">

            {/* 3. আমার কেনা মক টেস্ট (User যে Category/Package কিনেছে, যেমন “WB Panchayat Mock Test Series”) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-3xl shadow-sm space-y-3 transition-colors duration-300">
              <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-850 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase leading-none">আমার কেনা মক টেস্ট</h4>
                </div>
                <span className="text-[9.5px] font-extrabold bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 px-2 py-0.5 rounded-full uppercase">
                  {hasPurchasedPanchayat ? 'Active (সক্রিয়)' : 'Free Test Available'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase">WB Govt Exam Package</span>
                    <h5 className="text-xs font-black text-slate-900 dark:text-white leading-normal">WB Panchayat Mock Test Series</h5>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-450">
                    {hasPurchasedPanchayat ? '২/৬ সম্পন্ন' : '১/৬ সম্পন্ন'}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: hasPurchasedPanchayat ? '33%' : '17%' }}
                  />
                </div>
                
                <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-sans">
                  <span>Progress: {hasPurchasedPanchayat ? '2/6 Completed' : '1/6 Completed'}</span>
                  <button 
                    onClick={() => setActiveTab('my-tests')}
                    className="text-blue-500 dark:text-blue-400 font-black hover:underline flex items-center"
                  >
                    সবগুলি দেখুন <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 4. चालू রাখুন (Continue) - অসম্পূর্ণ Mock Test আবার Continue করতে পারবে */}
            {hasIncompleteTest && (
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-3xl shadow-sm space-y-2.5 relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 right-0 w-12 h-12 bg-rose-500/10 rounded-bl-3xl flex items-center justify-center pointer-events-none">
                  <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase leading-none">চালু রাখুন (Continue Test)</h4>
                </div>

                <div className="p-3 bg-rose-50/40 dark:bg-rose-950/10 rounded-2xl border border-rose-100/40 dark:border-rose-950/20 flex items-center justify-between">
                  <div>
                    <span className="text-[8.5px] bg-rose-500/10 text-rose-600 dark:text-rose-400 font-extrabold px-1.5 py-0.5 rounded font-sans leading-none uppercase">অসম্পূর্ণ মক টেস্ট</span>
                    <h5 className="text-xs font-black text-slate-850 dark:text-white mt-1">মক টেস্ট ২ (Panchayat Practice)</h5>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-sans">১টি প্রশ্নের উত্তর দেওয়া বাকি | ৩ মিনিট ৫ সেকেন্ড বাকি</p>
                  </div>
                  
                  <button 
                    onClick={() => {
                      if (!hasPurchasedPanchayat) {
                        triggerBuySimulation();
                      } else {
                        triggerStartTestSimulation(2);
                      }
                    }}
                    className="bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-black px-3 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-white stroke-none" />
                    <span>আবার শুরু করুন</span>
                  </button>
                </div>
              </div>
            )}

            {/* 5. আমার ফলাফল (কতটি পরীক্ষা দিয়েছে, Average Score, Best Score, Rank) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-3xl shadow-sm space-y-3 transition-colors duration-300">
              <div className="flex items-center gap-2 border-b border-slate-50 dark:border-slate-850 pb-2">
                <div className="p-1 rounded-lg bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase leading-none">আমার ফলাফল</h4>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-2xl border border-slate-100/50 dark:border-slate-850">
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">কতটি পরীক্ষা দিয়েছে</span>
                  <span className="text-sm font-black text-slate-800 dark:text-white font-sans block mt-1">
                    {resultsLog.length + 1} টি
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-2xl border border-slate-100/50 dark:border-slate-850">
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">Average Score</span>
                  <span className="text-sm font-black text-emerald-500 font-sans block mt-1">
                    {resultsLog.length > 0 
                      ? Math.round((resultsLog.reduce((acc, r) => acc + (r.score/r.totalMarks)*100, 0) + 72) / (resultsLog.length + 1))
                      : 72}%
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-2xl border border-slate-100/50 dark:border-slate-850">
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">Best Score</span>
                  <span className="text-sm font-black text-blue-500 font-sans block mt-1">
                    {resultsLog.length > 0 
                      ? Math.max(...resultsLog.map(r => Math.round((r.score/r.totalMarks)*100)), 72)
                      : 72}%
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-2xl border border-slate-100/50 dark:border-slate-850">
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">লিডারবোর্ড Rank</span>
                  <span className="text-sm font-black text-amber-500 font-sans block mt-1">#42</span>
                </div>
              </div>
            </div>

            {/* 6. Mock Test Series (Mock Test 1 FREE, Mock Test 2–6 PREMIUM; কেনা থাকলে PREMIUM-এর Lock খুলে যাবে) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-3xl shadow-sm space-y-4 transition-colors duration-300">
              <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-850 pb-2.5">
                <div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase leading-none">WB Panchayat Mock Test Series</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-sans">Your Progress: {hasPurchasedPanchayat ? '2/6 Completed' : '1/6 Completed'}</p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 px-2.5 py-0.5 rounded-full font-bold">
                    {panchayatTestsList.length} Tests
                  </span>
                </div>
              </div>

              {/* MOCK TESTS 1-6 DYNAMIC LIST */}
              <div className="space-y-3">
                {panchayatTestsList.map((test) => {
                  const isLocked = false;
                  
                  return (
                    <div 
                      key={test.id} 
                      className={`p-3.5 rounded-2xl border transition-all ${
                        test.completed 
                          ? 'bg-emerald-500/5 border-emerald-500/20 dark:bg-emerald-950/10 dark:border-emerald-900/30' 
                          : isLocked 
                            ? 'bg-slate-100/40 border-slate-200/50 dark:bg-slate-950/20 dark:border-slate-850'
                            : 'bg-slate-50 border-slate-150 dark:bg-slate-950 dark:border-slate-850 hover:border-blue-500/30'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-black text-slate-800 dark:text-white">
                              {test.bengaliTitle}
                            </span>
                            
                            {/* Complete / Free / Premium labels */}
                            {test.completed ? (
                              <span className="text-[8.5px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 px-1.5 py-0.5 rounded font-black uppercase flex items-center gap-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5" /> ✓ Completed
                              </span>
                            ) : test.isPremium ? (
                              <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-black uppercase flex items-center gap-0.5 ${
                                isLocked 
                                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400' 
                                  : 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400'
                              }`}>
                                {isLocked ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />} PREMIUM
                              </span>
                            ) : (
                              <span className="text-[8.5px] bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 px-1.5 py-0.5 rounded font-black uppercase">
                                FREE
                              </span>
                            )}
                          </div>
                          
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-sans">
                            {test.totalQuestions} Questions • {test.totalMarks} Marks • {test.durationMinutes} Mins
                          </p>
                        </div>

                        {/* Status Label (✓ Completed / ▶ Available / 🔒 Not Attempted) */}
                        <div className="text-right">
                          {test.completed ? (
                            <span className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-black">
                              Score: {test.score}/100
                            </span>
                          ) : isLocked ? (
                            <span className="text-[10.5px] text-rose-500 dark:text-rose-400 font-black flex items-center gap-0.5 justify-end">
                              🔒 Locked
                            </span>
                          ) : (
                            <span className="text-[10.5px] text-blue-600 dark:text-blue-400 font-black flex items-center gap-0.5 justify-end">
                              ▶ Available
                            </span>
                          )}
                        </div>
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex justify-end gap-2 mt-3 pt-2.5 border-t border-slate-150/40 dark:border-slate-800/40">
                        {test.completed ? (
                          <button 
                            onClick={() => {
                              // Simulate result details viewing
                              const mockResultObj: TestResult = {
                                id: `panchayat-res-${test.testNumber}`,
                                testId: test.id,
                                testTitle: `West Bengal Panchayat Recruitment - ${test.title}`,
                                score: test.score,
                                totalMarks: test.totalMarks,
                                correctAnswers: 72,
                                wrongAnswers: 18,
                                unanswered: 10,
                                accuracy: 80,
                                timeTakenMinutes: 65,
                                rank: test.rank || 42,
                                totalParticipants: 1500,
                                date: test.date || '02 July, 2026',
                                subjectWise: [
                                  { subject: 'GK (সাধারণ জ্ঞান)', correct: 15, total: 20 },
                                  { subject: 'Math (পাটিগণিত)', correct: 18, total: 25 },
                                  { subject: 'English (ইংরেজি)', correct: 16, total: 20 },
                                  { subject: 'Bengali (বাংলা)', correct: 23, total: 25 }
                                ]
                              };
                              onSelectResult(mockResultObj);
                              setView('test-result');
                            }}
                            className="text-[11px] font-black text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 border border-blue-500/20 hover:border-blue-500 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer bg-blue-50/50 dark:bg-blue-950/20"
                          >
                            [Result দেখুন]
                          </button>
                        ) : isLocked ? (
                          <button 
                            onClick={triggerBuySimulation}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 text-[11px] font-black px-4 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Lock className="w-3 h-3" />
                            <span>প্যাকেজ কিনুন (Unlock Test)</span>
                          </button>
                        ) : (
                          <button 
                            onClick={() => triggerStartTestSimulation(test.testNumber)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black px-4 py-2 rounded-xl shadow-md shadow-blue-500/10 transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                          >
                            <Play className="w-3.5 h-3.5 fill-white stroke-none" />
                            <span>[পরীক্ষা শুরু করুন]</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 8. Leaderboard - নিজের Rank দেখতে পারবে */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-3xl shadow-sm space-y-3 transition-colors duration-300">
              <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-850 pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-yellow-100 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-400">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase leading-none">লিডারবোর্ড (Leaderboard)</h4>
                </div>
                <span className="text-[10px] text-slate-400 font-bold font-sans">১০,৫০০ পরীক্ষার্থী</span>
              </div>

              <div className="space-y-1.5">
                {leaderboardData.map((player) => (
                  <div 
                    key={player.rank} 
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-all ${
                      player.isCurrentUser 
                        ? 'bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-bold' 
                        : 'bg-slate-50/50 dark:bg-slate-950 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-5 text-center font-black ${
                        player.rank <= 3 ? 'text-amber-500 text-sm' : 'text-slate-400'
                      }`}>
                        {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : `#${player.rank}`}
                      </span>
                      <span className="text-slate-800 dark:text-slate-200 font-extrabold">{player.name}</span>
                    </div>

                    <div className="flex items-center gap-3 text-right font-sans">
                      <span className="text-slate-500 dark:text-slate-400 font-bold">{player.score}</span>
                      <span className="text-[10px] bg-slate-200/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-lg font-black">
                        {player.xp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: MY TESTS (আমার কেনা মক টেস্ট) */}
        {activeTab === 'my-tests' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-3xl shadow-sm text-center transition-colors duration-300">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase">আমার মক টেস্ট প্যাকেজসমূহ</h3>
              <p className="text-[10px] text-slate-400 mt-1">আপনার কেনা বা অ্যাক্সেসযোগ্য মক টেস্ট প্যাকেজের সম্পূর্ণ তালিকা</p>
            </div>

            {/* Test Series 1 Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-4 rounded-3xl shadow-sm space-y-3 relative overflow-hidden transition-colors duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase">WB Panchayat Recruitment</span>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white mt-0.5">WB Panchayat Mock Test Series</h4>
                </div>
                <span className="text-[9px] bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold uppercase">
                  {hasPurchasedPanchayat ? 'Unlocked' : 'Free Trial'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans border-y border-slate-50 dark:border-slate-850 py-2">
                <span>৬টি পরীক্ষার ফুল সেট (6 Full Sets)</span>
                <span className="font-bold text-slate-600 dark:text-slate-350">Madhyamik Standard</span>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>অগ্রগতি (Progress)</span>
                  <span className="font-bold">{hasPurchasedPanchayat ? '33% (2/6 Completed)' : '17% (1/6 Completed)'}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: hasPurchasedPanchayat ? '33%' : '17%' }}
                  />
                </div>
              </div>

              <div className="pt-2">
                {hasPurchasedPanchayat ? (
                  <button 
                    onClick={() => setActiveTab('home')}
                    className="w-full py-2.5 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>সিরিজ খুলুন (Open Series)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button 
                    onClick={triggerBuySimulation}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-black rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Crown className="w-4 h-4 fill-white" />
                    <span>সম্পূর্ণ সিরিজ আনলক করুন (Unlock Series)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Other Simulated packages */}
            <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-4 rounded-3xl shadow-sm space-y-3 opacity-75 transition-colors duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase">WB Police Recruitment</span>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white mt-0.5">WB Police Constable Master Set</h4>
                </div>
                <span className="text-[9px] bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 px-2 py-0.5 rounded-full font-bold uppercase">
                  🔒 Locked
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans border-y border-slate-50 dark:border-slate-850 py-2">
                <span>১০টি প্র্যাকটিস মক টেস্ট (10 Sets)</span>
                <span className="font-bold text-slate-600 dark:text-slate-350">Combined Constable</span>
              </div>

              <button 
                onClick={() => alert('এই পুলিশ কনস্টেবল প্যাকেজটি কিনতে প্রিমিয়াম মেম্বারশিপ বোতাম চাপুন।')}
                className="w-full py-2 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 text-xs font-black rounded-xl hover:bg-slate-200 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>প্যাকেজটি কিনুন (Buy Package)</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: RESULTS (পরীক্ষার ইতিহাস ও আমার ফলাফল) */}
        {activeTab === 'results' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* 7. পরীক্ষার ইতিহাস — Test Name, Score, Rank, Date, Time Taken */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-3xl shadow-sm space-y-3 transition-colors duration-300">
              <div className="flex items-center gap-2 border-b border-slate-50 dark:border-slate-850 pb-2.5">
                <div className="p-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                  <BookOpenCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase leading-none">পরীক্ষার ইতিহাস (Test History)</h4>
              </div>

              <div className="space-y-3">
                {/* Simulated default test result log */}
                <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-150 dark:border-slate-850 flex flex-col justify-between hover:border-blue-500/30 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] text-slate-400 font-sans block">02 July, 2026 • 11:30 AM</span>
                      <h5 className="text-xs font-black text-slate-900 dark:text-white mt-0.5">West Bengal Panchayat Recruitment - Mock Test 1</h5>
                    </div>
                    <span className="text-xs font-black text-indigo-600 dark:text-blue-400 font-sans">Rank #184</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-slate-500 mt-3 pt-2.5 border-t border-slate-150/40 dark:border-slate-800/30 font-sans">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Score (স্কোর)</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-xs">72/100</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Time Taken</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">65 Mins</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Accuracy</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">80%</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex justify-end">
                    <button 
                      onClick={() => {
                        const mockResultObj: TestResult = {
                          id: `panchayat-res-1`,
                          testId: 'panchayat-1',
                          testTitle: `West Bengal Panchayat Recruitment - Mock Test 1`,
                          score: 72,
                          totalMarks: 100,
                          correctAnswers: 72,
                          wrongAnswers: 18,
                          unanswered: 10,
                          accuracy: 80,
                          timeTakenMinutes: 65,
                          rank: 184,
                          totalParticipants: 1500,
                          date: '02 July, 2026',
                          subjectWise: [
                            { subject: 'GK (সাধারণ জ্ঞান)', correct: 15, total: 20 },
                            { subject: 'Math (পাটিগণিত)', correct: 18, total: 25 },
                            { subject: 'English (ইংরেজি)', correct: 16, total: 20 },
                            { subject: 'Bengali (বাংলা)', correct: 23, total: 25 }
                          ]
                        };
                        onSelectResult(mockResultObj);
                        setView('test-result');
                      }}
                      className="text-[10px] font-black bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 px-3 py-1.5 rounded-lg hover:underline transition-all cursor-pointer"
                    >
                      [ সমাধান ও এআই উপদেশ দেখুন ]
                    </button>
                  </div>
                </div>

                {/* Additional real attempts from state */}
                {resultsLog.length > 0 ? (
                  resultsLog.map((log) => (
                    <div 
                      key={log.id} 
                      className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-150 dark:border-slate-850 flex flex-col justify-between hover:border-blue-500/30 transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] text-slate-400 font-sans block">{log.date}</span>
                          <h5 className="text-xs font-black text-slate-900 dark:text-white mt-0.5">{log.testTitle}</h5>
                        </div>
                        <span className="text-xs font-black text-indigo-600 dark:text-blue-400 font-sans">Rank #{log.rank}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-slate-500 mt-3 pt-2.5 border-t border-slate-150/40 dark:border-slate-800/30 font-sans">
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Score (স্কোর)</span>
                          <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-xs">{log.score}/{log.totalMarks}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Time Taken</span>
                          <span className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">{log.timeTakenMinutes} Mins</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Accuracy</span>
                          <span className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">{log.accuracy}%</span>
                        </div>
                      </div>

                      <div className="mt-3 flex justify-end">
                        <button 
                          onClick={() => {
                            onSelectResult(log);
                            setView('test-result');
                          }}
                          className="text-[10px] font-black bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 px-3 py-1.5 rounded-lg hover:underline transition-all cursor-pointer"
                        >
                          [ সমাধান ও এআই উপদেশ দেখুন ]
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    <p className="text-[10px] text-slate-400">আর কোনো আগের টেস্ট হিস্ট্রি খুঁজে পাওয়া যায়নি।</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: PERFORMANCE (দুর্বল ও শক্তিশালী বিষয়) */}
        {activeTab === 'performance' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* 9. Performance Analysis — Bengali, English, Math, GK কোন Subject-এ দুর্বল/শক্তিশালী */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-3xl shadow-sm space-y-4 transition-colors duration-300">
              <div className="flex items-center gap-2 border-b border-slate-50 dark:border-slate-850 pb-2.5">
                <div className="p-1 rounded-lg bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase leading-none">বিষয়ভিত্তিক দুর্বলতা ও শক্তি (Performance Analysis)</h4>
              </div>

              <div className="space-y-4 font-sans">
                {performanceData.map((perf) => (
                  <div key={perf.subject} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                      <span>{perf.subject}</span>
                      <span className={perf.textColor}>{perf.status} • {perf.percentage}%</span>
                    </div>
                    
                    {/* Progress Bar Container */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${perf.color} transition-all duration-700`}
                        style={{ width: `${perf.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-100/30 dark:border-blue-900/30 space-y-1.5 mt-2">
                <h5 className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-blue-500 text-blue-500" /> এআই শিক্ষা পরামর্শ (AI Learning Recommendation)
                </h5>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal font-medium">
                  আপনার <strong>সাধারণ জ্ঞান (GK)</strong> মডিউলে স্কোর সবচেয়ে দুর্বল রয়েছে। পঞ্চায়েত পরীক্ষার ২০ নম্বর নিশ্চিত করতে পঞ্চায়েতি রাজ আইন ১৯৭৩, সংবিধানের ৭৩তম সংশোধনী এবং পশ্চিমবঙ্গের ভূগোলে বিশেষ জোর দিন।
                </p>
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: PROFILE & ACCOUNT (নাম, Email, Logout, Simulator) */}
        {activeTab === 'profile' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* 10. Profile & Account — নাম, Email, Password, Logout */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4 transition-colors duration-300">
              <div className="flex items-center gap-2 border-b border-slate-50 dark:border-slate-850 pb-3">
                <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350">
                  <Settings className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase leading-none">প্রোফাইল ও অ্যাকাউন্ট</h4>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">নাম (User Name)</span>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {profileName}
                  </div>
                </div>

                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">ইমেল (Email Address)</span>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 font-bold font-sans text-slate-600 dark:text-slate-400 mt-1 truncate">
                    {firebaseUser?.email || 'candidate@wbmocktest.in'}
                  </div>
                </div>

                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">পাসওয়ার্ড (Password)</span>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 font-sans text-slate-400 mt-1">
                    •••••••••••• (সুরক্ষিত / Google Verified)
                  </div>
                </div>
              </div>

              {/* SIMULATOR SWITCHES FOR EASIER TESTING */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-4 space-y-3">
                <div className="p-3.5 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl space-y-2">
                  <span className="text-[10px] text-amber-500 font-extrabold uppercase tracking-wider block">মেম্বারশিপ সিমুলেটর (Simulator Tool)</span>
                  <p className="text-[9px] text-slate-400 leading-normal">
                    মূল্যায়নকারী শিক্ষকের সুবিধার্থে, আপনি মক টেস্ট ২-৬ এর লক/আনলক অবস্থা পরীক্ষা করার জন্য নিচের বাটন দিয়ে সরাসরি স্টেট পরিবর্তন করতে পারেন:
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 pt-1 font-sans">
                    <button 
                      onClick={() => handleTogglePanchayatPurchase(false)}
                      className={`py-1.5 px-3 text-[10px] font-extrabold rounded-lg border transition-all cursor-pointer ${
                        !hasPurchasedPanchayat 
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' 
                          : 'bg-slate-100 dark:bg-slate-950 border-slate-150 dark:border-slate-850 text-slate-400'
                      }`}
                    >
                      Free (Tests 2-6 Locked 🔒)
                    </button>
                    <button 
                      onClick={() => handleTogglePanchayatPurchase(true)}
                      className={`py-1.5 px-3 text-[10px] font-extrabold rounded-lg border transition-all cursor-pointer ${
                        hasPurchasedPanchayat 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' 
                          : 'bg-slate-100 dark:bg-slate-950 border-slate-150 dark:border-slate-850 text-slate-400'
                      }`}
                    >
                      Paid (Tests 2-6 Unlocked 🔓)
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    onSignOut();
                    alert('সফলভাবে সাইন-আউট করা হয়েছে!');
                  }}
                  className="w-full py-2.5 bg-rose-550 hover:bg-rose-600 text-white text-[11px] font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-md shadow-rose-950/10 mb-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>লগআউট করুন (Logout)</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* DETAILED PAYMENTS/CHECKOUT POPUP MODAL SIMULATOR */}
      {showBuyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn font-sans">
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl w-full max-w-sm p-5 shadow-2xl relative transition-all">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5 mb-2.5">
              <Crown className="w-5 h-5 fill-yellow-500 text-yellow-500" />
              <span>WB Panchayat Mock Test Series আনলক করুন</span>
            </h3>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal mb-4">
              এই প্যাকেজে আপনি পাবেন মক টেস্ট ১ (ফ্রি) সহ <strong>মক টেস্ট ২ - ৬ (প্রিমিয়াম)</strong> এর সম্পূর্ণ অ্যাক্সেস। পেমেন্ট সম্পন্ন করে সাথে সাথে সব লক খুলে দিন।
            </p>

            <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-3 border border-slate-100 dark:border-slate-850 space-y-2 mb-4 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">প্যাকেজের নাম (Package Name):</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200">WB Panchayat mock tests (1-6)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">পরিমাণ (Price):</span>
                <span className="font-black text-emerald-500 text-xs">৳ ৯৯ টাকা মাত্র</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">বৈধতা (Validity):</span>
                <span className="font-extrabold text-slate-850 dark:text-slate-350">১ বছর (1 Year)</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setShowBuyModal(false)}
                className="flex-1 py-2.5 border border-slate-150 dark:border-slate-800 hover:bg-slate-50 text-slate-500 text-xs font-black rounded-xl cursor-pointer text-center"
              >
                বাতিল করুন
              </button>
              <button 
                onClick={confirmBuySimulation}
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-black rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all text-center cursor-pointer"
              >
                ৳ ৯৯ পেমেন্ট করুন
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
