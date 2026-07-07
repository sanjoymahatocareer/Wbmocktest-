import React, { useState, useEffect } from 'react';
import { 
  Menu, Bell, Users, Crown, BookOpen, Plus, Briefcase, CreditCard, 
  LayoutDashboard, Settings, FileText, BarChart, BellRing, User, 
  Shield, HelpCircle, Trophy, Trash2, Edit3, Save, X, ArrowLeft, 
  Upload, CheckCircle, Sparkles, PlusCircle, MinusCircle, FileCode, 
  Layers, Calendar, ChevronDown, ChevronUp, Search, Filter, Globe, LogOut
} from 'lucide-react';
import { 
  getCategories, saveCategories, 
  getPosts, savePosts, 
  getMockTests, saveMockTests, 
  getUsers, saveUsers, 
  getAttempts, 
  getTemplates, saveTemplates,
  getDashboardStats 
} from '../lib/db';
import { ExamCategory, PostName, MockTest, Question, CustomTemplate, TestResult } from '../types';
import { safeSessionStorage } from '../lib/storage';

// Import subcomponents
import AdminPostsView from './AdminPostsView';
import AdminMockTestsView from './AdminMockTestsView';
import AdminQuestionBankView from './AdminQuestionBankView';
import AdminUsersView from './AdminUsersView';
import AdminSettingsView from './AdminSettingsView';
import CategoryManager from './CategoryManager';
import AdminPaymentsDashboard from './AdminPaymentsDashboard';

