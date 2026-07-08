import React from 'react';
import { Home, BookOpen, User, Newspaper } from 'lucide-react';
import { ViewType } from '../types';

interface BottomNavProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

export default function BottomNav({ currentView, setView }: BottomNavProps) {
  
  // Maps a ViewType to corresponding label and icon
  const navItems = [
    {
      view: 'home' as ViewType,
      label: 'হোম',
      icon: Home
    },
    {
      view: 'mock-tests' as ViewType,
      label: 'মক টেস্ট',
      icon: BookOpen
    },
    {
      view: 'daily-ca' as ViewType,
      label: 'ডেইলি সিএ',
      icon: Newspaper
    },
    {
      view: 'profile' as ViewType,
      label: 'প্রোফাইল',
      icon: User
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/85 dark:bg-slate-950/80 border-t border-slate-150 dark:border-white/10 backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-md mx-auto h-16 px-2 flex items-center justify-around font-sans">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          // Determine if this nav item is active
          const isActive = currentView === item.view || 
            (item.view === 'mock-tests' && currentView === 'test-running') ||
            (item.view === 'daily-ca' && currentView === 'news-details') ||
            (item.view === 'profile' && (currentView === 'my-tests' || currentView === 'results' || currentView === 'performance' || currentView === 'test-result'));

          return (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className="flex-1 flex flex-col items-center justify-center h-full relative cursor-pointer active:scale-95 transition-transform"
            >
              {isActive && (
                <span className="absolute top-1 w-5 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" />
              )}
              
              <div 
                className={`p-1.5 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400 scale-110' 
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'
                }`}
              >
                <IconComponent className="w-5 h-5 stroke-[2.25]" />
              </div>
              
              <span className={`text-[9px] font-extrabold -mt-1 tracking-tight ${
                isActive 
                  ? 'text-blue-600 dark:text-blue-400 font-black' 
                  : 'text-slate-500 dark:text-slate-400'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
