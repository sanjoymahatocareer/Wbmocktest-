import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Percent, Gift, UserCheck, Trash2, Edit3, Save, Plus, 
  X, Check, AlertCircle, RefreshCw, Calendar, Eye, ShieldAlert, Badge
} from 'lucide-react';
import { PostName } from '../types';

interface AdminPaymentsDashboardProps {
  posts: PostName[];
  users: any[];
  onBack: () => void;
}

export default function AdminPaymentsDashboard({ posts, users, onBack }: AdminPaymentsDashboardProps) {
  const [subView, setSubView] = useState<'analytics' | 'pricing' | 'coupons' | 'manual'>('analytics');
  
  // Dashboard state
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalPaymentsCount: 0,
    successfulPaymentsCount: 0,
    successRate: 100,
    activePurchasesCount: 0,
    transactions: [] as any[]
  });
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7days' | '30days'>('all');

  // Series Pricing state
  const [seriesList, setSeriesList] = useState<any[]>([]);
  const [editingSeriesId, setEditingSeriesId] = useState<string | null>(null);
  const [regularPrice, setRegularPrice] = useState<number>(99);
  const [salePrice, setSalePrice] = useState<number>(49);
  const [validityDays, setValidityDays] = useState<number>(365);
  const [seriesStatus, setSeriesStatus] = useState<'draft' | 'published'>('published');
  
  // Coupons state
  const [coupons, setCoupons] = useState<any[]>([]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newDiscountValue, setNewDiscountValue] = useState<number>(10);
  const [newDiscountType, setNewDiscountType] = useState<'flat' | 'percentage'>('flat');
  const [newMinOrderAmount, setNewMinOrderAmount] = useState<number>(0);
  const [newCouponActive, setNewCouponActive] = useState(true);

  // Manual access state
  const [manualUserId, setManualUserId] = useState('');
  const [manualSeriesId, setManualSeriesId] = useState('');
  const [manualDays, setManualDays] = useState<number>(365);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [selectedUserFilter, setSelectedUserFilter] = useState('');

  // General Notification toast
  const [msg, setMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  const triggerToast = (text: string, isError = false) => {
    setMsg({ text, isError });
    setTimeout(() => setMsg(null), 3000);
  };

  // Fetch Stats & Transactions
  const fetchDashboardStats = async () => {
    setIsLoadingStats(true);
    try {
      const res = await fetch('/api/admin/payments-dashboard');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error(e);
      triggerToast('ড্যাশবোর্ড তথ্য লোড করা যায়নি', true);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Fetch Pricing
  const fetchSeriesPricing = async () => {
    try {
      const res = await fetch('/api/payments/series-pricing');
      if (res.ok) {
        const data = await res.json();
        setSeriesList(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch Coupons
  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/coupons');
      if (res.ok) {
        const data = await res.json();
        setCoupons(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch audit logs & active purchases
  const fetchManualAccessData = async () => {
    try {
      const resAudit = await fetch('/api/admin/audit-logs');
      if (resAudit.ok) {
        const logs = await resAudit.json();
        setAuditLogs(logs);
      }
      
      // Let's retrieve all active entitlements by reading the general purchases collection if possible
      // (Since we don't have a direct fetch-all-purchases endpoint, we can infer some from transactions or we can just fetch audit logs)
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchSeriesPricing();
    fetchCoupons();
    fetchManualAccessData();
  }, []);

  // Save Pricing Changes
  const handleSavePricing = async (id: string, bengaliName: string) => {
    try {
      const res = await fetch('/api/admin/save-series-pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          regularPrice,
          salePrice,
          validityDays,
          status: seriesStatus,
          bengaliName
        })
      });
      if (res.ok) {
        triggerToast('সিরিজের দাম সফলভাবে আপডেট হয়েছে!');
        setEditingSeriesId(null);
        fetchSeriesPricing();
      } else {
        triggerToast('দাম সেভ করতে ব্যর্থ হয়েছে', true);
      }
    } catch (e) {
      triggerToast('সার্ভার এরর হয়েছে', true);
    }
  };

  // Create Coupon
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    try {
      const res = await fetch('/api/admin/save-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCouponCode,
          discountValue: newDiscountValue,
          discountType: newDiscountType,
          minOrderAmount: newMinOrderAmount,
          active: newCouponActive
        })
      });
      if (res.ok) {
        triggerToast(`কুপন ${newCouponCode.toUpperCase()} তৈরি হয়েছে!`);
        setNewCouponCode('');
        setNewDiscountValue(10);
        setNewMinOrderAmount(0);
        fetchCoupons();
      } else {
        triggerToast('কুপন তৈরিতে ব্যর্থতা', true);
      }
    } catch (e) {
      triggerToast('সার্ভার এরর হয়েছে', true);
    }
  };

  // Delete Coupon
  const handleDeleteCoupon = async (code: string) => {
    if (!window.confirm(`আপনি কি কুপন ${code} মুছে ফেলতে চান?`)) return;
    try {
      const res = await fetch('/api/admin/delete-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      if (res.ok) {
        triggerToast('কুপন মুছে ফেলা হয়েছে!');
        fetchCoupons();
      }
    } catch (e) {
      triggerToast('মুছে ফেলতে ব্যর্থ হয়েছে', true);
    }
  };

  // Grant Manual Access
  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUserId || !manualSeriesId) {
      triggerToast('অনুগ্রহ করে ইউজার আইডি ও সিরিজ নির্বাচন করুন', true);
      return;
    }
    try {
      const res = await fetch('/api/admin/grant-series-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: manualUserId,
          seriesId: manualSeriesId,
          durationDays: manualDays,
          adminId: 'WBMockTest-Admin'
        })
      });
      if (res.ok) {
        triggerToast('সফলভাবে ম্যানুয়াল প্রিমিয়াম অ্যাক্সেস প্রদান করা হয়েছে!');
        setManualUserId('');
        setManualSeriesId('');
        fetchManualAccessData();
        fetchDashboardStats(); // refresh counts
      } else {
        triggerToast('অ্যাক্সেস প্রদানে ব্যর্থতা', true);
      }
    } catch (e) {
      triggerToast('সার্ভার এরর হয়েছে', true);
    }
  };

  // Revoke Access
  const handleRevokeAccess = async (userId: string, seriesId: string) => {
    if (!window.confirm(`আপনি কি এই ইউজারের (${userId}) সিরিজ (${seriesId}) অ্যাক্সেস বাতিল করতে চান?`)) return;
    try {
      const res = await fetch('/api/admin/cancel-series-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          seriesId,
          adminId: 'WBMockTest-Admin'
        })
      });
      if (res.ok) {
        triggerToast('অ্যাক্সেস বাতিল করা হয়েছে!');
        fetchManualAccessData();
        fetchDashboardStats();
      }
    } catch (e) {
      triggerToast('বাতিল করতে ব্যর্থ হয়েছে', true);
    }
  };

  // Date Filtering logic on Transactions
  const getFilteredTransactions = () => {
    if (!stats.transactions) return [];
    const now = new Date();
    return stats.transactions.filter(t => {
      if (dateFilter === 'all') return true;
      const tDate = new Date(t.date);
      const diffTime = Math.abs(now.getTime() - tDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (dateFilter === 'today') return diffDays <= 1;
      if (dateFilter === '7days') return diffDays <= 7;
      if (dateFilter === '30days') return diffDays <= 30;
      return true;
    });
  };

  const filteredTransactions = getFilteredTransactions();

  return (
    <div className="space-y-4 pb-20">
      {/* Toast Notification */}
      {msg && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-black transition-all ${
          msg.isError ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
        }`}>
          {msg.isError ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Header Panel */}
      <div className="bg-gradient-to-tr from-[#0F172A] to-[#1E293B] text-white p-5 rounded-[28px] shadow-lg border border-slate-800">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#16A34A]">পেমেন্ট গেটওয়ে হাব</span>
            <h2 className="text-lg font-black leading-tight">ক্যাশফ্রি ও সেলস প্যানেল</h2>
          </div>
          <button 
            onClick={onBack}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all"
          >
            ফিরে যান
          </button>
        </div>

        {/* Dashboard Navigation */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button 
            onClick={() => setSubView('analytics')}
            className={`py-2 text-[10.5px] font-black rounded-lg transition-all ${
              subView === 'analytics' ? 'bg-[#16A34A] text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            অ্যানালিটিক্স
          </button>
          <button 
            onClick={() => setSubView('pricing')}
            className={`py-2 text-[10.5px] font-black rounded-lg transition-all ${
              subView === 'pricing' ? 'bg-[#16A34A] text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            সিরিজ দাম
          </button>
          <button 
            onClick={() => setSubView('coupons')}
            className={`py-2 text-[10.5px] font-black rounded-lg transition-all ${
              subView === 'coupons' ? 'bg-[#16A34A] text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            কুপন কোড
          </button>
          <button 
            onClick={() => setSubView('manual')}
            className={`py-2 text-[10.5px] font-black rounded-lg transition-all ${
              subView === 'manual' ? 'bg-[#16A34A] text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ম্যানুয়াল
          </button>
        </div>
      </div>

      {/* SUBVIEW 1: ANALYTICS */}
      {subView === 'analytics' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-3xl border border-slate-150 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">মোট অর্জিত রাজস্ব (Revenue)</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xl font-black text-slate-800">₹{stats.totalRevenue}</span>
                <span className="text-[9px] font-bold text-[#16A34A] bg-[#eefdf2] px-1 rounded">INR</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-150 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">পেমেন্ট সাকসেস রেট</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xl font-black text-slate-800">{stats.successRate}%</span>
                <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1 rounded">লাইভ</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-150 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">সফল পেমেন্ট / মোট চেষ্টা</span>
              <div className="mt-2 text-md font-black text-slate-800">
                {stats.successfulPaymentsCount} <span className="text-slate-400 font-bold text-xs">/ {stats.totalPaymentsCount}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-150 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">সক্রিয় ইউজার এনটাইটেলমেন্ট</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xl font-black text-slate-800">{stats.activePurchasesCount}</span>
                <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1 rounded">সিরিজ</span>
              </div>
            </div>
          </div>

          {/* Transactions List with Date Filter */}
          <div className="bg-white p-4 rounded-3xl border border-slate-150 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-slate-800">লেনদেন ইতিহাস (Transactions)</h3>
              <select 
                className="text-[10px] font-bold bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl"
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value as any)}
              >
                <option value="all">সর্বকালের</option>
                <option value="today">আজকের</option>
                <option value="7days">গত ৭ দিন</option>
                <option value="30days">গত ৩০ দিন</option>
              </select>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {filteredTransactions.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-[11px] font-bold space-y-1">
                  <span>🏜️ কোনো লেনদেন খুঁজে পাওয়া যায়নি</span>
                </div>
              ) : (
                filteredTransactions.map((tx: any) => (
                  <div key={tx.id} className="p-3 bg-slate-50 border border-slate-150 rounded-2xl flex justify-between items-center gap-2">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-black text-slate-800 leading-none truncate max-w-[120px]">{tx.userName || 'পরীক্ষার্থী'}</span>
                        <span className={`text-[8.5px] font-extrabold px-1 rounded ${
                          tx.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>{tx.status}</span>
                      </div>
                      <p className="text-[9px] text-slate-400 font-bold truncate">{tx.item}</p>
                      <p className="text-[8px] text-slate-400 font-mono">{new Date(tx.date).toLocaleString('bn-BD')}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-[#16A34A]">₹{tx.amount}</span>
                      <p className="text-[8px] text-slate-400 font-mono font-bold">ID: {tx.id.substring(0, 10)}...</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW 2: PRICING */}
      {subView === 'pricing' && (
        <div className="bg-white p-4 rounded-3xl border border-slate-150 shadow-sm space-y-4 animate-fadeIn">
          <div className="space-y-1">
            <h3 className="text-xs font-black text-slate-800">মক টেস্ট সিরিজ ও দাম নির্ধারণ</h3>
            <p className="text-[10px] text-slate-400 font-bold">নিচের তালিকা থেকে যেকোনো টেস্ট সিরিজের বিক্রয় মূল্য এবং মেয়াদ পরিবর্তন করতে পারবেন।</p>
          </div>

          <div className="space-y-3">
            {seriesList.map((series: any) => {
              const isEditing = editingSeriesId === series.id;
              return (
                <div key={series.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="text-xs font-black text-slate-800">{series.bengaliName}</h4>
                      <p className="text-[9px] font-mono font-semibold text-slate-400">Slug ID: {series.id}</p>
                    </div>
                    {!isEditing && (
                      <button 
                        onClick={() => {
                          setEditingSeriesId(series.id);
                          setRegularPrice(series.regularPrice || 99);
                          setSalePrice(series.salePrice || 49);
                          setValidityDays(series.validityDays || 365);
                          setSeriesStatus(series.status || 'published');
                        }}
                        className="p-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-3 pt-2 border-t border-slate-200">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 block">পূর্ববর্তী মূল্য (Regular Price)</label>
                          <input 
                            type="number"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                            value={regularPrice}
                            onChange={e => setRegularPrice(Number(e.target.value))}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 block">বর্তমান মূল্য (Sale Price) <span className="text-rose-500">*</span></label>
                          <input 
                            type="number"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                            value={salePrice}
                            onChange={e => setSalePrice(Number(e.target.value))}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 block">মেয়াদ (Validity in Days)</label>
                          <input 
                            type="number"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                            value={validityDays}
                            onChange={e => setValidityDays(Number(e.target.value))}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 block">অবস্থা (Status)</label>
                          <select 
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                            value={seriesStatus}
                            onChange={e => setSeriesStatus(e.target.value as any)}
                          >
                            <option value="published">পাবলিশড</option>
                            <option value="draft">ড্রাফট</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex gap-1.5 justify-end">
                        <button 
                          onClick={() => setEditingSeriesId(null)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 text-[10px] font-black rounded-lg transition-colors cursor-pointer"
                        >
                          বাতিল
                        </button>
                        <button 
                          onClick={() => handleSavePricing(series.id, series.bengaliName)}
                          className="px-3.5 py-1.5 bg-[#16A34A] text-white text-[10px] font-black rounded-lg flex items-center gap-1 shadow-md shadow-emerald-600/10 active:scale-95 transition-all cursor-pointer"
                        >
                          <Save className="w-3 h-3" /> সংরক্ষণ
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center pt-1.5 text-[10px] font-bold text-slate-400 border-t border-slate-100 flex-wrap">
                      <div className="flex gap-2">
                        <span>বর্তমান দাম: <span className="text-[#16A34A] font-extrabold">₹{series.salePrice || 49}</span></span>
                        <span className="line-through">₹{series.regularPrice || 99}</span>
                      </div>
                      <div className="flex gap-2">
                        <span>মেয়াদ: <span className="text-slate-600 font-extrabold">{series.validityDays || 365} দিন</span></span>
                        <span className={`px-1.5 rounded text-[8px] font-black ${
                          series.status === 'draft' ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-emerald-800'
                        }`}>{series.status === 'draft' ? 'খসড়া' : 'প্রকাশিত'}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBVIEW 3: COUPONS */}
      {subView === 'coupons' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Coupon Generator Form */}
          <form onSubmit={handleCreateCoupon} className="bg-white p-4 rounded-3xl border border-slate-150 shadow-sm space-y-3">
            <h3 className="text-xs font-black text-slate-800">নতুন কুপন কোড তৈরি করুন</h3>
            
            <div className="space-y-2">
              <div className="space-y-1">
                <label className="text-[9.5px] font-bold text-slate-500 block">কুপন কোড (যেমন: PROMO50) <span className="text-rose-500">*</span></label>
                <input 
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black uppercase font-mono"
                  placeholder="যেমন: EASTER10"
                  value={newCouponCode}
                  onChange={e => setNewCouponCode(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[9.5px] font-bold text-slate-500 block">ছাড়ের মূল্য (Discount Value) <span className="text-rose-500">*</span></label>
                  <input 
                    type="number"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    value={newDiscountValue}
                    onChange={e => setNewDiscountValue(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9.5px] font-bold text-slate-500 block">ছাড়ের ধরণ (Discount Type)</label>
                  <select 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    value={newDiscountType}
                    onChange={e => setNewDiscountType(e.target.value as any)}
                  >
                    <option value="flat">টাকা (Flat ₹)</option>
                    <option value="percentage">শতকরা (Percentage %)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[9.5px] font-bold text-slate-500 block">সর্বনিম্ন অর্ডার মূল্য</label>
                  <input 
                    type="number"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    placeholder="০ হলে কোনো সীমা নেই"
                    value={newMinOrderAmount}
                    onChange={e => setNewMinOrderAmount(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9.5px] font-bold text-slate-500 block">সক্রিয় করুন</label>
                  <div className="flex items-center h-10">
                    <input 
                      type="checkbox"
                      id="coupon-active"
                      className="w-4 h-4 text-indigo-600 accent-indigo-600 border-slate-300 rounded"
                      checked={newCouponActive}
                      onChange={e => setNewCouponActive(e.target.checked)}
                    />
                    <label htmlFor="coupon-active" className="text-[10px] font-bold text-slate-600 ml-1.5 cursor-pointer">সক্রিয়</label>
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> কুপন কোড যোগ করুন
            </button>
          </form>

          {/* Coupons List */}
          <div className="bg-white p-4 rounded-3xl border border-slate-150 shadow-sm space-y-3">
            <h3 className="text-xs font-black text-slate-800">চলমান কুপন কোডসমূহ</h3>
            
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {coupons.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-[10px] font-bold">
                  কোনো কুপন কোড তৈরি করা নেই।
                </div>
              ) : (
                coupons.map((coupon: any) => (
                  <div key={coupon.id} className="p-3 bg-slate-50 border border-slate-150 rounded-2xl flex justify-between items-center gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black font-mono text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-lg leading-none">{coupon.code}</span>
                        {!coupon.active && <span className="text-[8px] font-bold bg-slate-200 text-slate-600 px-1 rounded">ইনঅ্যাক্টিভ</span>}
                      </div>
                      <p className="text-[9px] text-slate-400 font-bold mt-1">
                        ছাড়: <span className="text-slate-700">{coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}</span>
                        {coupon.minOrderAmount > 0 && ` • সর্বনিম্ন অর্ডার: ₹${coupon.minOrderAmount}`}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleDeleteCoupon(coupon.code)}
                      className="p-2 text-rose-600 hover:bg-rose-50 border border-rose-100 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW 4: MANUAL ACCESS */}
      {subView === 'manual' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Grant form */}
          <form onSubmit={handleGrantAccess} className="bg-white p-4 rounded-3xl border border-slate-150 shadow-sm space-y-3">
            <div className="space-y-1">
              <h3 className="text-xs font-black text-slate-800">প্রিমিয়াম এনটাইটেলমেন্ট (ম্যানুয়াল অ্যাক্সেস)</h3>
              <p className="text-[9.5px] text-slate-400 font-bold">সার্ভার-সাইডে নির্দিষ্ট কোনো শিক্ষার্থীকে ডাইরেক্ট সিরিজ আনলক করে দিতে নিচের ফর্মটি পূরণ করুন।</p>
            </div>

            <div className="space-y-2.5">
              <div className="space-y-1">
                <label className="text-[9.5px] font-bold text-slate-500 block">ইউজার নির্বাচন করুন (User List) <span className="text-rose-500">*</span></label>
                <select 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  value={manualUserId}
                  onChange={e => setManualUserId(e.target.value)}
                  required
                >
                  <option value="">-- ইউজার সিলেক্ট করুন --</option>
                  {users.map(u => (
                    <option key={u.id || u.uid} value={u.id || u.uid}>
                      {u.name || u.displayName || 'Unnamed'} ({u.email || 'No email'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9.5px] font-bold text-slate-500 block">আনলক করার জন্য সিরিজ <span className="text-rose-500">*</span></label>
                <select 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  value={manualSeriesId}
                  onChange={e => setManualSeriesId(e.target.value)}
                  required
                >
                  <option value="">-- সিরিজ সিলেক্ট করুন --</option>
                  {posts.map(p => (
                    <option key={p.id} value={p.id}>{p.bengaliName}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9.5px] font-bold text-slate-500 block">অ্যাক্সেস মেয়াদ (Days of Access)</label>
                <input 
                  type="number"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  value={manualDays}
                  onChange={e => setManualDays(Number(e.target.value))}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-2.5 bg-[#16A34A] hover:bg-[#15803d] text-white font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-1 shadow-md shadow-emerald-600/10 active:scale-95 transition-transform cursor-pointer"
            >
              <UserCheck className="w-4 h-4" /> ম্যানুয়াল অ্যাক্সেস দিন
            </button>
          </form>

          {/* Audit Trail */}
          <div className="bg-white p-4 rounded-3xl border border-slate-150 shadow-sm space-y-3">
            <h3 className="text-xs font-black text-slate-800">অডিট লগ ও পরিবর্তন ইতিহাস</h3>
            
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {auditLogs.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-[10px] font-bold">
                  কোনো ম্যানুয়াল অ্যাক্সেসের রেকর্ড অডিট লগে নেই।
                </div>
              ) : (
                auditLogs.map((log: any) => {
                  const matchedUser = users.find(u => u.id === log.targetUserId || u.uid === log.targetUserId);
                  return (
                    <div key={log.id} className="p-3 bg-slate-50 border border-slate-150 rounded-2xl text-[10px] font-bold space-y-1.5 relative">
                      <div className="flex justify-between items-center">
                        <span className={`text-[8px] px-1 py-0.5 rounded ${
                          log.action === 'grant_access' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {log.action === 'grant_access' ? 'গ্রান্ট অ্যাক্সেস' : 'ক্যানসেল অ্যাক্সেস'}
                        </span>
                        <span className="text-[8px] text-slate-400 font-mono font-bold">{new Date(log.timestamp).toLocaleDateString('bn-BD')}</span>
                      </div>
                      
                      <div className="space-y-0.5">
                        <p className="text-slate-800">ইউজার: <span className="font-extrabold text-slate-900">{matchedUser?.name || log.targetUserId}</span></p>
                        <p className="text-slate-500">বিবরণ: {log.details}</p>
                      </div>

                      {log.action === 'grant_access' && (
                        <button 
                          onClick={() => handleRevokeAccess(log.targetUserId, log.targetSeriesId || '')}
                          className="absolute bottom-2 right-2 text-[8px] font-extrabold text-rose-600 hover:bg-rose-50 border border-rose-100 px-2 py-1 rounded"
                        >
                          অ্যাক্সেস বাতিল করুন
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
