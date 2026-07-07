import React, { useState } from 'react';
import { 
  ArrowLeft, Search, Users, Crown, CreditCard, Activity, CheckCircle, 
  Trash2, UserCheck, ShieldAlert, Award, FileText, ChevronRight, X, 
  Download, Filter, Shield, Clock, HelpCircle
} from 'lucide-react';
import { TestResult } from '../types';

interface AdminUsersProps {
  users: any[];
  attempts: TestResult[];
  onTogglePremium: (id: string) => void;
  onGoBack: () => void;
}

export default function AdminUsers({
  users,
  attempts,
  onTogglePremium,
  onGoBack
}: AdminUsersProps) {
  const [activeSubView, setActiveSubView] = useState<'list' | 'details' | 'results'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMembership, setFilterMembership] = useState<'all' | 'free' | 'premium'>('all');
  
  // Selection
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [selectedUserTab, setSelectedUserTab] = useState<'overview' | 'history' | 'payments' | 'activity'>('overview');

  // Results search
  const [resultsSearch, setResultsSearch] = useState('');

  // Helpers
  const handleOpenDetails = (user: any) => {
    setSelectedUser(user);
    setSelectedUserTab('overview');
    setActiveSubView('details');
  };

  const getFilteredUsers = () => {
    return users.filter(u => {
      const email = u.email || '';
      const matchesSearch = email.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (filterMembership === 'all') return matchesSearch;
      if (filterMembership === 'free') return matchesSearch && !u.isPremium;
      if (filterMembership === 'premium') return matchesSearch && u.isPremium;
      return matchesSearch;
    });
  };

  const getUserAttempts = (email: string) => {
    return attempts.filter(att => att.userEmail === email || (email.includes('anonymous') && !att.userEmail));
  };

  const calculateUserAvgScore = (email: string) => {
    const userAtts = getUserAttempts(email);
    if (userAtts.length === 0) return 0;
    const total = userAtts.reduce((acc, curr) => acc + curr.score, 0);
    return Math.round((total / userAtts.length) * 10) / 10;
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 pb-20">
      
      {/* ------------------------- */}
      {/* 1. USER DETAIL PAGE VIEW */}
      {/* ------------------------- */}
      {activeSubView === 'details' && selectedUser && (
        <div className="min-h-screen">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-3 z-30 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <button onClick={() => setActiveSubView('list')} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase">প্রোফাইল ডিটেইলস</p>
                <h2 className="text-sm font-black text-slate-800 truncate max-w-[170px]">{selectedUser.email}</h2>
              </div>
            </div>
          </div>

          <div className="p-4 max-w-md mx-auto space-y-4">
            {/* User Profile Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 rounded-3xl text-white shadow-xl space-y-3.5 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 translate-x-3 translate-y-3">
                <Users className="w-32 h-32" />
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center font-black text-lg border border-white/10 shadow-inner uppercase">
                  {selectedUser.email.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-black truncate max-w-[200px]">{selectedUser.email}</h3>
                  <p className="text-[10px] text-blue-200 font-bold mt-0.5 uppercase">আইডি: {selectedUser.id}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <div>
                  <p className="text-[10px] text-blue-200 font-bold">মেম্বারশিপ টাইপ</p>
                  <span className={`inline-block mt-1 text-[9.5px] font-black px-2 py-0.5 rounded-full ${
                    selectedUser.isPremium 
                      ? 'bg-amber-400 text-slate-900' 
                      : 'bg-white/15 text-white border border-white/10'
                  }`}>
                    {selectedUser.isPremium ? '★ Premium User' : 'Free Candidate'}
                  </span>
                </div>

                <button
                  onClick={() => {
                    onTogglePremium(selectedUser.id);
                    setSelectedUser({ ...selectedUser, isPremium: !selectedUser.isPremium });
                  }}
                  className="px-3.5 py-1.5 bg-white text-blue-700 text-[10.5px] font-black rounded-xl hover:bg-blue-50 transition-all cursor-pointer shadow-sm"
                >
                  {selectedUser.isPremium ? 'Free তে ডাউনগ্রেড' : 'Premium এক্টিভেট করুন'}
                </button>
              </div>
            </div>

            {/* Custom Tabs */}
            <div className="flex bg-white p-1 rounded-2xl border border-slate-150 overflow-x-auto no-scrollbar">
              {(['overview', 'history', 'payments', 'activity'] as const).map(tab => {
                const labelMap = { overview: 'ওভারভিউ', history: 'পরীক্ষার ইতিহাস', payments: 'পেমেন্ট রেকর্ড', activity: 'অ্যাক্টিভিটি লগ' };
                return (
                  <button
                    key={tab}
                    onClick={() => setSelectedUserTab(tab)}
                    className={`flex-1 py-2 text-center rounded-xl text-[10.5px] font-black transition-all cursor-pointer ${
                      selectedUserTab === tab 
                        ? 'bg-slate-900 text-white shadow-sm' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {labelMap[tab]}
                  </button>
                );
              })}
            </div>

            {/* Tab content wrapper */}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm min-h-[220px]">
              
              {selectedUserTab === 'overview' && (
                <div className="space-y-4">
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-black px-2 py-0.5 rounded-full">প্রার্থী বিবরণ</span>
                  
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 bg-slate-50 rounded-2xl border">
                      <p className="text-[10px] text-slate-400 font-bold">মোট পরীক্ষা সম্পন্ন</p>
                      <p className="text-base font-black text-slate-800 mt-1">
                        {getUserAttempts(selectedUser.email).length} বার
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border">
                      <p className="text-[10px] text-slate-400 font-bold">গড় স্কোর (Average)</p>
                      <p className="text-base font-black text-indigo-600 mt-1">
                        {calculateUserAvgScore(selectedUser.email)}%
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-bold text-slate-600">
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span>নিবন্ধন তারিখ (Join Date)</span>
                      <span className="text-slate-800">০৫ জুলাই, ২০২৬</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span>স্ট্যাটাস (Status)</span>
                      <span className="text-emerald-600">Active (সক্রিয়)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span>রোল (Role)</span>
                      <span className="text-indigo-600">Candidate</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedUserTab === 'history' && (
                <div className="space-y-3">
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 font-black px-2 py-0.5 rounded-full">পরীক্ষার ফলাফলসমূহ</span>
                  
                  {getUserAttempts(selectedUser.email).length === 0 ? (
                    <p className="text-xs text-slate-400 font-bold text-center py-10">প্রার্থী এখনো কোনো মক টেস্টে অংশ নেয়নি।</p>
                  ) : (
                    <div className="space-y-2">
                      {getUserAttempts(selectedUser.email).map((att, index) => (
                        <div key={index} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                          <div>
                            <p className="font-black text-slate-800 truncate max-w-[180px]">{att.testTitle}</p>
                            <p className="text-[9.5px] text-slate-400 mt-0.5">তারিখ: {att.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-slate-800">{att.score}/{att.totalMarks}</p>
                            <p className={`text-[9px] font-black ${att.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {att.passed ? 'Passed ✓' : 'Failed ✗'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {selectedUserTab === 'payments' && (
                <div className="space-y-3">
                  <span className="text-[10px] bg-amber-50 text-amber-800 font-black px-2 py-0.5 rounded-full">মেম্বারশিপ ট্রানজ্যাকশন</span>
                  
                  {selectedUser.isPremium ? (
                    <div className="p-3 bg-amber-55 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1.5">
                      <div className="flex justify-between font-bold">
                        <span className="text-amber-800">১ বছর মেম্বারশিপ প্ল্যান</span>
                        <span className="text-slate-850">৳ ৯৯৯.০০</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium">Txn ID: TXN893048934208</p>
                      <p className="text-[10px] text-emerald-600 font-bold">পেমেন্ট স্ট্যাটাস: SUCCESS</p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 font-bold text-center py-10">কোনো পেমেন্ট বা প্রিমিয়াম রেকর্ড নেই।</p>
                  )}
                </div>
              )}

              {selectedUserTab === 'activity' && (
                <div className="space-y-3">
                  <span className="text-[10px] bg-teal-50 text-teal-700 font-black px-2 py-0.5 rounded-full">ইউজার লগস</span>
                  <div className="space-y-2 text-[10px] font-bold text-slate-500">
                    <p className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> আজ সকাল ১০:১৫ - লগইন করেছেন (IP: 103.44.*)</p>
                    <p className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> আজ সকাল ১০:২০ - পঞ্চায়েত মক টেস্ট ০২ সম্পন্ন করেছেন</p>
                    <p className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> ৫ জুলাই, ২০২৬ - প্রিমিয়াম সাবস্ক্রিপশন চালু করেছেন</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ------------------------------- */}
      {/* 2. RESULTS & LEADERBOARD VIEW */}
      {/* ------------------------------- */}
      {activeSubView === 'results' && (
        <div className="min-h-screen">
          <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-3 z-30 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <button onClick={() => setActiveSubView('list')} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h2 className="text-sm font-black text-slate-800">সাবমিশন রিপোর্ট ও লিডারবোর্ড</h2>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">প্রার্থীদের লাইভ টেস্ট সাবমিশন লগস</p>
              </div>
            </div>
          </div>

          <div className="p-4 max-w-md mx-auto space-y-4">
            
            {/* Quick Metrics */}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm grid grid-cols-2 gap-3 text-center">
              <div>
                <p className="text-[10px] text-slate-400 font-bold">মোট পরীক্ষা সম্পন্ন</p>
                <p className="text-base font-black text-slate-800 mt-1">{attempts.length} টি</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold">গড় পাস রেট (Pass %)</p>
                <p className="text-base font-black text-emerald-600 mt-1">৭৮.৫%</p>
              </div>
            </div>

            {/* Results Search */}
            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-6 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="প্রার্থীর ইমেল বা টেস্টের নাম খুঁজুন..." 
                value={resultsSearch}
                onChange={e => setResultsSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-150 rounded-xl text-xs font-bold outline-none"
              />
            </div>

            {/* Submissions list */}
            {attempts.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-10 font-bold">এখনো কোনো টেস্ট সাবমিশন হয়নি।</p>
            ) : (
              <div className="space-y-3">
                {attempts
                  .filter(att => 
                    (att.testTitle || '').toLowerCase().includes(resultsSearch.toLowerCase()) ||
                    (att.userEmail || '').toLowerCase().includes(resultsSearch.toLowerCase())
                  )
                  .map((att, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-xs space-y-2.5">
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5 max-w-[70%]">
                          <h4 className="font-black text-slate-800 truncate">{att.testTitle}</h4>
                          <p className="text-[10px] font-semibold text-slate-400 truncate">প্রার্থী: {att.userEmail || 'Anonymous Student'}</p>
                        </div>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                          att.passed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {att.passed ? 'পাস (Passed)' : 'ফেল (Failed)'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-500 pt-2 border-t border-slate-50">
                        <span>প্রাপ্ত নম্বর: {att.score}/{att.totalMarks}</span>
                        <span>সময়কাল: {att.timeTakenMinutes || 12} মি.</span>
                        <div className="flex items-center gap-1">
                          <span className="text-[9.5px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md">র‍্যাংক: #{att.rank || 4}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------ */}
      {/* 3. CORE USERS LIST */}
      {/* ------------------ */}
      {activeSubView === 'list' && (
        <div className="min-h-screen">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-3 z-30 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <button onClick={onGoBack} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h2 className="text-sm font-black text-slate-800">নিবন্ধিত প্রার্থী প্যানেল</h2>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">প্রার্থী ও সাবস্ক্রিপশন ট্র্যাকার</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveSubView('results')}
              className="bg-purple-600 hover:bg-purple-700 text-white text-[10.5px] font-black px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-all shadow-md shadow-purple-600/10"
            >
              <Award className="w-3.5 h-3.5" /> সাবমিশন ইতিহাস
            </button>
          </div>

          <div className="p-4 max-w-md mx-auto space-y-4">
            
            {/* Quick stats scroll */}
            <div className="bg-white p-3.5 rounded-3xl border border-slate-100 shadow-sm grid grid-cols-2 gap-3 text-center">
              <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold">মোট নিবন্ধিত ইউজার</p>
                <p className="text-base font-black text-slate-800 mt-1">{users.length} জন</p>
              </div>
              <div className="p-2.5 bg-amber-50 rounded-2xl border border-amber-100/60">
                <p className="text-[10px] text-amber-800 font-bold">প্রিমিয়াম সাবস্ক্রাইবার</p>
                <p className="text-base font-black text-amber-700 mt-1">
                  {users.filter(u => u.isPremium).length} জন
                </p>
              </div>
            </div>

            {/* Search and membership filters */}
            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="প্রার্থী খুঁজুন (ইমেল টাইপ করুন)..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-150 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all shadow-inner"
                />
              </div>

              <div className="flex gap-1.5">
                {(['all', 'free', 'premium'] as const).map(mem => {
                  const labelMap = { all: 'সব', free: 'ফ্রি ইউজার', premium: 'পেইড প্রিমিয়াম' };
                  return (
                    <button
                      key={mem}
                      onClick={() => setFilterMembership(mem)}
                      className={`flex-1 py-1.5 rounded-full text-[10px] font-black cursor-pointer transition-all border ${
                        filterMembership === mem 
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                          : 'bg-white text-slate-600 border-slate-150 hover:bg-slate-50'
                      }`}
                    >
                      {labelMap[mem]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Registered User Cards */}
            <div className="space-y-3">
              {getFilteredUsers().map(user => (
                <div key={user.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-black text-xs text-slate-500 uppercase shrink-0">
                        {user.email.charAt(0)}
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-black text-slate-800 truncate max-w-[170px]">{user.email}</h4>
                        <p className="text-[9px] font-bold text-slate-400">আইডি: {user.id} • রোল: Candidate</p>
                      </div>
                    </div>

                    <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded-full ${
                      user.isPremium 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {user.isPremium ? '★ Premium' : 'Free'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-500 pt-2 border-t border-slate-50">
                    <div className="flex gap-2">
                      <span>টেস্ট: {getUserAttempts(user.email).length} টি</span>
                      <span>•</span>
                      <span>গড় স্কোর: {calculateUserAvgScore(user.email)}%</span>
                    </div>

                    <button 
                      onClick={() => handleOpenDetails(user)}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-[9.5px] font-black rounded-lg transition-all border border-slate-200 cursor-pointer flex items-center gap-0.5"
                    >
                      বিস্তারিত দেখুন <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
