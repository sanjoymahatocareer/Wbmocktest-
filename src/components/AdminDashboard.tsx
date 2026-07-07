import React from 'react';
import { 
  Users, Layers, FileText, Sliders, Play, Plus, Upload, Bell, ArrowRight,
  TrendingUp, Award, Calendar, ChevronRight, HelpCircle, Sparkles, CheckCircle, Clock
} from 'lucide-react';
import { PostName, MockTest, ExamCategory, TestResult } from '../types';

interface AdminDashboardProps {
  posts: PostName[];
  mockTests: MockTest[];
  categories: ExamCategory[];
  users: any[];
  attempts: TestResult[];
  onNavigateToView: (view: any) => void;
  onGoBackToFront: () => void;
}

export default function AdminDashboard({
  posts,
  mockTests,
  categories,
  users,
  attempts,
  onNavigateToView,
  onGoBackToFront
}: AdminDashboardProps) {

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'শুভ সকাল, অ্যাডমিন! 👋';
    if (hr < 17) return 'শুভ অপরাহ্ন, অ্যাডমিন! 👋';
    return 'শুভ সন্ধ্যা, অ্যাডমিন! 👋';
  };

  const totalQuestionsCount = mockTests.reduce((acc, curr) => acc + (curr.questions?.length || 0), 0);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 pb-20">
      
      {/* 1. Dashboard Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-xs shadow-md shadow-indigo-600/10">
            WB
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-800 tracking-tight">WBMockTest Admin</h1>
            <p className="text-[10px] text-slate-400 font-bold">মোবাইল-ফার্স্ট কন্ট্রোল রুম</p>
          </div>
        </div>

        <button 
          onClick={onGoBackToFront}
          className="text-[11px] font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full cursor-pointer transition-all flex items-center gap-1"
        >
          মেনু ফিরুন <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-4">
        
        {/* 2. Welcome Banner Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
          {/* Subtle background graphics */}
          <div className="absolute -right-3 -bottom-3 opacity-10">
            <Sparkles className="w-28 h-28" />
          </div>
          
          <div className="space-y-1 relative z-10">
            <h2 className="text-base font-black tracking-tight">{getGreeting()}</h2>
            <p className="text-xs text-blue-100 font-medium opacity-90">
              আপনার Mock Test প্ল্যাটফর্ম এখন সম্পূর্ণ মোবাইল-ফার্স্ট প্যানেল দ্বারা নিয়ন্ত্রিত।
            </p>
          </div>

          <div className="flex items-center gap-4 mt-5 pt-3 border-t border-white/10 text-xs relative z-10">
            <div>
              <p className="text-[10px] text-blue-200 font-bold">চলতি মাস</p>
              <p className="text-sm font-black text-white mt-0.5">জুলাই ২০২৬</p>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div>
              <p className="text-[10px] text-blue-200 font-bold">পেইড গ্রাহক</p>
              <p className="text-sm font-black text-amber-300 mt-0.5">
                {users.filter(u => u.isPremium).length} জন ★
              </p>
            </div>
          </div>
        </div>

        {/* 3. System Statistics Overview Grid */}
        <div className="space-y-2">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">রিয়েল-টাইম পারফরম্যান্স স্ট্যাটস</h3>
          
          <div className="grid grid-cols-2 gap-3">
            
            {/* Stat 1: Categories */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] text-slate-400 font-bold leading-tight">মোট ক্যাটাগরি</p>
                <p className="text-base font-black text-slate-800">{categories.length}</p>
              </div>
            </div>

            {/* Stat 2: Active Posts */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3">
              <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] text-slate-400 font-bold leading-tight">চাকরি বিজ্ঞপ্তি পোস্ট</p>
                <p className="text-base font-black text-slate-800">{posts.length}</p>
              </div>
            </div>

            {/* Stat 3: Mock Tests */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                <Sliders className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] text-slate-400 font-bold leading-tight">মোট মক টেস্ট</p>
                <p className="text-base font-black text-slate-800">{mockTests.length}</p>
              </div>
            </div>

            {/* Stat 4: Questions Bank */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] text-slate-400 font-bold leading-tight">মোট প্রশ্নসমূহ</p>
                <p className="text-base font-black text-slate-800">{totalQuestionsCount}</p>
              </div>
            </div>

            {/* Stat 5: Candidates */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3 col-span-2">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div className="flex-1 flex justify-between items-center pr-1">
                <div className="space-y-0.5">
                  <p className="text-[10px] text-slate-400 font-bold leading-tight">মোট পরীক্ষার্থী (Registered Candidates)</p>
                  <p className="text-base font-black text-slate-800">{users.length} জন</p>
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-500 animate-pulse" />
              </div>
            </div>

          </div>
        </div>

        {/* 4. Quick Actions Grid */}
        <div className="space-y-2">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">দ্রুত অ্যাকশন (Quick Settings Room)</h3>
          
          <div className="grid grid-cols-2 gap-3.5">
            
            <button 
              onClick={() => onNavigateToView('posts')}
              className="p-4 bg-white hover:bg-slate-50 text-left rounded-2xl border border-slate-150 transition-all flex flex-col justify-between h-24 shadow-sm group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Plus className="w-4 h-4" /></div>
              <div>
                <p className="text-xs font-black text-slate-800">পোস্ট তৈরি করুন</p>
                <p className="text-[9px] text-slate-400 font-bold mt-0.5">নতুন নিয়োগ বিজ্ঞপ্তি</p>
              </div>
            </button>

            <button 
              onClick={() => onNavigateToView('mock_tests')}
              className="p-4 bg-white hover:bg-slate-50 text-left rounded-2xl border border-slate-150 transition-all flex flex-col justify-between h-24 shadow-sm group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center"><Sliders className="w-4 h-4" /></div>
              <div>
                <p className="text-xs font-black text-slate-800">মক টেস্ট উইজার্ড</p>
                <p className="text-[9px] text-slate-400 font-bold mt-0.5">৫-ধাপের প্রশ্নপত্র বিল্ডার</p>
              </div>
            </button>

            <button 
              onClick={() => onNavigateToView('users')}
              className="p-4 bg-white hover:bg-slate-50 text-left rounded-2xl border border-slate-150 transition-all flex flex-col justify-between h-24 shadow-sm group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Users className="w-4 h-4" /></div>
              <div>
                <p className="text-xs font-black text-slate-800">প্রার্থী তালিকা</p>
                <p className="text-[9px] text-slate-400 font-bold mt-0.5">গ্রাহক ও মেম্বারশিপ টগল</p>
              </div>
            </button>

            <button 
              onClick={() => onNavigateToView('more')}
              className="p-4 bg-white hover:bg-slate-50 text-left rounded-2xl border border-slate-150 transition-all flex flex-col justify-between h-24 shadow-sm group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center"><Bell className="w-4 h-4" /></div>
              <div>
                <p className="text-xs font-black text-slate-800">গ্লোবাল সেটিংস</p>
                <p className="text-[9px] text-slate-400 font-bold mt-0.5">বিজ্ঞাপন, নোটিফিকেশন ও এসইও</p>
              </div>
            </button>

          </div>
        </div>

        {/* 5. Live Activity Logs Stream */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">সাম্প্রতিক পরীক্ষা সাবমিশন লগস</h3>
            <button 
              onClick={() => onNavigateToView('users')}
              className="text-[10px] font-black text-indigo-600 flex items-center gap-0.5 cursor-pointer"
            >
              সব দেখুন <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {attempts.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl border text-center text-xs font-bold text-slate-400">
              কোনো সাবমিশন হিস্ট্রি পাওয়া যায়নি।
            </div>
          ) : (
            <div className="space-y-2.5">
              {attempts.slice(0, 3).map((attempt, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center text-xs">
                  <div className="space-y-1 max-w-[70%]">
                    <p className="font-black text-slate-800 truncate leading-tight">{attempt.testTitle}</p>
                    <div className="flex gap-2 items-center text-[10px] text-slate-400 font-bold">
                      <span className="truncate max-w-[120px]">{attempt.userEmail || 'Anonymous Candidate'}</span>
                      <span>•</span>
                      <span>{attempt.date}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-black text-slate-800 leading-tight">{attempt.score}/{attempt.totalMarks}</p>
                    <span className={`text-[9px] font-black ${attempt.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {attempt.passed ? 'Passed ✓' : 'Failed ✗'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
