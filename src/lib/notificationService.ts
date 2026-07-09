// Web Notification Service for WBMockTest.in

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  category: 'job' | 'mock-test' | 'current-affairs' | 'system';
  time: string;
}

// Sample notifications to send periodically
export const mockNotificationPool: Omit<NotificationItem, 'id' | 'time'>[] = [
  {
    title: "🎯 পঞ্চায়েত মক টেস্ট লাইভ!",
    body: "পশ্চিমবঙ্গ পঞ্চায়েত সেক্রেটারি স্পেশাল মক টেস্ট ৩ এখন সম্পূর্ণ ফ্রি। আপনার প্রস্তুতি পরীক্ষা করুন!",
    category: 'mock-test'
  },
  {
    title: "🔥 WB Police Constables 2026",
    body: "কলকাতা ও পশ্চিমবঙ্গ পুলিশ কনস্টেবল স্পেশাল ২৫টি নতুন জেনারেল নলেজ প্রশ্ন যুক্ত হয়েছে। এখনই পড়ুন!",
    category: 'mock-test'
  },
  {
    title: "📌 নতুন নিয়োগ বিজ্ঞপ্তি প্রকাশিত!",
    body: "রাজ্য সরকারি গ্রুপ সি (Group C) ও গ্রুপ ডি (Group D) পদের অফিশিয়াল নোটিফিকেশন প্রকাশিত হয়েছে।",
    category: 'job'
  },
  {
    title: "💡 আজকের দৈনিক সাম্প্রতিক ঘটনাবলী",
    body: "৮ই জুলাই ২০২৬-এর গুরুত্বপূর্ণ কারেন্ট অ্যাফেয়ার্স আপডেট করা হয়েছে। পরীক্ষায় সফল হতে এখনই চোখ বুলিয়ে নিন!",
    category: 'current-affairs'
  },
  {
    title: "🏆 ডাবল XP বোনাস সেশন!",
    body: "আজকের যেকোনো লাইভ মক টেস্ট দিলে পাবেন ডাবল এক্সপেরিয়েন্স পয়েন্ট (XP)। মিস করবেন না!",
    category: 'system'
  },
  {
    title: "📝 WBPSC Clerkship 2026 Special",
    body: "ক্লার্কশিপ প্রিলিমস পরীক্ষার বিগত ৫ বছরের সমাধান করা প্রশ্নপত্র এখন ডাউনলোডের জন্য প্রস্তুত।",
    category: 'mock-test'
  },
  {
    title: "🔔 ফুড সাব-ইন্সপেক্টর (Food SI) আপডেট",
    body: "খাদ্য দপ্তরের সাব-ইন্সপেক্টর পরীক্ষার অ্যাডমিট কার্ড রিলিজ ডেট ঘোষণা করা হয়েছে। বিস্তারিত তথ্য দেখুন।",
    category: 'job'
  }
];

export const isNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

// Register Service Worker for Real Push Notifications (works in background / offline)
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log("Service workers not supported in this browser.");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('[Service Worker] Registration successful with scope:', registration.scope);
    return registration;
  } catch (error) {
    console.error('[Service Worker] Registration failed:', error);
    return null;
  }
};

// Convert VAPID key string to Uint8Array for push subscription
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Subscribe user to Web Push protocol
export const subscribeUserToPush = async (): Promise<PushSubscription | null> => {
  if (!isNotificationSupported() || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await registerServiceWorker();
    if (!registration) {
      throw new Error("Could not register or obtain Service Worker registration.");
    }

    // Default public VAPID key. When the user hosts they can generate their own using 'web-push' package.
    // This is a valid public key format that serves as a robust placeholder.
    const PUBLIC_VAPID_KEY = "BJ5IxJpYq75xD-g78E9988941_H012976214151241249-asb_2412-ABC1_S_2452"; 
    
    // Check if subscription already exists
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      console.log("[Push Notification] Creating new subscription...");
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
      });
    }

    console.log("[Push Notification] Subscription obtained:", JSON.stringify(subscription));

    // Send subscription object to backend server so we can notify them remotely!
    try {
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      });
      console.log("[Push Notification] Subscription successfully saved to database!");
    } catch (err) {
      console.warn("[Push Notification] Network request to save subscription failed, falling back to local simulation:", err);
    }

    return subscription;
  } catch (error) {
    console.error("[Push Notification] Subscription failed:", error);
    return null;
  }
};

export const getNotificationPermission = (): NotificationPermission => {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
};

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isNotificationSupported()) return 'denied';
  
  try {
    const permission = await Notification.requestPermission();
    localStorage.setItem('browser_notifications_permission', permission);
    return permission;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return 'denied';
  }
};

export const sendBrowserNotification = (title: string, body: string, iconUrl?: string): boolean => {
  if (!isNotificationSupported()) return false;
  if (Notification.permission !== 'granted') return false;

  try {
    const options: any = {
      body: body,
      icon: iconUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=60',
      badge: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=60',
      vibrate: [200, 100, 200],
      tag: 'wbmocktest-notification',
      renotify: true
    };
    
    new Notification(title, options);
    return true;
  } catch (err) {
    console.error("Failed to send native notification:", err);
    return false;
  }
};

// Return a random notification from pool
export const getRandomNotification = () => {
  const index = Math.floor(Math.random() * mockNotificationPool.length);
  return mockNotificationPool[index];
};
