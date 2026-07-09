import React from 'react';
import { 
  X, Home, BookOpen, HelpCircle, Award, User, Crown, 
  FileText, Briefcase, ChevronRight, LogIn, LogOut, Shield, Settings, HeadphonesIcon, Bell, Zap, Newspaper,
  Info, Phone, Scale
} from 'lucide-react';
import { ViewType } from '../types';
import { safeSessionStorage } from '../lib/storage';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: ViewType;
  setView: (view: ViewType) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  isPremiumUser: boolean;
  onOpenSyllabus: () => void;
  onOpenJobNews: () => void;
  onOpenPremium: () => void;
  firebaseUser: any | null;
  isLoggingIn: boolean;
  authError: string | null;
  onGoogleLogin: () => void;
  onDemoLogin: () => void;
  onSignOut: () => void;
}

export default function SidebarDrawer({
  isOpen,
  onClose,
  currentView,
  setView,
  theme,
  setTheme,
  isPremiumUser,
  onOpenSyllabus,
  onOpenJobNews,
  onOpenPremium,
  firebaseUser,
  isLoggingIn,
  authError,
  onGoogleLogin,
  onDemoLogin,
  onSignOut
}: SidebarDrawerProps) {

  if (!isOpen) return null;

  const mainMenuItems = [
    { 
      id: 'home', 
      label: 'হোম ড্যাশবোর্ড', 
      icon: Home, 
      action: () => { setView('home'); onClose(); } 
    },
    { 
      id: 'mock-tests', 
      label: 'সকল মক টেস্ট', 
      icon: BookOpen, 
      action: () => { setView('mock-tests'); onClose(); } 
    },
    { 
      id: 'question-bank', 
      label: 'প্রশ্ন ব্যাংক', 
      icon: HelpCircle, 
      action: () => { setView('question-bank'); onClose(); } 
    },
    { 
      id: 'daily-ca', 
      label: 'ডেইলি কারেন্ট অ্যাফেয়ার্স', 
      icon: Newspaper, 
      action: () => { setView('daily-ca'); onClose(); } 
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex font-sans">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-[#0A1B3D]/40 dark:bg-black/80 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative w-[300px] max-w-[85vw] h-full bg-white dark:bg-slate-950 flex flex-col shadow-2xl animate-slideInLeft rounded-r-[24px] overflow-hidden">
        
        {/* Drawer Header */}
        <div className="p-5 pt-6 flex items-start justify-between bg-white dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
             <div className="relative flex items-center justify-center w-10 h-10">
               <Shield className="w-9 h-9 text-[#FBBF24] fill-[#2563EB] stroke-[1.5]" />
               <Crown className="w-5 h-5 text-[#FBBF24] absolute -top-3 drop-shadow-sm" />
               <span className="absolute text-white font-black text-[11px] leading-none mt-1">WB</span>
            </div>
            <div className="flex flex-col pt-1">
              <h1 className="text-[19px] font-black tracking-tight text-[#0A1B3D] dark:text-white leading-none mb-1">
                <span className="text-[#2563EB]">WB</span>MockTest
              </h1>
              <span className="text-[10px] text-slate-500 font-bold tracking-tight">
                পশ্চিমবঙ্গ চাকরি পরীক্ষার সেরা প্রস্তুতি
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 -mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-5 custom-scrollbar">
          
          {/* Login / User Section */}
          <div className="flex flex-col gap-2.5 mt-2">
            {firebaseUser ? (
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-[16px] border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-[#2563EB] to-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                    {firebaseUser.photoURL ? (
                      <img src={firebaseUser.photoURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      (firebaseUser.displayName || 'U').substring(0, 1)
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[13px] font-black text-slate-800 dark:text-white block truncate leading-tight">
                      {firebaseUser.displayName || 'পরীক্ষার্থী'}
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate font-medium">
                      {firebaseUser.email}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={onSignOut}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={onGoogleLogin}
                  disabled={isLoggingIn}
                  className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 text-white text-[13px] font-bold rounded-[14px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/20 disabled:opacity-70"
                >
                  {isLoggingIn ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                       {/* SVG Icon for Google */}
                       <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                         <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                         </svg>
                       </div>
                      <span className="tracking-wide">Google দিয়ে লগইন</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="w-full h-px bg-slate-100 dark:bg-slate-800"></div>

          {/* Main Navigation */}
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 font-bold mb-2.5 block px-2">মূল নেভিগেশন</span>
            {mainMenuItems.map((item) => {
              const IconComp = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-[12px] text-[13.5px] font-bold transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'bg-blue-50 text-[#2563EB] dark:bg-[#2563EB]/10 dark:text-blue-400' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className={`w-[18px] h-[18px] stroke-[2.5] ${isActive ? 'text-[#2563EB] dark:text-blue-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-blue-400" />}
                </button>
              );
            })}
          </div>

          {/* Job Section */}
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 font-bold mb-2.5 block px-2 mt-4">চাকরি বিভাগ</span>
            
            <button
               onClick={() => { onOpenJobNews(); onClose(); }}
               className="w-full flex items-center justify-between px-3 py-3 rounded-[12px] text-[13.5px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
            >
               <div className="flex items-center gap-3">
                 <Briefcase className="w-[18px] h-[18px] stroke-[2.5] text-slate-400" />
                 <span>সরকারি চাকরির খবর</span>
               </div>
               <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">NEW</span>
            </button>

            <button
               className="w-full flex items-center px-3 py-3 rounded-[12px] text-[13.5px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
            >
               <div className="flex items-center gap-3">
                 <svg className="w-[18px] h-[18px] stroke-[2.5] text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                 <span>অ্যাডমিট কার্ড</span>
               </div>
            </button>

            <button
               className="w-full flex items-center px-3 py-3 rounded-[12px] text-[13.5px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
            >
               <div className="flex items-center gap-3">
                 <Bell className="w-[18px] h-[18px] stroke-[2.5] text-slate-400" />
                 <span>রেজাল্ট আপডেট</span>
               </div>
            </button>

            <button
               onClick={() => { onOpenSyllabus(); onClose(); }}
               className="w-full flex items-center px-3 py-3 rounded-[12px] text-[13.5px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
            >
               <div className="flex items-center gap-3">
                 <FileText className="w-[18px] h-[18px] stroke-[2.5] text-slate-400" />
                 <span>পরীক্ষার সিলেবাস</span>
               </div>
            </button>
          </div>

          {/* Info & Policy Section */}
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 font-bold mb-2.5 block px-2 mt-4">প্রয়োজনীয় তথ্য ও নীতি</span>
            
            <button
               onClick={() => { setView('about'); onClose(); }}
               className="w-full flex items-center px-3 py-2.5 rounded-[12px] text-[12.5px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
            >
               <div className="flex items-center gap-3">
                 <Info className="w-4 h-4 text-slate-400" />
                 <span>আমাদের সম্পর্কে</span>
               </div>
            </button>

            <button
               onClick={() => { setView('contact'); onClose(); }}
               className="w-full flex items-center px-3 py-2.5 rounded-[12px] text-[12.5px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
            >
               <div className="flex items-center gap-3">
                 <Phone className="w-4 h-4 text-slate-400" />
                 <span>যোগাযোগ করুন</span>
               </div>
            </button>

            <button
               onClick={() => { setView('privacy'); onClose(); }}
               className="w-full flex items-center px-3 py-2.5 rounded-[12px] text-[12.5px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
            >
               <div className="flex items-center gap-3">
                 <Shield className="w-4 h-4 text-slate-400" />
                 <span>গোপনীয়তা নীতি</span>
               </div>
            </button>

            <button
               onClick={() => { setView('disclaimer'); onClose(); }}
               className="w-full flex items-center px-3 py-2.5 rounded-[12px] text-[12.5px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
            >
               <div className="flex items-center gap-3">
                 <Scale className="w-4 h-4 text-slate-400" />
                 <span>দাবিত্যাগ</span>
               </div>
            </button>

            <button
               onClick={() => { setView('terms'); onClose(); }}
               className="w-full flex items-center px-3 py-2.5 rounded-[12px] text-[12.5px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
            >
               <div className="flex items-center gap-3">
                 <Scale className="w-4 h-4 text-slate-400" />
                 <span>শর্তাবলী</span>
               </div>
            </button>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between">
           <button 
              onClick={() => { setView('contact'); onClose(); }}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 font-bold text-[12px] transition-colors py-2 px-1 cursor-pointer"
           >
              <HeadphonesIcon className="w-[18px] h-[18px]" /> সাপোর্ট সেন্টার
           </button>
           <div className="w-px h-4 bg-slate-200 dark:bg-slate-800"></div>
           <button 
              onClick={() => { setView('contact'); onClose(); }}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 font-bold text-[12px] transition-colors py-2 px-1 cursor-pointer"
           >
              <Settings className="w-[18px] h-[18px]" /> যোগাযোগ
           </button>
        </div>

      </div>
    </div>
  );
}