export default function MobileAdminDashboard() {
  const [activeView, setActiveView] = useState<
    'dashboard' | 'posts' | 'mock_tests' | 'questions' | 'users' | 'settings' | 'more' | 'categories_manager' | 'payments'
  >('dashboard');

  const [settingsSubView, setSettingsSubView] = useState<'menu' | 'categories' | 'templates' | 'fields' | 'website' | 'notifications'>('menu');

  // Master States
  const [categories, setCategories] = useState<ExamCategory[]>([]);
  const [posts, setPosts] = useState<PostName[]>([]);
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<TestResult[]>([]);
  const [templates, setTemplates] = useState<CustomTemplate[]>([]);

  // UI Dialog/Bottom Sheet Toggles
  const [showProfileSheet, setShowProfileSheet] = useState(false);
  const [showPlusSheet, setShowPlusSheet] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize and load all data
  const loadAllData = () => {
    setCategories(getCategories());
    setPosts(getPosts());
    setMockTests(getMockTests());
    setUsers(getUsers());
    setAttempts(getAttempts());
    setTemplates(getTemplates());
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Auth logout handler
  const handleLogout = () => {
    if (window.confirm('আপনি কি লগআউট করতে চান?')) {
      safeSessionStorage.removeItem('admin_auth_token');
      window.location.href = '/';
    }
  };

  // Database callback wrapper saves
  const handleSavePosts = (updatedPosts: PostName[]) => {
    savePosts(updatedPosts);
    setPosts(updatedPosts);
    triggerToast('পোস্ট সফলভাবে সেভ করা হয়েছে!');
  };

  const handleSavePost = (savedPost: PostName) => {
    let updated = [...posts];
    if (savedPost.id && posts.some(p => p.id === savedPost.id)) {
      updated = updated.map(p => p.id === savedPost.id ? savedPost : p);
    } else {
      updated.unshift({ ...savedPost, id: savedPost.id || 'post-' + Date.now() });
    }
    handleSavePosts(updated);
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই পোস্টটি ডিলিট করতে চান?')) {
      const updated = posts.filter(p => p.id !== id);
      handleSavePosts(updated);
    }
  };

  const handleSaveMockTests = (updatedTests: MockTest[]) => {
    saveMockTests(updatedTests);
    setMockTests(updatedTests);
    triggerToast('মক টেস্ট সফলভাবে সেভ করা হয়েছে!');
  };

  const handleSaveMockTest = (savedTest: MockTest) => {
    let updated = [...mockTests];
    if (savedTest.id && mockTests.some(t => t.id === savedTest.id)) {
      updated = updated.map(t => t.id === savedTest.id ? savedTest : t);
    } else {
      updated.unshift({ ...savedTest, id: savedTest.id || 'test-' + Date.now() });
    }
    handleSaveMockTests(updated);
  };

  const handleDeleteMockTest = (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই মক টেস্টটি ডিলিট করতে চান?')) {
      const updated = mockTests.filter(t => t.id !== id);
      handleSaveMockTests(updated);
    }
  };

  const handleTogglePremiumUser = (id: string) => {
    const updated = users.map(u => {
      if (u.id === id) {
        const nextState = !u.isPremium;
        triggerToast(`মেম্বারশিপ ${nextState ? 'অ্যাক্টিভেট করা হয়েছে ★' : 'ডি-অ্যাক্টিভেট করা হয়েছে'}`);
        return { ...u, isPremium: nextState };
      }
      return u;
    });
    saveUsers(updated);
    setUsers(updated);
  };

  const handleSaveCategories = (updatedCats: ExamCategory[]) => {
    saveCategories(updatedCats);
    setCategories(updatedCats);
    triggerToast('ক্যাটাগরি সেভ করা হয়েছে!');
  };

  const handleSaveTemplates = (updatedTpls: CustomTemplate[]) => {
    saveTemplates(updatedTpls);
    setTemplates(updatedTpls);
    triggerToast('টেমপ্লেট সেভ করা হয়েছে!');
  };

  // Total questions aggregator
  const totalQuestionsSum = mockTests.reduce((sum, t) => sum + (t.questions?.length || 0), 0);

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 flex justify-center items-start font-sans">
      {/* Centered Android Mobile View Simulator Shell */}
      <div className="w-full max-w-md bg-slate-50 min-h-screen shadow-2xl relative flex flex-col border-x border-slate-200 overflow-hidden">
        
        {/* ================= STICKY TOP HEADER ================= */}
        <header className="sticky top-0 z-30 bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-4 py-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-1.5" id="admin-header-logo">
            <Shield className="w-5 h-5 text-amber-400" />
            <span className="font-black text-xs tracking-wider uppercase">WB Admin</span>
          </div>

          <h2 className="text-xs font-black bg-white/10 px-2.5 py-1 rounded-full text-white/95">
            {activeView === 'dashboard' && 'ড্যাশবোর্ড'}
            {activeView === 'posts' && 'পোস্টস ম্যানেজার'}
            {activeView === 'mock_tests' && 'মক টেস্টস'}
            {activeView === 'questions' && 'প্রশ্ন ব্যাংক'}
            {activeView === 'users' && 'ইউজারস'}
            {activeView === 'settings' && 'কন্ট্রোল প্যানেল'}
            {activeView === 'more' && 'সব মেনু'}
          </h2>

          <div className="flex items-center gap-2">
            {/* Notification Icon */}
            <button className="relative p-1.5 hover:bg-white/10 rounded-full transition-colors">
              <Bell className="w-4 h-4 text-white" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
            </button>

            {/* Profile Avatar Trigger */}
            <button 
              onClick={() => setShowProfileSheet(true)}
              className="w-7 h-7 rounded-full bg-amber-400 text-slate-900 font-black text-[11px] flex items-center justify-center shadow"
            >
              SA
            </button>
          </div>
        </header>

        {/* ================= TOAST NOTIFICATION ================= */}
        {toastMessage && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur text-white px-4 py-2.5 rounded-xl text-[11px] font-black shadow-lg animate-bounce whitespace-nowrap">
            ✓ {toastMessage}
          </div>
        )}

        {/* ================= MAIN SCROLLABLE CONTENT ================= */}
        <main className="flex-1 p-4 pb-24 overflow-y-auto">
          
          {/* VIEW 1: DASHBOARD VIEW */}
          {activeView === 'dashboard' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Top welcome card with buttons */}
              <div className="bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-4 text-white shadow-md relative overflow-hidden">
                <div className="absolute right-[-10%] top-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="space-y-3 relative z-10">
                  <div>
                    <h3 className="text-sm font-black leading-none">স্বাগতম, Super Admin 👋</h3>
                    <p className="text-[10px] text-indigo-100 font-bold mt-1">WBMockTest প্ল্যাটফর্ম ও ডেটাবেস পরিচালনা করুন</p>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <a 
                      href="/" 
                      target="_blank"
                      className="px-3.5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-[10.5px] font-extrabold flex items-center gap-1 transition-all"
                    >
                      <Globe className="w-3.5 h-3.5 text-amber-300" /> ওয়েবসাইট দেখুন
                    </a>
                    <button 
                      onClick={handleLogout}
                      className="px-3.5 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 rounded-xl text-[10.5px] font-extrabold flex items-center gap-1 transition-all"
                    >
                      লগআউট (Logout)
                    </button>
                  </div>
                </div>
              </div>

              {/* Horizontally Scrollable Stats Cards */}
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">প্ল্যাটফর্ম ওভারভিউ (Stats)</span>
                <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                  
                  {/* Card 1 */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-150 min-w-[130px] shadow-sm shrink-0 space-y-1">
                    <span className="text-[9px] font-extrabold text-slate-400 block uppercase">মোট পোস্ট</span>
                    <span className="text-lg font-black text-slate-900 block">{posts.length}</span>
                    <span className="text-[9px] text-emerald-600 font-bold block">+১ নতুন আজ</span>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-150 min-w-[130px] shadow-sm shrink-0 space-y-1">
                    <span className="text-[9px] font-extrabold text-slate-400 block uppercase">মোট মক টেস্ট</span>
                    <span className="text-lg font-black text-slate-900 block">{mockTests.length}</span>
                    <span className="text-[9px] text-emerald-600 font-bold block">+২ নতুন সেট</span>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-150 min-w-[130px] shadow-sm shrink-0 space-y-1">
                    <span className="text-[9px] font-extrabold text-slate-400 block uppercase">মোট প্রশ্নাবলি</span>
                    <span className="text-lg font-black text-slate-900 block">{totalQuestionsSum}</span>
                    <span className="text-[9px] text-indigo-600 font-bold block">২৪০টি ম্যাপড</span>
                  </div>

                  {/* Card 4 */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-150 min-w-[130px] shadow-sm shrink-0 space-y-1">
                    <span className="text-[9px] font-extrabold text-slate-400 block uppercase">মোট প্রার্থী (Users)</span>
                    <span className="text-lg font-black text-slate-900 block">{users.length}</span>
                    <span className="text-[9px] text-emerald-600 font-bold block">+৮ এই সপ্তাহে</span>
                  </div>

                  {/* Card 5 */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-150 min-w-[130px] shadow-sm shrink-0 space-y-1">
                    <span className="text-[9px] font-extrabold text-slate-400 block uppercase">আজকের পরীক্ষা</span>
                    <span className="text-lg font-black text-slate-900 block">{attempts.length}</span>
                    <span className="text-[9px] text-emerald-600 font-bold block">৮৫% সাকসেস রেট</span>
                  </div>
                </div>
              </div>

              {/* QUICK ACTIONS ("দ্রুত কাজ" section) 2-column grid */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">দ্রুত কাজ (Quick Actions)</span>
                
                <div className="grid grid-cols-2 gap-2">
                  
                  <button 
                    onClick={() => setActiveView('posts')}
                    className="p-3 bg-white border border-slate-150 hover:border-indigo-300 rounded-2xl flex flex-col items-start gap-2 text-left shadow-sm active:scale-95 transition-all"
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-800 block">নতুন পোস্ট</span>
                      <span className="text-[9px] text-slate-450 font-semibold block">নিয়োগ বিজ্ঞপ্তি এডিট করুন</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => setActiveView('mock_tests')}
                    className="p-3 bg-white border border-slate-150 hover:border-purple-300 rounded-2xl flex flex-col items-start gap-2 text-left shadow-sm active:scale-95 transition-all"
                  >
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-800 block">মক টেস্ট উইজার্ড</span>
                      <span className="text-[9px] text-slate-450 font-semibold block">৫-ধাপের টেস্ট ক্রিয়েটর</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => setActiveView('questions')}
                    className="p-3 bg-white border border-slate-150 hover:border-amber-300 rounded-2xl flex flex-col items-start gap-2 text-left shadow-sm active:scale-95 transition-all"
                  >
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-800 block">প্রশ্ন ব্যাংক</span>
                      <span className="text-[9px] text-slate-450 font-semibold block">নতুন প্রশ্ন তৈরি করুন ও আপলোড</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => {
                      setActiveView('categories_manager');
                    }}
                    className="p-3 bg-white border border-slate-150 hover:border-emerald-300 rounded-2xl flex flex-col items-start gap-2 text-left shadow-sm active:scale-95 transition-all"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-800 block">ক্যাটাগরি ম্যানেজার</span>
                      <span className="text-[9px] text-slate-450 font-semibold block">নতুন পরীক্ষার বিভাগ যুক্ত ও এডিট করুন</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => setActiveView('users')}
                    className="p-3 bg-white border border-slate-150 hover:border-blue-300 rounded-2xl flex flex-col items-start gap-2 text-left shadow-sm active:scale-95 transition-all"
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-800 block">প্রার্থী তালিকা</span>
                      <span className="text-[9px] text-slate-450 font-semibold block">পরীক্ষার্থী ও মেম্বারশিপ টগল</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => {
                      setSettingsSubView('menu');
                      setActiveView('settings');
                    }}
                    className="p-3 bg-white border border-slate-150 hover:border-slate-300 rounded-2xl flex flex-col items-start gap-2 text-left shadow-sm active:scale-95 transition-all"
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-800 block">কন্ট্রোল প্যানেল</span>
                      <span className="text-[9px] text-slate-450 font-semibold block">টেমপ্লেট, নোটিফিকেশন ও এসইও</span>
                    </div>
                  </button>

                </div>
              </div>

              {/* RECENT ACTIVITY ("সাম্প্রতিক কার্যক্রম") */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">সাম্প্রতিক কার্যক্রম (Activity)</span>
                
                <div className="bg-white rounded-3xl border border-slate-150 p-3 shadow-sm space-y-2.5">
                  
                  <div className="flex gap-2 text-xs font-bold text-slate-700 p-1">
                    <span className="text-emerald-500">●</span>
                    <div>
                      <span className="block font-black text-slate-850">নতুন মক টেস্ট সেট প্রকাশিত হয়েছে</span>
                      <span className="block text-[9px] text-slate-400 font-semibold">আজ দুপুর ১২:৩০ মিনিটে • কন্সটেবল ০১</span>
                    </div>
                  </div>

                  <div className="flex gap-2 text-xs font-bold text-slate-700 p-1 border-t border-slate-100 pt-2.5">
                    <span className="text-indigo-500">●</span>
                    <div>
                      <span className="block font-black text-slate-850">আবেদন টেমপ্লেট সফলভাবে আপডেট করা হয়েছে</span>
                      <span className="block text-[9px] text-slate-400 font-semibold">গতকাল • আইসিডিএস সুপারভাইজার</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveView('more')}
                    className="w-full text-center py-2 text-[10.5px] font-black text-indigo-600 hover:underline pt-1"
                  >
                    সব কার্যক্রম দেখুন ➔
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* VIEW 2: POSTS VIEW */}
          {activeView === 'posts' && (
            <AdminPostsView 
              posts={posts}
              categories={categories}
              templates={templates}
              onSavePost={handleSavePost}
              onDeletePost={handleDeletePost}
              onBack={() => setActiveView('dashboard')}
            />
          )}

          {/* VIEW 3: MOCK TESTS VIEW */}
          {activeView === 'mock_tests' && (
            <AdminMockTestsView 
              mockTests={mockTests}
              posts={posts}
              categories={categories}
              templates={templates}
              onSaveMockTest={handleSaveMockTest}
              onDeleteMockTest={handleDeleteMockTest}
              onViewQuestions={(tId) => {
                setActiveView('questions');
              }}
              onBack={() => setActiveView('dashboard')}
            />
          )}

          {/* VIEW 4: QUESTIONS VIEW */}
          {activeView === 'questions' && (
            <AdminQuestionBankView 
              mockTests={mockTests}
              categories={categories}
              onSaveMockTests={handleSaveMockTests}
              onBack={() => setActiveView('dashboard')}
            />
          )}

          {/* VIEW 5: USERS VIEW */}
          {activeView === 'users' && (
            <AdminUsersView 
              users={users}
              attempts={attempts}
              onTogglePremium={handleTogglePremiumUser}
              onBack={() => setActiveView('dashboard')}
            />
          )}

          {/* VIEW 6: SETTINGS VIEW */}
          {activeView === 'settings' && (
            <AdminSettingsView 
              categories={categories}
              templates={templates}
              onSaveCategories={handleSaveCategories}
              onSaveTemplates={handleSaveTemplates}
              onBack={() => {
                setSettingsSubView('menu');
                setActiveView('dashboard');
              }}
              initialSubView={settingsSubView}
            />
          )}

          {/* VIEW 8: CATEGORIES MANAGER VIEW */}
          {activeView === 'categories_manager' && (
            <CategoryManager 
              categories={categories}
              onSaveCategories={handleSaveCategories}
              onBack={() => setActiveView('dashboard')}
            />
          )}

          {/* VIEW 9: PAYMENTS GATEWAY & DASHBOARD */}
          {activeView === 'payments' && (
            <AdminPaymentsDashboard 
              posts={posts}
              users={users}
              onBack={() => setActiveView('dashboard')}
            />
          )}

          {/* VIEW 7: MORE VIEW MENU */}
          {activeView === 'more' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-white p-4 rounded-3xl border border-slate-150 shadow-sm text-center space-y-1">
                <Shield className="w-10 h-10 text-indigo-600 mx-auto" />
                <h4 className="text-sm font-black text-slate-900">কন্ট্রোল প্যানেল গ্রিড</h4>
                <p className="text-[10px] text-slate-400 font-bold">WBMockTest এর সম্পূর্ণ ফাংশনালিটি এখান থেকে পরিচালনা করুন</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setActiveView('dashboard')} className="p-3 bg-white border border-slate-150 rounded-2xl text-left font-black text-xs space-y-1 shadow-sm">
                  <span className="text-lg block">📊</span>
                  <span className="block text-slate-800">ড্যাশবোর্ড</span>
                </button>
                <button onClick={() => setActiveView('posts')} className="p-3 bg-white border border-slate-150 rounded-2xl text-left font-black text-xs space-y-1 shadow-sm">
                  <span className="text-lg block">📝</span>
                  <span className="block text-slate-800">পোস্টস এডিটর</span>
                </button>
                <button onClick={() => setActiveView('mock_tests')} className="p-3 bg-white border border-slate-150 rounded-2xl text-left font-black text-xs space-y-1 shadow-sm">
                  <span className="text-lg block">📋</span>
                  <span className="block text-slate-800">মক টেস্ট উইজার্ড</span>
                </button>
                <button onClick={() => setActiveView('questions')} className="p-3 bg-white border border-slate-150 rounded-2xl text-left font-black text-xs space-y-1 shadow-sm">
                  <span className="text-lg block">❓</span>
                  <span className="block text-slate-800">প্রশ্ন ব্যাংক</span>
                </button>
                <button onClick={() => setActiveView('users')} className="p-3 bg-white border border-slate-150 rounded-2xl text-left font-black text-xs space-y-1 shadow-sm">
                  <span className="text-lg block">👥</span>
                  <span className="block text-slate-800">ইউজার ম্যানেজমেন্ট</span>
                </button>
                <button onClick={() => setActiveView('categories_manager')} className="p-3 bg-white border border-slate-150 rounded-2xl text-left font-black text-xs space-y-1 shadow-sm">
                  <span className="text-lg block">📁</span>
                  <span className="block text-slate-800">ক্যাটাগরি ম্যানেজার</span>
                </button>
                <button onClick={() => setActiveView('settings')} className="p-3 bg-white border border-slate-150 rounded-2xl text-left font-black text-xs space-y-1 shadow-sm">
                  <span className="text-lg block">⚙️</span>
                  <span className="block text-slate-800">সাইট সেটিংস</span>
                </button>
                <button onClick={() => setActiveView('payments')} className="p-3 bg-[#eefdf2] border border-emerald-200 hover:bg-emerald-100 rounded-2xl text-left font-black text-xs space-y-1 shadow-sm transition-colors">
                  <span className="text-lg block">💳</span>
                  <span className="block text-emerald-950">পেমেন্ট গেটওয়ে</span>
                </button>
              </div>
            </div>
          )}

        </main>

        {/* ================= FIXED BOTTOM NAVIGATION ================= */}
        <nav className="absolute bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200/60 h-16 flex items-center justify-around px-2 shadow-lg">
          
          <button 
            onClick={() => setActiveView('dashboard')}
            className={`flex flex-col items-center gap-1 w-12 transition-all ${
              activeView === 'dashboard' ? 'text-indigo-600 scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[8.5px] font-black">হোম</span>
          </button>

          <button 
            onClick={() => setActiveView('posts')}
            className={`flex flex-col items-center gap-1 w-12 transition-all ${
              activeView === 'posts' ? 'text-indigo-600 scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[8.5px] font-black">পোস্টস</span>
          </button>

          {/* Floating Action Button (FAB) center trigger */}
          <div className="relative -top-5">
            <button 
              onClick={() => setShowPlusSheet(true)}
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 active:scale-95 transition-transform"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          <button 
            onClick={() => setActiveView('mock_tests')}
            className={`flex flex-col items-center gap-1 w-12 transition-all ${
              activeView === 'mock_tests' ? 'text-indigo-600 scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[8.5px] font-black">মক টেস্ট</span>
          </button>

          <button 
            onClick={() => setActiveView('more')}
            className={`flex flex-col items-center gap-1 w-12 transition-all ${
              activeView === 'more' ? 'text-indigo-600 scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Menu className="w-5 h-5" />
            <span className="text-[8.5px] font-black">আরো</span>
          </button>

        </nav>

        {/* ================= PROFILE DROPDOWN / BOTTOM SHEET ================= */}
        {showProfileSheet && (
          <div className="absolute inset-0 z-40">
            {/* Overlay backdrop */}
            <div 
              onClick={() => setShowProfileSheet(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            ></div>
            {/* Sheet content */}
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl border-t border-slate-200 p-4 space-y-4 shadow-2xl animate-slide-up">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto"></div>
              
              <div className="text-center space-y-1">
                <div className="w-14 h-14 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto text-slate-900 font-black text-sm shadow">
                  SA
                </div>
                <h4 className="text-xs font-black text-slate-800">Super Admin Profile</h4>
                <p className="text-[10px] text-slate-400 font-bold">prokashmal799@gmail.com</p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <button 
                  onClick={() => {
                    setShowProfileSheet(false);
                    setActiveView('settings');
                  }}
                  className="w-full text-left py-2.5 px-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-black text-slate-800"
                >
                  ⚙️ সাইট কনফিগারেশন সেটিংস
                </button>
                <a 
                  href="/"
                  target="_blank"
                  className="w-full text-left block py-2.5 px-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-black text-slate-800"
                >
                  🌐 মূল ওয়েবসাইট দেখুন
                </a>
                <button 
                  onClick={() => {
                    setShowProfileSheet(false);
                    handleLogout();
                  }}
                  className="w-full text-left py-2.5 px-3 bg-rose-50 hover:bg-rose-100 rounded-xl text-xs font-black text-rose-700"
                >
                  🚪 সিস্টেম থেকে লগআউট
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= PLUS FLOATING SHORTCUTS BOTTOM SHEET ================= */}
        {showPlusSheet && (
          <div className="absolute inset-0 z-40">
            <div 
              onClick={() => setShowPlusSheet(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            ></div>
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl border-t border-slate-200 p-4 space-y-4 shadow-2xl animate-slide-up">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto"></div>
              
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h4 className="text-xs font-black text-slate-800">কুইক শর্টকাট একশন</h4>
                <button 
                  onClick={() => setShowPlusSheet(false)}
                  className="p-1 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                <button 
                  onClick={() => {
                    setShowPlusSheet(false);
                    setActiveView('posts');
                  }}
                  className="w-full text-left py-2.5 px-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-black text-slate-800 flex justify-between"
                >
                  <span>📝 নতুন নোটিফিকেশন পোস্ট তৈরি করুন</span>
                  <span className="text-[10px] text-indigo-600 font-extrabold">যাব</span>
                </button>
                <button 
                  onClick={() => {
                    setShowPlusSheet(false);
                    setActiveView('mock_tests');
                  }}
                  className="w-full text-left py-2.5 px-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-black text-slate-800 flex justify-between"
                >
                  <span>📝 নতুন মক টেস্ট বা পরীক্ষার উইজার্ড</span>
                  <span className="text-[10px] text-indigo-600 font-extrabold">যাব</span>
                </button>
                <button 
                  onClick={() => {
                    setShowPlusSheet(false);
                    setActiveView('questions');
                  }}
                  className="w-full text-left py-2.5 px-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-black text-slate-800 flex justify-between"
                >
                  <span>❓ নতুন প্রশ্ন বা সমাধান যুক্ত করুন</span>
                  <span className="text-[10px] text-indigo-600 font-extrabold">যাব</span>
                </button>
                <button 
                  onClick={() => {
                    setShowPlusSheet(false);
                    setActiveView('categories_manager');
                  }}
                  className="w-full text-left py-2.5 px-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-black text-slate-800 flex justify-between"
                >
                  <span>📁 ক্যাটাগরি ম্যানেজার কন্ট্রোল</span>
                  <span className="text-[10px] text-indigo-600 font-extrabold">যাব</span>
                </button>
                <button 
                  onClick={() => {
                    setShowPlusSheet(false);
                    setSettingsSubView('menu');
                    setActiveView('settings');
                  }}
                  className="w-full text-left py-2.5 px-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-black text-slate-800 flex justify-between"
                >
                  <span>⚙️ সাইট কনফিগারেশন ও সেটিংস</span>
                  <span className="text-[10px] text-indigo-600 font-extrabold">যাব</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
