import React, { useState, useEffect } from 'react';
import { Bell, X, ShieldAlert, CheckCircle, Smartphone } from 'lucide-react';
import { 
  isNotificationSupported, 
  getNotificationPermission, 
  requestNotificationPermission, 
  sendBrowserNotification,
  registerServiceWorker,
  subscribeUserToPush
} from '../lib/notificationService';

export default function NotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [permissionState, setPermissionState] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState<boolean>(true);

  useEffect(() => {
    const supported = isNotificationSupported();
    setIsSupported(supported);
    
    if (supported) {
      const currentPermission = getNotificationPermission();
      setPermissionState(currentPermission);

      // Register the service worker on load so it is ready for real push event handling
      registerServiceWorker();

      // Check if user dismissed it in this session or globally
      const dismissed = localStorage.getItem('notification_prompt_dismissed') === 'true';
      
      if (currentPermission === 'default' && !dismissed) {
        // Show after 3.5 seconds for high conversion rate and polished feel
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 3500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleAllowNotifications = async () => {
    const permission = await requestNotificationPermission();
    setPermissionState(permission);
    setShowPrompt(false);

    if (permission === 'granted') {
      // Register SW and attempt Web Push Protocol Subscription
      await subscribeUserToPush();

      // Send a gorgeous welcome notification immediately!
      sendBrowserNotification(
        "WBMockTest.in 🔔", 
        "অভিনন্দন! আপনি সফলভাবে ব্রাউজার নোটিফিকেশন সক্রিয় করেছেন। এখন থেকে নতুন মক টেস্ট ও সরকারি চাকরির আপডেট সরাসরি আপনার ফোনে বা কম্পিউটারে পাবেন।"
      );
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Mark as dismissed for 24 hours so we don't annoy the user
    localStorage.setItem('notification_prompt_dismissed', 'true');
    localStorage.setItem('notification_prompt_dismissed_time', Date.now().toString());
  };

  if (!isSupported || !showPrompt || permissionState !== 'default') return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-0 md:right-6 left-0 md:left-auto z-40 px-4 md:px-0 w-full md:w-[380px] animate-slideUp font-sans">
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-[#070e27] border border-indigo-500/30 rounded-[28px] shadow-[0_20px_50px_rgba(99,102,241,0.25)] text-white p-5 space-y-4 relative overflow-hidden">
        
        {/* Subtle glowing ring backgrounds */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />
        
        {/* Close Button */}
        <button 
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-350 hover:text-white transition-all cursor-pointer"
          title="বন্ধ করুন"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex gap-3.5 items-start">
          <div className="bg-gradient-to-br from-yellow-400 to-amber-500 text-slate-950 p-2.5 rounded-2xl shrink-0 shadow-lg shadow-amber-500/10 animate-pulse">
            <Bell className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <h4 className="text-[13px] font-black tracking-tight text-yellow-300 leading-snug">
              পরীক্ষার নোটিফিকেশন চালু করুন! 🔔
            </h4>
            <p className="text-[11px] text-slate-200 leading-relaxed font-medium">
              পশ্চিমবঙ্গের পঞ্চায়েত, পুলিশ, ক্লার্কশিপ ও ফুড এসআই পরীক্ষার মক টেস্টের আপডেট এবং নতুন সরকারি চাকরির বিজ্ঞপ্তি সরাসরি আপনার ব্রাউজারে পান।
            </p>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-3 border border-white/5 space-y-2 text-[10.5px] text-indigo-200">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>নতুন মক টেস্ট যোগ হলে সাথে সাথে জানতে পারবেন</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>ব্রাউজার বন্ধ থাকলেও নোটিফিকেশন কাজ করবে</span>
          </div>
        </div>

        <div className="flex gap-2.5 pt-1">
          <button
            onClick={handleDismiss}
            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
          >
            পরে হবে
          </button>
          <button
            onClick={handleAllowNotifications}
            className="flex-[1.5] py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 rounded-xl text-xs font-black transition-all shadow-lg shadow-amber-500/15 text-center cursor-pointer transform active:scale-95"
          >
            হ্যাঁ, অনুমতি দিন ➔
          </button>
        </div>

      </div>
    </div>
  );
}
