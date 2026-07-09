import React, { useEffect, useState } from 'react';
import { Bell, X, Sparkles, AlertCircle, Bookmark } from 'lucide-react';

interface NotificationToastProps {
  toast: { title: string; body: string; id: number } | null;
  onClose: () => void;
}

export default function NotificationToast({ toast, onClose }: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      setIsVisible(true);
      // Auto close after 7 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Delay callback to match transition exit
        setTimeout(onClose, 400);
      }, 7000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [toast]);

  if (!toast) return null;

  return (
    <div 
      className={`fixed top-4 right-4 z-50 max-w-sm w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-[0_10px_35px_rgba(30,41,59,0.15)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-slate-800 p-4 transition-all duration-300 ease-out font-sans ${
        isVisible 
          ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto' 
          : '-translate-y-4 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white p-2.5 rounded-xl shadow-md shrink-0 relative">
          <Bell className="w-4 h-4 animate-bounce" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
        </div>
        
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-black tracking-wider text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md">
              লাইভ আপডেট
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">এইমাত্র</span>
          </div>
          <h4 className="text-[12.5px] font-black text-slate-900 dark:text-white leading-snug mt-1">
            {toast.title}
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-450 mt-1 leading-relaxed font-medium">
            {toast.body}
          </p>
        </div>

        <button 
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress bar indicating auto-close */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-850 rounded-b-2xl overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-b-2xl transition-all"
          style={{ 
            animation: 'notification-progress 7s linear forwards',
            transformOrigin: 'left'
          }}
        />
      </div>

      {/* Styled inline animation for the progress bar */}
      <style>{`
        @keyframes notification-progress {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
}
