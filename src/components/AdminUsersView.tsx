import React, { useState } from 'react';
import { 
  Users, Search, Crown, Shield, Ban, Check, ArrowLeft, Trophy, Clock, 
  CreditCard, RefreshCw, BarChart2, Eye, Trash2, FileSpreadsheet, ShieldAlert 
} from 'lucide-react';
import { TestResult, PaymentTransaction } from '../types';

interface AdminUsersViewProps {
  users: any[];
  attempts: TestResult[];
  onTogglePremium: (id: string) => void;
  onBack: () => void;
}

export default function AdminUsersView({
  users,
  attempts,
  onTogglePremium,
  onBack
}: AdminUsersViewProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'free' | 'premium' | 'blocked'>('all');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [userTab, setUserTab] = useState<'overview' | 'tests' | 'payments' | 'activity'>('overview');

  // Transactions mockup list to manage manual UPI validation
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([
    {
      id: 'TXN-90218',
      userId: 'user-2',
      userName: 'bengali.stud@gmail.com',
      userEmail: 'bengali.stud@gmail.com',
      orderId: 'ORDER-90218',
      amount: 499,
      planName: 'Yearly Premium Plan',
      status: 'PAID',
      purchaseDate: '2026-07-01',
      expiryDate: '2027-07-01',
      createdAt: '2026-07-01'
    },
    {
      id: 'TXN-38290',
      userId: 'user-1',
      userName: 'student@wbmocktest.com',
      userEmail: 'student@wbmocktest.com',
      orderId: 'ORDER-38290',
      amount: 199,
      planName: 'Monthly Standard Plan',
      status: 'PENDING',
      purchaseDate: '2026-07-06',
      expiryDate: '2026-08-06',
      createdAt: '2026-07-06'
    }
  ]);

  const handleApproveUPI = (id: string) => {
    setTransactions(prev => prev.map(txn => {
      if (txn.id === id) {
        // Find user and trigger premium status activation too
        onTogglePremium(txn.userId);
        return { ...txn, status: 'PAID' as const };
      }
      return txn;
    }));
  };

  const handleBlockUser = (id: string) => {
    alert("ইউজার ব্লক করা হয়েছে!");
  };

  const filteredUsers = users.filter(u => {
    const email = (u.email || '').toLowerCase();
    const term = search.toLowerCase();
    const matchesSearch = email.includes(term);

    if (filter === 'premium') return matchesSearch && u.isPremium;
    if (filter === 'free') return matchesSearch && !u.isPremium;
    if (filter === 'blocked') return matchesSearch && u.id.includes('block');
    return matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* 1. USER PROFILE PAGE DETAIL VIEW */}
      {selectedUser ? (
        <div className="space-y-4">
          {/* Header */}
          <div className="sticky top-0 z-20 bg-slate-100/95 backdrop-blur-sm border-b border-slate-200/60 pb-3 flex items-center justify-between">
            <button 
              onClick={() => setSelectedUser(null)}
              className="p-2 text-slate-600 hover:bg-slate-200 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="text-center">
              <span className="text-[9px] font-black uppercase text-indigo-600">ইউজার প্রোফাইল</span>
              <h3 className="text-xs font-black text-slate-800 leading-tight">প্রার্থী বিস্তারিত ফাইল</h3>
            </div>
            <div className="w-8"></div>
          </div>

          {/* Core Info card */}
          <div className="bg-white p-4 rounded-3xl border border-slate-150 shadow-sm space-y-3.5">
            <div className="flex gap-3 items-center">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm">
                {selectedUser.email.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800">{selectedUser.email}</h4>
                <p className="text-[10px] text-slate-400 font-bold">UID: {selectedUser.id} • যোগদানের তারিখ: 2026-01-10</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-150 text-center">
                <span className="text-[9px] font-black text-slate-400 block uppercase">অ্যাক্টিভিটি</span>
                <span className="text-xs font-black text-slate-800">১৪টি পরীক্ষা</span>
              </div>
              <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-150 text-center">
                <span className="text-[9px] font-black text-slate-400 block uppercase">গড় নম্বর</span>
                <span className="text-xs font-black text-emerald-600">৭২.৫%</span>
              </div>
            </div>

            {/* Profile Action switches */}
            <div className="flex gap-2">
              <button 
                onClick={() => onTogglePremium(selectedUser.id)}
                className={`w-1/2 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1 border transition-all ${
                  selectedUser.isPremium 
                    ? 'bg-amber-100 border-amber-300 text-amber-900' 
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                {selectedUser.isPremium ? 'Active Premium' : 'Activate Premium'}
              </button>
              <button 
                onClick={() => handleBlockUser(selectedUser.id)}
                className="w-1/2 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-black flex items-center justify-center gap-1 border border-rose-100"
              >
                <Ban className="w-3.5 h-3.5" /> ব্লক করুন
              </button>
            </div>
          </div>

          {/* Tab switches */}
          <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-150 shadow-sm overflow-x-auto scrollbar-none">
            {(['overview', 'tests', 'payments', 'activity'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setUserTab(tab)}
                className={`flex-1 py-2 text-[10.5px] font-black rounded-lg text-center whitespace-nowrap transition-all ${
                  userTab === tab 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab === 'overview' && 'সংক্ষিপ্ত বিবরণ'}
                {tab === 'tests' && 'পরীক্ষার ইতিহাস'}
                {tab === 'payments' && 'পেমেন্টস'}
                {tab === 'activity' && 'লগস'}
              </button>
            ))}
          </div>

          {/* Tab Render panel */}
          <div className="bg-white p-4 rounded-3xl border border-slate-150 shadow-sm text-xs font-bold text-slate-700 space-y-3">
            {userTab === 'overview' && (
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-400">সাবস্ক্রিপশন টাইপ:</span>
                  <span className="text-slate-800">{selectedUser.isPremium ? 'Premium (Pro)' : 'Free (Basic)'}</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-400">ব্যবহৃত ডিভাইস:</span>
                  <span className="text-slate-800">Android Chrome</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-400">লগইন আইপি:</span>
                  <span className="text-slate-800">103.140.231.55</span>
                </div>
              </div>
            )}

            {userTab === 'tests' && (
              <div className="space-y-2.5">
                {attempts.length === 0 ? (
                  <p className="text-slate-400 text-center py-4 text-[11px]">কোনো টেস্টের রেকর্ড নেই</p>
                ) : (
                  attempts.map((att, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-150 flex justify-between items-center">
                      <div>
                        <span className="text-[11px] block font-black text-slate-800">{att.testTitle}</span>
                        <span className="text-[9px] block text-slate-400">তারিখ: {att.date}</span>
                      </div>
                      <span className="text-xs font-black text-indigo-600">{att.score}/{att.totalMarks}</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {userTab === 'payments' && (
              <div className="space-y-2">
                <p className="text-[10px] text-slate-400 uppercase font-black">লেনদেন ডাটাবেস</p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex justify-between items-center">
                  <div>
                    <span className="block font-black text-slate-800">Yearly Premium Plan</span>
                    <span className="block text-[9px] text-slate-400">Txn: TXN-3820938</span>
                  </div>
                  <div className="text-right">
                    <span className="block font-black text-slate-800">৳ ৪৯৯</span>
                    <span className="block text-[9px] text-emerald-600 font-extrabold uppercase">PAID</span>
                  </div>
                </div>
              </div>
            )}

            {userTab === 'activity' && (
              <div className="space-y-2 text-[10.5px]">
                <p className="text-slate-500 font-semibold">• 2026-07-07 10:24 AM: মক টেস্ট শুরু করেছে - "পুলিশ কন্সটেবল ০১"</p>
                <p className="text-slate-500 font-semibold">• 2026-07-06 05:12 PM: মেম্বারশিপ ফি পেমেন্ট জমা দেওয়া হয়েছে</p>
                <p className="text-slate-500 font-semibold">• 2026-07-05 09:41 AM: নতুন একাউন্ট খুলেছে</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* 2. CORE USERS MANAGER LISTS */
        <div className="space-y-4">
          <div className="flex justify-between items-center gap-2">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-600" />
              প্রার্থী তালিকা ({users.length})
            </h3>
          </div>

          {/* Quick stats panel */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white p-2 rounded-xl border border-slate-150 text-center shadow-sm">
              <span className="text-[9px] font-black text-slate-400 block uppercase">মোট প্রার্থী</span>
              <span className="text-sm font-black text-slate-800">{users.length}</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-slate-150 text-center shadow-sm">
              <span className="text-[9px] font-black text-slate-400 block uppercase">প্রিমিয়াম</span>
              <span className="text-sm font-black text-amber-600">{users.filter(u => u.isPremium).length}</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-slate-150 text-center shadow-sm">
              <span className="text-[9px] font-black text-slate-400 block uppercase">ফ্রি</span>
              <span className="text-sm font-black text-slate-800">{users.filter(u => !u.isPremium).length}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="text"
                placeholder="প্রার্থীর ইমেইল আইডি দিয়ে খুঁজুন..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold shadow-sm focus:outline-none focus:border-indigo-400"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Chips */}
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
              {(['all', 'free', 'premium', 'blocked'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilter(mode)}
                  className={`px-3 py-1.5 rounded-full text-[10.5px] font-black whitespace-nowrap border transition-all ${
                    filter === mode 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-100' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {mode === 'all' && 'সব ইউজার্স'}
                  {mode === 'free' && 'ফ্রি অ্যাকাউন্ট'}
                  {mode === 'premium' && 'প্রিমিয়াম ★'}
                  {mode === 'blocked' && 'ব্লকড ইউজার্স'}
                </button>
              ))}
            </div>
          </div>

          {/* User records list */}
          <div className="space-y-3">
            {filteredUsers.map((u) => (
              <div key={u.id} className="bg-white p-3.5 rounded-2xl border border-slate-150 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex gap-2.5 items-center">
                    <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-700 font-black text-xs flex items-center justify-center">
                      {u.email.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800 truncate">{u.email}</h4>
                      <p className="text-[10px] text-slate-400 font-bold">আইডি: {u.id} • ভূমিকা: {u.role}</p>
                    </div>
                  </div>

                  <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded-md ${
                    u.isPremium 
                      ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}>
                    {u.isPremium ? 'PRO ★' : 'FREE'}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2.5 border-t border-slate-100">
                  <button 
                    onClick={() => setSelectedUser(u)}
                    className="text-[10px] font-extrabold text-indigo-600 hover:underline flex items-center gap-0.5"
                  >
                    <Eye className="w-3 h-3" /> বিস্তারিত প্রোফাইল দেখুন
                  </button>

                  <button 
                    onClick={() => onTogglePremium(u.id)}
                    className="text-[10px] font-black bg-slate-50 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 px-2.5 py-1.5 rounded-lg active:scale-95 transition-all"
                  >
                    {u.isPremium ? 'ডি-অ্যাক্টিভেট' : 'প্রিমিয়াম করুন'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* MANUAL UPI PAYMENT TRANSACTIONS SECTION */}
          <div className="bg-white p-4 rounded-3xl border border-slate-150 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-amber-600" />
                ম্যানুয়াল UPI পেমেন্ট অনুমোদন (Pending UPI)
              </h4>
            </div>

            <div className="space-y-3">
              {transactions.map(txn => (
                <div key={txn.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-150 space-y-2">
                  <div className="flex justify-between items-start text-[11px] font-bold">
                    <div>
                      <span className="text-slate-800 block font-black">{txn.userEmail}</span>
                      <span className="text-[9px] text-slate-400 block">{txn.planName} • {txn.id}</span>
                    </div>
                    <span className="text-slate-900 font-extrabold text-xs">৳ {txn.amount}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${
                      txn.status === 'PAID' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800 animate-pulse'
                    }`}>
                      {txn.status === 'PAID' ? 'APPROVED' : 'PENDING APPROVAL'}
                    </span>

                    {txn.status === 'PENDING' && (
                      <button 
                        onClick={() => handleApproveUPI(txn.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black px-3 py-1 rounded-lg shadow-sm"
                      >
                        অনুমোদন দিন (Approve)
                      </button>
                    )}
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
