import React from 'react';
import { Menu, Bell, Crown, Sun, Moon, ArrowLeft } from 'lucide-react';
import { ViewType } from '../types';

interface HeaderProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  currentView: ViewType;
  setView: (view: ViewType) => void;
  isPremiumUser: boolean;
  onOpenNotifications: () => void;
  onOpenPremiumModal: () => void;
  hasUnreadNotification: boolean;
  onOpenSidebar: () => void;
  points?: number;
  streakCount?: number;
}

export default function Header({
  theme,
  setTheme,
  currentView,
  setView,
  isPremiumUser,
  onOpenNotifications,
  onOpenPremiumModal,
  hasUnreadNotification,
  onOpenSidebar,
  points,
  streakCount
}: HeaderProps) {
  const isTestingMode = currentView === 'test-running';

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl border-b transition-colors duration-300"
      style={{
        backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(15, 23, 42, 0.55)',
        borderColor: theme === 'light' ? 'rgba(226, 232, 240, 0.7)' : 'rgba(255, 255, 255, 0.08)'
      }}
    >
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between relative">
        {isTestingMode ? (
          <div className="flex items-center gap-3 z-10">
            <button 
              onClick={() => {
                if (window.confirm('আপনি কি সত্যিই মক টেস্টটি বন্ধ করতে চান?')) {
                  setView('home');
                }
              }}
              className="p-1 rounded-full text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="বন্ধ করুন"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <span className="text-xs font-semibold text-rose-500 tracking-wider">চলতি পরীক্ষা</span>
              <h1 className="text-sm md:text-base font-extrabold tracking-tight font-display bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent -mt-1">WB Mock Test</h1>
            </div>
          </div>
        ) : (
          <>
            <button 
              onClick={onOpenSidebar}
              className="p-1 rounded-xl text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all active:scale-95 cursor-pointer z-10"
              title="মেনু"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div 
              className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center cursor-pointer select-none" 
              onClick={() => setView('home')}
            >
              <div className="flex items-baseline leading-none justify-center">
                <span className="text-xl md:text-2xl font-black tracking-tight font-display bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
                  WB Mock Test
                </span>
              </div>
              <span className="text-[8px] text-slate-500 dark:text-slate-400 font-black tracking-tight block -mt-0.5 text-center">
                সফলতার পথে আমরা
              </span>
            </div>
          </>
        )}

        <div className="flex items-center gap-1.5 font-sans z-10">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-indigo-600" />
            ) : (
              <Sun className="w-5 h-5 text-amber-400" />
            )}
          </button>

          {/* Premium icon removed */}

          {/* Notification Bell */}
          {!isTestingMode && (
            <button
              onClick={onOpenNotifications}
              className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-all active:scale-95"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {hasUnreadNotification && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-white dark:border-slate-950 rounded-full animate-ping" />
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

